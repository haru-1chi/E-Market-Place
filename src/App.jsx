import { useState } from "react";

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
