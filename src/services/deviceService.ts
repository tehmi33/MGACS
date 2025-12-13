import api from "../api/client";
import { ApiResponse } from "../types/api";

/**
 * Untrust all other devices for this user.
 * Requires a valid session token.
 */

export const untrustDevices = async (
  sessionToken: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(
      "/auth/untrust-devices",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    );

    return res.data;

  } catch (err: any) {
    return {
      success: false,
      code: "NETWORK_ERROR",
      message: err?.message ?? "Request failed",
      data: null,
    };
  }
};

/**
 * OPTIONAL future expansion:
 * - listTrustedDevices()
 * - revokeSpecificDevice(deviceId)
 * - renameDevice(deviceId, newName)
 * These stay in this service file.
 */
