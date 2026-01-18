import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  StatusBar,
  Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import QRCode from 'react-native-qrcode-svg';

import { useTheme } from '../../theme/ThemeContext';
import { AppStyles } from '../../styles/AppStyles';
import api from '../../api/client';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
const { height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;
/* ========================================================= */
/* ===================== MAIN SCREEN ======================= */
/* ========================================================= */

const VisitorPassScreen: React.FC = ({ route }:any) => {
const visitId = route.params?.visitId || globalThis.visitId;
// ❌ fails if visitId === '' or '0'

console.log ("passvisitId", visitId); 
  const navigation = useNavigation();


  const theme = useTheme();
  const app = AppStyles(theme);
  const styles = createStyles(theme);


  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<View>(null);
  const cardY = useSharedValue(50);



  // useEffect(() => {
  //   cardY.value = withSpring(0, { damping: 30, stiffness: 350 });
  // }, []);

  // const cardStyle = useAnimatedStyle(() => ({
  //   transform: [{ translateY: cardY.value }],
  // }));
   useEffect(() => {
    cardY.value = withSpring(0, { damping: 30, stiffness: 350 });
    fetchVisit();
  }, []);

  const fetchVisit = async () => {
    try {
      const res = await api.get(`/visit/${visitId}`);
      setVisit(res.data.visit);
    } catch (e) {
      console.error('Visit fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardY.value }],
  }));

  const primaryVisitor = visit?.visit_visitors?.find(
    (v: any) => v.model_type_code === '1'
  );

  const otherVisitors = visit?.visit_visitors?.filter(
    (v: any) => v.model_type_code !== '1'
  );

  if (loading) {
    return (
      <View style={[app.container, ]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!visit) return null;
  const isApproved = visit?.model_status?.name === 'Approved';


 const buildShareMessage = () => {
  if (!visit) return '';

  const primary = visit.visit_visitors?.find(
    (v: any) => v.model_type_code === '1'
  );

  const adults = visit.visit_visitors?.filter(
    (v: any) =>
      v.model_type_code !== '1' &&
      (v.cnic || v.mobile_no)
  );

  const children = visit.visit_visitors?.filter(
    (v: any) =>
      !v.cnic &&
      !v.mobile_no &&
      v.model_type_code !== '1'
  );

  const vehicles = visit.visit_vehicles || [];

  const sections: string[] = [];

  // Header
  sections.push(
    `VISITOR PASS`,
    `🏠 House: ${visit.destination || '—'}`,
    `📍 Gate: ${visit.checkpost?.name || '—'}`,
    `✅ Status: ${visit.model_status?.name || '—'}`,
    `📅 From: ${formatDate(visit.from)} ${formatTime(visit.from)}`,
    `📅 To: ${formatDate(visit.to)} ${formatTime(visit.to)}`,
    `🎯 Purpose: ${visit.purpose || '—'}`
  );

  // Primary Visitor
  if (primary) {
    sections.push(
      `👤 Primary Visitor:\n${[
        primary.full_name,
        primary.cnic && `CNIC: ${primary.cnic}`,
        primary.mobile_no && `Phone: ${primary.mobile_no}`,
      ]
        .filter(Boolean)
        .join('\n')}`
    );
  }

  // Adults
  if (adults.length > 0) {
    sections.push(
      `👥 Adults:\n${adults
        .map((v: any) => `• ${v.full_name}`)
        .join('\n')}`
    );
  }

  // Children
  if (children.length > 0) {
    sections.push(
      `🧒 Children:\n${children
        .map((v: any) => `• ${v.full_name}`)
        .join('\n')}`
    );
  }

  // Vehicles
  if (vehicles.length > 0) {
    sections.push(
      `🚗 Vehicles:\n${vehicles
        .map(
          (v: any) =>
            `• ${v.make} ${v.model}, ${v.color} – ${v.registration_no}`
        )
        .join('\n')}`
    );
  }

  // Footer
  sections.push(
    `⏳ Valid Until: ${formatDate(visit.to)} ${formatTime(visit.to)}`
  );

  return sections.join('\n\n');
};



  const onSharePass = async () => {
    try {
      if (!qrRef.current) return;

      const uri = await captureRef(qrRef.current, {
        format: 'png',
        quality: 1,
      });

      await Share.open({
        url: uri,
        type: 'image/png',
        message: buildShareMessage(),
        failOnCancel: false,
      });
    } catch {
      Alert.alert('Error', 'Unable to share visitor pass');
    }
  };
  const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateString?: string) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};


  return (

    <View style={{flex:1}}>
      <Header
      navigation={navigation}
        statusName={visit.model_status?.name}
        statusColor={visit.model_status?.color}
        created_at={visit.created_at}
      />

      <Animated.View style={[styles.card, cardStyle]}>
        <ScrollView showsVerticalScrollIndicator={false}>

{/* QR / VALIDITY */}
          {isApproved && (
            <View style={styles.qrRow}>
              <ViewShot ref={qrRef}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={visit.visit_code}
                    size={70}
                    color={theme.colors.title}
                    backgroundColor={theme.colors.white}
                  />
                  {/* <Text style={app.mutedText}>{visit.visit_code}</Text> */}
                </View>
              </ViewShot>

              <View style={styles.validBox}>
                <View>
                  <Text style={[app.mutedText, {fontSize: 10}]}>Valid Until</Text>
                  <Text style={[app.heading, {fontSize: 13}]}>{formatDate(visit.to)}</Text>
                  <Text style={[app.mutedText, {fontSize: 10}]}>{formatTime(visit.to)}</Text>
                </View>

                <TouchableOpacity onPress={onSharePass}>
                  <LinearGradient colors={theme.gradients.primary} style={styles.shareBtn}>
                    <Icon name="share-variant" size={18} color={theme.colors.white} />
                    <Text style={styles.shareText}>SHARE</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {/* VISIT INFO */}
          <InfoCard visit={visit} />
          {/* FROM / TO */}
         
            <View style={styles.infoGrid}>
              <View style={styles.infoBox}>
                <Text style={app.mutedText}>From</Text>
                <Text style={[app.heading, {fontSize: 12}]}>{formatDate(visit.from)},  <Text style={styles.meta}>{formatTime(visit.from)}</Text></Text>
                
              </View>
             

              <View style={styles.infoBox}>
                <Text style={app.mutedText}>To</Text>
                <Text style={[app.heading, {fontSize: 12}]}>{formatDate(visit.to)},  <Text style={styles.meta}>{formatTime(visit.to)}</Text></Text>
              </View>
            </View>
          
          {/* PRIMARY VISITOR */}
          <BlueCard title={`Visitors (${visit.visit_visitors?.length || 0})`} icon="account-group">
  {visit.visit_visitors?.map((v: any) => (
    <VisitorRow key={v.id} visitor={v} />
  ))}
</BlueCard>

       {visit.visit_vehicles?.length > 0 && (
  <BlueCard title="Vehicle" icon="car-outline">
    {visit.visit_vehicles.map((v: any) => (
      <View
        key={v.id}
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="car-outline" size={14} color={theme.colors.primary} />
            <Text style={app.heading}>
              {v.make} {v.model}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="palette-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.meta}>{v.color}</Text>
          </View>
        </View>

        <View style={styles.plate}>
          <Text style={{ color: theme.colors.header }}>
            {v.registration_no}
          </Text>
        </View>
      </View>
    ))}
  </BlueCard>
)}


        </ScrollView>
      </Animated.View>
    </View>
  );
};



/* ========================================================= */
/* ===================== HEADER ============================= */
/* ========================================================= */

const formatDateTime = (dateString?: string) => {
  if (!dateString) return '—';

  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const isPM = hours >= 12;
  const displayHour = hours % 12 || 12;
  const ampm = isPM ? 'PM' : 'AM';

  return `${day} ${month}, ${displayHour}:${minutes} ${ampm}`;
};

const Header = ({ statusName, statusColor, created_at, navigation }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const app = AppStyles(theme);

  return (
    <LinearGradient colors={theme.gradients.primary} style={styles.header}>

      {/* TOP BAR */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: STATUS_BAR_HEIGHT + 20 ,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={({ pressed }) => [
            app.backButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Icon name="chevron-left" size={22} color={theme.colors.white} />
        </Pressable>

        <Text
          style={[
            app.screenTitle,
            { color: theme.colors.white, marginLeft: 8 },
          ]}
        >
          Visitor Pass
        </Text>
      </View>

      {/* SECOND ROW */}
      <View style={[styles.inline, { marginTop: 10 }]}>
        <Text style={styles.headerText}>
          Created at: {formatDateTime(created_at)}
        </Text>

        <View style={[styles.status, { backgroundColor: statusColor }]}>
          <Icon name="check-circle" size={14} color={theme.colors.white} />
          <Text style={styles.statusText}>{statusName}</Text>
        </View>
      </View>

    </LinearGradient>
  );
};



/* ========================================================= */
/* ===================== INFO CARD ========================== */
/* ========================================================= */

const InfoCard = ({ visit }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const app = AppStyles(theme);

  return (
    <View style={styles.blueCard}>
      <LinearGradient colors={theme.gradients.primary} style={styles.blueHeader}>
        <Icon name="information-outline" size={16} color={theme.colors.header} />
        <Text style={[app.heading, { color: theme.colors.header }]}>
        
          Visit Information
        </Text>
      </LinearGradient>

<View style={styles.blueBody}>
  {/* Purpose – full row */}
    <InfoRow
      icon="clipboard-text-outline"
      label="Purpose"
      value={visit.purpose}
    />
    
    <InfoRow
      icon="home-outline"
      label="Destination"
      value={visit.destination}
    />
  

  {/* Category + Gate – same row */}
  <View style={styles.infoGrid2Col}>
    <InfoRow
      icon="shape-outline"
      label="Resident Type"
      value={visit.model_category?.name}
    />

    <InfoRow
      icon="map-marker-outline"
      label="Entry Gate"
      value={visit.checkpost?.name}
    />
  </View>
</View>

    </View>
  );
};


const InfoRow = ({ icon, label, value }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const app = AppStyles(theme);

  return (
    <View style={styles.infoGridItem}>
      <View style={styles.infoRowCompact}>
        <Icon name={icon} size={14} color={theme.colors.primary} />
        <Text style={app.mutedText}>{label}:</Text>
        <Text style={app.heading} numberOfLines={1}>
        {value || '—'}
      </Text>
      </View>

      
    </View>
  );
};


/* ========================================================= */
/* ===================== REUSABLE =========================== */
/* ========================================================= */

const BlueCard = ({ title, icon, children }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const app = AppStyles(theme);

  return (
    <View style={styles.blueCard}>
      <LinearGradient colors={theme.gradients.primary} style={styles.blueHeader}>
        <Icon name={icon} size={16} color={theme.colors.header} />
        <Text style={[app.heading, { color: theme.colors.header }]}>{title}</Text>
      </LinearGradient>
      <View style={styles.blueBody}>{children}</View>
    </View>
  );
};

const LightCard = ({ children }: any) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  return <View style={styles.lightCard}>{children}</View>;
};

const Person = ({ name }: any) => {
  const app = AppStyles(useTheme());
  return <Text style={app.heading}>{name}</Text>;
};
const VisitorRow = ({ visitor }: any) => {
  const theme = useTheme();
  const app = AppStyles(theme);
  const styles = createStyles(theme); // 👈 IMPORTANT

 const isPrimary = visitor.model_type_code === '1';
const isChild =
  !visitor.cnic &&
  !visitor.mobile_no &&
  !isPrimary

const badges = [
  isPrimary && {
    label: 'Primary',
    color: theme.colors.success,
    bg: theme.colors.successLight,
  },
  isChild && {
    label: 'Under 18',
    color: theme.colors.warning,
    bg: theme.colors.warningLight,
  },
].filter(Boolean);


  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={app.heading}>{visitor.full_name}</Text>

        {badges.map((b: any, i: number) => (
          <View
            key={i}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10,
              backgroundColor: b.bg,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: b.color }}>
              {b.label}
            </Text>
          </View>
        ))}
      </View>
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 5 }}>
      {visitor.cnic && (
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, }}>
          <Icon
            name="card-account-details-outline"
            size={14}
            color={theme.colors.primary}
          />
          <Text style={styles.meta}>{visitor.cnic}</Text>
        </View>
      )}

      {visitor.mobile_no && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon
            name="phone-outline"
            size={14}
            color={theme.colors.primary}
          />
          <Text style={styles.meta}>{visitor.mobile_no}</Text>
        </View>
      )}
    </View>
    </View>
  );
};




/* ========================================================= */
/* ===================== STYLES ============================= */
/* ========================================================= */

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      // paddingTop: 60,
      paddingBottom: 100,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      height:'30%'
    },

  
    house: { color: theme.colors.white, fontSize: 15, fontWeight: '700' },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginTop: 6,
      alignItems: 'center',
    },
    


    headerText: { color: theme.colors.white, fontSize: 12 },

    inline: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'space-between' },

    status: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 14,
    },

    statusText: {  
      
      fontSize: 12, fontWeight: '600'

     },

    card: {
      marginHorizontal: 14,
      marginTop: -90,
      backgroundColor: theme.colors.cardBg,
      borderRadius: 24,
      padding: 14,
      elevation: 8,
      // flex: 1,
    },

    qrRow: { flexDirection: 'row', gap: 12, marginTop: 12

     },
    qrWrapper: { padding: 4, backgroundColor: theme.colors.white },

    validBox: {
  flex: 1,
  backgroundColor: theme.colors.infoLight,
  borderRadius: 14,
  padding: 12,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
    validValue: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.title,
    },

    shareBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
    },

    shareText: { color: theme.colors.white, fontWeight: '700' },

    lightCard: {
      backgroundColor: theme.colors.infoLight,
      borderRadius: 16,
      padding: 12,
      
    },

    infoGrid: { flexDirection: 'row', gap: 20, flexWrap: 'wrap' },

    infoBox: {
      flex: 1,
      backgroundColor: theme.colors.infoLight,
      borderRadius: 12,
      padding: 12,
    },


    blueCard: {
      marginVertical: 10,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.colors.softCardBg,
    },

    blueHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      padding: 10,
    },

    blueBody: { padding: 10, backgroundColor: theme.colors.infoLight },



    meta: {
      fontSize: 12,
      color: theme.colors.muted,
    },

    vehicleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    plate: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
   infoGrid2Col: {
  flexDirection: 'row',
  flexWrap: 'wrap',
 justifyContent: 'space-between',
},

infoGridItem: {
  // width: '60%',
  backgroundColor: theme.colors.infoLight,
  borderRadius: 10,
  padding: 4,
},

infoRowCompact: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  // marginBottom: 2,
},




  });

export default VisitorPassScreen;  