let CACHED_FCM_TOKEN: string | null = null;

export const setFcmToken = (token: string | null) => {
  CACHED_FCM_TOKEN = token;
};

export const getCachedFcmToken = () => CACHED_FCM_TOKEN;
