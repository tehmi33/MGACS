import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Vehicle } from "../types/VisitorRequest";

export type VehicleFormValues = {
  plateNo: string;
  make?: string;
  color?: string;
  model?: string;
};

type Props = {
  visible: boolean;
  initialValues?: Vehicle;
  onClose: () => void;
  onSubmit: (data: VehicleFormValues) => void;
};

export default function VehicleDetailsForm({
  visible,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset } = useForm<VehicleFormValues>({
    defaultValues: {
      plateNo: initialValues?.plateNo ?? "",
      make: initialValues?.make ?? "",
      color: initialValues?.color ?? "",
      model: initialValues?.model ?? "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        plateNo: initialValues?.plateNo ?? "",
        make: initialValues?.make ?? "",
        color: initialValues?.color ?? "",
        model: initialValues?.model ?? "",
      });
    }
  }, [visible, initialValues, reset]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          {/* BOTTOM SHEET */}
          <View style={styles.sheet}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {initialValues ? "Edit Vehicle" : "Vehicle Details"}
              </Text>
            </View>

            {/* PLATE NUMBER */}
            <Controller
              control={control}
              name="plateNo"
              rules={{ required: "Plate number is required" }}
              render={({ field, fieldState }) => (
                <Input
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
            <Controller
              control={control}
              name="make"
              render={({ field, fieldState }) => (
                <Input
                  label="Make"
                  placeholder="Toyota, Honda, Suzuki"
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* MODEL */}
            <Controller
              control={control}
              name="model"
              render={({ field, fieldState }) => (
                <Input
                  label="Model"
                  placeholder="Camry, Civic"
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* COLOR */}
            <Controller
              control={control}
              name="color"
              render={({ field, fieldState }) => (
                <Input
                  label="Color"
                  placeholder="White, Black, Silver"
                  value={field.value ?? ""}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* SAVE */}
            <TouchableOpacity
              style={styles.submit}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitText}>
                {initialValues ? "Update Vehicle" : "Save Vehicle"}
              </Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* INPUT COMPONENT */

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  keyboardType?: "default" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
};

const Input = ({
  label,
  value,
  placeholder,
  onChangeText,
  onBlur,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
}: InputProps) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#9ca3af"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

/* STYLES */

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end", // 👈 keeps sheet at bottom
    zIndex: 100,
  },
  keyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  inputWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
    fontSize: 12,
  },
  submit: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancel: {
    textAlign: "center",
    marginTop: 14,
    color: "#6b7280",
  },
});
