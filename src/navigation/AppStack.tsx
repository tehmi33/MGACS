import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/home/HomeScreen";
import VisitorRequestScreen from "../screens/VisitorRequest/VisitorRequestScreen";
import VisitorInformation from "../screens/visitorinfo/VisitorInformation";

// import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="VisitorRequestScreen" component={VisitorRequestScreen} />
    <Stack.Screen name="VisitorsInformation" component={VisitorInformation} />

    {/* <Stack.Screen name="HomeDrawer" component={DrawerNavigator} /> */}
  </Stack.Navigator>
);

export default AppStack;
