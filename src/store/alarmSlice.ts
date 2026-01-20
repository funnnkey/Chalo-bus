import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlarmConfig } from '../services/GPSAlarmService';

export interface AlarmState {
  isAlarmSet: boolean;
  activeAlarms: {
    stopName: string;
    config: AlarmConfig;
    hasTriggered: boolean;
    lastTriggered?: string;
    currentDistance: number;
    isActive: boolean;
    alarmKey: string;
  }[];
  selectedStops: string[];
  distanceToStops: { [stopName: string]: number };
  lastLocationUpdate?: string;
  isTrackingEnabled: boolean;
  error?: string;
}

const initialState: AlarmState = {
  isAlarmSet: false,
  activeAlarms: [],
  selectedStops: [],
  distanceToStops: {},
  isTrackingEnabled: false,
};

const alarmSlice = createSlice({
  name: 'alarm',
  initialState,
  reducers: {
    setAlarm: (state, action: PayloadAction<{
      alarmKey: string;
      config: AlarmConfig;
    }>) => {
      const { alarmKey, config } = action.payload;
      
      // Check if alarm for this stop already exists
      const existingAlarmIndex = state.activeAlarms.findIndex(
        alarm => alarm.stopName === config.stopName
      );
      
      if (existingAlarmIndex >= 0) {
        // Update existing alarm
        state.activeAlarms[existingAlarmIndex] = {
          ...state.activeAlarms[existingAlarmIndex],
          config,
          isActive: true,
        };
      } else {
        // Add new alarm
        state.activeAlarms.push({
          stopName: config.stopName,
          config,
          hasTriggered: false,
          currentDistance: Infinity,
          isActive: true,
          alarmKey,
        });
      }
      
      state.isAlarmSet = state.activeAlarms.length > 0;
      state.selectedStops = [...new Set([...state.selectedStops, config.stopName])];
      state.error = undefined;
    },
    
    clearAlarm: (state, action: PayloadAction<string>) => {
      const stopName = action.payload;
      
      state.activeAlarms = state.activeAlarms.filter(
        alarm => alarm.stopName !== stopName
      );
      
      state.selectedStops = state.selectedStops.filter(stop => stop !== stopName);
      delete state.distanceToStops[stopName];
      
      state.isAlarmSet = state.activeAlarms.length > 0;
    },
    
    clearAllAlarms: (state) => {
      state.activeAlarms = [];
      state.selectedStops = [];
      state.distanceToStops = {};
      state.isAlarmSet = false;
    },
    
    updateAlarmDistance: (state, action: PayloadAction<{
      stopName: string;
      distance: number;
    }>) => {
      const { stopName, distance } = action.payload;
      state.distanceToStops[stopName] = distance;
      
      // Update the alarm's current distance
      const alarm = state.activeAlarms.find(a => a.stopName === stopName);
      if (alarm) {
        alarm.currentDistance = distance;
      }
    },
    
    triggerAlarm: (state, action: PayloadAction<{
      stopName: string;
      triggeredAt: string;
    }>) => {
      const { stopName, triggeredAt } = action.payload;
      
      const alarm = state.activeAlarms.find(a => a.stopName === stopName);
      if (alarm) {
        alarm.hasTriggered = true;
        alarm.lastTriggered = triggeredAt;
      }
    },
    
    toggleAlarm: (state, action: PayloadAction<{
      stopName: string;
      isActive: boolean;
    }>) => {
      const { stopName, isActive } = action.payload;
      
      const alarm = state.activeAlarms.find(a => a.stopName === stopName);
      if (alarm) {
        alarm.isActive = isActive;
      }
      
      // Update overall alarm status
      state.isAlarmSet = state.activeAlarms.some(alarm => alarm.isActive);
    },
    
    updateAlarmRadius: (state, action: PayloadAction<{
      stopName: string;
      radius: number;
    }>) => {
      const { stopName, radius } = action.payload;
      
      const alarm = state.activeAlarms.find(a => a.stopName === stopName);
      if (alarm) {
        alarm.config.alarmRadius = radius;
      }
    },
    
    setLastLocationUpdate: (state, action: PayloadAction<string>) => {
      state.lastLocationUpdate = action.payload;
    },
    
    setTrackingEnabled: (state, action: PayloadAction<boolean>) => {
      state.isTrackingEnabled = action.payload;
    },
    
    setAlarmError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    clearAlarmError: (state) => {
      state.error = undefined;
    },
    
    selectStopForAlarm: (state, action: PayloadAction<string>) => {
      const stopName = action.payload;
      if (!state.selectedStops.includes(stopName)) {
        state.selectedStops.push(stopName);
      }
    },
    
    deselectStopForAlarm: (state, action: PayloadAction<string>) => {
      const stopName = action.payload;
      state.selectedStops = state.selectedStops.filter(stop => stop !== stopName);
    },
    
    setMultipleAlarms: (state, action: PayloadAction<{
      configs: { alarmKey: string; config: AlarmConfig }[];
    }>) => {
      const { configs } = action.payload;
      
      configs.forEach(({ alarmKey, config }) => {
        const existingAlarmIndex = state.activeAlarms.findIndex(
          alarm => alarm.stopName === config.stopName
        );
        
        if (existingAlarmIndex >= 0) {
          state.activeAlarms[existingAlarmIndex] = {
            ...state.activeAlarms[existingAlarmIndex],
            config,
            isActive: true,
            alarmKey,
          };
        } else {
          state.activeAlarms.push({
            stopName: config.stopName,
            config,
            hasTriggered: false,
            currentDistance: Infinity,
            isActive: true,
            alarmKey,
          });
        }
        
        if (!state.selectedStops.includes(config.stopName)) {
          state.selectedStops.push(config.stopName);
        }
      });
      
      state.isAlarmSet = state.activeAlarms.length > 0;
    },
  },
});

export const {
  setAlarm,
  clearAlarm,
  clearAllAlarms,
  updateAlarmDistance,
  triggerAlarm,
  toggleAlarm,
  updateAlarmRadius,
  setLastLocationUpdate,
  setTrackingEnabled,
  setAlarmError,
  clearAlarmError,
  selectStopForAlarm,
  deselectStopForAlarm,
  setMultipleAlarms,
} = alarmSlice.actions;

export default alarmSlice.reducer;

// Selectors
export const selectAlarmState = (state: { alarm: AlarmState }) => state.alarm;

export const selectIsAlarmSet = (state: { alarm: AlarmState }) => state.alarm.isAlarmSet;

export const selectActiveAlarms = (state: { alarm: AlarmState }) => state.alarm.activeAlarms;

export const selectAlarmForStop = (stopName: string) => (state: { alarm: AlarmState }) =>
  state.alarm.activeAlarms.find(alarm => alarm.stopName === stopName);

export const selectDistanceToStop = (stopName: string) => (state: { alarm: AlarmState }) =>
  state.alarm.distanceToStops[stopName];

export const selectSelectedStops = (state: { alarm: AlarmState }) => state.alarm.selectedStops;

export const selectHasActiveAlarms = (state: { alarm: AlarmState }) =>
  state.alarm.activeAlarms.some(alarm => alarm.isActive);

export const selectTriggeredAlarms = (state: { alarm: AlarmState }) =>
  state.alarm.activeAlarms.filter(alarm => alarm.hasTriggered);

export const selectNextAlarm = (state: { alarm: AlarmState }) => {
  const activeAlarms = state.alarm.activeAlarms.filter(alarm => alarm.isActive && !alarm.hasTriggered);
  
  if (activeAlarms.length === 0) return null;
  
  // Sort by distance (closest first)
  return activeAlarms.reduce((closest, current) => 
    current.currentDistance < closest.currentDistance ? current : closest
  );
};