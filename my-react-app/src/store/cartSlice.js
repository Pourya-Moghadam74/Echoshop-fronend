import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    itemCount: 0,
    subtotal: 0.00
  },
  reducers: {
    // 1. Reducer for adding an item
    addToCart: (state, action) => {
      const { id, name, price, quantity = 1 } = action.payload;
      
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
      
      // Update global state derived values
      state.itemCount = state.items.length;
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // 2. Reducer for clearing the cart
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0.00;
    }
  }
});

// Export the action creators for components to use
export const { addToCart, clearCart } = cartSlice.actions;

// Export the reducer for the store configuration
export default cartSlice.reducer;