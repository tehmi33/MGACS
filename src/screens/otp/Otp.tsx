import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useContext } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { OtpInput } from 'react-native-otp-entry';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';


interface OtpScreenProps {
  navigation: any;
  route: { params: { phone: string } };
}

const OtpScreen: React.FC<OtpScreenProps> = ({ navigation, route }) => {
  
  const { phone } = route.params;
  const { verifyOtp } = useContext(AuthContext);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');


   const handleVerifyOtp = async () => {
    let isValid = true;

    // 🔹 Validate OTP field
    if (!otp.trim()) {
      setOtpError("OTP is required");
      isValid = false;
    } else if (otp.length < 4) {
      setOtpError("OTP must be 4 digits");
      isValid = false;
    }

    if (!isValid) return; // ❌ STOP without alert

    setLoading(true);
    setOtpError(""); // clear old server errors

    try {
      const response = await verifyOtp(phone, otp);

      if (!response.success) {
        setOtpError(response.message || "Invalid OTP");
        return;
      }

      // Verified → AuthContext will auto redirect
    } catch (error: any) {
      setOtpError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
  <View style={styles.containerMain}>

    <TouchableOpacity onPress={() => navigation.goBack()}>
      <View style={styles.backiconcontainer}>
        <AntDesign name="arrowleft" size={20} color="#2C3E50" />
      </View>
    </TouchableOpacity>

    <View style={styles.textContainer}>
      <Text style={styles.text}>Enter 4 digit OTP</Text>
      <Text style={styles.text1}>
        An OTP has been sent to your mobile number {phone}
      </Text>
    </View>

    <OtpInput
      numberOfDigits={4}
      onTextChange={(value) => {
        setOtp(value);
        setOtpError("");
      }}
      autoFocus={true}
      theme={{
        containerStyle: styles.otpContainer,
        pinCodeContainerStyle: styles.pinCodeContainer,
        pinCodeTextStyle: styles.pinCodeText,
        focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
        focusStickStyle: styles.focusStick,
      }}
    />

    {/* 🔴 OTP error below the input */}
    {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

    {/* 🔥 Button with disabled + loader */}
    <TouchableOpacity
      disabled={loading}
      onPress={handleVerifyOtp}
      style={[
        styles.verifyBtn,
        loading && { backgroundColor: "#AAB7FF" }, // disabled shade
      ]}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color="#3D5AFE" />
          <Text style={styles.verifyBtnText}>  Verifying...</Text>
        </>
      ) : (
        <Text style={styles.verifyBtnText}>Submit</Text>
      )}
    </TouchableOpacity>

  </View>
);

};

export default OtpScreen;

const styles = StyleSheet.create({
  containerMain: { flex: 1, backgroundColor: 'white', padding: 20 },
  backiconcontainer: {
    marginLeft: 5,
    width: 36,
    height: 36,
    backgroundColor: '#F2F2F2',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  textContainer: { alignItems: 'center', marginBottom: 15, marginTop: 40 },
  text: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Manrope',
  },
  text1: {
    fontSize: 14,
    fontWeight: '400',
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Manrope',
    width: '80%',
  },
  otpContainer: {
    width: '75%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  pinCodeContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    width: 55,
    height: 55,
    marginHorizontal: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedPinCodeContainer: { borderColor: '#3D5AFE', borderWidth: 2 },
  pinCodeText: { fontSize: 18, fontWeight: '600', textAlign: 'center', color: 'black', fontFamily: 'Manrope' },
  focusStick: { backgroundColor: '#000', width: 2, height: 24 },
  resendContainer: { flexDirection: 'row', alignSelf: 'center', marginTop: 15, marginBottom: 30 },
  resendtext: { fontSize: 13, fontWeight: '400', color: '#000', fontFamily: 'Manrope', textAlign: 'center' },
  verifyBtn: {
  backgroundColor: "#3D5AFE",
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  marginTop: 15,
},

verifyBtnText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
  fontFamily: "Manrope",
},

errorText: {
  color: "red",
  fontSize: 13,
  fontFamily: "Manrope",
  textAlign: "center",
  marginBottom: 10,
},

});
