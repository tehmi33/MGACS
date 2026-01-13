import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { withSpring, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import { Theme } from '../../theme/themes';
import ChallanCard from '../../components/ChallanCard';


const MyChallansScreen = () => {
  const theme = useTheme();
  const app = AppStyles(theme);
  const styles = createStyles(theme);

  const y = useSharedValue(60);

  React.useEffect(() => {
    y.value = withSpring(0, { damping: 30 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  const challans = [
    {
      id: 1,
      violation: 'Speeding Violation',
      vehicle: 'KA-01-MJ-2045',
      location: 'Outer Ring Road',
      datetime: '12 Jan 2024, 10:45 AM',
      amount: 1500,
      status: 'UNPAID',
    },
    {
      id: 2,
      violation: 'No Helmet',
      vehicle: 'KA-03-HL-9921',
      location: 'Whitefield',
      datetime: '08 Jan 2024, 6:30 PM',
      amount: 500,
      status: 'PAID',
    },
  ];

  return (
    <View style={[app.container,{padding:0}]}>
      {/* HEADER */}
      <LinearGradient colors={theme.gradients.primary} style={styles.header}>
        <Text style={styles.title}>My Challans</Text>
        <Text style={styles.subtitle}>
          Total Due: ₹8,500 • Paid: ₹5,500
        </Text>
      </LinearGradient>

      {/* CARD */}
      <Animated.View style={[styles.card, animStyle]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {challans.map(c => (
            <ChallanCard key={c.id} challan={c} />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      paddingTop: 60,
      paddingBottom: 110,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.white,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 12,
      color: theme.colors.white,
      opacity: 0.9,
    },
    card: {
      marginHorizontal: 14,
      marginTop: -90,
      backgroundColor: theme.colors.cardBg,
      borderRadius: 24,
      padding: 14,
      elevation: 8,
      flex: 1,
    },
  });

export default MyChallansScreen;
