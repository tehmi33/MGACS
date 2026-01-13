import React from 'react';
import { TextInput, View } from 'react-native';
 import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';


interface InputEmailProps {
  placeholder: string;
  onchangeText: (text: string) => void;
  value: string;
  keyboardType?: any;
}

const InputEmail: React.FC<InputEmailProps> = ({ placeholder, onchangeText, value, keyboardType }) => {
   const theme = useTheme();
    const appstyles = AppStyles(theme);
  return (
   <View style={appstyles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={appstyles.textInput}
        placeholderTextColor={theme.colors.placeholder}
        onChangeText={onchangeText}
        value={value}
      />
    </View>
  );
};

export default InputEmail;

