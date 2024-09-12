import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage";
import Pagepoint from "../pages/PointPage/Pagepoint";
import Appbar from "../component/Appbar";
import ShopPage from "../pages/ShopPage/ShopPage";
import HelpCenterPage from "../pages/HelpCenterPage/HelpCenterPage";
import ShopCategriesSelected from "../pages/ShopPage/ShopCategriesSelected";
import ListProductsPage from "../pages/ProductPage/ListProductsPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import PaymentPage from "../pages/CheckoutPage/PaymentPage";
import PaymentSuccessfully from "../pages/CheckoutPage/PaymentSuccessfully";
import AccountPage from "../pages/AccountPage/AccountPage";
import StatusShippingPage from "../pages/AccountPage/StatusShippingPage";
import QRPage from "../pages/CheckoutPage/QRPage";
import NoPage from "../pages/ErrorPage/NoPage";
import Footer from "../component/Footer";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import Navbar from "../component/Navbar";
import OrderSummaryPage from "./OrderSummaryPage";
function Router() {
  return (
    <BrowserRouter>

      <Routes>
        if (path != "LoginPage" && path != "LoginPage" )
        {
          <Route path="/" element={<Appbar />}>
            <Route index element={<HomePage />} />
            <Route path="Pagepoint" element={<Pagepoint />} />
            <Route path="HelpCenterPage" element={<HelpCenterPage />} />
            <Route path="ShopPage/:partner_id" element={<ShopPage />} />
            <Route path="/ShopCategriesSelected/:partner_id" element={<ShopCategriesSelected />} />
            <Route path="List-Product" element={<ListProductsPage />} />
            <Route path="List-Product/Product/:product_id" element={<ProductPage />} />
            <Route path="CheckoutPage" element={<CheckoutPage />} />
            <Route path="PaymentPage" element={<PaymentPage />} />
            <Route path="PaymentSuccessfully" element={<PaymentSuccessfully />} />
            <Route path="QRPage" element={<QRPage />} />
            <Route path="AccountPage" element={<AccountPage />} />2
            <Route path="StatusShippingPage/:orderId" element={<StatusShippingPage />} />
            <Route path="*" element={<NoPage />} />
            <Route path="/OrderSummaryPage" element={<OrderSummaryPage />} />
          </Route>
        }
        else
        {
          <Route path="/" element={<Navbar />}>
            <Route path="LoginPage" element={<LoginPage />} />
            <Route path="RegisterPage" element={<RegisterPage />} />
          </Route>
        }
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
