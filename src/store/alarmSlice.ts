import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlarmConfig, AlarmState, RouteStop } from '../types';

const initialState: AlarmState = {
  isAlarmSet: false,
  alarmStops: [],
  distanceToStop: 0,
  hasTriggered: false,
  selectedStopIndex: null,
  alarmDistance: 10, // Default 10km
  alarmSettings: {
    notification: true,
    sound: true,
    vibration: true,
    repeatAlerts: false,
  },
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarm: (state, action: PayloadAction<AlarmConfig>) => {
      const { payload } = action;
      
      // Check if alarm for this stop already exists
      const existingIndex = state.alarmStops.findIndex(
        alarm => alarm.stopName === payload.stopName
      );
      
      if (existingIndex >= 0) {
        // Update existing alarm
        state.alarmStops[existingIndex] = payload;
      } else {
        // Add new alarm
        state.alarmStops.push(payload);
      }
      
      state.isAlarmSet = true;
      state.hasTriggered = false;
      state.selectedStopIndex = state.alarmStops.findIndex(
        alarm => alarm.stopName === payload.stopName
      );
    },

    setMultipleAlarms: (state, action: PayloadAction<AlarmConfig[]>) => {
      state.alarmStops = [...action.payload];
      state.isAlarmSet = action.payload.length > 0;
      state.hasTriggered = false;
      
      if (action.payload.length > 0) {
        // Select the first stop by default
        state.selectedStopIndex = 0;
      } else {
        state.selectedStopIndex = null;
      }
    },

    clearAlarm: (state, action: PayloadAction<string>) => {
      const stopName = action.payload;
      
      state.alarmStops = state.alarmStops.filter(
        alarm => alarm.stopName !== stopName
      );
      
      if (state.alarmStops.length === 0) {
        state.isAlarmSet = false;
        state.selectedStopIndex = null;
      } else {
        // Update selected index if needed
        if (state.selectedStopIndex !== null && 
            state.selectedStopIndex >= state.alarmStops.length) {
          state.selectedStopIndex = state.alarmStops.length - 1;
        }
      }
      
      state.hasTriggered = false;
    },

    clearAllAlarms: (state) => {
      state.alarmStops = [];
      state.isAlarmSet = false;
      state.hasTriggered = false;
      state.selectedStopIndex = null;
      state.distanceToStop = 0;
    },

    updateDistance: (state, action: PayloadAction<number>) => {
      state.distanceToStop = action.payload;
    },

    markAlarmTriggered: (state, action: PayloadAction<string>) => {
      // Mark specific alarm as triggered
      const stopName = action.payload;
      // In a real implementation, we'd track triggered status per alarm
      // For now, mark as general triggered state
      state.hasTriggered = true;
    },

    markAllAlarmsTriggered: (state) => {
      state.hasTriggered = true;
    },

    selectAlarmStop: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.alarmStops.length) {
        state.selectedStopIndex = index;
      }
    },

    updateAlarmSettings: (state, action: PayloadAction<Partial<AlarmState['alarmSettings']>>) => {
      state.alarmSettings = { ...state.alarmSettings, ...action.payload };
    },

    updateAlarmDistance: (state, action: PayloadAction<number>) => {
      state.alarmDistance = action.payload;
      
      // Update all active alarms with new distance
      state.alarmStops = state.alarmStops.map(alarm => ({
        ...alarm,
        radius: action.payload,
      }));
    },

    // Reset alarm state when starting a new journey
    resetAlarmState: (state) => {
      return {
        ...initialState,
        alarmSettings: state.alarmSettings, // Keep user settings
        alarmDistance: state.alarmDistance, // Keep user distance preference
      };
    },
  },
});

export const {
  setAlarm,
  setMultipleAlarms,
  clearAlarm,
  clearAllAlarms,
  updateDistance,
  markAlarmTriggered,
  markAllAlarmsTriggered,
  selectAlarmStop,
  updateAlarmSettings,
  updateAlarmDistance,
  resetAlarmState,
} = alarmSlice.actions;

export default alarmSlice.reducer;

// Selector functions
export const selectAlarmState = (state: { alarm: AlarmState }) => state.alarm;
export const selectIsAlarmSet = (state: { alarm: AlarmState }) => state.alarm.isAlarmSet;
export const selectActiveAlarms = (state: { alarm: AlarmState }) => state.alarm.alarmStops;
export const selectSelectedAlarm = (state: { alarm: AlarmState }) => {
  const { alarmStops, selectedStopIndex } = state.alarm;
  return selectedStopIndex !== null ? alarmStops[selectedStopIndex] : null;
};
export const selectDistanceToStop = (state: { alarm: AlarmState }) => state.alarm.distanceToStop;
export const selectHasTriggered = (state: { alarm: AlarmState }) => state.alarm.hasTriggered;
export const selectAlarmSettings = (state: { alarm: AlarmState }) => state.alarm.alarmSettings;