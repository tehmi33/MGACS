import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ChallanRow = ({ challan }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const image =
    challan.type === 'bike'
      ? require('../Asesst/bike.png')
      : require('../Asesst/car.png');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* IMAGE */}
        <Image source={image} style={styles.image} />

        {/* INFO */}
        <View style={styles.info}>
          <Text style={styles.title}>{challan.title}</Text>
          <Text style={styles.sub}>{challan.vehicle}</Text>

          <View style={styles.bottom}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>01</Text>
            </View>

            <Text style={styles.price}>₹{challan.amount}</Text>
          </View>
        </View>
      </View>

      {/* SEPARATOR */}
      <View style={styles.separator} />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.infoLight,
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
    },

    image: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
      marginRight: 12,
    },

    info: {
      flex: 1,
    },

    title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },

    sub: {
      fontSize: 11,
      color: '#666',
      marginTop: 2,
    },

    bottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },

    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    circleText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary,
    },

    price: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.primary,
    },

    separator: {
      height: 1,
      backgroundColor: theme.colors.primary, // dark line between rows
      marginLeft: 76, // aligns after image
    },
  });

export default ChallanRow;
