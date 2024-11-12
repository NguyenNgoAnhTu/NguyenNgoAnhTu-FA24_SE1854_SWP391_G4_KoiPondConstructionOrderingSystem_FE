// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA7FQLsAttQHY_FMtRuwfX5gLpKNRGrjHo",
    authDomain: "movie-management-32979.firebaseapp.com",
    projectId: "movie-management-32979",
    storageBucket: "movie-management-32979.appspot.com",
    messagingSenderId: "286223491916",
    appId: "1:286223491916:web:5faf8ec5808ceff0f6e5e9",
    measurementId: "G-SF6T2PLSJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 