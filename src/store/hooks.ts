import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Alarm-specific selectors
export const useAlarmSelector = useAppSelector;

// Export alarm slice selectors for convenience
export { 
  selectAlarmState,
  selectIsAlarmSet,
  selectActiveAlarms,
  selectAlarmForStop,
  selectDistanceToStop,
  selectSelectedStops,
  selectHasActiveAlarms,
  selectTriggeredAlarms,
  selectNextAlarm,
} from './alarmSlice';
