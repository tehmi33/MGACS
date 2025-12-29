import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import { Control, Controller } from 'react-hook-form';
import { ResidentType, ResidentTypeOption } from '../types/VisitorRequest';

interface Props {
  control: Control<any>;
  name: string;
  options: ResidentTypeOption[];
}

export default function ResidentTypeSelector({
  control,
  name,
  options,
}: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Controller
        control={control}
        name={name}
        rules={{ required: 'Resident type is required' }}
        render={({ field: { value, onChange } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={styles.row}>
              {options.map(opt => (
                <View key={opt.value} style={styles.option}>
                  <RadioButton value={opt.value} />
                  <TouchableOpacity onPress={() => onChange(opt.value)}>
                    <Text style={styles.label}>{opt.label}</Text>
                    <Text style={styles.hours}>({opt.hours} hrs)</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    gap: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  hours: {
    fontSize: 11,
    color: '#64748b',
    marginTop: -2,
  },
});
