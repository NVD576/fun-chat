import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBFbqhHX4lsle__TSdmgFTzfGGiWG79QlA",
  authDomain: "login-53f05.firebaseapp.com",
  databaseURL: "https://login-53f05-default-rtdb.firebaseio.com",
  projectId: "login-53f05",
  storageBucket: "login-53f05.firebasestorage.app",
  messagingSenderId: "414312040508",
  appId: "1:414312040508:web:31b34a07356365c9f75b39",
  measurementId: "G-8192YN2ND7"
};
//https://login-53f05.firebaseapp.com/__/auth/handler
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Thiết lập persistence cho Firebase Auth
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Đã thiết lập persistence thành công');
  })
  .catch((error) => {
    console.error('Lỗi khi thiết lập persistence:', error);
  });

// Cấu hình cho Google Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Cấu hình cho Facebook Provider
const fbProvider = new firebase.auth.FacebookAuthProvider();
fbProvider.addScope('public_profile');
fbProvider.addScope('email');

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
  // Comment lại để sử dụng Firebase thật
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', '8080');
}

// Bật gỡ lỗi Firebase
if (process.env.NODE_ENV === 'development') {
  window.firebase = firebase;
}

export { db, auth, googleProvider, fbProvider };
export default firebase;
