import React from "react";
import { StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { Option } from "../types/common";

interface Props<TValue = string | number> {
  control: Control<any>;
  name: string;
  placeholder: string;
  data: Option<TValue>[];
  rules?: object;
}

export default function DropDown<TValue = string | number>({
  control,
  name,
  placeholder,
  data,
  rules = { required: "This field is required" },
}: Props<TValue>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Dropdown
          style={styles.input}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={value}
          onChange={(item: Option<TValue>) => onChange(item.value)}
          itemTextStyle={styles.itemText}
          selectedTextStyle={styles.selectedText}
          placeholderStyle={styles.placeholderText}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: "#0f172a",
  },
  selectedText: {
    fontSize: 14,
    color: "#0f172a",
  },
  placeholderText: {
    fontSize: 14,
    color: "#94a3b8",
  },
});
