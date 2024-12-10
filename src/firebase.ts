// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2uel3UzhGPdKLQHD_laIHLesg2b5UhL8",
  authDomain: "responsi-pemob-f0cf1.firebaseapp.com",
  projectId: "responsi-pemob-f0cf1",
  storageBucket: "responsi-pemob-f0cf1.firebasestorage.app",
  messagingSenderId: "960001111944",
  appId: "1:960001111944:web:7cf55a77f2f04ecf2bac3d",
  measurementId: "G-KHQJCC1PEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const dataBase = getFirestore(app);

export {
  dataBase,
  auth
};
