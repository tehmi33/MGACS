import React, { useRef, useState } from 'react';
import uuid from 'react-native-uuid';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  ToastAndroid, Platform
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FormCard from '../../components/FormCard';
import ResidentTypeSelector from '../../components/ResidentTypeSelector';
import Dropdown from '../../components/Dropdown';
import DropdownWithOther from '../../components/VisitPurposeSelector';
import VisitorDestinationInput from '../../components/VisitorDestinationInput';
import { FormDateTime } from '../../components/FormDateTime';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import api from "../../api/client";
import { mapVisitToFormData } from "../../api/visit.mapper";
import { useVisitCreate } from "../../hooks/useVisitCreate";
import { useNavigation } from '@react-navigation/native';



import {
  VisitorRequest,
  Visitor,
  Vehicle,
  ResidentTypeOption,
} from '../../types/VisitorRequest';

import DynamicVisitorForm, {
  VisitorFormValues,
} from '../../components/DynamicVisitorForm';

import VehicleDetailsForm, {
  VehicleFormValues,
} from '../../components/VehicleDetailsForm';

import { compact } from '../../utils/helpers';
import IconSelectorModal from '../../components/CardSelectorModal';


/* ---------------- FORM SCHEMA ---------------- */

type VisitorField = 'name' | 'phone' | 'cnic';
type VehicleType = 1 | 2;

const VISITOR_FORM_SCHEMAS: Record<
  'primary' | 'adult' | 'under18',
  VisitorField[]
> = {
  primary: ['name', 'phone', 'cnic'],
  adult: ['name', 'cnic', 'phone'],
  under18: ['name'],
};
const VEHICLE_TYPE_MAP: Record<"car" | "bike", VehicleType> = {
  car: 1,
  bike: 2,
}

/* ---------------- SCREEN ---------------- */

export default function VisitorRequestScreen() {
  const navigation = useNavigation<any>();
  const {
  loading,
  residentOptions,
  checkpostOptions,
  vehicleTypeOptions,
  vehicleMakeOptions,
  vehicleModelOptions,
  vehicleColorOptions
} = useVisitCreate();



   const theme = useTheme();
    const appstyles = AppStyles(theme);
    const styles = createStyles(theme);
  const {
    control,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isValid },
  } = useForm<VisitorRequest>({
    mode: 'onChange',
    defaultValues: {
      residentType: undefined,
      visitDateTime: undefined,
      entryGate: undefined,
      visitPurpose: '',
      destination: '',
      visitors: [
        {
          id: uuid.v4() as string,
          type: 'primary',
          name: '',
          cnic: '',
          phone: '',
        },
      ],
      vehicles: [],
    },
  });

  // --------------------------
  // FIELD ARRAYS
  // --------------------------
 const {
    fields: visitorFields,
    append: addVisitor,
    update: updateVisitor,
    remove: removeVisitor,
  } = useFieldArray({ control, name: 'visitors' });

  const {
    fields: vehicleFields,
    append: addVehicle,
    update: updateVehicle,
    remove: removeVehicle,
  } = useFieldArray({ control, name: 'vehicles' });




  /* ---------------- STATE ---------------- */

  const [formVisible, setFormVisible] = useState(false);
  const [vehicleFormVisible, setVehicleFormVisible] = useState(false);

  const [editingVisitorId, setEditingVisitorId] = useState<string | null>(null);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const [visitorFormFields, setVisitorFormFields] = useState<VisitorField[]>([]);
  const [visitorTypeForSubmit, setVisitorTypeForSubmit] =
    useState<Visitor['type']>('adult');
  const [selectorVisible, setSelectorVisible] = useState<"visitor" | "vehicle" | null>(null);
const [vehicleTypeForSubmit, setVehicleTypeForSubmit] =
  useState<VehicleType>(1);



///* ---------------- VALIDATION ---------------- */

  const visitors = watch('visitors');
  const vehicles = watch('vehicles');
  const primaryVisitor = visitors.find(v => v.type === 'primary');

  const isPrimaryValid =
    primaryVisitor &&
    primaryVisitor.name?.trim() &&
    primaryVisitor.phone?.trim() &&
    primaryVisitor.cnic?.trim();

  const hasEmptyVisitor = visitors.some(v => !v.name?.trim());

  const canSubmit = isValid && Boolean(isPrimaryValid) && !hasEmptyVisitor;

   /* ---------------- HELPERS ---------------- */

  const findVisitorById = (id: string | null) =>
    visitorFields.find(v => v.id === id);

  const editingVisitorData = editingVisitorId
    ? findVisitorById(editingVisitorId)
    : undefined;
  const findVehicleById = (id: string | null) =>
    vehicleFields.find(v => v.id === id);

  const editingVehicleData = editingVehicleId
    ? findVehicleById(editingVehicleId)
    : undefined;

  const isEmptyVisitor = (v: Visitor) =>
    !v.name || v.name.trim() === "";



  const hasVisitorError = (index: number) => {
  return Boolean(errors?.visitors && errors.visitors[index]);
};

const hasVehicleError = (index: number) => {
  return Boolean(errors?.vehicles && errors.vehicles[index]);
};

   /* ---------------- HANDLERS ---------------- */

 const handleVisitorTypeSelect = (type: "adult" | "under18") => {
  setSelectorVisible(null);
  setVisitorTypeForSubmit(type);
  setVisitorFormFields(VISITOR_FORM_SCHEMAS[type]);
  setFormVisible(true);
};

const handleVehicleTypeSelect = (type: "car" | "bike") => {
  setSelectorVisible(null);
  setVehicleTypeForSubmit(VEHICLE_TYPE_MAP[type]);
  setVehicleFormVisible(true);
};


  // const handleSubmitVisitor = (data: VisitorFormValues) => {
  //   if (editingVisitorId) {
  //     const index = visitorFields.findIndex(v => v.id === editingVisitorId);
  //     if (index !== -1) {
  //       updateVisitor(index, { ...visitorFields[index], ...data });
  //     }
  //   } else {
  //     addVisitor({
  //       id: uuid.v4() as string,
  //       type: visitorMode,
  //       name: data.name,
  //       phone: data.phone,
  //       cnic: data.cnic,
  //     });
  //   }

  //   setFormVisible(false);
  //   setEditingVisitorId(null);
  // };
  const handleSubmitVisitor = (data: VisitorFormValues) => {
    if (editingVisitorId) {
      const index = visitorFields.findIndex(v => v.id === editingVisitorId);
      updateVisitor(index, { ...visitorFields[index], ...data });
    } else {
      addVisitor({
        id: uuid.v4() as string,
        type: visitorTypeForSubmit,
        ...data,
      });
    }

    setFormVisible(false);
    setEditingVisitorId(null);
  };

  // 
//    const handleSubmitVehicle = (data: VehicleFormValues) => {
//   if (editingVehicleId) {
//     const index = vehicleFields.findIndex(v => v.id === editingVehicleId);
//     updateVehicle(index, {
//       ...vehicleFields[index],
//       ...data,
//     });
//   } else {
//     addVehicle({
//       id: uuid.v4() as string,
//       type: vehicleTypeForSubmit,
//       ...data,
//     });
//   }

//   setVehicleFormVisible(false);
//   setEditingVehicleId(null);
// };
const handleSubmitVehicle = (data: VehicleFormValues) => {
  if (editingVehicleId) {
    const index = vehicleFields.findIndex(v => v.id === editingVehicleId);
    updateVehicle(index, {
      ...vehicleFields[index],
      ...data,
    });
  } else {
    addVehicle({
  id: uuid.v4() as string,
  vehicle_type_code: vehicleTypeForSubmit, // number
  ...data,
});

  }

  setVehicleFormVisible(false);
  setEditingVehicleId(null);
};


  /* ---------------- FAB ---------------- */

  

  /* ---------------- VISITOR SUBMIT ---------------- */

  // const handleAddVisitor = (visitor: Visitor) => {
  //   addVisitor(visitor);
  //   setFormVisible(false);
  // };

  // /* ---------------- VEHICLE SUBMIT ---------------- */

  // const handleAddVehicle = (vehicle: Vehicle) => {
  //   addVehicle(vehicle);
  //   setVehicleFormVisible(false);
  // };

  /* ---------------- UI ---------------- */

 

const reqSubmit = (data: VisitorRequest) => {
  const loc = undefined; // or get from state / GPS
  RequestSubmit(data, loc);
};

const mapApiErrorPathToFormPath = (path: string): string => {
  // visitor_mobile_no.0 → visitors.0.phone
  if (path.startsWith('visitor_mobile_no')) {
    const index = path.split('.')[1];
    return `visitors.${index}.phone`;
  }

  // visitor_cnic.0 → visitors.0.cnic
  if (path.startsWith('visitor_cnic')) {
    const index = path.split('.')[1];
    return `visitors.${index}.cnic`;
  }

  // vehicle_plate_no.0 → vehicles.0.plateNo
  if (path.startsWith('vehicle_plate_no')) {
    const index = path.split('.')[1];
    return `vehicles.${index}.plateNo`;
  }

  return path; // fallback
};


  const RequestSubmit = async (data: VisitorRequest, loc?: {
  latitude: number;
  longitude: number;
  accuracy: number;
}) => {
    console.log("📋 RAW FORM DATA (react-hook-form):", JSON.stringify(data, null, 2));
  try {
    
    const formData = mapVisitToFormData(data);

    // ✅ Append location fields to BODY
    if (loc) {
      formData.append("latitude", (loc.latitude));
      formData.append("longitude", (loc.longitude));
      formData.append("accuracy", (loc.accuracy));
    }

    const res = await api.post("/visit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // ✅ Extract visitId safely
const visitId = res.data?.data?.visit?.id;

console.log('visit id:' , visitId)
if (!visitId) {
  throw new Error('Visit ID not returned from API');
}
reset({
  residentType: undefined,
  visitDateTime: undefined,
  entryGate: undefined,
  visitPurpose: '',
  destination: '',
  visitors: [
    {
      id: uuid.v4() as string,
      type: 'primary',
      name: '',
      cnic: '',
      phone: '',
    },
  ],
  vehicles: [],
});

// ✅ CLOSE MODALS
setFormVisible(false);
setVehicleFormVisible(false);
setEditingVisitorId(null);
setEditingVehicleId(null);
    console.log("✅ VISIT REQUEST SUCCESS:", data);
      navigation.navigate('VisitorPass', { visitId });
  } 
    catch (error: any) {
  const apiErrors = error?.response?.data?.errors;
  const message =
    error?.response?.data?.message ||
    'Something went wrong. Please check your input.';

  // 🔴 ANDROID ONLY TOAST
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }

  // Still map errors to form (for red rows & inputs)
  if (apiErrors && typeof apiErrors === 'object') {
    Object.entries(apiErrors).forEach(([path, messages]) => {
      const formPath = mapApiErrorPathToFormPath(path);

      setError(formPath as any, {
        type: 'server',
        message: Array.isArray(messages) ? messages[0] : String(messages),
      });
    });
  }
}

};







  return (
   <View style={appstyles.container}>
      {/* FIXED FORM */}  
   <View style={{backgroundColor:'transparent'}}>
        <FormCard title="Visitor Request" subtitle="Add visit information">
     
          
        
          <ResidentTypeSelector
  control={control}
  name="residentType"
  options={residentOptions}
/>

          <Controller
            control={control}
            name="visitDateTime"
            rules={{ required: 'Date & time is required' }}
            render={({ field: { value, onChange } }) => (
              <FormDateTime
                value={value ? new Date(value) : undefined}
                onChange={(date: Date) => onChange(date)} 
                error={errors.visitDateTime?.message}
              />
            )}
          />

          <Dropdown<number>
  control={control}
  name="entryGate"
  placeholder="Select entry gate"

  data={checkpostOptions}
/>


          <DropdownWithOther
            control={control}
            name="visitPurpose"
            otherName="otherPurpose"
            isOtherName="isOtherPurpose"
            placeholder="Select purpose"
            otherPlaceholder="Enter other purpose"
            data={[
              { label: 'Personal', value: 'personal' },
              { label: 'Business', value: 'business' },
              { label: 'Delivery', value: 'delivery' },
              // { label: 'Maintenance', value: 'maintenance' },
            ]}
          />

          <VisitorDestinationInput
            control={control}
            name="destination"
            placeholder="Visitor destination"
          />
        </FormCard>
      </View>

      {/* VISITORS */}
      <ScrollView contentContainerStyle={[appstyles.scrollContent]}>
       <Section
  title="Visitors"
  rightComponent={
    <TouchableOpacity
      style={styles.addBtn}
      onPress={() => setSelectorVisible('visitor')}
    >
      <Text
        style={[
          appstyles.textInput,
          {
            color: theme.colors.white,
            marginRight: 5,
          },
        ]}
      >
        Add
      </Text>

      <MaterialCommunityIcons
        name="plus"
        size={18}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  }
>
  {visitorFields.map((v, index) => {
    const isPrimary = v.type === 'primary';
    const isEmpty = !v.name?.trim();
    const isError = hasVisitorError(index);

    if (isPrimary && isEmpty) {
      return (
        <PrimaryVisitorPlaceholder
          key={v.id}
          onPress={() => {
            setVisitorTypeForSubmit('primary');
            setVisitorFormFields(VISITOR_FORM_SCHEMAS.primary);
            setEditingVisitorId(v.id);
            setFormVisible(true);
          }}
          styles={styles}
          appstyles={appstyles}
          theme={theme}
        />
      );
    }   return (
     
      <VisitorRow
        key={v.id}
        icon={v.type === 'under18' ? 'account-child' : 'account'}
        title={v.name}
         hasError={isError}
        styles={styles}
        appstyles={appstyles}
        theme={theme}
        badges={compact<Badge>([
          v.type === 'primary' && {
            label: 'Primary',
            color: theme.colors.success,
            backgroundColor: theme.colors.successLight,
          },
          v.type === 'under18' && {
            label: 'Under 18',
            color: theme.colors.warning,
            backgroundColor: theme.colors.warningLight,
          },
        ])}
        meta={compact<MetaItem>(
          v.type !== 'under18'
            ? [
                v.phone && {
                  icon: 'phone',
                  value: v.phone,
                  color: theme.colors.success,
                },
                v.cnic && {
                  icon: 'card-account-details-outline',
                  value: v.cnic,
                  color: theme.colors.primary,
                },
              ]
            : [],
        )}
        isLast={index === visitorFields.length - 1}
        onEdit={() => {
          setVisitorTypeForSubmit(v.type);
          setVisitorFormFields(VISITOR_FORM_SCHEMAS[v.type]);
          setEditingVisitorId(v.id);
          setFormVisible(true);
        }}
        onDelete={
          v.type === 'primary'
            ? undefined
            : () => removeVisitor(index)
        }
      />
    );
  })}
</Section>


       <Section
  title="Vehicles"
  rightComponent={
    <TouchableOpacity
      style={styles.addBtn}
      onPress={() => setSelectorVisible('vehicle')}
    >
      <Text
        style={[
          appstyles.textInput,
          { color: theme.colors.white, marginRight: 5 },
        ]}
      >
        Add
      </Text>

      <MaterialCommunityIcons
        name="plus"
        size={18}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  }
>
  {vehicleFields.length === 0 ? (
    <VehiclePlaceholder
      onPress={() => {
        setEditingVehicleId(null);
        setVehicleFormVisible(true);
      }}
      styles={styles}
      appstyles={appstyles}
      theme={theme}
    />
  ) : (
    vehicleFields.map((v, index) => {
      const isError = hasVehicleError(index);

      return (
        <VisitorRow
          key={v.id}
          icon="car"
          iconType="fontawesome"
          title={v.plateNo || '(No plate number)'}
          hasError={isError}
          styles={styles}
          appstyles={appstyles}
          theme={theme}
          // badges={compact<Badge>([
          //   isError && {
          //     label: 'Error',
          //     color: theme.colors.danger,
          //     backgroundColor: theme.colors.danger,
          //   },
          // ])}
          meta={compact<MetaItem>([
            v.make && {
              icon: 'info',
              value: v.make,
              color: theme.colors.info,
            },
            v.model && {
              icon: 'calendar',
              value: v.model,
              color: theme.colors.warning,
            },
          ])}
          isLast={index === vehicleFields.length - 1}
          onEdit={() => {
            setEditingVehicleId(v.id);
            setVehicleFormVisible(true);
          }}
          onDelete={() => removeVehicle(index)}
        />
      );
    })
  )}
</Section>


   <TouchableOpacity
        style={[
          appstyles.primaryButton,
          !canSubmit && { backgroundColor: theme.colors.muted  },
        ]}
        disabled={!canSubmit}
        onPress={handleSubmit(reqSubmit)}
      >
        <Text style={appstyles.buttonText}>Save Visitor Request</Text>
      </TouchableOpacity>


      </ScrollView>

     
      {/* SUBMIT */}
   
        

      
      {/* MODALS */}
<IconSelectorModal<"adult" | "under18">
  visible={selectorVisible === "visitor"}
  title="Add Visitor"
  data={[
    {
      id: "adult",
      title: "Adult",
      iconName: "person",
      iconSet: "MaterialIcons",
    },
    {
      id: "under18",
      title: "Under 18",
      iconName: "account-child",
      iconSet: "MaterialCommunityIcons",
    },
  ]}
  onClose={() => setSelectorVisible(null)}
  onSelect={handleVisitorTypeSelect}
/>



<IconSelectorModal<"car" | "bike">
  visible={selectorVisible === "vehicle"}
  title="Add Vehicle"
  data={[
    {
      id: "car",
      title: "Car",
      iconName: "car",
      iconSet: "FontAwesome5",
    },
    {
      id: "bike",
      title: "Bike",
      iconName: "motorcycle",
      iconSet: "FontAwesome6",
    },
  ]}
  onClose={() => setSelectorVisible(null)}
  onSelect={handleVehicleTypeSelect}
/>





         <DynamicVisitorForm
        visible={formVisible}
        fields={visitorFormFields}
        initialValues={editingVisitorData}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitVisitor}
      />

      <VehicleDetailsForm
        key={`vehicle-${editingVehicleId ?? 'new'}`}
        visible={vehicleFormVisible}
        initialValues={editingVehicleData}
         vehicleMakeOptions={vehicleMakeOptions} 
         vehicleModelOptions={vehicleModelOptions}
  vehicleColorOptions={vehicleColorOptions}
        onClose={() => {
          setVehicleFormVisible(false);
          setEditingVehicleId(null);
        }}
        onSubmit={handleSubmitVehicle}
      />

    </View>
  );
}


/* ---------------- COMPONENTS ---------------- */

const Section = ({
  title,
  children,
  rightComponent,
}: any) => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const styles = createStyles(theme);

  return (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Text style={appstyles.heading}>{title}</Text>

      {rightComponent && (
        <View style={styles.rightContainer}>{rightComponent}</View>
      )}
    </View>

    <View style={styles.sectionBody}>{children}</View>
  </View>
)};

const PrimaryVisitorPlaceholder = ({
  onPress,
  styles,
  appstyles,
  theme,
}: {
  onPress: () => void;
  styles: any;
  appstyles: any;
  theme: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.placeholderRow}
  >
    <LinearGradient
      colors={theme.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconCircle}
    >
      <MaterialCommunityIcons
        name="account-plus-outline"
        size={20}
        color={theme.colors.softCardBg}
      />
    </LinearGradient>

    <Text
      style={[
        appstyles.mutedText,
        {
          color: theme.colors.primary,
          marginLeft: 10,
          fontWeight: '700',
        },
      ]}
    >
      Add Primary Visitor
    </Text>
  </TouchableOpacity>
);



const VehiclePlaceholder = ({
  onPress,
  styles,
  appstyles,
  theme,
}: {
  onPress: () => void;
  styles: any;
  appstyles: any;
  theme: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.placeholderRow}
  >
    <LinearGradient
      colors={theme.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.iconCircle}
    >
      <FontAwesome
        name="car"
        size={15}
        color={theme.colors.white}
      />
    </LinearGradient>

    <Text
      style={[
        appstyles.mutedText,
        {
          color: theme.colors.primary,
          marginLeft: 10,
          fontWeight: '700',
        },
      ]}
    >
      Add Vehicle
    </Text>
  </TouchableOpacity>
);


// ------------------------------
// VisitorRow (inline component)
// ------------------------------
interface Badge {
  label: string;
  color: string;
  backgroundColor?: string;
  icon?: string; // optional
}
interface MetaItem {
  icon: string;
  iconType?: 'material' | 'fontawesome';
  value: string;
  color: string;
}

interface VisitorRowProps {
  icon: string;
  iconType?: 'material' | 'fontawesome'; 
 iconSize?: number; 
  title: string;
  hasError?: boolean;
  badges?: Badge[];
  meta?: MetaItem[];
  onEdit: () => void;
  onDelete?: () => void;
  isLast?: boolean;
  hideEdit?: boolean;
}
const VisitorRow = ({
  icon,
  iconType = 'material',
  title,
  hasError = false, 
  badges = [],
  meta = [],
  onEdit,
  onDelete,
  isLast,
  hideEdit = false,
  styles,
  appstyles,
  theme,
}: VisitorRowProps & {
  styles: any;
  appstyles: any;
  theme: any;
}) => {
  const IconComponent =
    iconType === 'fontawesome' ? FontAwesome : MaterialCommunityIcons;


  const isVehicleIcon = icon === 'car' || icon === 'bus';

  return (
   <View
  style={[
    styles.rowCompact,
    isLast && { borderBottomWidth: 0 },
    hasError && {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.danger,
      backgroundColor: theme.colors.dangerLight,
    },
  ]}
>

      {/* Icon */}
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <IconComponent
          name={icon}
          size={isVehicleIcon ? 15 : 20}
          color={theme.colors.white}
        />
      </LinearGradient>

      {/* Content */}
      <View style={{ flex: 1, marginLeft: 10 }}>
        {/* Title & badges */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={appstyles.heading}>{title}</Text>

          {badges.map((b, i) => (
            <View
              key={i}
              style={[
                appstyles.badge,
                {
                  backgroundColor:
                    b.backgroundColor ??
                    theme.colors.primaryLight,
                },
              ]}
              
            >
              {b.icon && (
                <IconComponent
                  name={b.icon}
                  size={12}
                  color={b.color}
                  style={appstyles.badgeIcon}
                />
              )}

              <Text
                style={[
                  appstyles.badgeText,
                  { color: b.color },
                ]}
              >
                {b.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Meta */}
        {meta.length > 0 && (
          <View style={styles.metaRow}>
            {meta.map((m, i) => (
              <View key={i} style={styles.metaItem}>
                <IconComponent
                  name={m.icon}
                  size={15}
                  color={m.color}
                />
                <Text
                  style={[
                    appstyles.mutedText,
                    { marginLeft: 4 },
                  ]}
                >
                  {m.value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      {!hideEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={18}
            color={theme.colors.info}
          />
        </TouchableOpacity>
      )}

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
          <MaterialCommunityIcons
            name="delete-outline"
            size={18}
            color={theme.colors.danger}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// const FabAction = ({ icon, label, onPress }: any) => (
//   <TouchableOpacity style={styles.fabAction} onPress={onPress}>
//     <Icon name={icon} size={20} color="#fff" />
//     <Text style={styles.fabLabel}>{label}</Text>
//   </TouchableOpacity>
// );

/* ---------------- STYLES ---------------- */

const createStyles = (theme: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 15,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 6,
    },

    rightContainer: {
      marginLeft: 8,
    },

    sectionBody: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },

    rowCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.softCardBg,
    },

    iconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },

    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 2,
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },

    actionBtn: {
      padding: 6,
    },

    placeholderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.cardBg,
    },

    addBtn: {
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
