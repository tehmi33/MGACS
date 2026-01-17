// import React from "react";
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const { width } = Dimensions.get("window");

// const CustomTabBar: React.FC<BottomTabBarProps> = ({
//   state,
//   navigation,
// }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.tabBar}>
//         {state.routes.map((route, index) => {
//           const isFocused = state.index === index;

//           let iconName: string = "home-outline";

//           switch (route.name) {
//   case "Home":
//     iconName = "home";
//     break;
//   case "Visitors":
//     iconName = "person-add";
//     break;
//   case "VisitorInfo":
//     iconName = "information-circle";
//     break;
//   // case "Challans":
//   //   iconName = "document-text";
//   //   break;
// }

//           return (
//             <TouchableOpacity
//               key={route.key}
//               style={styles.tabItem}
//               onPress={() => navigation.navigate(route.name)}
//             >
//               <Ionicons
//                 name={iconName}
//                 size={24}
//                 color={isFocused ? "#1E40AF" : "#9CA3AF"}
//               />
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default CustomTabBar;

// const styles = StyleSheet.create({
//   container: {
//     // position: "absolute",
//     // bottom: 10,
//     // left: 20,
//     // right: 20,
//   },
//   tabBar: {
//     height: 65,
//     backgroundColor: "#FFFFFF",
//     // borderRadius: 30,
//     flexDirection: "row",
//     elevation: 10,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 🔴 Hide tab bar when keyboard is open
  if (keyboardVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          let iconName: string = "home-outline";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Visitors":
              iconName = "person-add";
              break;
            case "VisitorInfo":
              iconName = "information-circle";
              break;
            case "Challans":
              iconName = "document-text";
              break;
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => navigation.navigate(route.name)}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={isFocused ? "#1E40AF" : "#9CA3AF"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {},
  tabBar: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});