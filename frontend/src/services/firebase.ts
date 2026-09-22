import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface FirebaseConfigType {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getStoredFirebaseConfig = (): FirebaseConfigType | null => {
  try {
    const stored = localStorage.getItem('custom_firebase_config');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // Ignore JSON error
  }
  return null;
};

export const getFirebaseConfig = (): FirebaseConfigType => {
  const stored = getStoredFirebaseConfig();
  return {
    apiKey: stored?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: stored?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nearbyhelpup09.firebaseapp.com",
    projectId: stored?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || "nearbyhelpup09",
    storageBucket: stored?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nearbyhelpup09.firebasestorage.app",
    messagingSenderId: stored?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401820413933",
    appId: stored?.appId || import.meta.env.VITE_FIREBASE_APP_ID || "",
  };
};

export const isFirebaseConfigured = (): boolean => {
  const cfg = getFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.apiKey.length > 5);
};

export const saveFirebaseConfig = (config: FirebaseConfigType) => {
  localStorage.setItem('custom_firebase_config', JSON.stringify(config));
};

export const getFirebaseApp = () => {
  const config = getFirebaseConfig();
  if (!getApps().length) {
    return initializeApp(config);
  }
  return getApp();
};

export const getFirebaseAuth = () => {
  return getAuth(getFirebaseApp());
};

export const signInWithFirebaseGoogle = async () => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const credential = await user.getIdToken();

  return {
    credential,
    email: user.email,
    name: user.displayName || user.email?.split('@')[0] || 'Google User',
    picture: user.photoURL,
    uid: user.uid,
  };
};
