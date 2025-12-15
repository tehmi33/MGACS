import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native-paper';

interface Props {
  control: Control<any>;
}

export default function VisitorDestinationInput({ control }: Props) {
  return (
    <Controller
      control={control}
      name="destination"
      rules={{ required: 'Destination is required' }}
      render={({ field: { onChange, value }, fieldState }) => (
        <View style={styles.wrapper}>
          <Text style={styles.label}>Visitor Destination</Text>

          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            value={value ?? ''}
            onChangeText={onChange}
            style={styles.input}
            outlineColor="#cbd5e1"
            activeOutlineColor="#2563eb"
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
  label: {  fontWeight: '600', marginBottom: 6, color: '#334155' },
  input: { backgroundColor: '#fff', paddingTop:10 , color: '#0f172a' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
});
