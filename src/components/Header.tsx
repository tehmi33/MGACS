import React from "react";
import { View, Text, StyleSheet, Pressable ,  Dimensions, Platform, StatusBar, Image} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../theme/ThemeContext";
const { height } = Dimensions.get("window");
type Props = {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onAlertPress?: () => void;
};

const Header: React.FC<Props> = ({
  title,
  subtitle,
  onMenuPress,
  onNotificationPress,
  onAlertPress,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
  <LinearGradient colors={theme.gradients.primary} style={styles.header}>
    {/* TOP ROW */}
    <View style={styles.topRow}>
      <View style={styles.leftRow}>
        <Pressable onPress={onMenuPress}>
          <Icon name="menu" size={26} color={theme.colors.white} />
        </Pressable>

        <View style={styles.avatar}>
          <Icon name="account" size={30} color={theme.colors.white} />
        </View>
      </View>

      <View style={styles.rightRow}>
        <Pressable onPress={onNotificationPress}>
          <Icon name="bell-outline" size={24} color={theme.colors.white} />
        </Pressable>

        <Pressable onPress={onAlertPress}>
          <Icon
            name="alert-circle-outline"
            size={24}
            color={theme.colors.white}
          />
        </Pressable>
      </View>
    </View>

    {/* CENTER BRAND */}
    <View style={styles.brandContainer}>
      <View style={styles.logoCircle}>
          <Image
                    source={require('../Asesst/mgacs-logo.png')}
                    style={styles.topImage}
                    resizeMode="contain"
                  />
        {/* <Icon name="react" size={22} color={theme.colors.white} /> */}
        {/* replace with Image if you have a logo */}
      </View>
      <Text style={styles.brandText}>{title}</Text>
    </View>

    {/* OPTIONAL SUBTITLE */}
    {subtitle && (
      <View style={styles.bottomRow}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    )}
  </LinearGradient>
);

};

export default Header;

const createStyles = (theme: any) =>
  StyleSheet.create({
   header: {
  // paddingTop: STATUS_BAR_HEIGHT ,
// paddingTop:20,
  paddingBottom: height * 0.10,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    leftRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    rightRow: {
      flexDirection: "row",
      gap: 14,
    },

    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    //   backgroundColor: "rgba(255,255,255,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },

    appName: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: "700",
    },

    bottomRow: {
      marginTop: 20,
    },

    subtitle: {
      color: theme.colors.white,
      fontSize: 14,
      fontWeight: "600",
    },
    brandContainer: {
  marginTop: 20,
  alignItems: "center",
  justifyContent: "center",
},

logoCircle: {
  width: 100,
  height: 100,
  borderRadius: 10,
//   backgroundColor: "rgba(255,255,255,0.25)",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 6,
},

brandText: {
  color: theme.colors.white,
  fontSize: 18,
  fontWeight: "700",
},
 topImage: {
    width: '100%',
    height: 120,
  },

  });
