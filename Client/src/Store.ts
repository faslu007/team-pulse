import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Pages/Auth/AuthSlices';
import gameManageSlice from "./Pages/Rooms/Games/GameSlices"
// Type for the store
export const store = configureStore({
    reducer: {
        auth: authSlice,
        gameManage: gameManageSlice
    },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
