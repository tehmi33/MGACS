import * as Keychain from "react-native-keychain";

const BIOMETRIC_TOKEN_KEY = "APP_SESSION_TOKEN";

/* -------------------------------------------------------
   CHECK IF DEVICE SUPPORTS BIOMETRICS
------------------------------------------------------- */
export const deviceHasBiometricSupport = async (): Promise<boolean> => {
  try {
    const supported = await Keychain.getSupportedBiometryType();
    return supported !== null; // fingerprint, face, iris
  } catch (e) {
    console.log("Biometric support check error:", e);
    return false;
  }
};

/* -------------------------------------------------------
   SAVE TOKEN BEHIND BIOMETRIC LOCK
------------------------------------------------------- */
export const saveTokenWithBiometric = async (token: string) => {
  try {
    await Keychain.setGenericPassword("auth", token, {
      service: BIOMETRIC_TOKEN_KEY,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
  } catch (e) {
    console.log("Error saving biometric token:", e);
  }
};

/* -------------------------------------------------------
   DOES BIOMETRIC TOKEN EXIST?
   (DO NOT RETURN THE TOKEN HERE!)
------------------------------------------------------- */
export const tokenExistsInBiometric = async (): Promise<boolean> => {
  try {
    const creds = await Keychain.getGenericPassword({
      service: BIOMETRIC_TOKEN_KEY,
    });
    return !!creds;
  } catch (e) {
    return false;
  }
};

/* -------------------------------------------------------
   DELETE BIOMETRIC TOKEN
------------------------------------------------------- */
export const deleteTokenFromBiometric = async () => {
  try {
    await Keychain.resetGenericPassword({ service: BIOMETRIC_TOKEN_KEY });
  } catch (e) {
    console.log("Error deleting biometric token:", e);
  }
};

/* -------------------------------------------------------
   AUTHENTICATE USER & RETURN TOKEN
   (This is the ONLY function allowed to return token)
------------------------------------------------------- */
export const authenticateBiometric = async (): Promise<string | null> => {
  try {
    const creds = await Keychain.getGenericPassword({
      service: BIOMETRIC_TOKEN_KEY,
      authenticationPrompt: {
        title: "Authenticate",
        subtitle: "Secure Login",
        description: "Use fingerprint/Face ID to unlock your session",
      },
    });

    return creds ? creds.password : null;

  } catch (e: any) {
    console.log("Biometric auth error:", e?.message ?? e);
    return null;
  }
};
