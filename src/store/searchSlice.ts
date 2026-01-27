import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, SearchHistory } from '../types';

const initialState: SearchState = {
  fromCity: '',
  toCity: '',
  busNumber: '',
  searchHistory: [],
  fromStop: '',
  toStop: '',
  searchType: 'CITY',
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
    setFromStop: (state, action: PayloadAction<string>) => {
      state.fromStop = action.payload;
    },
    setToStop: (state, action: PayloadAction<string>) => {
      state.toStop = action.payload;
    },
    setSearchType: (state, action: PayloadAction<'CITY' | 'STOP'>) => {
      state.searchType = action.payload;
    },
    clearSearch: (state) => {
      state.fromCity = '';
      state.toCity = '';
      state.busNumber = '';
      state.fromStop = '';
      state.toStop = '';
    },
  },
});

export const {
  setFromCity,
  setToCity,
  setBusNumber,
  setSearchHistory,
  setFromStop,
  setToStop,
  setSearchType,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
