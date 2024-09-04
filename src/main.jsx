import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js"
import { CartProvider } from './router/CartContext';
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";

// import Tailwind from 'primereact/passthrough/tailwind';
ReactDOM.createRoot(document.getElementById("root")).render(
  // <PrimeReactProvider value={{unstyled : true,pt:Tailwind}} >
  <PrimeReactProvider>
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
        <CartProvider>
          <App />
        </CartProvider>
      </React.Suspense>
    </React.StrictMode>
  </PrimeReactProvider>
);
