/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../common/api";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// Add axios interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  passwordSet: false,
};

const authSlice = createSlice({
  name: "auth",
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
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
    sendOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.otpSent = false;
    },
    sendOtpSuccess: (state) => {
      state.loading = false;
      state.otpSent = true;
    },
    sendOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    verifyOtpRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.otpVerified = false;
    },
    verifyOtpSuccess: (state) => {
      state.loading = false;
      state.otpVerified = true;
    },
    verifyOtpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    setPassword: (state, action) => {
      state.loading = false;
      state.passwordSet = true;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure,
  setPassword,
} = authSlice.actions;

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

export const sendOtp = (email, role) => async (dispatch) => {
  dispatch(sendOtpRequest());

  try {
    await api.post("/api/auth/send-otp", { email, role });
    dispatch(sendOtpSuccess());
  } catch (error) {
    dispatch(
      sendOtpFailure({
        error: error.response?.data?.message || "Failed to send OTP",
      })
    );
  }
};

export const verifyOtp = (email, otp, role) => async (dispatch) => {
  dispatch(verifyOtpRequest());

  try {
    const response = await api.post("/api/auth/verify-otp", {
      email,
      otp,
      role,
    });
    dispatch(verifyOtpSuccess());
  } catch (error) {
    dispatch(
      verifyOtpFailure({
        error: error.response?.data?.message || "OTP verification failed",
      })
    );
  }
};

export const setUserPassword = (email, password, role) => async (dispatch) => {
  dispatch(sendOtpRequest());

  try {
    await api.post("/api/auth/create-password", { email, password, role });
    dispatch(setPassword());
  } catch (error) {
    dispatch(
      sendOtpFailure({
        error: error.response?.data?.message || "Failed to set password",
      })
    );
  }
};

// Create a function to verify token
export const verifyToken = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(logout());
    return;
  }

  try {
    const response = await api.get("/api/auth/verify-token");
    dispatch(
      loginSuccess({
        token,
        user: response.data.user,
        role: response.data.role,
      })
    );
  } catch (error) {
    console.error("Token verification failed:", error);
    dispatch(logout());
  }
};

export const loginUser =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(loginRequest());

    try {
      const response = await api.post("/api/auth/login/password", {
        email,
        password,
      });

      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.userId,
          role: response.data.role,
        })
      );
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      dispatch(loginFailure({ error: errorMessage }));
    }
  };

export default authSlice.reducer;
