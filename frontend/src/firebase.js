import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shivforage.firebaseapp.com",
  projectId: "shivforage",
  storageBucket: "shivforage.firebasestorage.app",
  messagingSenderId: "552795227769",
  appId: "1:552795227769:web:c5b8637747ad178f0036a8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };