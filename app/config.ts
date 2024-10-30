// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3rN6MUCSJFk-anwYkaCSv4JQhB96TjWw",
  authDomain: "tuitemfider.firebaseapp.com",
  projectId: "tuitemfider",
  storageBucket: "tuitemfider.appspot.com",
  messagingSenderId: "107171632606",
  appId: "1:107171632606:web:71ca17eef1d07442f7394f",
  measurementId: "G-GT1ZG3QW5E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
