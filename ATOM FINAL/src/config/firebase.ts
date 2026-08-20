import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// User's Live Firebase configuration (atom-ce46c)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAQV8GXxpRJsYyo1T8BdhwRxa0h_uqQik8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "atom-ce46c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "atom-ce46c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "atom-ce46c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "716364741802",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:716364741802:web:8ef7dd534b3daf278964d3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HQJEP3Q0BK"
};

// Initialize Firebase App safely
let app: any = null;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn('Firebase init warning:', e);
}

// Initialize Services safely
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

// Initialize Analytics if supported in environment
export let analytics: any = null;
if (typeof window !== 'undefined' && app) {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Timeout helper for Firebase requests
export const withTimeout = <T>(promise: Promise<T>, timeoutMs = 6000, errorMsg = 'Firebase operation timed out'): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    )
  ]);
};

// Check if live Firebase project ID is configured
export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.projectId.length > 0 && db);
};

// Helper: Upload file or base64 data string to Firebase Storage safely
export const uploadFileToFirebase = async (
  fileOrBase64: string | File, 
  storagePath: string
): Promise<string> => {
  try {
    if (!storage) return typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
    const storageRef = ref(storage, storagePath);
    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('data:')) {
        await withTimeout(uploadString(storageRef, fileOrBase64, 'data_url'), 6000);
      } else if (fileOrBase64.startsWith('/') || fileOrBase64.startsWith('http')) {
        const res = await fetch(fileOrBase64);
        if (!res.ok) return fileOrBase64;
        const blob = await res.blob();
        await withTimeout(uploadBytes(storageRef, blob), 6000);
      } else {
        return fileOrBase64;
      }
    } else {
      await withTimeout(uploadBytes(storageRef, fileOrBase64), 6000);
    }
    const downloadUrl = await withTimeout(getDownloadURL(storageRef), 6000);
    return downloadUrl || (typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
  } catch (error) {
    console.warn('Firebase storage upload fallback:', error);
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
  }
};

export default app;
