import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHistory } from "react-router-dom";
import axios from "../../axios";
import { AuthContext } from "../../Context/AuthProvider";

const Register = () => {
  const formRef = useRef();
  const isMounted = useRef(true); // ✅ kiểm soát mounted state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const { setUser } = React.useContext(AuthContext);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });

    return () => {
      isMounted.current = false; // ✅ cleanup khi component bị hủy
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      if (isMounted.current) setMessage("Mật khẩu không khớp");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      if (isMounted.current) setIsLoading(true);
      const response = await axios.post("register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      if (isMounted.current) {
        setUser(data);
        history.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      console.log("Chi tiết từ Django:", error.response?.data);
      if (isMounted.current) {
        setMessage("Đăng ký không thành công. Vui lòng thử lại.");
      }
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        ref={formRef}
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          Đăng ký
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className="w-full p-3 mb-4 border rounded-xl"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-3 mb-4 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="w-full p-3 mb-4 border rounded-xl"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          placeholder="Link ảnh avatar"
          className="w-full p-3 mb-4 border rounded-xl"
          onChange={(e) => setAvatar(e.target.files[0])}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition"
        >
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
