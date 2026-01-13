export interface User {
  id: number;
  mobile_no: string;
  name: string;
}

export interface LoginResponse {
  status: "INVALID_CREDENTIALS" | "OTP_REQUIRED" | "TRUSTED_DEVICE" | "test";
  token?: string;
  otp_sent?: boolean;
  user?: User;
  debug_otp?: string;
}

export interface VerifyOtpResponse {
  status: "SUCCESS" | "INVALID_OTP" | "INVALID_USER";
  token?: string;
  user?: User;
}