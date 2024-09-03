import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBJ3MvpGosCmmoOHcoUon13fBoPA2MV_RQ",
    authDomain: "team-pulse-dev.firebaseapp.com",
    projectId: "team-pulse-dev",
    storageBucket: "team-pulse-dev.appspot.com",
    messagingSenderId: "372838493651",
    appId: "1:372838493651:web:192c90b723f039c0921326",
    measurementId: "G-670MPF5JGR"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 