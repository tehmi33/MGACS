import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Vehicle, VehicleMakeOption , VehicleModelOption, VehicleColorOption} from '../types/VisitorRequest';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';
import Button from './Button';
import Dropdown from './Dropdown';

/* ---------------- TYPES ---------------- */

export type VehicleFormValues = {

  plateNo: string;
  make?: string;
  color?: string;
  model?: string;
};
type VehicleType = 1| 2 ;
type Props = {
  visible: boolean;
  initialValues?: Vehicle;
  vehicleMakeOptions: VehicleMakeOption[];
    vehicleModelOptions: VehicleModelOption[];
  vehicleColorOptions: VehicleColorOption[];
  onClose: () => void;
  onSubmit: (data: VehicleFormValues) => void;
};

/* ---------------- COMPONENT ---------------- */

export default function VehicleDetailsForm({
  visible,
  initialValues,
   vehicleMakeOptions,
   vehicleModelOptions,
  vehicleColorOptions,
  onClose,
  onSubmit,
}: Props) {
  
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const styles = createStyles(theme);

  const { control, handleSubmit, reset } =
    useForm<VehicleFormValues>({
      defaultValues: {
        plateNo: '',
        make: '',
        color: '',
        model: '',
      },
    });

  useEffect(() => {
    if (visible) {
      reset({
        plateNo: initialValues?.plateNo ?? '',
        make: initialValues?.make ?? '',
        color: initialValues?.color ?? '',
        model: initialValues?.model ?? '',
      });
    }
  }, [visible, initialValues, reset]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.sheet}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={appstyles.screenTitle}>
                {initialValues ? 'Edit Vehicle' : 'Vehicle Details'}
              </Text>
            </View>

            {/* PLATE NUMBER */}
            <Controller
              control={control}
              name="plateNo"
              rules={{ required: 'Plate number is required' }}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Plate Number"
                  placeholder="ABC-123 or ABC1234"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoCapitalize="characters"
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* MAKE */}
<Text style={[appstyles.mutedText, { marginTop: 5 }]}>Make</Text>

<Dropdown
  control={control}
  name="make"
  placeholder="Select vehicle make"
  // data={VEHICLE_MAKES}
data={vehicleMakeOptions ?? []}
  rules={{ required: 'Vehicle make is required' }}
/>
<Text style={[appstyles.mutedText, { marginTop: 5 }]}>Model</Text>
<Dropdown
  control={control}
  name="model"
  placeholder="Select vehicle model"
  data={vehicleModelOptions}
/>

<Text style={[appstyles.mutedText, { marginTop: 5 }]}>Color</Text>
<Dropdown
  control={control}
  name="color"
  placeholder="Select vehicle color"
  data={vehicleColorOptions}
/>

            {/* MODEL */}
            {/* <Controller
              control={control}
              name="model"
              render={({ field, fieldState }) => (
                <FormInput
                  label="Model"
                  placeholder="Camry, Civic"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            /> */}

            {/* COLOR */}
            {/* <Controller
              control={control}
              name="color"
              render={({ field, fieldState }) => (
                <FormInput
                  label="Color"
                  placeholder="White, Black, Silver"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            /> */}

            {/* SAVE */}
            <Button
              title={
                initialValues ? 'Update Vehicle' : 'Save Vehicle'
              }
              onPress={handleSubmit(onSubmit)}
            />

            {/* CANCEL */}
            <Text style={appstyles.cancel} onPress={onClose}>
              Cancel
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- FORM INPUT ---------------- */

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  keyboardType?: 'default' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
};

const FormInput = ({
  label,
  value,
  placeholder,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
}: InputProps) => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);

  return (
    <View >
      <Text style={appstyles.mutedText}>{label}</Text>

      <View
        style={[
          appstyles.inputContainer,
          
          error && appstyles.errorBorder,
        
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={theme.colors.placeholder}
          style={appstyles.textInput}
        />
      </View>

      {error && (
        <Text style={appstyles.errorText}>{error}</Text>
      )}
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    keyboard: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: theme.colors.cardBg,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    header: {
      // marginBottom: 16,
    },
    
  });
