import React from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { auth, googleProvider, fbProvider } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/services';

const { Title } = Typography;

export default function Login() {
  const handleLogin = async (provider) => {
    try {
      console.log('Bắt đầu đăng nhập với provider:', provider);
      
      const result = await auth.signInWithPopup(provider);
      console.log('Thông tin đăng nhập:', {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        providerId: result.additionalUserInfo.providerId
      });
      
      const { additionalUserInfo, user } = result;
      if (additionalUserInfo?.isNewUser) {
        // Nếu là người dùng mới, thêm vào Firestore
        console.log('Thêm người dùng mới vào Firestore');
        addDocument('users', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: additionalUserInfo.providerId,
          keywords: generateKeywords(user.displayName?.toLowerCase() || ''),
        });
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại: ' + error.message);
    }
  };

  return (
    <div>
      <Row justify='center' style={{ height: 800 }}>
        <Col span={8}>
          <Title style={{ textAlign: 'center' }} level={3}>
            Fun Chat
          </Title>
          <Button
            style={{ width: '100%', marginBottom: 5 }}
            onClick={() => handleLogin(googleProvider)}
          >
            Đăng nhập bằng Google
          </Button>
          <Button
            style={{ width: '100%' }}
            onClick={() => handleLogin(fbProvider)}
          >
            Đăng nhập bằng Facebook
          </Button>
        </Col>
      </Row>
    </div>
  );
}
