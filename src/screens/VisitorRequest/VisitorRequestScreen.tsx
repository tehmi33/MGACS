import React, { useRef, useState } from 'react';
import uuid from 'react-native-uuid';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import FormCard from '../../components/FormCard';
import ResidentTypeSelector from '../../components/ResidentTypeSelector';
import Dropdown from '../../components/Dropdown';
import DropdownWithOther from '../../components/VisitPurposeSelector';
import VisitorDestinationInput from '../../components/VisitorDestinationInput';
import { FormDateTime } from '../../components/FormDateTime';

import { VisitorRequest, Visitor, Vehicle, ResidentTypeOption } from "../../types/VisitorRequest";

import DynamicVisitorForm, {
  VisitorFormValues,
} from '../../components/DynamicVisitorForm';

import VehicleDetailsForm, {
  VehicleFormValues,
} from '../../components/VehicleDetailsForm';
import { compact } from '../../utils/helpers';
import DropdownButton from '../../components/DropdownButton';

/* ---------------- SCREEN ---------------- */

export default function VisitorRequestScreen() {
  const {
    control, register, handleSubmit, setValue, watch,
    formState: { errors, isValid },
    
  } = useForm<VisitorRequest>({
     mode: "onChange",
    defaultValues: {
      residentType: undefined,
      visitDateTime: "",
      entryGate: undefined,
      visitPurpose: "",
      destination: "",
      visitors: [
        {
          id: uuid.v4() as string,
          type: "primary",
          name: "",
          cnic: "",
          phone: "",
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
  } = useFieldArray({
    control,
    name: "visitors",
  });

  const watchedVisitors = watch("visitors");

  const {
    fields: vehicleFields,
    append: addVehicle,
    update: updateVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: "vehicles",
  });

  const watchedVehicles = watch("vehicles");

  const animation = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [vehicleFormVisible, setVehicleFormVisible] = useState(false);


  // for adding or editing visitor
  const [visitorMode, setVisitorMode] = useState<Visitor["type"]>("adult");
  const [editingVisitorId, setEditingVisitorId] = useState<string | null>(null);

  // for vehicles
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  const visitors = watch("visitors");
const vehicles = watch("vehicles");

// Primary visitor must exist and be filled
const primaryVisitor = visitors.find(v => v.type === "primary");

const isPrimaryValid =
  primaryVisitor &&
  primaryVisitor.name?.trim() &&
  primaryVisitor.phone?.trim() &&
  primaryVisitor.cnic?.trim();

// No empty visitors allowed
const hasEmptyVisitor = visitors.some(
  v => !v.name || v.name.trim() === ""
);

// FINAL eligibility
const canSubmit =
  isValid &&
  Boolean(isPrimaryValid) &&
  !hasEmptyVisitor;


  const findVisitorById = (id: string | null) =>
    visitorFields.find(v => v.id === id);

  const findVehicleById = (id: string | null) =>
    vehicleFields.find(v => v.id === id);

  const editingVisitorData = editingVisitorId
    ? findVisitorById(editingVisitorId)
    : undefined;

  const editingVehicleData = editingVehicleId
    ? findVehicleById(editingVehicleId)
    : undefined;

  const isEmptyVisitor = (v: Visitor) =>
    !v.name || v.name.trim() === "";

  const handleSubmitVisitor = (data: VisitorFormValues) => {
    if (editingVisitorId) {
      const index = visitorFields.findIndex(v => v.id === editingVisitorId);
      if (index !== -1) {
        updateVisitor(index, { ...visitorFields[index], ...data });
      }
    } else {
      addVisitor({
        id: uuid.v4() as string,
        type: visitorMode,
        name: data.name,
        phone: data.phone,
        cnic: data.cnic,
      });
    }

    setFormVisible(false);
    setEditingVisitorId(null);
  };

  const handleSubmitVehicle = (data: VehicleFormValues) => {
    if (editingVehicleId) {
      const index = vehicleFields.findIndex(v => v.id === editingVehicleId);
      if (index !== -1) {
        updateVehicle(index, { ...vehicleFields[index], ...data });
      }
    } else {
      addVehicle({
        id: uuid.v4() as string,
        ...data,
      });
    }

    setVehicleFormVisible(false);
    setEditingVehicleId(null);
  };

  /* ---------------- FAB ---------------- */

  const toggleMenu = () => {
    Animated.spring(animation, {
      toValue: open ? 0 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    setOpen(prev => !prev);
  };

  const closeFab = () => {
    animation.setValue(0);
    setOpen(false);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  /* ---------------- VISITOR SUBMIT ---------------- */

  const handleAddVisitor = (visitor: Visitor) => {
    addVisitor(visitor);
    setFormVisible(false);
  };

  /* ---------------- VEHICLE SUBMIT ---------------- */

  const handleAddVehicle = (vehicle: Vehicle) => {
    addVehicle(vehicle);
    setVehicleFormVisible(false);
  };

  /* ---------------- UI ---------------- */

  const residentOptions: ResidentTypeOption[] = [
    { label: 'Family', value: 'family', hours: 48 },
    { label: 'Utility', value: 'utility', hours: 12 },
    { label: 'Commercial', value: 'commercial', hours: 6 },
  ];




  const RequestSubmit = (data: VisitorRequest) => {
  // Optional cleanup
  const cleanedData: VisitorRequest = {
    ...data,
    visitors: data.visitors.filter(v => v.name?.trim()),
    vehicles: data.vehicles ?? [],
  };

  console.log("FINAL SUBMIT DATA", cleanedData);

  // API call example
  // await api.post("/visitor-request", cleanedData);
};


  return (
    <View style={styles.container}>
      {/* FIXED FORM */}
      <View style={styles.fixedForm}>
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
                onChange={(date: Date) => onChange(date.toISOString())}
                error={errors.visitDateTime?.message}
              />
            )}
          />

          <Dropdown<number>
            control={control}
            name="entryGate"
            placeholder="Select entry gate"
            data={[
              { label: "CheckPost - 1", value: 1 },
              { label: "CheckPost - 2", value: 2 },
            ]}
          />

          {/* <DropdownWithOther
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
          /> */}

          <VisitorDestinationInput
            control={control}
            name="destination"
            placeholder="Visitor destination"
          />
        </FormCard>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 10, flexGrow: 1 }}>
        <Section
          title="Visitors"
          rightComponent={
            <DropdownButton
              menuItems={[
                { label: "Adult", icon: "user-plus", onPress: () => { setVisitorMode("adult");
                  setEditingVisitorId(null);
                  setFormVisible(true);} },
                { label: "Under-18", icon: "smile", onPress: () => {setVisitorMode('under18');
                  setEditingVisitorId(null);
                  setFormVisible(true);} },
              ]}
            />
          }>

          {visitorFields.map((v, index) => {

            const isPrimary = v.type === "primary";
            const isEmpty = isEmptyVisitor(v);

            // SHOW PLACEHOLDER for empty primary visitor
            if (isPrimary && isEmpty) {
              return (
                <PrimaryVisitorPlaceholder
                  key={v.id}
                  onPress={() => {
                    closeFab();
                    setVisitorMode("primary");
                    setEditingVisitorId(v.id); // edit the existing placeholder
                    setFormVisible(true);
                  }}
                />
              );
            }

            return (
              <VisitorRow
                key={v.id}
                icon={v.type === "under18" ? "account-child" : "account"}
                title={v.name || "please enter primary visitor"}

                badges={compact<Badge>([
                  v.type === "primary" && { label: "Primary", color: "#16a34a" },
                  v.type === "under18" && { label: "Under 18", color: "#f59e0b" },
                ].filter(Boolean))}

                meta={
                  compact<MetaItem>(v.type !== "under18"
                    ? [
                      v.phone && {
                        icon: "phone",
                        value: v.phone,
                        color: "#16a34a",
                      },
                      v.cnic && {
                        icon: "card-account-details-outline",
                        value: v.cnic,
                        color: "#2563eb",
                      },
                    ].filter(Boolean)
                    : [])
                }

                isLast={index === visitorFields.length - 1}

                onEdit={() => {
                  closeFab();
                  setVisitorMode(v.type);        // "primary" | "adult" | "under18"
                  setEditingVisitorId(v.id);     // Pass UUID to form
                  setFormVisible(true);
                }}

                onDelete={
                  v.type === "primary"
                    ? undefined
                    : () => removeVisitor(index)
                }
              />
            );
          })}
        </Section>

       <Section title="Vehicles"
        rightComponent={
            <DropdownButton
  menuItems={[
    {
      label: "Car",
      icon: "car",
      iconType: "fontawesome",
      onPress: () => {},
    },
    {
      label: "Bus",
      icon: "bus",
      iconType: "fontawesome",
      onPress: () => {},
    },
  ]}
/>

          }
          >
  {vehicleFields.length === 0 ? (
    <VehiclePlaceholder
      onPress={() => {
        closeFab();
        setEditingVehicleId(null);
        setVehicleFormVisible(true);
      }}
    />
  ) : (
    vehicleFields.map((v, index) => (
      <VisitorRow
        key={v.id}
        icon="car"
        title={v.plateNo || "(No plate number)"}
        meta={compact<MetaItem>([
          v.make && { icon: "car-info", value: v.make, color: "#7c3aed" },
          v.color && { icon: "palette", value: v.color, color: "#f59e0b" },
        ].filter(Boolean))}
        isLast={index === vehicleFields.length - 1}
        onEdit={() => {
          closeFab();
          setEditingVehicleId(v.id);
          setVehicleFormVisible(true);
        }}
        onDelete={() => removeVehicle(index)}
      />
    ))
  )}
</Section>

      </ScrollView>

     
      <TouchableOpacity
  style={[
    styles.submit,
    !canSubmit && { backgroundColor: "#9ca3af" }
  ]}
  disabled={!canSubmit}
  onPress={handleSubmit(RequestSubmit)}
>
  <Text style={styles.submitText}>
    Save Visitor Request
  </Text>
</TouchableOpacity>

        

      {/* FAB */}
      {/* {!formVisible && !vehicleFormVisible && (
        <View style={styles.fabContainer}>
          {open && (
            <Animated.View style={{ transform: [{ translateY }] }}>
              <FabAction
                icon="account"
                label="Add Adult"
                onPress={() => {
                  closeFab();
                  setVisitorMode("adult");
                  setEditingVisitorId(null);
                  setFormVisible(true);
                }}
              />
              <FabAction
                icon="account-child"
                label="Add Child"
                onPress={() => {
                  closeFab();
                  setVisitorMode('under18');
                  setEditingVisitorId(null);
                  setFormVisible(true);
                }}
              />
              <FabAction
                icon="car"
                label="Add Vehicle"
                onPress={() => {
                  closeFab();
                  // setEditingVehicleId(null);
                  setVehicleFormVisible(true);
                }}
              />
            </Animated.View>
          )}

          <TouchableOpacity style={styles.fabMain} onPress={toggleMenu}>
            <Icon name={open ? 'close' : 'plus'} size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )} */}

      <DynamicVisitorForm
        key={`visitor-${visitorMode}-${editingVisitorId ?? 'new'}`}
        visible={formVisible}
        mode={visitorMode}
        initialValues={editingVisitorData}
        onClose={() => {
          setFormVisible(false);
          setEditingVisitorId(null);
        }}
        onSubmit={handleSubmitVisitor}
      />

      <VehicleDetailsForm
        key={`vehicle-${editingVehicleId ?? 'new'}`}
        visible={vehicleFormVisible}
        initialValues={editingVehicleData}
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

const Section = ({ title, children, rightComponent }: any) => (
  <View style={styles.section}>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {/* Optional right-side component */}
      {rightComponent && (
        <View style={styles.rightContainer}>{rightComponent}</View>
      )}
    </View>

    <View style={styles.sectionBody}>{children}</View>
  </View>
);

const PrimaryVisitorPlaceholder = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.placeholderRow}>
    <View style={styles.iconCircle}>
      <Icon name="account-plus-outline" size={20} color="#2563eb" />
    </View>

    <Text style={styles.placeholderText}>Add Primary Visitor</Text>
  </TouchableOpacity>
);


const VehiclePlaceholder = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.placeholderRow}
  >
    <View style={styles.iconCircle}>
      <Icon1 name="car" size={20} color="#2563eb" />
    </View>

    <Text style={styles.placeholderText}>Add Vehicle</Text>
  </TouchableOpacity>
);

// ------------------------------
// VisitorRow (inline component)
// ------------------------------
interface Badge {
  label: string;
  color: string;
}

interface MetaItem {
  icon: string;
  value: string;
  color: string;
}

interface VisitorRowProps {
  icon: string;
  title: string;
  badges?: Badge[];
  meta?: MetaItem[];
  onEdit: () => void;
  onDelete?: () => void;
  isLast?: boolean;
  hideEdit?: boolean;
}
const VisitorRow = ({
  icon,
  title,
  badges = [],
  meta = [],
  onEdit,
  onDelete,
  isLast,
  hideEdit = false,
}: VisitorRowProps) => (
  <View style={[styles.rowCompact, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.iconCircle}>
      <Icon name={icon} size={18} color="#4f46e5" />
    </View>

    <View style={{ flex: 1, marginLeft: 10 }}>
      {/* Title and Badge row */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={styles.rowTitleCompact}>{title}</Text>

        {badges.map((b, i) => (
          <View
            key={i}
            style={[styles.badge, { backgroundColor: b.color + "22" }]}
          >
            <Text style={[styles.badgeText, { color: b.color }]}>{b.label}</Text>
          </View>
        ))}
      </View>

      {/* Meta row */}
      {meta.length > 0 && (
        <View style={styles.metaRow}>
          {meta.map((m, i) => (
            <View key={i} style={styles.metaItem}>
              <Icon name={m.icon} size={12} color={m.color} />
              <Text style={styles.metaText}>{m.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>

    {/* Edit button */}
    {!hideEdit && (
      <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
        <Icon name="pencil-outline" size={16} color="#6366f1" />
      </TouchableOpacity>
    )}
    {/* Delete button */}
    {onDelete && (
      <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
        <Icon name="delete-outline" size={16} color="#ef4444" />
      </TouchableOpacity>
    )}
  </View>
);

// const FabAction = ({ icon, label, onPress }: any) => (
//   <TouchableOpacity style={styles.fabAction} onPress={onPress}>
//     <Icon name={icon} size={20} color="#fff" />
//     <Text style={styles.fabLabel}>{label}</Text>
//   </TouchableOpacity>
// );

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  fixedForm: { backgroundColor: '#fff' },

  section: {
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, // moved from sectionTitle
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  rightContainer: {
    marginLeft: 8, // small spacing from title
  },

  sectionBody: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  rowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitleCompact: { fontSize: 13, fontWeight: '600', color: '#111827' },

  badge: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  metaText: { fontSize: 11, color: '#6b7280', marginLeft: 4 },

  actionBtn: { padding: 6 },

  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    alignItems: 'flex-end',
  },
  fabMain: {
    backgroundColor: '#4f46e5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  fabLabel: { color: '#fff', marginLeft: 8 },
  placeholderRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  placeholderText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  submit: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    margin: 16,
    marginBottom: 5,

  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    // padding: 14,
    margin: 14,
  },
});
