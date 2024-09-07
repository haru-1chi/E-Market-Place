import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import Navbar from "../../component/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      if (response.data.status) {
        console.log("Login successful", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.data._id);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        window.location.href = '/';
      } else {
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "มีปัญหาบางอย่างเกิดขึ้น กรุณาลองใหม่อีกครั้งในภายหลัง");
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='w-full flex flex-column gap-2 justify-content-center'>
      <div className='bg-section-product w-fit flex flex-column border-1 surface-border border-round mt-5 py-3 px-3 bg-white border-round-mb justify-content-center align-self-center'>
        <h2 className="m-0 p-0">เข้าสู่ระบบ</h2>
        <p className="p-0 m-0">กรอกเบอร์โทรศัพท์หรืออีเมลเพื่อเข้าสู่ระบบ</p>
        <div className="card my-5 flex flex-column gap-3 justify-content-center">
          <FloatLabel className="w-full">
            <label htmlFor="username">
              Username
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </FloatLabel>
          <FloatLabel className="w-full">
            <Password
              inputId="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              className="w-full"
              toggleMask />
            <label htmlFor="password">
              รหัสผ่าน
            </label>
          </FloatLabel>

          {errorMessage && <Message severity="error" text={errorMessage} />}
          <Button
            className="mt-4 mb-2"
            label={loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            onClick={handleLogin}
            disabled={loading}
            rounded
          />
          <span className="text-center hidden">OR</span>
          <Button className="mt-2 mb-4 hidden" label="เข้าสู่ระบบด้วย OTP" rounded />
          <p className="text-center m-0 p-0">ไม่มีบัญชีผู้ใช้ <a href="/RegisterPage">สร้างบัญชี</a></p>
          <p className="text-center m-0 p-0 hidden">ต้องการความช่วยเหลือใช่ไหม? <a href="#">แตะที่นี้</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;