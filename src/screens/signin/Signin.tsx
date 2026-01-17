import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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

const Signin: React.FC = () => {
  const theme = useTheme();
  const appstyles = AppStyles(theme);
  const navigation = useNavigation();
  const { register } = useContext(AuthContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('+92-');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= PHONE FORMAT ================= */
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


  /* ================= CNIC FORMAT ================= */
  const formatCnic = (text: string) => {
    let digits = text.replace(/\D/g, '').slice(0, 13);

    let formatted = digits;
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + '-' + digits.slice(5);
    }
    if (digits.length > 12) {
      formatted =
        digits.slice(0, 5) +
        '-' +
        digits.slice(5, 12) +
        '-' +
        digits.slice(12);
    }

    return formatted;
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    setError('');

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!/^\+92-\d{3}-\d{7}$/.test(phone)) {
      setError('Enter valid phone number');
      return;
    }

    if (!/^\d{5}-\d{7}-\d$/.test(cnic)) {
      setError('Enter valid CNIC');
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await register(
        phone,
        password,
        confirmPassword,
        `${firstName} ${lastName}`.trim(),
        cnic
      );

      if (!response || !response.data) {
        setError(response?.message || 'Registration failed');
        return;
      }

      navigation.navigate('Login');
    } catch (err) {
      setError('Something went wrong, try again.');
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
          <Text style={appstyles.screenTitle}>CREATE ACCOUNT</Text>

          {/* NAME ROW */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputEmail placeholder="First Name" value={firstName} onchangeText={setFirstName} />
            </View>
            <View style={styles.halfInput}>
              <InputEmail placeholder="Last Name" value={lastName} onchangeText={setLastName} />
            </View>
          </View>

          {/* CNIC */}
          <InputEmail
            placeholder="CNIC (xxxxx-xxxxxxx-x)"
            keyboardType="numeric"
            value={cnic}
            onchangeText={(t) => setCnic(formatCnic(t))}
          />

          {/* PHONE */}
          <InputEmail
            placeholder="+92-300-1234567"
            keyboardType="numeric"
            value={phone}
            onchangeText={(t) => setPhone(formatPhoneInput(t))}
          />

          <Password placeholder="Password" value={password} onchangeText={setPassword} />
          <Password placeholder="Confirm Password" value={confirmPassword} onchangeText={setConfirmPassword} />

          {error ? <Text style={appstyles.errorText}>{error}</Text> : null}

          <Button title="Register" onPress={handleRegister} />

          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 20 }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Creating account...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Signin;

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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  linkText: {
    color: '#2B68F6',
    fontWeight: '600',
    fontSize: 13,
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
});
