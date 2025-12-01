import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '../services/cartService';

const saveCart = (state) => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      items: state.items,
      itemCount: state.itemCount,
      subtotal: state.subtotal,
    })
  );
};

// Helper function to calculate cart totals
const calculateTotals = (items) => {
  return {
    itemCount: items.length,
    subtotal: items.reduce((total, item) => total + (item.price * item.quantity), 0),
  };
};

// Async thunk to load cart from backend
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to sync cart to backend
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (items, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const cartItems = items || state.cart.items;
      await cartService.syncCartToBackend(cartItems);
      return { synced: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    itemCount: 0,
    subtotal: 0.00,
    loading: false,
    error: null,
  },
  reducers: {
    // Add item to cart (frontend only - sync handled separately)
    addToCart: (state, action) => {
      const { id, name, price, quantity = 1 } = action.payload;
      
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, quantity });
      }
      
      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.subtotal = totals.subtotal;
    },
    
    // Remove item from cart (frontend only - sync handled separately)
    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      const item = state.items.find(item => item.id === idToRemove);
      
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== idToRemove);
        }
      }

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.subtotal = totals.subtotal;
    },

    // Update item quantity (frontend only - sync handled separately)
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.subtotal = totals.subtotal;
    },
    
    // Clear cart (frontend only - sync handled separately)
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0.00;
      localStorage.removeItem("cart"); // optional
    },

    // Set cart from backend data (used on login)
    setCart: (state, action) => {
      const { items, itemCount, subtotal } = action.payload;
      state.items = items || [];
      state.itemCount = itemCount || 0;
      state.subtotal = subtotal || 0.00;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cart cases
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.itemCount = action.payload.itemCount;
        state.subtotal = action.payload.subtotal;
        saveCart(state);
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync cart cases
      .addCase(syncCart.pending, (state) => {
        // Don't set loading for sync to avoid UI flicker
      })
      .addCase(syncCart.fulfilled, (state) => {
        saveCart(state);
        // Sync successful, no state change needed
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.error = action.payload;
        console.log(action.payload)
        saveCart(state);
      });
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;