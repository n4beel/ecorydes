import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'YOUR-API-KEY',
    authDomain: 'YOUR-PROJECT.firebaseapp.com',
    projectId: 'YOUR-PROJECT-ID',
    storageBucket: 'YOUR-PROJECT.appspot.com',
    messagingSenderId: 'YOUR-MESSAGING-SENDER-ID',
    appId: 'YOUR-APP-ID',
};

export const firebaseApp = initializeApp(firebaseConfig);