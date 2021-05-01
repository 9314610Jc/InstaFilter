import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// import intital seed file

const config = {}; // this needs to come from firebase

const firebase = Firebase.initializeApp;

//

const { FieldValue } = Firebase.firestore;

// export data

export { firebase, FieldValue};