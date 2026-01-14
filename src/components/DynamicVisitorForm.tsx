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
import { Visitor } from '../types/VisitorRequest';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';
import { Theme } from '../theme/themes';
import Button from './Button';

/* ---------------- TYPES ---------------- */

export type VisitorFormValues = {
  name: string;
  phone?: string;
  cnic?: string;
};

type VisitorField = 'name' | 'phone' | 'cnic';

type Props = {
  visible: boolean;
  fields: VisitorField[];
  initialValues?: Visitor;
  onClose: () => void;
  onSubmit: (data: VisitorFormValues) => void;
};

/* ---------------- COMPONENT ---------------- */

export default function DynamicVisitorForm({
  visible,
  fields,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const styles = createStyles(theme);
const formatPhoneInput = (text: string) => {
  let digits = text.replace(/\D/g, '');

  // Remove leading 92 if pasted
  if (digits.startsWith('92')) {
    digits = digits.slice(2);
  }

  // Remove leading 0
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // Must start with 3
  if (!digits.startsWith('3')) {
    digits = '3' + digits.replace(/^3+/, '');
  }

  digits = digits.slice(0, 10); // 3XX + 7 digits

  let formatted = '+92';

  if (digits.length >= 3) {
    formatted += `-${digits.slice(0, 3)}`;
  }
  if (digits.length > 3) {
    formatted += `-${digits.slice(3)}`;
  }

  return formatted;
};

const formatCnicInput = (text: string) => {
  let value = text.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Limit to 13 total characters
  value = value.slice(0, 13);

  let formatted = value;

  if (value.length > 5) {
    formatted = value.slice(0, 5) + '-' + value.slice(5);
  }
  if (value.length > 12) {
    formatted =
      value.slice(0, 5) +
      '-' +
      value.slice(5, 12) +
      '-' +
      value.slice(12);
  }

  return formatted;
};

  const { control, handleSubmit, reset } =
    useForm<VisitorFormValues>({
      defaultValues: {
        name: '',
        phone: '',
        cnic: '',
      },
    });

  /* ---------------- RESET ON OPEN ---------------- */

  useEffect(() => {
    if (visible) {
      reset({
        name: initialValues?.name ?? '',
        phone: initialValues?.phone ?? '',
        cnic: initialValues?.cnic ?? '',
      });
    }
  }, [visible, initialValues, reset]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.sheet}>
            <Text style={appstyles.screenTitle}>
              {initialValues ? 'Edit Visitor' : 'Add Visitor'}
            </Text>

            {/* NAME */}
            {fields.includes('name') && (
              <Controller
                control={control}
                name="name"
                rules={{ required: 'Name is required' }}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Full Name"
                    placeholder="Enter full name"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* PHONE */}
            {fields.includes('phone') && (
              <Controller
                control={control}
                name="phone"
               rules={{ required: false }}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Phone Number"
                    placeholder="03xx-xxxxxxx"
                    value={field.value ?? ''}
                   onChangeText={(text) =>
          field.onChange(formatPhoneInput(text))
        }
                    onBlur={field.onBlur}
                    keyboardType="phone-pad"
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* CNIC */}
            {fields.includes('cnic') && (
              <Controller
                control={control}
                name="cnic"
                rules={{ required: 'CNIC is required' }}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="CNIC"
                    placeholder="xxxxx-xxxxxxx-x"
                    value={field.value ?? ''}
                      onChangeText={(text) =>
          field.onChange(formatCnicInput(text))
        }
                    onBlur={field.onBlur}
                    keyboardType="numeric"
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* SAVE */}
            <Button
              title={
                initialValues ? 'Update Visitor' : 'Save Visitor'
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
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  error?: string;
};

const FormInput = ({
  label,
  value,
  placeholder,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  error,
}: InputProps) => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);

  return (
    <View style={{ marginBottom: 14 }}>
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
      // justifyContent: 'flex-end',
      zIndex: 1000,
      marginBottom: 80 
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
    },
  
  });
