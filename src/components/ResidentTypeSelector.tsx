import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Control, Controller } from 'react-hook-form';
interface Props {
  control: Control<any>;
}
const options = [
  { label: 'Family (48 hours)', value: 'family', hours: 48 },
  { label: 'Utility (12 hours)', value: 'utility', hours: 12 },
  { label: 'Commercial (6 hours)', value: 'commercial', hours: 6 },
];

export default function ResidentTypeSelector({ control }: Props) {
  return (
    <Controller
      control={control}
      name="residentType"
      rules={{ required: 'Resident type required' }}
      render={({ field: { onChange, value } }) => (
        <View>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>
            Request Type
          </Text>
          <RadioButton.Group onValueChange={onChange} value={value}>
            {options.map(opt => (
              <RadioButton.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </RadioButton.Group>
        </View>
      )}
    />
  );
}
