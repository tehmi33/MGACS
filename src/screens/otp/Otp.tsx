import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { OtpInput } from 'react-native-otp-entry';
import Button from '../../components/Button';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import { Theme } from '../../theme/themes';

interface OtpScreenProps {
  navigation: any;
  route: { params: { phone: string } };
}

const OtpScreen: React.FC<OtpScreenProps> = ({
  navigation,
  route,
}) => {
  const { phone } = route.params;
  const { verifyOtp, resendOtp } = useContext(AuthContext);

  const theme = useTheme();
  const appStyles = AppStyles(theme);
  const styles = createStyles(theme);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleVerifyOtp = async () => {
    let isValid = true;

    if (!otp.trim()) {
      setOtpError('OTP is required');
      isValid = false;
    } else if (otp.length < 4) {
      setOtpError('OTP must be 4 digits');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    setOtpError('');

    try {
      const response = await verifyOtp(phone, otp);

      if (!response.success) {
        setOtpError(response.message || 'Invalid OTP');
        return;
      }
      // AuthContext handles success
    } catch (error: any) {
      setOtpError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
const handleResendOtp = async () => {
  console.log('🔁 Resend OTP button clicked');

  setOtpError('');
  setLoading(true);

  try {
    console.log('📡 Calling resendOtp API...');
    const res = await resendOtp();
    console.log('✅ Resend OTP success response:', res);

    // Extract OTP safely
    const otp =
      res?.data?.otp ||
      res?.otp ||
      '****';

    Alert.alert(
      'OTP Sent',
      `Your OTP is: ${otp}`,
      [{ text: 'OK' }]
    );

  } catch (err) {
    console.log('❌ Resend OTP failed:', err);

    Alert.alert(
      'Error',
      'Failed to resend OTP. Please try again.'
    );

    setOtpError('Failed to resend OTP');
  } finally {
    console.log('🏁 Resend OTP finished');
    setLoading(false);
  }
};



  return (
    <View style={appStyles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.backIconContainer}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={theme.colors.text}
          />
        </View>
      </TouchableOpacity>

      {/* TITLE */}
      <View style={styles.centerBox}>
        <Text style={appStyles.screenTitle}>
          Enter 4 digit OTP
        </Text>
        <Text style={appStyles.subtitle}>
          Enter the OTP code sent to {phone}.
        </Text>
      </View>

      {/* OTP INPUT */}
      <OtpInput
        numberOfDigits={4}
        autoFocus
        onTextChange={(value) => {
          setOtp(value);
          setOtpError('');
        }}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          pinCodeTextStyle: styles.pinCodeText,
          focusedPinCodeContainerStyle:
            styles.focusedPinCodeContainer,
          focusStickStyle: styles.focusStick,
        }}
      />

      {/* OTP ERROR */}
      {otpError ? (
        <Text style={appStyles.errorText}>{otpError}</Text>
      ) : null}

      {/* RESEND */}
      <View style={styles.resendRow}>
        <Text style={appStyles.mutedText}>
          Didn't receive the OTP code?
        </Text>

        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendLink}> Resend</Text>
        </TouchableOpacity>
      </View>

      {/* BUTTON */}
      <Button
        title={loading ? 'Verifying...' : 'Submit'}
        onPress={loading ? undefined : handleVerifyOtp}
      />
    </View>
  );
};

export default OtpScreen;

/* ---------------- STYLES ---------------- */

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    backIconContainer: {
      marginLeft: 5,
      width: 36,
      height: 36,
      backgroundColor: theme.colors.cardBg,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    centerBox: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 20,
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
      backgroundColor: theme.colors.cardBg,
      borderRadius: 10,
      width: 55,
      height: 55,
      marginHorizontal: 10,
      borderColor: theme.colors.border,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    focusedPinCodeContainer: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },

    pinCodeText: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.colors.text,
      fontFamily: 'Manrope',
    },

    focusStick: {
      backgroundColor: theme.colors.primary,
      width: 2,
      height: 24,
    },

    resendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 30,
    },

    resendLink: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.error,
      fontFamily: 'Manrope',
    },
  });
