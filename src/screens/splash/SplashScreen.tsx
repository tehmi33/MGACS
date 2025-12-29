import React, { FC, useContext, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const SplashScreen: FC = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: user ? "Home" : "Login" }],
      });
    }, 1500); // splash duration

    return () => clearTimeout(timer);
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.roundcontainer}>
        <Image
          source={require("../../Asesst/mgacs-logo.png")}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  roundcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "70%",
    height: "20%",
    resizeMode: "contain",
  },
});
