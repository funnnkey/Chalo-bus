import { DELHI_BUS_STOPS, DELHI_BUS_ROUTES } from './delhiBusData';
import { MUMBAI_BUS_STOPS, MUMBAI_BUS_ROUTES } from './mumbaiBusData';

export type SupportedCity = 'DELHI' | 'MUMBAI';

export const SUPPORTED_CITIES = [
  { id: 'DELHI', name: 'Delhi', isActive: true },
  { id: 'MUMBAI', name: 'Mumbai', isActive: true },
] as const;

export const getCityBusStops = (city: SupportedCity) => {
  switch (city) {
    case 'DELHI':
      return DELHI_BUS_STOPS;
    case 'MUMBAI':
      return MUMBAI_BUS_STOPS;
    default:
      return DELHI_BUS_STOPS;
  }
};

export const getCityBusRoutes = (city: SupportedCity) => {
  switch (city) {
    case 'DELHI':
      return DELHI_BUS_ROUTES;
    case 'MUMBAI':
      return MUMBAI_BUS_ROUTES;
    default:
      return DELHI_BUS_ROUTES;
  }
};