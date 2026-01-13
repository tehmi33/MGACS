// src/notifications.ts
import { NavigationContainerRef } from '@react-navigation/native'
import { setPendingNotification } from './notificationsPending';

export enum NotificationAction {
  GO_HOME = 'GO_HOME',
}

export type NotificationPayload = {
  action: NotificationAction
  data?: Record<string, any>
}

// ✅ Type guard (THIS SOLVES YOUR ERROR)
function isNotificationAction(
  action: any
): action is NotificationAction {
  return Object.values(NotificationAction).includes(action)
}

const notificationRouter = {
  [NotificationAction.GO_HOME]: (_data: any, nav: NavigationContainerRef<any>) => {
    nav.navigate('VisitorRequestScreen')
  },
}

export function handleNotification(
  payload: { action: any; data?: any },
  navigationRef: NavigationContainerRef<any>,
  isAuthenticated: boolean
) {
  if (!isNotificationAction(payload.action)) {
    console.warn('❌ Invalid notification action:', payload.action);
    return;
  }

  // 🔐 Auth not ready → store & exit
  if (!isAuthenticated) {
    setPendingNotification(payload);
    return;
  }

  if (!navigationRef.isReady()) {
    setPendingNotification(payload);
    return;
  }

  const handler = notificationRouter[payload.action];
  handler(payload.data || {}, navigationRef);
}


 