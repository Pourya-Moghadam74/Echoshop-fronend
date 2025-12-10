import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Removed all internal component logic and used imports instead

// 1. Import components from their new /pages directory
import LoginPage from "./features/auth/LoginPage.jsx";
import SignUpPage from './features/auth/SignUpPage.jsx';
import HomePage from './features/home/HomePage.jsx';
import ShopPage from './features/shop/ShopPage.jsx';
import LogoutPage from './features/auth/LogoutPage.jsx';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage.jsx';
import PasswordConfirmPage from './features/auth/PasswordConfirmPage.jsx';
import AccountLayout from './features/account/AccountLayout.jsx';
import AccountPage from './features/account/AccountPage.jsx';
import AddressPage from './features/account/AddressPage.jsx'; 
import CartPage from './features/cart/CartPage.jsx';
import SecurityPage from './features/account/SecurityPage.jsx';

export default function RouterConfig() {
  return (
    // <h1 class="text-3xl font-bold underline text-red-500">
    //   Hello world!
    // </h1>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password-confirm" element={<PasswordConfirmPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountPage />} />
          <Route path="addresses" element={<AddressPage />} />
          <Route path="security" element={<SecurityPage />} />           
          {/* <Route path="profile" element={<AccountProfilePage />} />  
          <Route path="orders" element={<OrdersPage />} />     
          <Route path="addresses" element={<AddressesPage />} /> 
          <Route path="settings" element={<SettingsPage />} />  */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
