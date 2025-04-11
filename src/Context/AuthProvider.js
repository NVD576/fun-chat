import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Spin } from "antd";
import axios from "../axios";
import { auth} from "../firebase/config";
import { set } from "lodash";
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

  useEffect(() => {
    if (!re) {
      setIsLoading(false);
      history.push("/login");
      return;
    }
    console.log("re", re);
    const handleLogin = async (userInfo) => {
      try {
        const res = await axios.post("login/", userInfo);
  
        const userData = {
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          avatar: res.data.avatar,
        };
        console.log("userData từ backend:", userData);
        setUser(userData);
        setIsLogin(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLogin", "true");
        setIsLoading(false);
        history.push("/");
      } catch (err) {
        console.error("Lỗi login backend:", err);
        setIsLoading(false);
        setUser({});
        setIsLogin(false);
        setRe(false);
        history.push("/login");
      }
    };
  
    // 1. Nếu user đã nhập thủ công (user.password tồn tại)
    if (user?.email && user?.password) {
      const userInfo = {
        email: user.email,
        username: user.username || "",
        password: user.password,
      };
      console.log("🧑‍💻 userInfo từ đăng nhập thủ công:", userInfo);
      handleLogin(userInfo);
      return;
    }
  
    // 2. Nếu đăng nhập bằng Google qua Firebase
    const unsubscribe = auth.onAuthStateChanged((userK) => {
      if (userK) {
        const userInfo = {
          email: userK.email,
          username: userK.displayName || "",
          password: "", // Google không có password
        };
        console.log("🌐 userInfo từ Google:", userInfo);
        handleLogin(userInfo);
      }
    });
  
    return () => unsubscribe();
  }, [re]);
  

  return (
    <AuthContext.Provider value={{ user, setUser, setIsLogin,  setRe }}>
      {isLoading ? <Spin style={{ position: "fixed", inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}
