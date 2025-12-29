import React from 'react';
import { StyleSheet , TextInput} from 'react-native';
import { Controller, Control } from 'react-hook-form';


interface Props {
  control: Control<any>;
  name: string;
  placeholder: string;
}

export default function VisitorDestinationInput({
  control,
  name,
  placeholder,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (
        <TextInput
          // mode="outlined"
          multiline
          numberOfLines={4}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={value ?? ''}
          onChangeText={onChange}
          style={styles.input}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
    height: 70,
    textAlignVertical: 'top',
  },
});
