import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';

interface PasswordProps {
  placeholder: string;
  onchangeText: (text: string) => void;
  value: string;
}

const Password: React.FC<PasswordProps> = ({ placeholder, onchangeText, value }) => {
   const theme = useTheme();
    const appstyles = AppStyles(theme);
  const [visible, setVisible] = useState(false);

  return (
    <View style={appstyles.inputContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          
        }}
      >
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!visible}
          style={[appstyles.textInput, { flex: 1, paddingHorizontal: 0 }]}
          placeholderTextColor={theme.colors.placeholder}
          onChangeText={onchangeText}
          value={value}
        />

        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Image
            source={
              visible
                ? require('../Asesst/Variant2.png') // open eye
                : require('../Asesst/eye.png')      // closed eye
            }
            style={
              visible
                ? { width: 15, height: 15 } // OPEN eye size
                : { width: 20, height: 7 } // CLOSED eye size
            }
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Password;
