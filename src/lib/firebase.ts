import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import type { PortfolioData } from '../types';

// Firebase Client Configuration
// This enables persistent, real-time multi-device sync on Vercel, Cloud Run, and mobile browsers
export const firebaseConfig = {
  projectId: "gen-lang-client-0323801389",
  appId: "1:644122738868:web:8a42c58807c86e9a5fd7e1",
  apiKey: "AIzaSyBWVG9FHFciz228cqjXaRBGy-WvROs9Aec",
  authDomain: "gen-lang-client-0323801389.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-deepakportfolio-d7958108-022d-4b15-aaf0-b86013e3ddfe",
  storageBucket: "gen-lang-client-0323801389.firebasestorage.app",
  messagingSenderId: "644122738868",
};

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with the provisioned database ID
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const PORTFOLIO_DOC_PATH = 'portfolio';
const PORTFOLIO_DOC_ID = 'main_portfolio';

/**
 * Validates connection to Firestore as required by Firebase skill
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, PORTFOLIO_DOC_PATH, 'connection_health'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status:', error);
    }
    return false;
  }
}

/**
 * Save portfolio data to Google Cloud Firestore (persisted globally across all devices/mobiles)
 */
export async function savePortfolioToFirestore(data: PortfolioData): Promise<boolean> {
  try {
    const portfolioDocRef = doc(db, PORTFOLIO_DOC_PATH, PORTFOLIO_DOC_ID);
    const now = Date.now();
    await setDoc(
      portfolioDocRef,
      {
        data,
        updatedAt: now,
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('[Firebase] Failed to write portfolio to Firestore:', err);
    return false;
  }
}

/**
 * Fetch portfolio data directly from Google Cloud Firestore
 */
export async function getPortfolioFromFirestore(): Promise<{
  data: PortfolioData | null;
  updatedAt: number;
} | null> {
  try {
    const portfolioDocRef = doc(db, PORTFOLIO_DOC_PATH, PORTFOLIO_DOC_ID);
    const snap = await getDoc(portfolioDocRef);
    if (snap.exists()) {
      const docData = snap.data();
      if (docData && docData.data) {
        return {
          data: docData.data as PortfolioData,
          updatedAt: Number(docData.updatedAt || 0),
        };
      }
    }
    return null;
  } catch (err) {
    console.warn('[Firebase] Could not read portfolio from Firestore:', err);
    return null;
  }
}

/**
 * Real-time listener: whenever you edit on Admin CMS on laptop or phone,
 * all other open devices, Vercel visitors, and mobiles get updated in real time!
 */
export function subscribeToPortfolioChanges(
  onUpdate: (data: PortfolioData, updatedAt: number) => void
): Unsubscribe {
  const portfolioDocRef = doc(db, PORTFOLIO_DOC_PATH, PORTFOLIO_DOC_ID);
  return onSnapshot(
    portfolioDocRef,
    (snap) => {
      if (snap.exists()) {
        const docData = snap.data();
        if (docData && docData.data && docData.data.personalInfo) {
          onUpdate(docData.data as PortfolioData, Number(docData.updatedAt || 0));
        }
      }
    },
    (error) => {
      console.warn('[Firebase] Realtime snapshot listener notice:', error);
    }
  );
}
