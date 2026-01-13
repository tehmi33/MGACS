import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/ThemeContext';
import { AppStyles } from '../styles/AppStyles';

const ChallanCard = ({ challan }: any) => {
  const theme = useTheme();
  const app = AppStyles(theme);
  const styles = createStyles(theme);

  const unpaid = challan.status === 'UNPAID';

  // choose image based on vehicle number (bike / car)
  const vehicleImage =
    challan.vehicle.includes('KA-03')
      ? require('../Asesst/bike.png')
      : require('../Asesst/car.png');

  return (
    <LinearGradient
      colors={theme.gradients.primary}
      style={styles.card}
    >
      {/* LEFT CONTENT */}
      <View style={styles.left}>
        <Text style={styles.offerLabel}>
          {unpaid ? 'Payment Due' : 'Paid'}
        </Text>

        <Text style={styles.title}>{challan.violation}</Text>

        <Text style={styles.sub}>
          {challan.vehicle} • ₹{challan.amount}
        </Text>

        {unpaid && (
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* RIGHT IMAGE */}
      <View style={styles.imageWrap}>
        <Image
          source={vehicleImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      height: 130,
      borderRadius: 20,
      marginBottom: 14,
      paddingLeft: 16,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },

    /* LEFT */
    left: {
      flex: 1,
      gap: 6,
    },
    offerLabel: {
      fontSize: 11,
      color: theme.colors.white,
      opacity: 0.8,
      fontWeight: '600',
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.colors.white,
    },
    sub: {
      fontSize: 12,
      color: theme.colors.white,
      opacity: 0.9,
    },
    btn: {
      marginTop: 6,
      backgroundColor: theme.colors.white,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    btnText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary,
    },

    /* RIGHT IMAGE */
    imageWrap: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: -30,
    },
    image: {
      width: 90,
      height: 90,
    },
  });

export default ChallanCard;
