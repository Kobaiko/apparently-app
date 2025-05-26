import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService, type AuthUser, type SignUpCredentials, type SignInCredentials } from '../services/auth';
import type { Session } from '@supabase/supabase-js';

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunks for authentication actions
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    const { data, error } = await AuthService.signUp(credentials);
    if (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Sign up failed');
    }
    return data;
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    const { data, error } = await AuthService.signIn(credentials);
    if (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Sign in failed');
    }
    return data;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    const { error } = await AuthService.signOut();
    if (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Sign out failed');
    }
    return null;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    const { user, error } = await AuthService.getCurrentUser();
    if (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to get user');
    }
    return user;
  }
);

export const getSession = createAsyncThunk(
  'auth/getSession',
  async (_, { rejectWithValue }) => {
    const { session, error } = await AuthService.getSession();
    if (error) {
      return rejectWithValue(typeof error === 'string' ? error : 'Failed to get session');
    }
    return session;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user as AuthUser;
        state.session = action.payload?.session || null;
        state.isAuthenticated = !!action.payload?.session;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user as AuthUser;
        state.session = action.payload?.session || null;
        state.isAuthenticated = !!action.payload?.session;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as AuthUser;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Session
      .addCase(getSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSession, setUser } = authSlice.actions;
export default authSlice.reducer; 