import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "../features/cart/cartSlice";
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (!saved) return undefined;

    return {
      cart: {
        items: saved.items,
        itemCount: saved.itemCount,
        subtotal: saved.subtotal,
        loadedFromBackend: false,
        loading: false,
        error: null,
      }
    };
  } catch (e) {
    return undefined;
  }
}


const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    user: userReducer,
    categories: categoryReducer,
  },
  preloadedState,
});