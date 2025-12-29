import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  value?: Date;
  onChange: (date: Date) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export const FormDateTime = ({
  value,
  onChange,
  error,
  label,
  placeholder = "Tap to select date & time",
  
}: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const currentValue = value ?? new Date();

  const handleChange = (_: any, selectedValue?: Date) => {
    if (!selectedValue) {
      setShowPicker(false);
      setMode("date");
      return;
    }

    if (mode === "date") {
      const updated = new Date(currentValue);
      updated.setFullYear(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate()
      );

      setMode("time");
      setShowPicker(true);
      onChange(updated);
      return;
    }

    if (mode === "time") {
      const updated = new Date(currentValue);
      updated.setHours(
        selectedValue.getHours(),
        selectedValue.getMinutes(),
        0,
        0
      );

      setShowPicker(false);
      setMode("date");
      onChange(updated);
    }
  };

  return (
    <View style={{ paddingBottom: 10  }}>


      <TouchableOpacity
        style={styles.selector}
        onPress={() => {
          setMode("date");
          setShowPicker(true);
        }}
      >
        <Text style={styles.selectorText}>
          {value ? value.toLocaleString() : placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          
          value={currentValue}
          mode={mode}
          display="default"
          minuteInterval={5}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  selector: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  selectorText: {
    color: "#000",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
