import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { CalenderSlice } from "./calenderSlice";
import authSlice, { AuthSlice } from "./authSlice";
export const store = configureStore({
    reducer: {
        [CalenderSlice.name]: CalenderSlice.reducer,
        [AuthSlice.name]: AuthSlice.reducer,
    },
    devTools: false,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
