import { createSlice } from '@reduxjs/toolkit';

// Function to check if tokens exist in local storage
const checkInitialAuth = () => {
  const accessToken = localStorage.getItem('accessToken');
  return !!accessToken; // Returns true if the token exists
};

const initialState = {
  // Check localStorage initially to see if the user is already logged in
  isAuthenticated: checkInitialAuth(), 
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: null, // Placeholder for user profile data (username, email, etc.)
  loading: false, // Useful for showing a loading spinner during API calls
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action for successful login (called after POST /api/token/)
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      // Optional: Store profile data if API returns it
      state.user = action.payload.user || { username: 'User' }; 
      
      // Also update localStorage here (CRITICAL)
      localStorage.setItem('accessToken', action.payload.access);
      localStorage.setItem('refreshToken', action.payload.refresh);
      localStorage.removeItem('cart');
    },
    
    // Action for successful token refresh
    tokenRefreshed: (state, action) => {
      state.accessToken = action.payload.access;
      localStorage.setItem('accessToken', action.payload.access);
    },

    // Action for logout (called after successful blacklist or failure)
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      
      // Clear localStorage (CRITICAL)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('cart')
    },
    
    // Actions for global loading state if needed
    setLoading: (state, action) => {
        state.loading = action.payload;
    }
  },
});

// Export all the action creators
export const { loginSuccess, tokenRefreshed, logout, setLoading } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;