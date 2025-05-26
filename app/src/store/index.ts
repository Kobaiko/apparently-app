import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Configure store with auth slice
const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more slices here as they are created
    // user: userSlice.reducer,
    // etc.
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 