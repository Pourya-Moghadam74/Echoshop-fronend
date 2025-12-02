import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { syncCart, resetLoadedFromBackend  } from '../store/cartSlice';

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


/**
 * Custom hook to auto-sync cart changes to backend when user is authenticated
 * Best Practice: Debounced sync to avoid excessive API calls
 */
export const useCartSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const cartItems = useSelector(state => state.cart.items);
  const backendFlag = useSelector(state => state.cart.loadedFromBackend)
  const syncTimeoutRef = useRef(null);
  const cart = useSelector(state => state.cart); 


  useEffect(() => {
    // Only sync if user is authenticated
    if (!isAuthenticated) {
      saveCart(cart)
      return;
    }
    console.log(backendFlag)
    if (backendFlag) {
      dispatch(resetLoadedFromBackend());
      console.log(backendFlag)
      return;
    }
      


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
    }, 3000);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [cartItems, isAuthenticated, dispatch]);
};

