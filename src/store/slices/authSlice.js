import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

// Async action untuk login
export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post("/auth/local", {
      email,
      password,
    });
    dispatch(
      loginSuccess({
        user: response.data.user,
        token: response.data.jwt,
      })
    );
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(message));
  }
};

// Async action untuk register
export const register = (username, email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axiosInstance.post("/auth/local/register", {
      username,
      email,
      password,
    });
    dispatch(
      loginSuccess({
        user: response.data.user,
        token: response.data.jwt,
      })
    );
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    dispatch(loginFailure(message));
  }
};

// Initial state untuk auth
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Slice untuk auth
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null; // Reset error saat memulai login/register
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setAuth } =
  authSlice.actions;

export default authSlice.reducer;
