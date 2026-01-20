import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types';

const initialState: UIState = {
  activeTab: 'Spot',
  loading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveTab, setLoading } = uiSlice.actions;

export default uiSlice.reducer;
