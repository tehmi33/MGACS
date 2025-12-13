import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Touchable, TouchableOpacity } from 'react-native';
import InputEmail from '../../components/InputEmail';
import Password from '../../components/Password';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
const { width } = Dimensions.get('window');
const Signin: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(text.length === 0 || !emailRegex.test(text) ? 'Please enter a valid email' : '');
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text.length < 6 ? 'Password must be at least 6 characters' : '');
  };

  return (
    <View style={styles.container}>
       <View style={styles.topContainer}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                style={styles.topImage}
              />
            </View>
            <View style={styles.card}>
      <Text style={styles.title}>CREATE AN ACCOUNT</Text>

      <View style={styles.inputContainer}>
        <InputEmail placeholder="Username" onchangeText={validateEmail} value={email} />
        <InputEmail placeholder="Email" onchangeText={validateEmail} value={email} />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
       

        <Password placeholder="Password" onchangeText={validatePassword} value={password} />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
<Password placeholder="Confirm Password" onchangeText={validatePassword} value={password} />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <Button title="Sign in" onPress={() => navigation.navigate('Login')} />
      </View>
       </View>
       <View style={styles.cont}>
        <Text style={styles.txt1}>By clicking "Registration".I agree to the</Text>
        <TouchableOpacity>
        <Text style={styles.txt2}>Terms of Service.</Text> 
        </TouchableOpacity>
       </View>
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
    paddingHorizontal: 20, 
  },
  topContainer: {
    height: 220,
    width: width * 1,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  topImage: {
    width: 90,
    height: 90,
    tintColor: '#6C87F5',
  },
   card: {
    width: width ,
    alignSelf: 'center',
   
    backgroundColor: '#fff',
  
    padding: 20,

  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2B68F6',
    fontFamily: 'Roboto',
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
   width: width * 0.9,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Roboto',
    marginVertical: 5,
  },
  cont:{
  alignItems:'center',
    margin:20,
  },
  txt1:{
    fontSize:13,
    fontFamily:'Roboto',
    color:'#535A73',    
  },
  txt2:{
    fontSize:13,
    fontFamily:'Roboto',
    color:'#2B68F6',    
    fontWeight:'700',
  
  }
  
});
