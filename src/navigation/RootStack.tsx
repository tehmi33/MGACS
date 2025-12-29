import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import LoginScreen from "../screens/login/Loginscreen";
import Signin from "../screens/signin/Signin";
import OtpScreen from "../screens/otp/Otp";
import HomeScreen from "../screens/home/HomeScreen";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;

