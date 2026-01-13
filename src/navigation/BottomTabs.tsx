import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home/HomeScreen";
import VisitorRequestScreen from "../screens/VisitorRequest/VisitorRequestScreen";
import ChallansScreen from "../screens/challan/ChallansScreen";
import VisitorInformation from "../screens/visitorinfo/VisitorInformation";
import CustomTabBar from "./CustomTabBar";

export type BottomTabParamList = {
  Home: undefined;
  Visitors: undefined;
    VisitorInfo: undefined;
  Challans: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Visitors" component={VisitorRequestScreen} />
       <Tab.Screen name="VisitorInfo" component={VisitorInformation} />
      <Tab.Screen name="Challans" component={ChallansScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
