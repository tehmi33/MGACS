import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image } from 'react-native';

interface PasswordProps {
  placeholder: string;
  onchangeText: (text: string) => void;
  value: string;
}

const Password: React.FC<PasswordProps> = ({ placeholder, onchangeText, value }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.passwordBox}>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
          placeholderTextColor="#9E9E9E"
          onChangeText={onchangeText}
          value={value}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Image
            source={
              isPasswordVisible
                ? require('../Asesst/Variant2.png')
                : require('../Asesst/eye.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Password;

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
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    fontFamily: 'Roboto',
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});
