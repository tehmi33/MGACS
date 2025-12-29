import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Controller, Control, useWatch } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';

interface Option {
  label: string;
  value: string;
}

interface Props {
  control: Control<any>;
  name: string;              // main dropdown field name
  otherName: string;         // text input field name
  isOtherName: string;       // checkbox field name
  label?: string;
  placeholder: string;
  otherPlaceholder?: string;
  data: Option[];
}

export default function DropdownWithOther({
  control,
  name,
  otherName,
  isOtherName,
  placeholder,
  otherPlaceholder = 'Enter other',
  data,
}: Props) {
  const isOther = useWatch({
    control,
    name: isOtherName,
    defaultValue: false,
  });

  return (
    <View style={styles.wrapper}>

      <View style={styles.row}>
        {/* Dropdown / Other Input */}
        <Controller
          control={control}
          name={isOther ? otherName : name}
          rules={{
            required: isOther ? 'Please specify other' : 'This field is required',
          }}
          render={({ field: { onChange, value }, fieldState }) => (
            <View style={{ flex: 1 }}>
              {!isOther ? (
                <Dropdown
                  style={[styles.input, fieldState.error && styles.errorBorder]}
                  data={data}
                  labelField="label"
                  valueField="value"
                  placeholder={placeholder}
                  value={value}
                  onChange={item => onChange(item.value)}
                  onChangeText={onChange}
                   itemTextStyle={styles.itemText}
  selectedTextStyle={styles.selectedText}
  placeholderStyle={styles.placeholderText}
                />
              ) : (
                <TextInput
                  style={[styles.input, fieldState.error && styles.errorBorder]}
                  placeholder={otherPlaceholder}
                  placeholderTextColor="#64748b"
                  value={value}
                  
                />
              )}
            </View>
          )}
        />

        {/* Other Checkbox */}
        <Controller
          control={control}
          name={isOtherName}
          render={({ field: { onChange, value } }) => (
            <View style={styles.otherBox}>
              <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChange(!value)}
              />
              <Text>Other</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
 
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: '#000',
  },
  otherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorBorder: {
    borderColor: 'red',
  },
  
itemText: {
    fontSize: 14,        // smaller font
    color: '#0f172a',
  },

  // 👇 Selected value shown in input
  selectedText: {
    fontSize: 14,
    color: '#0f172a',
  },

  // 👇 Placeholder text
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
