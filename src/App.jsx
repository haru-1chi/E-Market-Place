import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "primeicons/primeicons.css";
import './assets/theme.css';
// import "primereact/resources/themes/lara-light-pink/theme.css";
import Appbar from "./component/Appbar";
import "./App.css";
import "/node_modules/primeflex/primeflex.css";
import Footer from "./component/Footer";
import Router from "./router/Router";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ListProductsPage from "./pages/ProductPage/ListProductsPage";
import ProductPage from "./pages/ProductPage/ProductPage";


function App() {
  const [tokenValid, setTokenValid] = useState(true);

  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  }

  useEffect(() => {
    function getTokenFromURL() {
      // const urlParams = new URLSearchParams(window.location.search);
      // return urlParams.get('token');
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjIwOGE4NTc0MzEzNjJkMmZlZDhmOWYiLCJyb3ciOiJtZW1iZXIiLCJ0ZWwiOiIwOTA5NTAwNzA5IiwiaWF0IjoxNzI2ODQ1MDg2LCJleHAiOjE3MjY4NjY2ODZ9.6gC_pnENRoBz5QmRH8FwfftEJe5dqsnja4NwwUeDXic'
    }


    function handleTokenExpiry(decodedToken) {
      if (decodedToken && decodedToken.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < now) {
          localStorage.removeItem('userToken');
          return true;
        }
      }
      return false;
    }

    const token = getTokenFromURL();
    const existingToken = localStorage.getItem("token");

    const seededUserAddress = [
      {
        _id: 1,
        label: 'บ้าน',
        customer_name: "น้องหญิง",
        customer_phone: "0633333333",
        customer_address: "103/3 หมู่ 4",
        customer_tambon: "สงเปลือย",
        customer_amphure: "นามน",
        customer_province: "กาฬสินธุ์",
        customer_zipcode: "46230",
        isDefault: true
      },
      {
        _id: 2,
        label: 'บ้าน',
        customer_name: "ซากุระโกะ ฟุบุกิ",
        customer_phone: "0855555555",
        customer_address: "5 หมู่ 5",
        customer_tambon: "ช้างม่อย",
        customer_amphure: "เมืองเชียงใหม่",
        customer_province: "เชียงใหม่",
        customer_zipcode: "50000",
        isDefault: false
      },
    ];

    if (token) {
      const decodedToken = decodeToken(token);
      decodedToken.user_address = seededUserAddress;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decodedToken));

      if (handleTokenExpiry(decodedToken)) {
        setTokenValid(false);
      } else {
        setTokenValid(true);
      }

    } else if (existingToken) {
      const decodedToken = decodeToken(existingToken);
      if (handleTokenExpiry(decodedToken)) {
        setTokenValid(false);
      } else {
        setTokenValid(true);
      }
    } else {
      setTokenValid(false);
    }

    // if (!token && !existingToken) {
    //   let countdown = 5;
    //   const timer = setInterval(() => {
    //     console.log(`Redirecting to login in ${countdown} seconds...`);
    //     countdown--;
    //     if (countdown === 0) {
    //       clearInterval(timer);
    //       alert('กรุณาเข้าสู่ระบบจาก https://service.tossaguns.com/ เพื่อใช้งาน E-Market');
    //       window.location.href = 'https://service.tossaguns.com/';
    //     }
    //   }, 1000);
    // }
  }, []);

  return (
    <>
      <Router />
    </>
  );
}

export default App;
