import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import { clearCart } from '../cart/cartSlice';

const LOGOUT_URL = 'http://localhost:8000/api/token/blacklist/';

export default function LogoutPage() {
  const [statusMessage] = useState('Logging out...');
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    const performLogout = async () => {
      try {
        if (refreshToken) {
          try {
            await axios.post(LOGOUT_URL, { refresh: refreshToken }, { withCredentials: true });
          } catch (error) {
            console.error('Server-side logout failed, performing client-side cleanup.', error);
          }
        }
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        dispatch(logout());
        dispatch(clearCart());
        timer = setTimeout(() => navigate('/'), 1000);
      }
    };

    performLogout();
    return () => clearTimeout(timer);
  }, [dispatch, navigate, refreshToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
        <h3 className="text-lg font-semibold text-slate-900">{statusMessage}</h3>
        <div className="mt-4 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        </div>
      </div>
    </div>
  );
}
