import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import violationReducer from './violationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    violations: violationReducer,
  },
});

export default store;

// Thunk to refresh access token on app load
import { setCredentials, logout } from './authSlice';

export const refreshAccessToken = () => async (dispatch) => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    dispatch(logout());
    return;
  }
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Refresh failed');
    localStorage.setItem('accessToken', data.tokens.accessToken);
    dispatch(setCredentials({ user: data.user }));
  } catch (err) {
    console.error('Refresh token error:', err);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
  }
}; 