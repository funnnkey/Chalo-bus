import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, SearchHistory } from '../types';

const initialState: SearchState = {
  fromCity: '',
  toCity: '',
  busNumber: '',
  searchHistory: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFromCity: (state, action: PayloadAction<string>) => {
      state.fromCity = action.payload;
    },
    setToCity: (state, action: PayloadAction<string>) => {
      state.toCity = action.payload;
    },
    setBusNumber: (state, action: PayloadAction<string>) => {
      state.busNumber = action.payload;
    },
    setSearchHistory: (state, action: PayloadAction<SearchHistory[]>) => {
      state.searchHistory = action.payload;
    },
    clearSearch: (state) => {
      state.fromCity = '';
      state.toCity = '';
      state.busNumber = '';
    },
  },
});

export const {
  setFromCity,
  setToCity,
  setBusNumber,
  setSearchHistory,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
