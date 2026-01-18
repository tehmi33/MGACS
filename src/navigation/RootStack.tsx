import React, { useContext, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import SplashScreen from "../screens/splash/SplashScreen";

const RootStack = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or <SplashScreen />

  return user ? <AppStack /> : <AuthStack />;
};

export default RootStack;
