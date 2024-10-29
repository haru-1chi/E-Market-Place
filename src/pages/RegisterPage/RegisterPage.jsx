import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import Navbar from "../../component/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_PLATFORM;
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    username: "",
    name: "",
    password: "",
    confirmPassword: ""
  });

  const validateForm = () => {
    const { phone, email, password, confirmPassword } = formData;

    if (!/^\d{10}$/.test(phone)) {
      return "เบอร์โทรศัพท์ต้องเป็นตัวเลข";
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return "กรุณาป้อนอีเมลในรูปแบบที่ถูกต้อง";
    }

    if (password !== confirmPassword) {
      return "รหัสผ่านไม่ตรงกัน";
    }

    return null;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${apiUrl}/users`, formData);
      if (response.data.status) {
        console.log("Register successful", response.data);
        window.location.href = import.meta.env.VITE_APP_API_URL;
      } else {
        setErrorMessage(response.data.message || "Register failed");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      console.error("Registration error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full flex flex-column gap-2 justify-content-center'>
        <div className='bg-section-product w-fit flex flex-column border-1 surface-border border-round mt-5 py-3 px-3 bg-white border-round-mb justify-content-center align-self-center'>
          <h2 className="p-0 m-0">สมัครสมาชิก</h2>
          <p className="p-0 my-1">สร้างบัญชีง่ายๆ ใน 1 นาที แล้วเลือกซื้อสินค้าที่คุณต้องการได้เลย</p>
          <div className="card my-4 flex flex-column justify-content-center">

            <FloatLabel className="w-full mb-3">
              <label htmlFor="phone">เบอร์มือถือ</label>
              <InputText
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
                keyfilter="pint"
              />
            </FloatLabel>

            <FloatLabel className="w-full mb-3">
              <label htmlFor="email">อีเมล (ไม่บังคับ)</label>
              <InputText
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                keyfilter="email"
              />
            </FloatLabel>

            <FloatLabel className="w-full mb-3">
              <label htmlFor="username">Username</label>
              <InputText
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full"
              />
            </FloatLabel>

            <FloatLabel className="w-full mb-3">
              <label htmlFor="name">ชื่อ</label>
              <InputText
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full"
              />
            </FloatLabel>

            <FloatLabel className="w-full mb-3">
              <Password
                inputId="password"
                value={formData.password}
                onChange={handleInputChange}
                feedback={false}
                className="w-full"
                toggleMask
              />
              <label htmlFor="password">รหัสผ่าน</label>
            </FloatLabel>

            <FloatLabel className="w-full mb-3">
              <Password
                inputId="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                feedback={false}
                className="w-full"
                toggleMask
              />
              <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            </FloatLabel>

            {errorMessage && <Message severity="error" text={errorMessage} />}
            <Button
              className="my-3"
              label={loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
              onClick={handleRegister}
              disabled={loading}
              rounded
            />
            <span className="text-center hidden">หรือ</span>
            <Button className="mt-3 mb-5 hidden" label="สร้างบัญชีธุรกิจ" outlined rounded />
            <a href="#" className="text-center hidden">บัญชีธุรกิจคืออะไร</a>
            <p className="text-center">มีบัญชีของอยู่แล้วใช่ไหม <a href={`${import.meta.env.VITE_APP_API_URL}`}>เข้าสู่ระบบที่นี่</a></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage