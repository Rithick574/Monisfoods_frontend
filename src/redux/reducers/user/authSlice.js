/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';



const api = axios.create({
  baseURL: 'https://phonebazaar.shop',
  withCredentials: true,
  // baseURL: 'https://monis-foods-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
}
});
// Add axios interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization =`Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.loading = false;
      
      // Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('role', action.payload.role);
    },
    loginFailure: (state, action) => {
      state.error = action.payload.error;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

// Add axios interceptor to include token in headers
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Create a function to verify token
export const verifyToken = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(logout());
    return;
  }
  
  try {
    const response = await api.get('/api/auth/verify-token');
    dispatch(loginSuccess({
      token,
      user: response.data.user,
      role: response.data.role
    }));
  } catch (error) {
    console.error('Token verification failed:', error);
    dispatch(logout());
  }
};

export const loginUser = ({ mobileNumber, password }) => async (dispatch) => {
  dispatch(loginRequest());
  
  try {
    const response = await api.post('/api/auth/login/password', {
      mobileNumber,
      password
    });
    
    dispatch(loginSuccess({ 
      token: response.data.token, 
      user: response.data.userId, 
      role: response.data.role  
    }));
  } catch (error) {
    console.error('Login failed:', error);
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    dispatch(loginFailure({ error: errorMessage }));
  }
};


export default authSlice.reducer;