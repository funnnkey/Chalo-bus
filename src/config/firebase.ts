import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDemoKey_ReplaceWithActualKey',
  authDomain: 'chalo-bus-demo.firebaseapp.com',
  databaseURL: 'https://chalo-bus-demo-default-rtdb.firebaseio.com',
  projectId: 'chalo-bus-demo',
  storageBucket: 'chalo-bus-demo.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef1234567890',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const DB_REFERENCES = {
  buses: 'buses',
  routes: 'routes',
  stations: 'stations',
  liveTracking: 'liveTracking',
};
