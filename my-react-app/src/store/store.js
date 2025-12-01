import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

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
    // We map the cart reducer to the 'cart' state key
    cart: cartReducer,
    // Add other reducers here as you build them (e.g., auth: authReducer)
    auth: authReducer,
  },
  preloadedState,
});