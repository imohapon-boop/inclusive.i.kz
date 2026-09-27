// ==========================================
// FIREBASE INITIALIZATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAd5ItVrwHNYlmQOmZ9x6q5HXtnszYzEqQ",
    authDomain: "qolday-app.firebaseapp.com",
    projectId: "qolday-app",
    storageBucket: "qolday-app.firebasestorage.app",
    messagingSenderId: "487310633029",
    appId: "1:487310633029:web:c6bc1895fca1ef40969b2c"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
window.db = db;
