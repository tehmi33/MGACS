import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ChallanRow from '../../components/ChallanCard';
import { Form } from 'react-hook-form';
import FormCard from '../../components/FormCard';

const MyChallansScreen = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const challans = [
    {
      id: '1',
      title: 'Speeding Violation',
      vehicle: 'KA-01-MJ-2045',
      amount: 1500,
      type: 'car',
    },
    {
      id: '2',
      title: 'No Helmet',
      vehicle: 'KA-03-HL-9921',
      amount: 500,
      type: 'bike',
    },
  ];

  return (
    <View style={styles.container}>
      <FormCard title="My Challans" subtitle="Your Challans"
        children={<></>}
       />

      <FlatList
        data={challans}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChallanRow challan={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.infoLight, // EXACT light purple
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    header: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: 16,
    },
  });

export default MyChallansScreen;
