import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { FormInput } from "../../components/FormInput";
import { FormDropdown } from "../../components/FormDropdown";
import { FormDateTime } from "../../components/FormDateTime";


interface FormData {
  name: string;
  phone: string;
  service: string;
  datetime: Date;
}

const FormScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      datetime: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
   ToastAndroid.show("Form submitted successfully!", ToastAndroid.SHORT);
    console.log("Form Data:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Booking Form</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { value, onChange } }) => (
          <FormInput
            placeholder="Full Name"
            value={value}
            onChange={onChange}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        rules={{
          required: "Phone number required",
          minLength: {
            value: 10,
            message: "Invalid phone number",
          },
        }}
        render={({ field: { value, onChange } }) => (
          <FormInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={value}
            onChange={onChange}
            error={errors.phone?.message}
          />
        )}
      />

     
      <Controller
        control={control}
        name="service"
        rules={{ required: "Service is required" }}
        render={({ field: { value, onChange } }) => (
          <FormDropdown
            value={value}
            onChange={onChange}
            error={errors.service?.message}
          />
        )}
      />
     <Controller
  control={control}
  name="datetime"
  rules={{ required: "Date & time is required" }}
  render={({ field: { value, onChange }, fieldState: { error } }) => (
    <FormDateTime value={value} onChange={onChange} error={error?.message} />
  )}
/>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#3D5AFE",
  },
  button: {
    backgroundColor: "#3D5AFE",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
