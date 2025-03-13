const firebase = require('firebase');
require('firebase/auth');

// Cấu hình Firebase giống như trong ứng dụng
const firebaseConfig = {
  apiKey: "AIzaSyBl4QS8AzcoBCdM7rcsx-WjfuXelUV8Vmk",
  authDomain: "chat-68081.firebaseapp.com",
  databaseURL: "https://chat-68081-default-rtdb.firebaseio.com",
  projectId: "chat-68081",
  storageBucket: "chat-68081.firebasestorage.app",
  messagingSenderId: "1059521286986",
  appId: "1:1059521286986:web:8485c81db425451697e7b3",
  measurementId: "G-PNPWCFTX3N"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Kết nối với Firebase Auth Emulator
firebase.auth().useEmulator('http://localhost:9099');

// Tạo người dùng test
async function createTestUser() {
  try {
    // Tạo người dùng với email và mật khẩu
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(
      'test@example.com',
      'password123'
    );
    
    // Cập nhật thông tin người dùng
    await userCredential.user.updateProfile({
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg'
    });
    
    console.log('Đã tạo người dùng test thành công:', userCredential.user);
  } catch (error) {
    console.error('Lỗi khi tạo người dùng test:', error);
  } finally {
    // Đóng kết nối Firebase
    firebase.app().delete();
  }
}

createTestUser(); 