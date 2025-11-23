import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

const AUTH_KEY = "tm_auth";

function loadAuthState(): Pick<AuthState, "token" | "username"> {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { token: null, username: null };
    return JSON.parse(raw);
  } catch {
    return { token: null, username: null };
  }
}

function saveAuthState(state: { token: string | null; username: string | null }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

const initialPersisted = loadAuthState();

const initialState: AuthState = {
  token: initialPersisted.token,
  username: initialPersisted.username,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/login", payload);
      return res.data as { token: string; username: string };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      saveAuthState({ token: null, username: null });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; username: string }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.username = action.payload.username;
          saveAuthState({ token: state.token, username: state.username });
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
