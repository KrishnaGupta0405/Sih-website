// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, serverTimestamp, doc, getDoc, getDocs, onSnapshot, setDoc, collection, query, where, orderBy, limit, addDoc, deleteDoc } from "firebase/firestore";

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

// Declare the user variable globally
let currentUser: any = null; 
let isSignUpInProgress = false;

// Exporting auth, provider, and db so they can be used in other files
export { auth, provider, db };

 // Constants for score calculation
 const LEVEL_WEIGHT = 10; // Points per completed level
 const MODULE_WEIGHT = 5; // Points per completed module
 const ACTIVITY_LOG_LIMIT = 10; // Max number of activity logs to keep

  // Capitalize the first letter of each word in the name
  function capitalizeFirstLetters(inputString: string) {
    return inputString
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }

  // Listen to auth state changes
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!isSignUpInProgress) {
      console.log("onauth started")
      // // Call the function to create or update the user's Firestore document and activity log

      // const useless = async ()=>{
      //   await createOrUpdateUser(user);
      // }; useless()

      // User is signed in
      console.log("User ID:", user.uid);
      console.log("User Email:", user.email);
      console.log("Display Name:", capitalizeFirstLetters(user.displayName || ""));

      // Set the global user variable so it's available across the file
      currentUser = user;

      // Optionally, store user info in localStorage
      localStorage.setItem("userID", user.uid);
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userDisplayName", capitalizeFirstLetters(user.displayName || ""));

      // Call another function to retrieve user-specific information
      // getUserData();

      // Call the function to delete activites older than 10 days
      deleteOldActivities(user.uid);

    } 
  } else {
      // User is signed out
      console.log("No user is signed in");

      // Clear the global user variable
      currentUser = null;

      // Clear user information from localStorage
      localStorage.removeItem("userID");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userDisplayName");
    }
  });

  // Function to handle Email Sign-Up
  export const handleSignUp = async (email: string, password: string, name: string) => {
    try {

      isSignUpInProgress = true; // Set the flag

      console.log("Handle signup started")
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Add new user data to Firestore
      await createOrUpdateUser(user, name);
      console.log("Handle signup ended")

      isSignUpInProgress = false; // Reset the flag
      
      // Return success message
      return { success: 'Sign-up successful! A verification email has been sent to your inbox.' };

    } catch (error: any) {
      // Return error
      return { error: error.message || 'An error occurred during sign-up.' };
    }
  };

// Function to handle Google Sign-Up 
export const handleGoogleSignUp = async () => {
  try {
    const result = await signInWithPopup(auth, provider); // Google sign-in popup
    const user = result.user; 
    
    // Add new user data to Firestore
    await createOrUpdateUser(user); // Ensure this is awaited

    return { user }; // Return user data for further processing

  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    return { error: error.message }; // Return error message to be handled by the component
  }
};

  // Sign in function (no hooks)
  export const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        return;
      } else {
        return { error: 'Please verify your email before signing in.' };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

  // Function to handle Google Sign-In
  export const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        return { newUser: true };
      } else {
        return { newUser: false };
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      return { error: error.message };
    }
  };

  // Function to check if a user is new and set their activity logs
  async function createOrUpdateUser(user: any, name:string  = user.displayName) {
    try {
      const userDocRef = doc(db, 'users', user.uid); // Using user.uid as the document ID
      const userDoc = await getDoc(userDocRef);

      // If user does not exist, create their profile and 10 activity logs with zeros
      if (!userDoc.exists()) {
        console.log("This is a new user in createOrUpdateUser");
        await setDoc(userDocRef, {
          email: user.email, // Use the email from the user object
          displayName: name, // Use the displayName from the user object
          createdAt: serverTimestamp(),
          overallScore: 0, // Initialize overall score
        });

        // Initialize activity log with zeroed out levels and modules for the last 10 days
        const activityLogRef = collection(db, 'users', user.uid, 'activityLog');
        for (let i = 0; i < ACTIVITY_LOG_LIMIT; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i); // Set the date to each of the last 10 days

          await addDoc(activityLogRef, {
            activityDate: date,
            levelsCompleted: 0,
            modulesCompleted: 0,
            overallScore: 0,
          });
        }
        console.log("New user created with initial activity logs.");
      } else {
        console.log("User already exists.");
      }
    } catch (error) {
      console.error("Error creating or updating user:", error);
    }
  }

  // Function to update user activity and recalculate overall score
  const updateUserActivity = async (userId: string, levelsCompletedIncrement: number, modulesCompletedIncrement: number) => {
    const activityRef = collection(db, `users/${userId}/activityLog`);

    // Get the last activity of the day
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const q = query(activityRef, where("activityDate", ">=", todayString), orderBy("activityDate", "desc"));
    const querySnapshot = await getDocs(q);

    let lastOverallScore = 0;

    if (!querySnapshot.empty) {
      const lastActivityDoc = querySnapshot.docs[0]; // Get the most recent activity
      const currentLevels = lastActivityDoc.data().levelsCompleted;
      const currentModules = lastActivityDoc.data().modulesCompleted;

      // Update levels and modules completed
      const updatedLevels = currentLevels + levelsCompletedIncrement;
      const updatedModules = currentModules + modulesCompletedIncrement;

      // Calculate overall score for the day
      const updatedOverallScore = (updatedLevels * LEVEL_WEIGHT) + (updatedModules * MODULE_WEIGHT);
      lastOverallScore = updatedOverallScore;

      // Update the document with new values
      await setDoc(lastActivityDoc.ref, {
        levelsCompleted: updatedLevels,
        modulesCompleted: updatedModules,
        overallScore: updatedOverallScore,
        activityDate: serverTimestamp(), // Update timestamp
      });
    }

    // Update user's lifetime overall score by summing up the last 10 days
    const overallScore = await calculateOverallScore(userId, lastOverallScore);
    
    // Update the user's profile with the recalculated overall score
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { overallScore }, { merge: true });

    console.log("User activity updated successfully.");
  };

  // Function to calculate overall score from the last 10 days
  const calculateOverallScore = async (userId: string, lastOverallScore: number): Promise<number> => {
    const activityLogRef = collection(db, 'users', userId, 'activityLog');

    // Query the last 10 activities
    const q = query(activityLogRef, orderBy('activityDate', 'desc'), limit(ACTIVITY_LOG_LIMIT));
    const querySnapshot = await getDocs(q);

    let overallScore = 0;
    querySnapshot.forEach((doc) => {
      overallScore += doc.data().overallScore;
    });

    // Include the last calculated overall score for today (if present)
    overallScore += lastOverallScore;

    return overallScore;
  };

  // Function to delete old activities after recalculating overall score
  const deleteOldActivities = async (userId: string) => {
    const activityLogRef = collection(db, 'users', userId, 'activityLog');
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - ACTIVITY_LOG_LIMIT);

    const q = query(activityLogRef, where("activityDate", "<", tenDaysAgo));
    const querySnapshot = await getDocs(q);

    // First, update the overall score before deletion
    const overallScore = await calculateOverallScore(userId, 0); // Calculate overall score before deleting

    // Delete the old activities
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Update the user's overall score in the profile after deleting old data
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { overallScore }, { merge: true });

    console.log("Old activities deleted and overall score updated.");
  };

// Function to fetch a user's data including the last 10 activities
export async function getUserData() {
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error("No user data found, setting up the user data as empty");
      createOrUpdateUser(currentUser);
      return { userProfile: null, activityLogs: [] }; // Return a fallback value
    }

    // Fetch user profile
    const userProfile = {
      displayName: userDoc.data()?.displayName || 'Unknown',
      overallScore: userDoc.data()?.overallScore || 0,
      email: userDoc.data()?.email || 'No email available',
    };

    // Fetch activity logs (limit to 10 most recent)
    const activityLogRef = collection(db, 'users', currentUser.uid, 'activityLog');
    const activityQuery = query(activityLogRef, orderBy('activityDate', 'desc'), limit(ACTIVITY_LOG_LIMIT));
    const activitySnapshot = await getDocs(activityQuery);

    const activityLogs = activitySnapshot.docs.map(doc => ({
      ...doc.data(),
      activityDate: doc.data().activityDate.toDate(), // Ensure Firestore Timestamp is converted to Date
    }));

    console.log({ userProfile, activityLogs });
    return { userProfile, activityLogs };
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return { userProfile: null, activityLogs: [] }; // Return fallback in case of error
  }
}

  // Define a type for leaderboard entries and user profiles
  interface LeaderboardEntry {
    displayName: string;
    overallScore: number;
    email?: string;
  }
  
  // Function to fetch the top 5 players for the leaderboard in real-time
  export const fetchTopPlayers = (callback: (leaderboard: LeaderboardEntry[]) => void) => {
    try {
      const usersRef = collection(db, 'users');

      // Query to fetch top 5 players by overallScore, already in descending order
      const q = query(usersRef, orderBy('overallScore', 'desc'), limit(5));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaderboard: LeaderboardEntry[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboard.push({
            displayName: data.displayName,
            overallScore: Number(data.overallScore), // Ensure overallScore is a number
            email: data.email, // Optional: include email
          });
        });

        // Ensure the leaderboard is sorted in descending order by overallScore
        leaderboard.sort((a, b) => b.overallScore - a.overallScore);

        callback(leaderboard); // Send updated leaderboard via callback
      });

      return unsubscribe; // Unsubscribe listener when not needed
    } catch (error) {
      console.error("Error fetching top players: ", error);
    }
  };

