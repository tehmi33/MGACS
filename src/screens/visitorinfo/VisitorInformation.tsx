import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import VisitorEntryCard from '../../components/VisitorEntryCard';
import FormCard from '../../components/FormCard';

import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import api from '../../api/client';

export default function VisitorInformation({ navigation }: any) {
  const theme = useTheme();
  const appstyles = AppStyles(theme);

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/visit?record=5');
      setVisits(res.data?.visits?.data ?? []);
    } catch (error) {
      console.error('Failed to fetch visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryVisitorName = (visit: any): string => {
    const primary = visit.visit_visitors?.find(
      (v: any) => v.model_type?.code === '1'
    );
    return primary?.full_name ?? 'N/A';
  };

  return (
    <ScrollView
      style={appstyles.container}
      contentContainerStyle={appstyles.scrollContent}
    >
      <FormCard
        title="Visitor Request"
        subtitle="Review visitor information"
        children={null}
      />

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
            navigation.navigate('VisitorPassScreen', {
              visitId: visit.id,
            })
          }
        />
      ))}
    </ScrollView>
  );
}
