import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormDropdown: React.FC<Props> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.pickerWrapper, error && styles.errorBorder]}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label="Select Service" value="" />
          <Picker.Item label="Cleaning" value="cleaning" />
          <Picker.Item label="Repair" value="repair" />
          <Picker.Item label="Delivery" value="delivery" />
        </Picker>
      </View>

    
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden", 
    backgroundColor: "#fff",
  },

  picker: {
  
    color: "#000",
    ...(Platform.OS === "ios" && {
      height: 180, // iOS needs more height
    }),
  },

  errorBorder: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
