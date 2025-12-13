import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import RNBootSplash from "react-native-bootsplash";
import { setFcmToken } from './src/utils/fcmToken';


const App = () => {


  // 📌 Request Notification Permission (Android 13+)
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log("Notification Permission:", granted);
      } catch (err) {
        console.warn(err);
    }
    }
  };


  // 📌 Call permission + token on app start
  useEffect(() => {
    requestNotificationPermission();
    // getFcmToken();

    // Hide splash when navigation is ready
    const init = async () => {
      RNBootSplash.hide({ fade: true });
    };

    init();

  }, []);

  // 📌 Foreground notification listener
  useEffect(() => {
    console.log("Setting up foreground notification listener...");
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });


    return unsubscribe;
  }, []);

  useEffect(() => {
  const initFCM = async () => {
    try {
      const token = await messaging().getToken();
      console.log("📌 Initial FCM:", token);
      setFcmToken(token);
    } catch (err) {
      console.log("FCM Init Error:", err);
    }
  };

  initFCM();

  const unsubscribe = messaging().onTokenRefresh((newToken) => {
    console.log("🔄 FCM token refreshed:", newToken);
    setFcmToken(newToken);

    // If authenticated, update backend
    // (AuthContext will expose the function)
    globalThis.updateFcmOnRefresh?.(newToken);
  });

  return unsubscribe;
}, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer
          onReady={() => {
            // Extra safety: hide splash only when navigation is ready
            RNBootSplash.hide({ fade: true });
          }}
        >
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
