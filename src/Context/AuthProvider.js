import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Spin } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  // Theo dõi trạng thái xác thực
  useEffect(() => {
    console.log('Đang theo dõi trạng thái xác thực...');
    const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log('Trạng thái xác thực thay đổi:', user);
      
      if (user) {
        const { displayName, email, uid, photoURL } = user;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
        });
        setIsLoading(false);
        console.log('Đã đăng nhập, chuyển hướng đến trang chính');
        
        // Đảm bảo chuyển hướng đến trang chính
        setTimeout(() => {
          history.push('/');
        }, 100);
        
        return;
      }

      // reset user info
      console.log('Chưa đăng nhập, chuyển hướng đến trang đăng nhập');
      setUser({});
      setIsLoading(false);
      history.push('/login');
    });

    // clean function
    return () => {
      unsubscribed();
    };
  }, [history]);

  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}
