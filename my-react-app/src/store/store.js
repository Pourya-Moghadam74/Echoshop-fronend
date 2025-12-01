import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import userReducer from './userSlice';

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (!saved) return undefined;

    return {
      cart: {
        items: saved.items,
        itemCount: saved.itemCount,
        subtotal: saved.subtotal,
      },
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
  },
  preloadedState,
});