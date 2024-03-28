'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface FlightState {
    nguoiLon: number,
    treEm: number,
    emBe: number,
}

const initialState: FlightState = {
    nguoiLon: 0,
    treEm: 0,
    emBe: 0,
}

export const passengerSlice = createSlice({
    name: 'passenger',
    initialState,
    reducers: {
        setNguoiLonState: (state, action) => {
            state.nguoiLon = action.payload;
        },
        setTreEmState: (state, action) => {
            state.treEm = action.payload;
        },
        setEmBeState: (state, action) => {
            state.emBe = action.payload;
        }
    }
})

export const { setNguoiLonState, setTreEmState, setEmBeState } = passengerSlice.actions;

export default passengerSlice.reducer;