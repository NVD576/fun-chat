import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import { Spin } from "antd";
import axios from "../axios";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem("isLogin") === "true";
  });
  const [re, setRe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  let userInfo = {
    id: user.id || "",
    username: user.username || "",
    email: user.email || "",
    avatar: user.avatar || "",
  };

  useEffect(() => {
    
    // Nếu đã có thông tin đăng nhập trong localStorage
    if (isLogin && user.email) {
      setIsLoading(false);
      return;
    }
    console.log("user:", user);
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const { displayName, email } = firebaseUser;
        if (!email) {
          console.warn("Firebase user không có email.");
          setIsLoading(false);
          userInfo.email = email;
          userInfo.username = displayName;
          userInfo.password ="123";
        }
      }
    });
    if(user){
      userInfo.username = user.username;;
      userInfo.email = user.email;
      userInfo.password = user.password;
    }


    // Gọi API để lấy thông tin user từ backend
    console.log("userInfo:", userInfo);
    axios
      .post("login/", {
        
        username: userInfo.username,
        email: userInfo.email,
        password: userInfo.password || "123", // Có thể bỏ nếu backend không cần
      })
      .then((res) => {

        const userInfo = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          avatar: res.data.avatar,
        };
        
        setUser(userInfo);
        setIsLogin(true);
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("isLogin", "true");
        setIsLoading(false);
        history.push("/");
      })
      .catch((err) => {
        console.error("Lỗi login backend:", err);
        setIsLoading(false);
        history.push("/login");
      });

    return () => unsubscribe();
  }, [history,re]);

  return (
    <AuthContext.Provider value={{ user, setUser, setIsLogin,  setRe }}>
      {isLoading ? <Spin style={{ position: "fixed", inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}
