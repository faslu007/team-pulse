import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Components/Pages/Auth/AuthSlices';

// Type for the store
export const store = configureStore({
    reducer: {
        auth: authSlice
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
