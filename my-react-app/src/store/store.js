import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    // We map the cart reducer to the 'cart' state key
    cart: cartReducer,
    // Add other reducers here as you build them (e.g., auth: authReducer)
    auth: authReducer,
  },
});