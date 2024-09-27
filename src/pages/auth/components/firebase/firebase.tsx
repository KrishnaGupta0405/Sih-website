// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Your Firebase configuration
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
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

// Exporting auth, provider, and db so they can be used in other files
export { auth, provider, db };

// Sign in function (no hooks)
export const handleSignIn = async (email: string, password: string) => {
  try {
    // Attempt to sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.emailVerified) {
      // const idToken = await user.getIdToken(/* forceRefresh */ true);
      // localStorage.setItem('idToken', idToken);

      // Query Firestore to check if the user is new
      const userDocRef = doc(db, "users", user.uid); // Assuming Firestore is used for storing users
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Optionally create a new document for the user
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          // Add other user data as needed
        });
        return { newUser: true };
      } else {
        return { newUser: false };
      }
    } else {
      return { error: 'Please verify your email before signing in.' }; // Return error message
    }
  } catch (error: any) {
    return { error: error.message }; // Catch and return the error
  }
};


// Function to handle Google Sign-In
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider); // Google sign-in popup
    const user = result.user; // Extract user object
    // const idToken = await user.getIdToken(true); // Get the user's ID token
    // localStorage.setItem('idToken', idToken); // Store ID token in local storage

    // Check if user is new and update Firestore accordingly
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If user is new, create a new document for them in Firestore
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
        // Add other user-related fields as necessary
      });
      return { newUser: true };
    } else {
      return { newUser: false };
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return { error: error.message }; // Return error to be handled by the component
  }
};

// Function to handle Email Sign-Up
export const handleSignUp = async (email: string, password: string) => {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Add new user data to Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      createdAt: new Date(),
      // Add other user-related fields if needed
    });

    // Return success message
    return { success: 'Sign-up successful! A verification email has been sent to your inbox.' };
  } catch (error: any) {
    // Return error
    return { error: error.message || 'An error occurred during sign-up.' };
  }
};

//to capatalize the first letter of the name except others
function capitalizeFirstLetters(inputString:string) {
  return inputString
    .split(' ') // Split the string into words
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and make the rest lowercase
    )
    .join(' '); // Join the words back into a single string
}

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User ID:", user.uid);
    console.log("User Email:", user.email);
    console.log("Display Name:", capitalizeFirstLetters(user.displayName || ""));

    // Set user information in localStorage
    localStorage.setItem("userID", user.uid);
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userDisplayName", capitalizeFirstLetters(user.displayName || "")); // Use an empty string if displayName is null
  } else {
    // User is signed out
    console.log("No user is signed in");

    // Clear user information from localStorage
    localStorage.removeItem("userID");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userDisplayName");
  }
});

// Example Firestore setDoc operation
export const saveCityData = async () => {
  // Retrieve the UID from localStorage
  const cityUid = localStorage.getItem('cityUid');

  // Check if the UID exists in localStorage
  if (cityUid) {
    try {
      // Add a new document in collection "cities" with the retrieved UID
      await setDoc(doc(db, "cities", cityUid), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      });
      console.log("City data saved successfully!");
    } catch (error) {
      console.error("Error saving city data:", error);
    }
  } else {
    console.error("City UID not found in localStorage.");
  }
};
