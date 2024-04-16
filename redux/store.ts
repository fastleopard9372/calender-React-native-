import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { CalenderSlice } from "./calenderSlice";
export const store = configureStore({
    reducer: {
        [CalenderSlice.name]: CalenderSlice.reducer
    },
    devTools: true,
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
