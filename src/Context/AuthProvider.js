import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase/config';
import { Spin } from 'antd';
import axios from '../axios';


export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  // Theo dõi trạng thái xác thực
  useEffect(() => {
    console.log('Đang theo dõi trạng thái xác thực...');
    const unsubscribed = auth.onAuthStateChanged((user) => {
      console.log('Auth State Changed - Full user object:', user);
      
      if (user) {
        const { displayName, email,  photoURL } = user;
        console.log('User Info trước khi set:', { displayName, email,  photoURL });
        
        
        // Đảm bảo photoURL không bị undefined hoặc null
        const userInfo = {
          id:0,
          username:displayName,
          email,
          avatar: photoURL || 'https://via.placeholder.com/150',
        };
        
        // Gọi API để lấy thông tin người dùng từ server
        axios.post('login/', { username: displayName, email })
          .then((response) => {
            
            // Cập nhật userInfo với dữ liệu từ server nếu cần
            userInfo.id = response.data.id || 0; // Giả sử server trả về id
            console.log('Response từ server:', userInfo);
            setUser(userInfo);

          })
          .catch((error) => {
            console.error('Lỗi khi gọi API login:', error);
            console.log('Chưa đăng nhập, chuyển hướng đến trang đăng nhập');
            setUser({});
            setIsLoading(false);
            history.push('/login');
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
