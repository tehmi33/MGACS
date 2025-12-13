import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
  value: Date | undefined;
  onChange: (date: Date) => void;
  error?: string;
}

export const FormDateTime = ({ value, onChange, error }: Props) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  const currentValue = value || new Date();

  const handleChange = (event: any, selectedValue?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (!selectedValue) return;

    // STEP 1: If selecting date → update date and open time picker
    if (mode === "date") {
      const updated = new Date(currentValue);
      updated.setFullYear(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate()
      );

      // Open TIME picker after selecting date
      setMode("time");
      setShowPicker(true);

      onChange(updated);
      return;
    }

    // STEP 2: If selecting time → update time and close picker
    if (mode === "time") {
      const updated = new Date(currentValue);
      updated.setHours(
        selectedValue.getHours(),
        selectedValue.getMinutes(),
        0,
        0
      );

      setShowPicker(false);
      setMode("date"); // reset for next time

      onChange(updated);
      return;
    }
  };

  const openPicker = () => {
    setMode("date");
    setShowPicker(true);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>Select Date & Time</Text>

      <TouchableOpacity style={styles.selector} onPress={openPicker}>
        <Text style={styles.selectorText}>
          {value
            ? value.toLocaleString() // Date + Time combined
            : "Tap to select date & time"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={currentValue}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  selector: {
    padding: 14,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectorText: {
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
