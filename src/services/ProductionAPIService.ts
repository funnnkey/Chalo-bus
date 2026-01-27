import { BusRoute, BusStop, LiveBus } from '../utils/delhiBusData';

// Production API endpoints
const API_BASE_URL = 'https://api.chalobus.com/v1';
const GOVERNMENT_API_ENDPOINTS = {
  DELHI_DTC: 'https://otd.delhi.gov.in/api/realtime',
  MUMBAI_BEST: 'https://bestundertaking.com/api/routes',
  // Add more government APIs
};

export class ProductionAPIService {
  private static apiKey = process.env.EXPO_PUBLIC_API_KEY;

  // Real DTC API integration
  static async getDelhiLiveBuses(): Promise<LiveBus[]> {
    try {
      const response = await fetch(`${GOVERNMENT_API_ENDPOINTS.DELHI_DTC}/buses`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('DTC API failed');
      
      const data = await response.json();
      return this.transformDTCData(data);
    } catch (error) {
      console.error('DTC API Error:', error);
      // Fallback to cached data
      return this.getCachedBusData('DELHI');
    }
  }

  // Real BEST API integration
  static async getMumbaiLiveBuses(): Promise<LiveBus[]> {
    try {
      const response = await fetch(`${GOVERNMENT_API_ENDPOINTS.MUMBAI_BEST}/live`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      
      const data = await response.json();
      return this.transformBESTData(data);
    } catch (error) {
      console.error('BEST API Error:', error);
      return this.getCachedBusData('MUMBAI');
    }
  }

  // Transform DTC API response to our format
  private static transformDTCData(dtcData: any[]): LiveBus[] {
    return dtcData.map(bus => ({
      busNumber: bus.vehicle_number,
      routeNumber: bus.route_id,
      currentStopId: bus.current_stop_id,
      nextStopId: bus.next_stop_id,
      estimatedArrival: Math.round(bus.eta_minutes),
      delay: bus.delay_minutes || 0,
      occupancy: this.mapOccupancy(bus.passenger_load),
    }));
  }

  // Transform BEST API response
  private static transformBESTData(bestData: any[]): LiveBus[] {
    return bestData.map(bus => ({
      busNumber: bus.bus_no,
      routeNumber: bus.route_no,
      currentStopId: bus.current_stop,
      nextStopId: bus.next_stop,
      estimatedArrival: bus.arrival_time,
      delay: bus.delay || 0,
      occupancy: bus.crowding_level,
    }));
  }

  private static mapOccupancy(load: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL' {
    if (load < 30) return 'LOW';
    if (load < 60) return 'MEDIUM';
    if (load < 90) return 'HIGH';
    return 'FULL';
  }

  private static async getCachedBusData(city: string): Promise<LiveBus[]> {
    // Return cached data as fallback
    const { OfflineStorageService } = await import('./OfflineStorageService');
    return []; // Implement cached data retrieval
  }

  // Real-time updates via WebSocket
  static connectToRealTimeUpdates(onUpdate: (buses: LiveBus[]) => void) {
    const ws = new WebSocket(`wss://api.chalobus.com/realtime`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data.buses);
    };

    return ws;
  }
}