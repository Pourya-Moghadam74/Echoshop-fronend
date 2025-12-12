import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserInfo } from '../features/user/userSlice';

export const useUserInfoSync = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

      dispatch(fetchUserInfo()).catch((err) => {
        console.error('Auto-sync user info failed:', err);
      });

  }, [isAuthenticated, dispatch]);
};
