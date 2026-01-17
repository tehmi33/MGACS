// src/notifications.ts
import { NavigationContainerRef } from '@react-navigation/native'
import { setPendingNotification } from './notificationsPending';

export enum NotificationAction {
  Visitor_Detail = 'Visitor_Detail',
}

export type NotificationPayload = {
  action: NotificationAction
  data?: Record<string, any>
}

// ✅ Type guard (THIS SOLVES YOUR ERROR)
// ✅ Type guard
function isNotificationAction(action: any): action is NotificationAction {
  return Object.values(NotificationAction).includes(action)
}
const notificationRouter = {
  [NotificationAction.Visitor_Detail]: (
    data: { id?: string },
    nav: NavigationContainerRef<any>
  ) => {
    nav.navigate('VisitorPass', {
  visitorId: data.id,
});

  },
};

export function handleNotification(
  payload: { action?: any; data?: any },
  navigationRef: NavigationContainerRef<any>,
  isAuthenticated: boolean
) {
  /**
   * 🔧 NORMALIZATION (KEY FIX)
   * Backend sends action INSIDE data
   */
  const action = payload.action ?? payload.data?.action;

  if (!isNotificationAction(action)) {
    console.warn('❌ Invalid notification action:', action);
    return;
  }

  const normalizedPayload: NotificationPayload = {
    action,
    data: payload.data ?? payload,
  };

  // 🔐 Auth not ready → store & exit
  if (!isAuthenticated || !navigationRef.isReady()) {
    setPendingNotification(normalizedPayload);
    return;
  }

  const handler = notificationRouter[action];
  handler(normalizedPayload.data || {}, navigationRef);
}


 