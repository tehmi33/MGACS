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
import { Visitor } from "../types/VisitorRequest";

export type VisitorMode = Visitor["type"]; // "primary" | "adult" | "under18"

export type VisitorFormValues = {
  name: string;
  phone?: string;
  cnic?: string;
};

type Props = {
  visible: boolean;
  mode: VisitorMode;
  initialValues?: Visitor;
  onClose: () => void;
  onSubmit: (data: VisitorFormValues) => void;
};

export default function DynamicVisitorForm({
  visible,
  mode,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const { control, handleSubmit, reset } = useForm<VisitorFormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      phone: initialValues?.phone ?? "",
      cnic: initialValues?.cnic ?? "",
    },
  });

  // Reset on open / edit
  useEffect(() => {
    if (visible) {
      reset({
        name: initialValues?.name ?? "",
        phone: initialValues?.phone ?? "",
        cnic: initialValues?.cnic ?? "",
      });
    }
  }, [visible, initialValues, reset]);

  const title =
    mode === "primary"
      ? "Primary Visitor"
      : mode === "adult"
      ? "Add Adult Visitor"
      : "Add Under 18 Visitor";

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.overlay, { opacity: visible ? 1 : 0 }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.sheet}>
            <Text style={styles.title}>{title}</Text>

            {/* NAME */}
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field, fieldState }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />

            {/* PHONE (primary only) */}
            {mode === "primary" && (
              <Controller
                control={control}
                name="phone"
                rules={{ required: "Phone number is required" }}
                render={({ field, fieldState }) => (
                  <Input
                    label="Phone Number"
                    placeholder="03xx-xxxxxxx"
                    value={field.value ?? ""}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="phone-pad"
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* CNIC (primary + adult) */}
            {(mode === "primary" || mode === "adult") && (
              <Controller
                control={control}
                name="cnic"
                rules={{ required: "CNIC is required" }}
                render={({ field, fieldState }) => (
                  <Input
                    label="CNIC"
                    placeholder="xxxxx-xxxxxxx-x"
                    value={field.value ?? ""}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    keyboardType="numeric"
                    error={fieldState.error?.message}
                  />
                )}
              />
            )}

            {/* SAVE */}
            <TouchableOpacity
              style={styles.submit}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitText}>
                {initialValues ? "Update Visitor" : "Save Visitor"}
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
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
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
      style={[
        styles.input,
        error && { borderColor: "#ef4444" },
      ]}
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
    justifyContent: "flex-end",
    zIndex: 100,
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
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
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  submit: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancel: {
    textAlign: "center",
    marginTop: 14,
    color: "#6b7280",
  },
});
