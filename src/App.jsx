import { HashRouter, Routes, Route } from 'react-router-dom';


import LoginPage from "./features/auth/LoginPage.jsx";
import SignUpPage from './features/auth/SignUpPage.jsx';
import HomePage from './features/home/HomePage.jsx';
import ShopPage from './features/shop/ShopPage.jsx';
import LogoutPage from './features/auth/LogoutPage.jsx';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage.jsx';
import PasswordConfirmPage from './features/auth/PasswordConfirmPage.jsx';
import ProductPage from './features/product/ProductPage.jsx';
import CategoryPage from './features/category/CategoryPage.jsx';
import ContactPage from './features/pages/ContactPage.jsx';
import FAQPage from './features/pages/FAQPage.jsx';
import TermsPage from './features/pages/TermsPage.jsx';
import PrivacyPage from './features/pages/PrivacyPage.jsx';
import OrdersPage from './features/order/OrdersPage.jsx';
import OrderDetailPage from './features/order/OrderDetailPage.jsx';
import AccountLayout from './features/account/AccountLayout.jsx';
import AccountPage from './features/account/AccountPage.jsx';
import AddressPage from './features/account/AddressPage.jsx'; 
import CartPage from './features/cart/CartPage.jsx';
import CheckoutPage from './features/cart/CheckoutPage.jsx';
import SecurityPage from './features/account/SecurityPage.jsx';
import { Toaster } from "react-hot-toast";

export default function RouterConfig() {
  return (
    <>
      <Toaster position="bottom-right" toastOptions={{duration: 2500,}}/>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password-confirm" element={<PasswordConfirmPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountPage />} />
          <Route path="addresses" element={<AddressPage />} />
          <Route path="security" element={<SecurityPage />} />           
        </Route>
      </Routes>
    </HashRouter>
    </>
  );
}
