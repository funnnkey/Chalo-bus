export interface City {
  id: string;
  name: string;
  state: string;
}

export interface SearchHistory {
  id: number;
  fromCity: string;
  toCity: string;
  searchCount: number;
  lastSearched: string;
}

export interface BusOperator {
  id: number;
  operatorName: string;
  operatorCode: string;
  isStateTransport: boolean;
}

export interface BusSchedule {
  id: number;
  busNumber: string;
  operatorId: number;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  isAc: boolean;
  isSleeper: boolean;
}

export interface SearchState {
  fromCity: string;
  toCity: string;
  busNumber: string;
  searchHistory: SearchHistory[];
  fromStop: string;
  toStop: string;
  searchType: 'CITY' | 'STOP';
}

export interface UIState {
  activeTab: string;
  loading: boolean;
}

export interface AlarmConfig {
  stopName: string;
  latitude: number;
  longitude: number;
  radius: number; // 5-15 km
  alarmType: 'NOTIFICATION' | 'SOUND' | 'VIBRATION' | 'ALL';
}

export interface AlarmState {
  isAlarmSet: boolean;
  alarmStops: AlarmConfig[];
  distanceToStop: number;
  hasTriggered: boolean;
  selectedStopIndex: number | null;
  alarmDistance: number; // Default 10km
  alarmSettings: {
    notification: boolean;
    sound: boolean;
    vibration: boolean;
    repeatAlerts: boolean;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
}

export interface RouteStop {
  id: number;
  sequence: number;
  stopName: string;
  latitude: number;
  longitude: number;
  expectedTime: string;
  actualTime?: string;
  distance?: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  SearchResults: {
    fromCity: string;
    toCity: string;
  };
  BusRouteResults: {
    fromStop: string;
    toStop: string;
  };
  BusTracking: {
    busNumber: string;
    operatorName: string;
    fromCity: string;
    toCity: string;
    departure: string;
    arrival: string;
    fare: number;
    bayNumber?: string;
  };
};

export type BottomTabParamList = {
  Spot: undefined;
  Routes: undefined;
  Stations: undefined;
};
