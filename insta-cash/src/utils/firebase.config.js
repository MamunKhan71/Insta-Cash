// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDx1_EBNQweN7IU3Q7R_1Byg5vuXQcZmBU",
    authDomain: "instacash-8beff.firebaseapp.com",
    projectId: "instacash-8beff",
    storageBucket: "instacash-8beff.appspot.com",
    messagingSenderId: "158347229881",
    appId: "1:158347229881:web:810fb39c1a7214ade67968"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = auth(app)
export default auth;