import { ApiResponse } from "../types/api";

export function parseApiError(err: any): ApiResponse<null> {
  // Case 1: Server responded with a structured API response
  if (err?.response?.data) {
    const r = err.response.data;

    return {
      success: false,
      code: r.code || "SERVER_ERROR",
      message: r.message || "Something went wrong on the server.",
      data: null,
    };
  }

  // Case 2: No response from server (network / timeout / DNS)
  if (err?.request) {
    return {
      success: false,
      code: "NETWORK_ERROR",
      message: "Unable to reach server. Check your internet connection.",
      data: null,
    };
  }

  // Case 3: Anything else (unexpected error)
  return {
    success: false,
    code: "UNKNOWN_ERROR",
    message: err.message || "An unexpected error occurred.",
    data: null,
  };
}