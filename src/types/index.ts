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

export interface SearchState {
  fromCity: string;
  toCity: string;
  busNumber: string;
  searchHistory: SearchHistory[];
}

export interface UIState {
  activeTab: string;
  loading: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  SearchResults: {
    fromCity: string;
    toCity: string;
  };
  BusTracking: {
    busNumber: string;
  };
};

export type BottomTabParamList = {
  Spot: undefined;
  Routes: undefined;
  Stations: undefined;
};
