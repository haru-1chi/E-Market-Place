import React, { useEffect } from 'react';
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
  function decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
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
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    }
    const token = getTokenFromURL();
    const existingToken = localStorage.getItem("token");
  
    if (token && token !== existingToken) {
      localStorage.setItem('token', token);

      try {
        const decodedToken = decodeToken(token);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        console.log('Decoded Token:', decodedToken);

        if (decodedToken) {
          const userId = decodedToken._id || decodedToken.user_id;
          console.log('User ID:', userId);
        }
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);
  // localStorage.clear();
  return (
    <>

      {/* <h1>{t("greeting")}</h1>
      <p>{line1}</p>
      <span>
        {line2}
      </span> */}
      <Router />
      {/* <ProductPage /> */}
      {/* <LoginPage /> */}
      {/* <RegisterPage /> */}
      {/* <ListProductsPage /> */}
    </>
  );
}

export default App;
