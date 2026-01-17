import React, { useState, useCallback } from 'react';
import { ScrollView, View , StatusBar, Dimensions, Platform} from 'react-native';
import VisitorEntryCard from '../../components/VisitorEntryCard';
import FormCard from '../../components/FormCard';

import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import api from '../../api/client';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/AppStack";
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;

type AppNavProp = NativeStackNavigationProp<AppStackParamList>;

export default function VisitorInformation() {
  const navigation = useNavigation<AppNavProp>();

  const theme = useTheme();
  const appstyles = AppStyles(theme);

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

/* ---------------- FETCH VISITS ---------------- */

const fetchVisits = useCallback(async () => {
  try {
    setLoading(true);

    console.log('Fetching visits...');
    const res = await api.get('/visit?record=5');

    console.log('Visits response:', res?.data);
    setVisits(res?.data?.visits?.data ?? []);
  } catch (error) {
    console.error('Failed to fetch visits:', error);
  } finally {
    setLoading(false);
  }
}, []);

/* ---------------- FOCUS EFFECT ---------------- */

useFocusEffect(
  useCallback(() => {
    fetchVisits();
  }, [fetchVisits])
);

  const getPrimaryVisitorName = (visit: any): string => {
    const primary = visit.visit_visitors?.find(
      (v: any) => v.model_type?.code === '1'
    );
    return primary?.full_name ?? 'N/A';
  };

  return (
    <View
      style={appstyles.container} 
    >
      {/* <StatusBar barStyle="dark-content" translucent backgroundColor={theme.colors.white}/> */}
      <FormCard
        title="Visitor Request"
        subtitle="Review visitor information"
        children={null}
       
      />
      <View></View>
<ScrollView contentContainerStyle={appstyles.scrollContent}>
      {visits.map((visit) => (
        <VisitorEntryCard
          key={visit.id}
          primaryMember={getPrimaryVisitorName(visit)}
          visitorsCount={visit.visit_visitors?.length ?? 0}
          vehiclesCount={visit.visit_vehicles?.length ?? 0}
          startDateTime={visit.from}
          endDateTime={visit.to}
          statusName={visit.model_status?.name}
          stautsColor={visit.model_status?.color}
          QRcode={visit.visit_code}
         onPress={() =>
            navigation.navigate("VisitorPass", {
              visitId: visit.id,
            })
          }
        />
      ))}
      </ScrollView>
      </View>
    
  );
}
