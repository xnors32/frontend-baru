import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi } from "@/api/auth";
import type { LoginPayload, RegisterPayload, Role, User } from "@/types/api";
import { isFirebaseEnabled } from "@/config/firebase"

const TOKEN_KEY = "labvault-token";
const USER_KEY = "labvault-user";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<User | null>(
    localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY)!)
      : null,
  );

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const role = computed(() => user.value?.role);
  const isAdmin = computed(() => role.value === "ADMIN");
  const isStaff = computed(
    () => role.value === "ADMIN" || role.value === "PETUGAS",
  );
  const isPeminjam = computed(() => role.value === "MAHASISWA");

  function persist(authToken: string, authUser: User) {
    token.value = authToken;
    user.value = authUser;
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  }

  function clear() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function login(payload: LoginPayload) {
    const data = await authApi.login(payload);
    persist(data.token, data.user);
    return data;
  }

  async function loginWithGoogle() {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase tidak dikonfigurasi. Gunakan email/password.')
    }
    const { firebaseAuth } = await import('@/config/firebase')
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth!, provider)
      const idToken = await result.user.getIdToken()
      const data = await authApi.loginWithGoogle(idToken)
      persist(data.token, data.user)
      return data
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in Google dibatalkan')
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up diblokir browser. Izinkan pop-up untuk situs ini.')
      }
      throw error
    }
  }

  async function loginWithPhone(_phoneNumber: string, otp: string, confirmationResult: any) {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase tidak dikonfigurasi. Gunakan email/password.')
    }
    try {
      const result = await confirmationResult.confirm(otp)
      const idToken = await result.user.getIdToken()
      const data = await authApi.loginWithPhone(idToken)
      persist(data.token, data.user)
      return data
    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('Kode OTP salah')
      }
      if (error.code === 'auth/code-expired') {
        throw new Error('Kode OTP telah expired. Kirim ulang kode baru.')
      }
      throw error
    }
  }

  async function sendPhoneOtp(phoneNumber: string, recaptchaContainerId: string = 'recaptcha-container') {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase tidak dikonfigurasi. Gunakan email/password.')
    }
    const { firebaseAuth } = await import('@/config/firebase')
    const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth')
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth!,
        recaptchaContainerId,
        { size: 'invisible' }
      )
      const confirmationResult = await signInWithPhoneNumber(
        firebaseAuth!,
        phoneNumber,
        recaptchaVerifier
      )
      return confirmationResult
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        throw new Error('Format nomor telepon tidak valid. Gunakan format +62...')
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Terlalu banyak percobaan. Coba lagi nanti.')
      }
      throw error
    }
  }

  async function register(payload: RegisterPayload) {
    return await authApi.register({
      ...payload,
      role: (payload.role ?? "MAHASISWA") as Role,
    });
  }

  async function registerWithGoogle(role: Role) {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase tidak dikonfigurasi. Gunakan email/password.')
    }
    const { firebaseAuth } = await import('@/config/firebase')
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth!, provider)
      const idToken = await result.user.getIdToken()
      const data = await authApi.registerWithGoogle(idToken, role)
      persist(data.token, data.user)
      return data
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Registrasi Google dibatalkan')
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up diblokir browser. Izinkan pop-up untuk situs ini.')
      }
      throw error
    }
  }

  async function registerWithPhone(idToken: string, nama: string, role: Role) {
    if (!isFirebaseEnabled()) {
      throw new Error('Firebase tidak dikonfigurasi. Gunakan email/password.')
    }
    try {
      const data = await authApi.registerWithPhone(idToken, nama, role)
      persist(data.token, data.user)
      return data
    } catch (error: any) {
      throw error
    }
  }

  function logout() {
    if (isFirebaseEnabled()) {
      import('firebase/auth').then(({ signOut }) => {
        import('@/config/firebase').then(({ firebaseAuth }) => {
          if (firebaseAuth) signOut(firebaseAuth).catch(() => {})
        })
      }).catch(() => {})
    }
    clear()
  }

  function hasRole(...roles: Role[]) {
    return user.value ? roles.includes(user.value.role) : false;
  }

  return {
    token,
    user,
    isAuthenticated,
    role,
    isAdmin,
    isStaff,
    isPeminjam,
    login,
    loginWithGoogle,
    loginWithPhone,
    sendPhoneOtp,
    register,
    registerWithGoogle,
    registerWithPhone,
    logout,
    hasRole,
  };
});
