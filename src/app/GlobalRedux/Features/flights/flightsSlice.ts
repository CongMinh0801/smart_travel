'use client';

import { createSlice } from '@reduxjs/toolkit';

export interface FlightState {
    chuyenBayDi: any,
    chuyenBayVe: any
}

const initialState: FlightState = {
    chuyenBayDi: null,
    chuyenBayVe: null
}

export const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        setChuyenBayDiState: (state, action) => {
            state.chuyenBayDi = action.payload;
        },
        setChuyenBayVeState: (state, action) => {
            state.chuyenBayVe = action.payload;
        }
    }
})

export const { setChuyenBayDiState, setChuyenBayVeState } = flightsSlice.actions;

export default flightsSlice.reducer;