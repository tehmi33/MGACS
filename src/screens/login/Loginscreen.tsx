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


const { width } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    let isValid = true;

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else {
      const regex = /^[0-9]{10,13}$/;
      if (!regex.test(phone.trim())) {
        setPhoneError("Enter valid Phone Number");
        isValid = false;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);
      const response = await login(phone, password);

      if (!response.success) {
        setPasswordError(response.message || "Login failed");
        return;
      }

      if (response.code === "OTP_REQUIRED") {
        navigation.navigate("Otp", { phone });
        return;
      }

    } catch (error) {
      setPasswordError("Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
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
        <Text style={styles.loginTitle}>LOG IN</Text>

        <InputEmail
          placeholder="Phone Number"
          keyboardType="phone-pad"
          onchangeText={(text) => {
            setPhone(text);
            setPhoneError('');
          }}
          value={phone}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

        <Password
          placeholder="Password"
          onchangeText={(text) => {
            setPassword(text);
            setPasswordError('');
          }}
          value={password}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}


        <View style={styles.rowBetween}>
          <TouchableOpacity>
            <Text style={styles.forgetText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <Button title="Login" onPress={handleLogin} />

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.separator} />
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('Signin')}
        >
          <Text style={styles.createBtnText}>Create a new account</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>

    {/* LOADING OVERLAY */}
    {loading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "white", marginTop: 10 }}>Logging in...</Text>
      </View>
    )}
  </KeyboardAvoidingView>
);

};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "white",
  
    
     
  },
scroll: {
  padding: 20,
  paddingBottom: 30,
  flexGrow: 1,
  justifyContent: "center",
   // small natural spacing ONLY
},

  innerContainer: {
    padding: 20,
    backgroundColor: "white",
  },

  topContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  topImage: {
    width: "40%",
    height: 120,
  },

  card: {
    width: "100%",
  },

  loginTitle: {
    color: "#2B68F6",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },

  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  forgetText: {
    color: "#777",
    fontSize: 13,
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },

  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },

  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 13,
  },

  createBtn: {
    backgroundColor: "#739CFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },

  createBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
