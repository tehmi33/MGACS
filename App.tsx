import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect , useState} from 'react';
import { PermissionsAndroid, Platform, Alert, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from './src/utils/fcmToken';
import notifee from '@notifee/react-native';

const App = () => {
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


 const requestIosPermission=async()=> {
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
        'New Notification',
        remoteMessage?.notification?.title || 'Message received'
      );
      //  onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, [notificationsAllowed]);
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



  if (checkingPermission || !notificationsAllowed) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer
        //  onReady={() => {
        //     // ✅ Set a delay (e.g., 5000ms = 5 seconds) before hiding
        //     setTimeout(async () => {
        //       await RNBootSplash.hide({ fade: true });
        //       console.log("Splash screen hidden after delay");
        //     }, 10000); 
        //   }}
        
        >
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;
