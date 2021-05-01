import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import intital seed file

const config = {
    apiKey: "AIzaSyC24ut1eS0xHiCbG7cUQ3xxjQMOsPErJ0s",
    authDomain: "insta-filter-187fd.firebaseapp.com",
    projectId: "insta-filter-187fd",
    storageBucket: "insta-filter-187fd.appspot.com",
    messagingSenderId: "204493802530",
    appId: "1:204493802530:web:e5cc225548f1499d980e7b",
    measurementId: "G-8RTVG51YWV"
}; // this needs to come from firebase

const firebase = Firebase.initializeApp(config);

//

const { FieldValue } = Firebase.firestore;

// export data

export { firebase, FieldValue};