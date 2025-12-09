import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../auth/authSlice';
import { loadCart } from '../cart/cartSlice';

const LOGIN_URL = 'http://localhost:8000/api/token/';

export default function LoginPage({ onSuccess = () => {} }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const loading = useSelector((state) => state.auth.loading);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError(null);

    try {
      const response = await axios.post(LOGIN_URL, formData, { withCredentials: true });
      dispatch(
        loginSuccess({
          access: response.data.access,
          refresh: response.data.refresh,
          user: formData.username,
        })
      );

      if (response.status === 200 && response.data.access) {
        dispatch(loadCart()).catch((cartError) => {
          console.error('Error loading cart after login:', cartError);
        });
        onSuccess(); 
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Invalid username or password.';
      setError(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg h-2/5 rounded-2xl p-6 shadow-lg bg-white flex flex-col gap-5 justify-center">
        <h2 className="mb-4 text-center text-2xl font-semibold text-slate-900">Log In</h2>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Login failed: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="formUsername" className="text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="formUsername"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="formPassword" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="formPassword"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-black bg-slate-900 px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70 text-white"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold text-slate-900 hover:underline">
            Sign Up Here
          </a>
        </p>
      </div>
    </div>
  );
}
