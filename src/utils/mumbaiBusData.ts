import { BusStop, BusRoute, LiveBus } from './delhiBusData';

export const MUMBAI_BUS_STOPS: BusStop[] = [
  { id: 'CST01', name: 'CST Station', latitude: 18.9398, longitude: 72.8355, area: 'South Mumbai' },
  { id: 'BAN01', name: 'Bandra Station', latitude: 18.0540, longitude: 72.8406, area: 'West Mumbai' },
  { id: 'AND01', name: 'Andheri Station', latitude: 19.1197, longitude: 72.8464, area: 'West Mumbai' },
  { id: 'BOV01', name: 'Borivali Station', latitude: 19.2307, longitude: 72.8567, area: 'West Mumbai' },
  { id: 'DAD01', name: 'Dadar Station', latitude: 19.0176, longitude: 72.8562, area: 'Central Mumbai' },
  { id: 'KUR01', name: 'Kurla Station', latitude: 19.0728, longitude: 72.8826, area: 'East Mumbai' },
  { id: 'VIL01', name: 'Vile Parle', latitude: 19.0990, longitude: 72.8426, area: 'West Mumbai' },
  { id: 'POW01', name: 'Powai', latitude: 19.1176, longitude: 72.9060, area: 'East Mumbai' },
];

export const MUMBAI_BUS_ROUTES: BusRoute[] = [
  {
    routeNumber: '1',
    operatorName: 'BEST',
    stops: [
      MUMBAI_BUS_STOPS.find(s => s.id === 'CST01')!,
      MUMBAI_BUS_STOPS.find(s => s.id === 'DAD01')!,
      MUMBAI_BUS_STOPS.find(s => s.id === 'BAN01')!,
      MUMBAI_BUS_STOPS.find(s => s.id === 'AND01')!,
    ],
    frequency: 10,
    firstBus: '05:00',
    lastBus: '00:30',
    fare: 15,
  },
  {
    routeNumber: '56',
    operatorName: 'BEST',
    stops: [
      MUMBAI_BUS_STOPS.find(s => s.id === 'AND01')!,
      MUMBAI_BUS_STOPS.find(s => s.id === 'VIL01')!,
      MUMBAI_BUS_STOPS.find(s => s.id === 'BOV01')!,
    ],
    frequency: 8,
    firstBus: '05:30',
    lastBus: '23:45',
    fare: 12,
  },
];

export const MUMBAI_LIVE_BUSES: LiveBus[] = [
  {
    busNumber: 'MH-01-AB-1234',
    routeNumber: '1',
    currentStopId: 'DAD01',
    nextStopId: 'BAN01',
    estimatedArrival: 4,
    delay: 1,
    occupancy: 'HIGH',
  },
];