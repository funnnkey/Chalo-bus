import { RouteStop } from '../types';

export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: string;
}

export interface BusRoute {
  routeNumber: string;
  operatorName: string;
  stops: BusStop[];
  frequency: number; // minutes
  firstBus: string;
  lastBus: string;
  fare: number;
}

export interface LiveBus {
  busNumber: string;
  routeNumber: string;
  currentStopId: string;
  nextStopId: string;
  estimatedArrival: number; // minutes
  delay: number; // minutes (positive = late, negative = early)
  occupancy: 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';
}

// Delhi Bus Stops
export const DELHI_BUS_STOPS: BusStop[] = [
  { id: 'KG01', name: 'Kashmiri Gate', latitude: 28.6667, longitude: 77.2300, area: 'Central Delhi' },
  { id: 'LN01', name: 'Laxmi Nagar', latitude: 28.6350, longitude: 77.2774, area: 'East Delhi' },
  { id: 'CP01', name: 'Connaught Place', latitude: 28.6315, longitude: 77.2167, area: 'Central Delhi' },
  { id: 'ISBT01', name: 'ISBT Kashmiri Gate', latitude: 28.6681, longitude: 77.2294, area: 'Central Delhi' },
  { id: 'RK01', name: 'Rajouri Garden', latitude: 28.6469, longitude: 77.1200, area: 'West Delhi' },
  { id: 'DU01', name: 'Delhi University', latitude: 28.6967, longitude: 77.2167, area: 'North Delhi' },
  { id: 'ITO01', name: 'ITO', latitude: 28.6289, longitude: 77.2426, area: 'Central Delhi' },
  { id: 'IP01', name: 'IP Extension', latitude: 28.6400, longitude: 77.2800, area: 'East Delhi' },
  { id: 'VK01', name: 'Vikas Marg', latitude: 28.6380, longitude: 77.2900, area: 'East Delhi' },
  { id: 'AN01', name: 'Anand Vihar', latitude: 28.6469, longitude: 77.3150, area: 'East Delhi' },
  { id: 'RG01', name: 'Red Fort', latitude: 28.6562, longitude: 77.2410, area: 'Central Delhi' },
  { id: 'CH01', name: 'Chandni Chowk', latitude: 28.6506, longitude: 77.2300, area: 'Central Delhi' },
  { id: 'JM01', name: 'Jama Masjid', latitude: 28.6507, longitude: 77.2334, area: 'Central Delhi' },
  { id: 'ND01', name: 'New Delhi Railway Station', latitude: 28.6431, longitude: 77.2197, area: 'Central Delhi' },
  { id: 'KP01', name: 'Karol Bagh', latitude: 28.6519, longitude: 77.1909, area: 'Central Delhi' },
];

// Delhi Bus Routes
export const DELHI_BUS_ROUTES: BusRoute[] = [
  {
    routeNumber: '34',
    operatorName: 'DTC',
    stops: [
      DELHI_BUS_STOPS.find(s => s.id === 'KG01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'RG01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'CH01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'JM01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'ITO01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'IP01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'LN01')!,
    ],
    frequency: 8,
    firstBus: '05:30',
    lastBus: '23:00',
    fare: 10,
  },
  {
    routeNumber: '54',
    operatorName: 'DTC',
    stops: [
      DELHI_BUS_STOPS.find(s => s.id === 'KG01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'CP01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'ND01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'KP01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'RK01')!,
    ],
    frequency: 12,
    firstBus: '06:00',
    lastBus: '22:30',
    fare: 10,
  },
  {
    routeNumber: '181',
    operatorName: 'DTC',
    stops: [
      DELHI_BUS_STOPS.find(s => s.id === 'AN01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'VK01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'LN01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'IP01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'ITO01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'CP01')!,
    ],
    frequency: 15,
    firstBus: '05:45',
    lastBus: '22:45',
    fare: 15,
  },
  {
    routeNumber: '405',
    operatorName: 'DTC',
    stops: [
      DELHI_BUS_STOPS.find(s => s.id === 'DU01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'KG01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'RG01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'ITO01')!,
      DELHI_BUS_STOPS.find(s => s.id === 'LN01')!,
    ],
    frequency: 10,
    firstBus: '06:15',
    lastBus: '23:15',
    fare: 12,
  },
];

// Live Bus Data (Mock)
export const LIVE_BUSES: LiveBus[] = [
  {
    busNumber: 'DL-1PC-1234',
    routeNumber: '34',
    currentStopId: 'RG01',
    nextStopId: 'CH01',
    estimatedArrival: 3,
    delay: 2,
    occupancy: 'MEDIUM',
  },
  {
    busNumber: 'DL-1PC-5678',
    routeNumber: '34',
    currentStopId: 'ITO01',
    nextStopId: 'IP01',
    estimatedArrival: 5,
    delay: -1,
    occupancy: 'HIGH',
  },
  {
    busNumber: 'DL-1PC-9012',
    routeNumber: '181',
    currentStopId: 'VK01',
    nextStopId: 'LN01',
    estimatedArrival: 7,
    delay: 0,
    occupancy: 'LOW',
  },
  {
    busNumber: 'DL-1PC-3456',
    routeNumber: '405',
    currentStopId: 'KG01',
    nextStopId: 'RG01',
    estimatedArrival: 2,
    delay: 1,
    occupancy: 'MEDIUM',
  },
];

// Helper functions
export const findRoutesBetweenStops = (fromStopId: string, toStopId: string): BusRoute[] => {
  return DELHI_BUS_ROUTES.filter(route => {
    const fromIndex = route.stops.findIndex(stop => stop.id === fromStopId);
    const toIndex = route.stops.findIndex(stop => stop.id === toStopId);
    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
  });
};

export const getLiveBusesForRoute = (routeNumber: string): LiveBus[] => {
  return LIVE_BUSES.filter(bus => bus.routeNumber === routeNumber);
};

export const getNextBusArrival = (stopId: string, routeNumber: string): number => {
  const liveBuses = getLiveBusesForRoute(routeNumber);
  const route = DELHI_BUS_ROUTES.find(r => r.routeNumber === routeNumber);
  
  if (!route) return route?.frequency || 15;
  
  const stopIndex = route.stops.findIndex(stop => stop.id === stopId);
  if (stopIndex === -1) return route.frequency;
  
  // Find buses approaching this stop
  const approachingBuses = liveBuses.filter(bus => {
    const currentStopIndex = route.stops.findIndex(stop => stop.id === bus.currentStopId);
    return currentStopIndex < stopIndex;
  });
  
  if (approachingBuses.length === 0) {
    return route.frequency; // Return frequency if no buses approaching
  }
  
  // Return the earliest arrival time
  return Math.min(...approachingBuses.map(bus => bus.estimatedArrival));
};

export const searchBusStops = (query: string): BusStop[] => {
  if (!query) return DELHI_BUS_STOPS;
  
  return DELHI_BUS_STOPS.filter(stop =>
    stop.name.toLowerCase().includes(query.toLowerCase()) ||
    stop.area.toLowerCase().includes(query.toLowerCase())
  );
};