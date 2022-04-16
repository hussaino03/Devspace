/*** INITIALIZING FIREBASE ***/

// Import the functions needed from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
require("dotenv").config()


// web app's Firebase configuration
// create a project from google's firebase console and initialize an app to get SECRET_KEYS
// added your secret keys to .env file with respect to the naming conventions in the below firebaseConfig object
// without your secret keys, you can't test the FIREBASE AUTH functionality.
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initializing Firebase Authentication to get a reference to the service
// auth code is found in ./auth.js
export const auth = getAuth(app)