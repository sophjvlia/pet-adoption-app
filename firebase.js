import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjEIE6QYL3X3UklOBxoUv81XnhNrHoCig",
  authDomain: "twitter-app-90521.firebaseapp.com",
  projectId: "twitter-app-90521",
  storageBucket: "twitter-app-90521.appspot.com",
  messagingSenderId: "201757745032",
  appId: "1:201757745032:web:5f5ab4ef352d7376b2a43d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { app, storage };
