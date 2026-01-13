// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "../screens/home/HomeScreen";
// import VisitorRequestScreen from "../screens/VisitorRequest/VisitorRequestScreen";
// import VisitorInformation from "../screens/visitorinfo/VisitorInformation";
// import VisitorPassScreen from "../screens/VisitorPassScreen/VisitorPassScreen";
// import ChallansScreen from "../screens/challan/ChallansScreen";


// // import DrawerNavigator from './DrawerNavigator';

// const Stack = createNativeStackNavigator();

// const AppStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="HomeScreen" component={HomeScreen} />
//     <Stack.Screen name="VisitorRequestScreen" component={VisitorRequestScreen} />
//     <Stack.Screen name="VisitorsInformation" component={VisitorInformation} />
//     <Stack.Screen name="VisitorPassScreen" component={VisitorPassScreen} />
//     <Stack.Screen name="ChallanScreen" component={ChallansScreen} />

//     {/* <Stack.Screen name="HomeDrawer" component={DrawerNavigator} /> */}
//   </Stack.Navigator>
// );

// export default AppStack;
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";

export type AppStackParamList = {
  Drawer: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Drawer is the MAIN ENTRY */}
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default AppStack;


