import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  Platform
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import BiometricEnableModal from "../../components/BiometricEnableModal";
import { deviceHasBiometricSupport } from "../../utils/biometricAuth";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import BottomTabParamList from "../../navigation/BottomTabs";

import {
  getCurrentLocation,
  requestLocationPermission,
} from "../../utils/location";

import Header from "../../components/Header";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../../theme//ThemeContext";
const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0;
/* Adjust to your navigator */
export type BottomTabParamList = {
  Home: undefined;
  Visitors: undefined;
  VisitorInfo: undefined;
  Challans: undefined;
};

const { width, height } = Dimensions.get("window");


const HomeScreen: React.FC = () => {
  
   const theme = useTheme();
  const styles = createStyles(theme);
const navigation = useNavigation<NavigationProp<BottomTabParamList>>();

  const auth = useContext(AuthContext);

  if (!auth) return null;

  const {
    user,
    logout,
    enableBiometricLogin,
    biometricEnabled,
    untrustAllDevices,
  } = auth;

  const [showModal, setShowModal] = useState(false);
  const [promptShownThisSession, setPromptShownThisSession] = useState(false);

  // 🔁 Used to retry location after returning from settings
  const shouldRetryLocation = useRef(false);

  /* -------------------------------------------------------
     FETCH LOCATION (GPS SAFE)
  ------------------------------------------------------- */
  const fetchLocation = useCallback(async () => {
  try {
    const location = await getCurrentLocation();

    // GPS OFF or permission blocked → user sent to settings
    if (!location) {
      shouldRetryLocation.current = true;
      return;
    }

    shouldRetryLocation.current = false;

    Alert.alert(
      "Location Fetched",
      `
Latitude: ${location.latitude}
Longitude: ${location.longitude}
Altitude: ${location.altitude ?? "N/A"}
Accuracy: ${location.accuracy} m
      `
    );

    console.log("User Location:", location);
  } catch (error: any) {
    Alert.alert("Error", error?.message || "Unable to fetch location");
  }
}, []);

  /* -------------------------------------------------------
     BIOMETRIC PROMPT (ONCE PER SESSION)
  ------------------------------------------------------- */
  useEffect(() => {
    const maybeShowPrompt = async () => {
      if (!user) return;
      if (biometricEnabled) return;
      if (promptShownThisSession) return;

      const supported = await deviceHasBiometricSupport();
      if (!supported) return;

      setShowModal(true);
      setPromptShownThisSession(true);
    };

    maybeShowPrompt();
  }, [user, biometricEnabled, promptShownThisSession]);

  const handleEnable = async () => {
    await enableBiometricLogin();
    setShowModal(false);
  };

  const handleSkip = () => setShowModal(false);

 
 return (
  <View style={styles.screen}>
    {/* <StatusBar barStyle="light-content" translucent backgroundColor={theme.colors.primary}/> */}
    <Header
      title={`Welcome, ${user?.name ?? "User"}`}
      onMenuPress={() => navigation.openDrawer?.()}
      onNotificationPress={() => Alert.alert("Notifications")}
      onAlertPress={() => Alert.alert("Alerts")}
    />
 <View style={styles.noticeBannerWrapper}>
  <View 
  // style={styles.noticeBanner}
  >
   <View style={styles.imageWrapper}>
  <Image
    source={require('../../Asesst/malir.png')}
    style={styles.topImage}
    resizeMode="cover"
  />
</View>

    {/* <LinearGradient
      colors={theme.gradients.primary}
      style={styles.noticeHeader}
    >
      <Text style={styles.noticeBannerTitle}>Instructions & Notices</Text>
      <Icon name="alert-circle-outline" size={26} color={theme.colors.white} />
    </LinearGradient> */}

    {/* <View style={styles.noticeBody}>
      <Text style={styles.noticeBannerDesc}>
        Please follow the latest society instructions and security notices.
      </Text>
    </View> */}
  </View>
</View>



    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== QUICK ACTIONS (IMAGE STYLE GRID) ===== */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <View style={styles.grid}>
        {[
          { icon: "account-plus", label: "Create Visitor Request",screen: "Visitors"},
          { icon: "qrcode", label: "My Passes",  screen: "VisitorInfo", },
          { icon: "car", label: "Vehicles/Visitors",   screen: "VisitorInfo",},
          { icon: "alert-octagon", label: "Violations / Challans", },
        ].map((item, index) => (
        <Pressable
  key={index}
  style={styles.gridCard}
  onPress={() => navigation.navigate(item.screen as any)}
>
  <LinearGradient
    colors={theme.gradients.primary}
    style={styles.iconGradient}
  >
    <Icon name={item.icon} size={24} color={theme.colors.white} />
  </LinearGradient>

  <Text style={styles.gridText}>{item.label}</Text>
</Pressable>


        ))}
      </View>


      {/* ===== NEWS & UPDATES =====
      <Text style={styles.sectionTitle}>News & Updates</Text>

      {[
        {
          title: "Security Update",
          desc: "New facial recognition enabled at Gate 3.",
        },
        {
          title: "Maintenance Alert",
          desc: "Water supply shutdown on Sunday (6 AM – 9 AM).",
        },
        {
          title: "Community Event",
          desc: "Annual society meeting on 25th Jan.",
        },
      ].map((item, index) => (
        <View key={index} style={styles.newsCard}>
          <Icon name="information-outline" size={22} color={theme.colors.primary} />
          <View style={styles.newsText}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDesc}>{item.desc}</Text>
          </View>
        </View>
      ))} */}

      <BiometricEnableModal
        visible={showModal}
        onEnable={handleEnable}
        onSkip={handleSkip}
      />
    </ScrollView>
  </View>
);

};

export default HomeScreen;
const createStyles = (theme: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // paddingTop: STATUS_BAR_HEIGHT
    },

    container: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      marginTop: height * 0.20,
    },

    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 14,
      color: theme.colors.title,
    },

    /* ===== CATEGORY GRID ===== */
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 28,
    },

    gridCard: {
      width: "47%",
      height: 120,
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      justifyContent: "space-between",
      backgroundColor: theme.colors.infoLight,
      elevation: 3,
    },

    iconGradient: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },

    gridText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.primary,
      lineHeight: 18,
    },

    /* ===== NOTICE BANNER ===== */
    noticeBannerWrapper: {
      position: "absolute",
      top: height * 0.27,
      left: width * 0.05,
      right: width * 0.05,
      zIndex: 10,
    },

    noticeBanner: {
      borderRadius: 22,
      overflow: "hidden",
      backgroundColor: theme.colors.infoLight,
      elevation: 10,
      height:190,
    },

    noticeHeader: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    noticeBannerTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.white,
    },

    noticeBody: {
      padding: 14,
      backgroundColor: theme.colors.infoLight,
    },

    noticeBannerDesc: {
      fontSize: 12,
      color: theme.colors.muted,
      lineHeight: 18,
    },
    imageWrapper: {
  width: 350,
  height: 200,
  borderRadius: 30,
  overflow: 'hidden',   // 🔑 THIS IS THE KEY
  alignSelf: 'center',
},

topImage: {
  width: '100%',
  height: '100%',
},

  });
