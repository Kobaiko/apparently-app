import { configureStore } from '@reduxjs/toolkit';

// Placeholder for future slices
const store = configureStore({
  reducer: {
    // Add slices here as they are created
    // auth: authSlice.reducer,
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