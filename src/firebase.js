import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDtCWKfuYhAMIbVrUbyz7oNSh-zZzlCBT4",
  authDomain: "tmahyk-f4290.firebaseapp.com",
  projectId: "tmahyk-f4290",
  storageBucket: "tmahyk-f4290.firebasestorage.app",
  messagingSenderId: "420650803073",
  appId: "1:420650803073:web:26faf0f3e4855667531280",
  measurementId: "G-T6YSWVQEH1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };