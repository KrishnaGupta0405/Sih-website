// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGJqmL5OTaCUZQRoUPfeENrY55lLcOOyM",
  authDomain: "dopescape-58aba.firebaseapp.com",
  projectId: "dopescape-58aba",
  storageBucket: "dopescape-58aba.appspot.com",
  messagingSenderId: "633621608764",
  appId: "1:633621608764:web:a19080043864c7d9244639",
  measurementId: "G-VQHYMJEKCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { auth, provider };
