import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import "dotenv/config"
const firebaseConfig = {
    apiKey: process.env.APIKE ,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket:process.env.STORAGEBUCKET ,
    messagingSenderId:process.env.MESSAGINGSENDERID ,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};
initializeApp(firebaseConfig)
export const stor = getStorage()