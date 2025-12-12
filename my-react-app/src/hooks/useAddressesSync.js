import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserAddresses } from '../features/user/userSlice';

export const useAddressesSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const addressItems = useSelector((state) => state.user.addresses || []);
  const lastSignature = useRef(null);
  const hasFetchedOnce = useRef(false);

  const signature = JSON.stringify(addressItems);

  useEffect(() => {
    if (!isAuthenticated) return;

    // initial load
    if (!hasFetchedOnce.current) {
      hasFetchedOnce.current = true;
      lastSignature.current = signature;
      dispatch(fetchUserAddresses()).catch((err) => {
        console.error('Auto-sync addresses failed:', err);
      });
      return;
    }

    // re-fetch only if the address list changed
    if (signature !== lastSignature.current) {
      lastSignature.current = signature;
      dispatch(fetchUserAddresses()).catch((err) => {
        console.error('Auto-sync addresses failed:', err);
      });
    }
  }, [isAuthenticated, signature, dispatch]);
};
