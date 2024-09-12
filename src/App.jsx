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
       return'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjlhOWZmNTg2MzBlYmE3YzgxZmRmMmUiLCJzaG9wX2lkIjoiNjY5YTlkZjc4NjMwZWJhN2M4MWZkZjFmIiwicGhvbmUiOiIwOTgxOTA5OTk5Iiwicm93IjoiZW1wbG95ZWUiLCJzdGF0dXMiOnRydWUsImlhdCI6MTcyNTg2MjkwMiwiZXhwIjoxNzI1ODg0NTAyfQ.mki2SWn53aCQL3MPxLEK9cR6C_sYhGM1vrS5aVKfeaU'
    }

  
    function handleTokenExpiry(decodedToken) {
      if (decodedToken && decodedToken.exp) {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedToken.exp < now) {
          localStorage.removeItem('userToken');
          return true;
        }
      }
      return false; // Not expired
    }

    const token = getTokenFromURL();
    const existingToken = localStorage.getItem("token");

    if (token) {
      localStorage.setItem('token', token);
      const decodedToken = decodeToken(token);
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
