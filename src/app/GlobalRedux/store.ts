'use client';

import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './Features/flights/flightsSlice';
import passengerReducer from "./Features/passenger/passengerSlice"

export const store = configureStore({
    reducer: {
        flights: flightsReducer,
        passenger: passengerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;