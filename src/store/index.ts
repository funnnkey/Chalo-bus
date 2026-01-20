import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import uiReducer from './uiSlice';
import alarmReducer from './alarmSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    ui: uiReducer,
    alarm: alarmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
