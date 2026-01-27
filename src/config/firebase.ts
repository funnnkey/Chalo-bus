import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKey_ReplaceWithActualKey',
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chalo-bus-demo'}.firebaseapp.com`,
  databaseURL: `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chalo-bus-demo'}-default-rtdb.firebaseio.com`,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chalo-bus-demo',
  storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'chalo-bus-demo'}.appspot.com`,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

export const DB_REFERENCES = {
  buses: 'buses',
  routes: 'routes',
  stations: 'stations',
  liveTracking: 'liveTracking',
};
