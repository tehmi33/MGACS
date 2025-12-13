import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface InputEmailProps {
  placeholder: string;
  onchangeText: (text: string) => void;
  value: string;
  keyboardType?: any;
}

const InputEmail: React.FC<InputEmailProps> = ({ placeholder, onchangeText, value, keyboardType }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.input}
        placeholderTextColor="#9E9E9E"
        onChangeText={onchangeText}
        value={value}
      />
    </View>
  );
};

export default InputEmail;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor:'#E0E0E0',
    borderWidth:1,
    borderRadius:10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    fontFamily: 'Roboto',
  },
});
