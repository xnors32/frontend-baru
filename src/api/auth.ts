import { apiClient, unwrap } from './client'
import type { ApiResponse, AuthData, LoginPayload, RegisterPayload, User } from '@/types/api'

export const authApi = {
  login: (payload: LoginPayload) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>('/auth/login', payload)),

  register: (payload: RegisterPayload) =>
    unwrap(apiClient.post<ApiResponse<User>>('/auth/register', payload)),

  // Firebase Google OAuth Login
  // Connects to Firebase: Validates Google ID token from Firebase
  // Backend validates token with Firebase Admin SDK and returns JWT
  loginWithGoogle: (firebaseIdToken: string) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>('/auth/login/google', {
      idToken: firebaseIdToken,
    })),

  // Firebase Phone OTP Login
  // Connects to Firebase: Validates Phone ID token from Firebase
  // Backend validates token with Firebase Admin SDK and returns JWT
  loginWithPhone: (firebaseIdToken: string) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>('/auth/login/phone', {
      idToken: firebaseIdToken,
    })),

  // Firebase Google OAuth Registration
  // Connects to Firebase: Validates Google ID token from Firebase
  // Backend validates token, creates new user, and returns JWT
  registerWithGoogle: (firebaseIdToken: string, role: string) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>('/auth/register/google', {
      idToken: firebaseIdToken,
      role,
    })),

  // Firebase Phone OTP Registration
  // Connects to Firebase: Validates Phone ID token from Firebase
  // Backend validates token, creates new user, and returns JWT
  registerWithPhone: (firebaseIdToken: string, nama: string, role: string) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>('/auth/register/phone', {
      idToken: firebaseIdToken,
      nama,
      role,
    })),
}
