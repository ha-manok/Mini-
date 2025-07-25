// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqimcBFJ3VniG_Un-PArp17YbbOMNQgEY",
  authDomain: "grade-point-b80d8.firebaseapp.com",
  projectId: "grade-point-b80d8",
  storageBucket: "grade-point-b80d8.firebasestorage.app",
  messagingSenderId: "1013035801319",
  appId: "1:1013035801319:web:90d214c7d6dd11e7756042",
  measurementId: "G-7R15782QQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = initializeAuth(app,{
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});