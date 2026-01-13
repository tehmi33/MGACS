// src/notificationsPending.ts
import { NotificationPayload } from './notifications';

let pendingNotification: NotificationPayload | null = null;

export function setPendingNotification(payload: NotificationPayload) {
  pendingNotification = payload;
}

export function consumePendingNotification(): NotificationPayload | null {
  const temp = pendingNotification;
  pendingNotification = null;
  return temp;
}
