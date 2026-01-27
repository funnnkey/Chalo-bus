import AsyncStorage from '@react-native-async-storage/async-storage';
import { BusRoute, BusStop, LiveBus } from '../utils/delhiBusData';

export class OfflineStorageService {
  private static KEYS = {
    BUS_ROUTES: 'bus_routes',
    BUS_STOPS: 'bus_stops',
    LIVE_BUSES: 'live_buses',
    LAST_UPDATE: 'last_update',
  };

  static async cacheBusRoutes(routes: BusRoute[]) {
    await AsyncStorage.setItem(this.KEYS.BUS_ROUTES, JSON.stringify(routes));
    await AsyncStorage.setItem(this.KEYS.LAST_UPDATE, Date.now().toString());
  }

  static async getCachedBusRoutes(): Promise<BusRoute[]> {
    const cached = await AsyncStorage.getItem(this.KEYS.BUS_ROUTES);
    return cached ? JSON.parse(cached) : [];
  }

  static async cacheBusStops(stops: BusStop[]) {
    await AsyncStorage.setItem(this.KEYS.BUS_STOPS, JSON.stringify(stops));
  }

  static async getCachedBusStops(): Promise<BusStop[]> {
    const cached = await AsyncStorage.getItem(this.KEYS.BUS_STOPS);
    return cached ? JSON.parse(cached) : [];
  }

  static async isDataStale(): Promise<boolean> {
    const lastUpdate = await AsyncStorage.getItem(this.KEYS.LAST_UPDATE);
    if (!lastUpdate) return true;
    
    const hoursSinceUpdate = (Date.now() - parseInt(lastUpdate)) / (1000 * 60 * 60);
    return hoursSinceUpdate > 24; // Refresh every 24 hours
  }
}