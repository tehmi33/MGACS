import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control, useWatch } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';

interface Props {
  control: Control<any>;
}

const purposes = [
  { label: 'Friend', value: 'friend' },
  { label: 'Relative', value: 'relative' },
  { label: 'Delivery', value: 'delivery' },
];

export default function VisitPurposeSelector({ control }: Props) {
  const isOther = useWatch({ control, name: 'isOther', defaultValue: false });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Visit Purpose / Relationship</Text>

      {/* ROW */}
      <View style={styles.row}>
        <Controller
          control={control}
          name="visitPurpose"
          rules={{ required: 'Purpose required' }}
          render={({ field: { onChange, value }, fieldState }) => (
            <View style={{ flex: 1 }}>
              <Dropdown
                style={[
                  styles.input,
                  fieldState.error && styles.errorBorder,
                ]}
                data={purposes}
                labelField="label"
                valueField="value"
                placeholder="Select purpose"
                value={value}
                onChange={item => onChange(item.value)}
              />
            </View>
          )}
        />

        {/* OTHER */}
        <Controller
          control={control}
          name="isOther"
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

      {/* OTHER INPUT */}
      {/* {isOther && (
        <Controller
          control={control}
          name="otherPurpose"
          rules={{ required: 'Please specify other' }}
          render={({ field: { onChange, value } }) => (
            <View style={{ marginTop: 10 }}>
              <Dropdown
                style={styles.input}
                data={[]}
                placeholder="Enter other purpose"
                value={value}
                onChange={() => {}}
              />
            </View>
          )}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  label: { fontWeight: '600', marginBottom: 6, color: '#334155' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  otherBox: { flexDirection: 'row', alignItems: 'center' },
  errorBorder: { borderColor: 'red' },
});
