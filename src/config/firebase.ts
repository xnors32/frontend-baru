import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null

try {
  if (firebaseConfig.apiKey) {
    firebaseApp = initializeApp(firebaseConfig)
    firebaseAuth = getAuth(firebaseApp)
  }
} catch {
  console.warn('Firebase not configured — Google & Phone auth disabled')
}

export { firebaseApp, firebaseAuth }

export function isFirebaseEnabled(): boolean {
  return !!firebaseAuth
}

export default firebaseApp
