import { configureStore } from '@reduxjs/toolkit';
import cartReducer from "../features/cart/cartSlice";
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';

function loadState() {
  try {
    const preloaded = {};
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      preloaded.cart = {
        items: savedCart.items,
        itemCount: savedCart.itemCount,
        subtotal: savedCart.subtotal,
        loadedFromBackend: false,
        loading: false,
        error: null,
      };
    }

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Seed user slice so selectors have a safe shape right after refresh
      preloaded.user = {
        userInfo: null,
        addresses: { results: [] },
      };
    }

    return Object.keys(preloaded).length ? preloaded : undefined;
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
