import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
// import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    {/* <Stack.Screen name="HomeDrawer" component={DrawerNavigator} /> */}
  </Stack.Navigator>
);

export default AppStack;
