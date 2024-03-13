//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDTPcaH-WZjvx1sTPXUeOTJPwwJsLaVfA8",
    authDomain: "textbookhero-19cac.firebaseapp.com",
    projectId: "textbookhero-19cac",
    storageBucket: "textbookhero-19cac.appspot.com",
    messagingSenderId: "112284245307",
    appId: "1:112284245307:web:26526785c8275e2dcc6b1e"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
