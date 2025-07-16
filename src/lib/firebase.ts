import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHb0vh5kX7qbMYC2fAqNMon-QYms_c6CU",
  authDomain: "chat-b24c7.firebaseapp.com",
  projectId: "chat-b24c7",
  storageBucket: "chat-b24c7.firebasestorage.app",
  messagingSenderId: "289453080871",
  appId: "1:289453080871:web:359d04c6077aaf579a6902",
  measurementId: "G-8K340PR09C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;