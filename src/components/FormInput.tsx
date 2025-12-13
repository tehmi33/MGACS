import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  keyboardType?: any;
  error?: string;
}

export const FormInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  keyboardType,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"  
        keyboardType={keyboardType}
        style={[styles.input, error && styles.errorInput]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
});
