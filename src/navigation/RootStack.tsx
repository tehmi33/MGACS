import React, { useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import SplashScreen from "../screens/splash/SplashScreen";

const RootStack = () => {
  const { user, loading } = useContext(AuthContext);

console.log("Root stack", user);
  
  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#2B68F6" />
  //     </View>
  //   );
  // }
  
  return user ? <AppStack /> : <AuthStack />;

};

export default RootStack;
