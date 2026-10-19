import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, GoogleAuthProvider }   from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOio-_rvm9TMkha0PqViT9SAnqj3m9wW8",
  authDomain: "alto-queroque-89efc.firebaseapp.com",
  projectId: "alto-queroque-89efc",
  storageBucket: "alto-queroque-89efc.firebasestorage.app",
  messagingSenderId: "512527158056",
  appId: "1:512527158056:web:34e1c31b3e921f9604de1d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
