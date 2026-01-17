import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Alert, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from './src/utils/fcmToken';
import notifee from '@notifee/react-native';
import { handleNotification } from './src/ntifications/notifications';
import { navigationRef } from './src/navigation/navigationRef';
import { setPendingNotification } from './src/ntifications/notificationsPending';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppBackground from './src/components/AppBackground';
import { TransparentNavTheme } from './src/navigation/transparentTheme';
import { ThemeContext } from './src/theme/ThemeContext';
import { useAppTheme } from './src/theme/useAppTheme';
import BootSplash from "react-native-bootsplash";

const App = () => {
    const theme = useAppTheme();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);


  // 🔔 Request Notification Permission (Android 13+)
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          if (Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (result === PermissionsAndroid.RESULTS.GRANTED) {
              setNotificationsAllowed(true);
            } else {
              showBlockedAlert();
            }
          } else {
            // ✅ Android < 13 → auto granted
            setNotificationsAllowed(true);
          }
        }
        if (Platform.OS === 'ios') {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            setNotificationsAllowed(true);
          } else {
            showBlockedAlert();
          }
        }
      } catch (e) {
        console.log('Permission error:', e);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkPermission();
  }, []);
  const showBlockedAlert = () => {
    Alert.alert(
      'Notifications Required',
      'Please enable notifications to continue using the app.',
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };


  const requestIosPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  // 🔔 Foreground FCM listener
  useEffect(() => {
    if (!notificationsAllowed) return;
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
      remoteMessage?.notification?.title ?? 'New Notification',
      remoteMessage?.notification?.body ?? 'Message received'
    );
// console.log("🚀 ~ file: App.tsx ~ line 95 ~ remoteMessage", remoteMessage)
const visitId = remoteMessage?.data?.id;

globalThis.visitId =
  typeof visitId === 'string' ? visitId : undefined;
  console.log("🚀 ~ file: App.tsx ~ line 97 ~ globalvisitId", globalThis.visitId)

    
 const payload = remoteMessage.data;
      

      if (payload?.action && navigationRef.isReady()) {
        if (navigationRef.isReady()) {
          handleNotification(
            {
              action: payload.action,
              data: payload,
            },
            navigationRef,
            true
          );
        }
      }
    });

    //  onDisplayNotification(remoteMessage);

    return unsubscribe;
  }, [notificationsAllowed]);




  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      const visitId = remoteMessage?.data?.id;

globalThis.visitId =
  typeof visitId === 'string' ? visitId : undefined;
      const payload = remoteMessage?.data;

      if (payload?.action && navigationRef.isReady()) {
        if (navigationRef.isReady()) {
          handleNotification(
            {
              action: payload.action,
              data: payload,
            },
            navigationRef,
            true
          );
        }
      }
    });
  }, []);

  // 🔔 QUIT STATE notification
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const visitId = remoteMessage?.data?.id;

globalThis.visitId =
  typeof visitId === 'string' ? visitId : undefined;
        const payload = remoteMessage?.data;
        if (!payload?.action) return;

        // ❗ DO NOT navigate here
        setPendingNotification({ 
          action: payload.action,
          data: payload,
        });
      });
  }, []);
  //  const onDisplayNotification = async (remoteMessage) => {
  //   // Request permissions (required for iOS)
  //   // await notifee.requestPermission()

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: remoteMessage.notification.title,
  //     body: remoteMessage.notification.body,
  //     android: {
  //       channelId,
  //       smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }

  // 🔔 FCM Token handling
  useEffect(() => {
    if (!notificationsAllowed) return;

    const initFCM = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (e) {
        console.log('FCM error:', e);
      }
    };

    initFCM();

    const unsubscribe = messaging().onTokenRefresh(token => {
      setFcmToken(token);
      globalThis.updateFcmOnRefresh?.(token);
    });

    return unsubscribe;
  }, [notificationsAllowed]);


useEffect(() => {
    const timer = setTimeout(() => {
      BootSplash.hide({ fade: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  if (checkingPermission || !notificationsAllowed) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
         
            <NavigationContainer ref={navigationRef} theme={TransparentNavTheme}
           
            >
              <RootStack />
            </NavigationContainer>
          
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
