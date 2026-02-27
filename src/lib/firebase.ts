import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCB6EB-zLuxM3idw7Xq2N09LTPwszarAl8",
  authDomain: "lightsup-energy-solutions.firebaseapp.com",
  databaseURL: "https://lightsup-energy-solutions-default-rtdb.firebaseio.com",
  projectId: "lightsup-energy-solutions",
  storageBucket: "lightsup-energy-solutions.firebasestorage.app",
  messagingSenderId: "733838981788",
  appId: "1:733838981788:web:34a7b55fdbfcc1ada74b59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
