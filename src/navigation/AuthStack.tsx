import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/rootstack";
import LoginScreen from "../screens/login/Loginscreen";
import Signin from "../screens/signin/Signin";
import OtpScreen from "../screens/otp/Otp";
// import VisitorPassScreen from "../screens/VisitorPassScreen/VisitorPassScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    {/* <Stack.Screen name="VisitorPassScreen" component={VisitorPassScreen} />  */}
    <Stack.Screen name="Signin" component={Signin} />
    <Stack.Screen name="Otp" component={OtpScreen} />
  </Stack.Navigator>
);

export default AuthStack;
