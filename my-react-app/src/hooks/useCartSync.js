import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { syncCart } from '../store/cartSlice';

/**
 * Custom hook to auto-sync cart changes to backend when user is authenticated
 * Best Practice: Debounced sync to avoid excessive API calls
 */
export const useCartSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const cartItems = useSelector(state => state.cart.items);
  const syncTimeoutRef = useRef(null);

  useEffect(() => {
    // Only sync if user is authenticated
    // if (!isAuthenticated) {
    //   return;
    // }

    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce sync by 3 second to avoid excessive API calls
    syncTimeoutRef.current = setTimeout(() => {
      dispatch(syncCart(cartItems)).catch((error) => {
        console.error('Auto-sync cart failed:', error);
        // Don't show error to user, just log it
      });
    }, 5000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cartItems, isAuthenticated, dispatch]);
};

