import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';

interface Props {
  control: Control<any>;
}

const data = [
  { label: 'CheckPost - 1', value: 'cp1' },
  { label: 'CheckPost - 2', value: 'cp2' },
];

export default function CheckPostDropdown({ control }: Props) {
  return (
    <Controller
      control={control}
      name="checkPost"
      rules={{ required: 'Entry point is required' }}
      render={({ field: { onChange, value }, fieldState }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>Select Entry</Text>

          <Dropdown
            style={[
              styles.input,
              fieldState.error && styles.errorBorder,
            ]}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select CheckPost"
            value={value}
            onChange={item => onChange(item.value)}
          />

          {fieldState.error && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  label: { fontWeight: '600', marginBottom: 6, color: '#334155' },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  errorBorder: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});
