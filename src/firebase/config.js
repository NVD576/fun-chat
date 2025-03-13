import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBl4QS8AzcoBCdM7rcsx-WjfuXelUV8Vmk",
  authDomain: "chat-68081.firebaseapp.com",
  databaseURL: "https://chat-68081-default-rtdb.firebaseio.com",
  projectId: "chat-68081",
  storageBucket: "chat-68081.firebasestorage.app",
  messagingSenderId: "1059521286986",
  appId: "1:1059521286986:web:8485c81db425451697e7b3",
  measurementId: "G-PNPWCFTX3N"
};

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
