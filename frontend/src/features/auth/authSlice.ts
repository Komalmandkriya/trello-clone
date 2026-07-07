import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/auth.api";
import { tokenStorage } from "../../utils/tokenStorage";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { LoginPayload, RegisterPayload, User } from "../../types/auth.types";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  bootstrapped: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  bootstrapped: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const result = await authApi.register(payload);
      tokenStorage.setTokens(result);
      return result.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await authApi.login(payload);
      tokenStorage.setTokens(result);
      return result.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_: void, { rejectWithValue }) => {
    try {
      return await authApi.getProfile();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load profile"));
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } finally {
    tokenStorage.clear();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null;
      state.status = "idle";
      state.bootstrapped = true;
      state.error = null;
      tokenStorage.clear();
    },
    clearAuthError(state) {
      state.error = null;
    },
    markBootstrapped(state) {
      state.bootstrapped = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.bootstrapped = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.bootstrapped = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.bootstrapped = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.bootstrapped = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { sessionExpired, clearAuthError, markBootstrapped } = authSlice.actions;
export default authSlice.reducer;
