import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import InputEmail from '../../components/InputEmail';
import Password from '../../components/Password';
import Button from '../../components/Button';

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const navigation = useNavigation();
  const { login, } = useContext(AuthContext);

  const [phone, setPhone] = useState('+92-');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ LIVE AUTO FORMAT: +92-300-1234567
 const formatPhoneInput = (text: string) => {
  // Extract digits only
  let digits = text.replace(/\D/g, '');

  // Remove country code if pasted
  if (digits.startsWith('92')) digits = digits.slice(2);

  // Remove leading zero
  if (digits.startsWith('0')) digits = digits.slice(1);

  // 🚨 Force first digit to be 3
  if (digits.length > 0 && digits[0] !== '3') {
    digits = '3' + digits.slice(1);
  }

  // Limit to 10 digits (3XX + 7)
  digits = digits.slice(0, 10);

  let formatted = '+92';

  if (digits.length > 0) {
    formatted += '-' + digits.substring(0, 3);
  }

  if (digits.length > 3) {
    formatted += '-' + digits.substring(3, 10);
  }

  return formatted;
};


  const handleLogin = async () => {
    let isValid = true;
    setPhoneError('');
    setPasswordError('');

    // ✅ Validate formatted number
    const regex = /^\+92-\d{3}-\d{7}$/;

    if (!regex.test(phone)) {
      setPhoneError('Enter valid phone number');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);

      const response = await login(phone, password);

       if (!response || !response.data) {
      setPasswordError(response?.message || 'Login failed');
      return;
    }

       if (response.data.trusted === false) {
      navigation.navigate('Otp', { phone });
      return;
    }
    } catch (error) {
      setPasswordError('Something went wrong, try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          appstyles.scrollContent,
          { padding: 20, justifyContent: 'center' }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO */}
        <View style={styles.topContainer}>
          <Image
            source={require('../../Asesst/mgacs-logo.png')}
            style={styles.topImage}
            resizeMode="contain"
          />
        </View>

        {/* FORM */}
        <View style={styles.card}>
          <Text style={appstyles.screenTitle}>LOG IN</Text>

          <InputEmail
            placeholder="+92-300-1234567"
            keyboardType="numeric"
            value={phone}
            onchangeText={(text) => {
              setPhone(formatPhoneInput(text));
              setPhoneError('');
            }}
          />
          {phoneError ? (
            <Text style={appstyles.errorText}>{phoneError}</Text>
          ) : null}

          <Password
            placeholder="Password"
            value={password}
            onchangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
          />
          {passwordError ? (
            <Text style={appstyles.errorText}>{passwordError}</Text>
          ) : null}

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
            <Text style={appstyles.mutedText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} />
        
             <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.separator} />
          </View>
             <Button
            title="Create New Account"
            onPress={() => navigation.navigate('Signin')}
          />
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>
            Logging in...
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  topImage: {
    width: '40%',
    height: 120,
  },
  card: {
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
   separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 13,
  },
});
