import React, { FC } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

const SplashScreen: FC = () => {
  return (
    <View style={styles.container}>
   <View style={styles.roundcontainer}>
      <Image
        source={require('../../Asesst/mgacs-logo.png')}
        style={{ width: '100%', height: '20%', resizeMode: 'contain' }}
      />
   </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roundcontainer: {
    width: '100%',
    height: '105%',
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
 
});
