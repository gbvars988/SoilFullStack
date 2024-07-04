import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar/navbar";
import Footer from "./Components/Footer/footer";
import Home from "./Pages/Home/home";
import Signin from "./Pages/Signin/signin";
import Signup from "./Pages/Signup/signup";
import Profile from "./Pages/Profile/profile";
import Products from "./Pages/Products/products";
import Cart from "./Pages/Cart/cart";
import ProductPage from "./Pages/Products/productpage";
import CheckoutForm from "./Pages/Cart/checkout";
import PurchaseSummary from "./Pages/Cart/purchasesummary";
import { UserProvider } from "./Context/UserContext";

import "./App.css";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/purchasesummary" element={<PurchaseSummary />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}
