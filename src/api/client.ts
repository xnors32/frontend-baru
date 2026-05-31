import axios, { type AxiosError } from "axios";
import type { ApiResponse } from "@/types/api";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("labvault-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle berbagai tipe error response
    let message = "Terjadi kesalahan pada server";

    if (error.response) {
      // Server merespon dengan status code error
      message =
        error.response?.data?.message ||
        error.response?.data?.status ||
        error.message ||
        "Terjadi kesalahan pada server";
    } else if (error.request) {
      // Request made tapi tidak ada response
      message =
        "Tidak dapat terhubung ke server. Pastikan backend running di http://localhost:4000";
    } else {
      // Error pada saat setup request
      message = error.message || "Terjadi kesalahan";
    }

    console.error(
      "[API Error]",
      error.config?.method?.toUpperCase(),
      error.config?.url,
      message,
    );
    return Promise.reject(new Error(message));
  },
);

/**
 * Unwrap API Response
 * Mengextract data dari WebResponse format backend
 * Backend format: { code, status, message, data, paging }
 */
export async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  try {
    const { data } = await promise;

    // Check if response indicates error (status 4xx or 5xx)
    if (data.code && data.code >= 400) {
      throw new Error(data.message || "Request failed");
    }

    // Check if success field is explicitly false
    if (data.success === false) {
      throw new Error(data.message || "Request failed");
    }

    return data.data;
  } catch (error) {
    // Re-throw dengan proper error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Terjadi kesalahan yang tidak terduga");
  }
}
