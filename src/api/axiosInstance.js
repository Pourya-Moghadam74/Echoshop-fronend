import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_REFRESH_URL = `${BASE_URL}token/refresh/`;

// Public endpoints that should never carry auth headers or trigger refresh
const PUBLIC_PATH_PATTERNS = ['/categories', '/products'];

// 1. Create a custom Axios instance for all API calls
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for local development
});

// 2. Request Interceptor: Attach Access Token on protected requests only
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        // Skip auth for public endpoints
        const isPublic = PUBLIC_PATH_PATTERNS.some((pattern) =>
            (config.url || '').includes(pattern)
        );

        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle Token Expiration (401 Error)
axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config || {};

        // Guard against missing response and skip retry loops on public endpoints/refresh endpoint
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !PUBLIC_PATH_PATTERNS.some((pattern) => (originalRequest.url || '').includes(pattern)) &&
            !(originalRequest.url || '').includes('token/refresh')
        ) {
            originalRequest._retry = true; // Flag to prevent infinite retry loops

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Step A: Request a new Access Token using the Refresh Token
                    const response = await axios.post(
                        TOKEN_REFRESH_URL,
                        { refresh: refreshToken },
                        { withCredentials: true }
                    );

                    const newAccessToken = response.data.access;

                    // Step B: Store the new token
                    localStorage.setItem('accessToken', newAccessToken);

                    // Step C: Update the header of the original failed request
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Step D: Re-run the original failed request
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails (e.g., refresh token expired/invalid), force log out
                    console.error("Refresh token failed. Logging user out.", refreshError);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login'; // Redirect to login page
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token found, force log out
                window.location.href = '/login';
            }
        }

        // For all other errors (404, 500, etc., or 401 not due to token expiration)
        return Promise.reject(error);
    }
);

export default axiosInstance;
