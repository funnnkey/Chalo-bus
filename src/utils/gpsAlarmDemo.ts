// Demo utility for testing GPS Alarm functionality
import { gpsAlarmService, AlarmConfig } from '../services/GPSAlarmService';
import { RouteStop } from '../types';

// Mock route stops for testing
export const MOCK_ALARM_STOPS: RouteStop[] = [
  {
    id: 1,
    sequence: 1,
    stopName: 'Delhi',
    latitude: 28.7041,
    longitude: 77.1025,
    expectedTime: '09:00 AM',
    actualTime: '09:00 AM',
  },
  {
    id: 2,
    sequence: 2,
    stopName: 'Gurgaon',
    latitude: 28.4595,
    longitude: 77.0266,
    expectedTime: '10:00 AM',
    actualTime: '10:05 AM',
  },
  {
    id: 3,
    sequence: 3,
    stopName: 'Mathura',
    latitude: 27.4924,
    longitude: 77.6737,
    expectedTime: '01:45 PM',
    distance: 85,
  },
  {
    id: 4,
    sequence: 4,
    stopName: 'Agra',
    latitude: 27.1767,
    longitude: 78.0081,
    expectedTime: '03:30 PM',
    distance: 120,
  },
];

// Simulate setting a demo alarm for Agra
export const setDemoAlarm = async (): Promise<string | null> => {
  try {
    const agraStop = MOCK_ALARM_STOPS.find(stop => stop.stopName === 'Agra');
    if (!agraStop) {
      console.error('Agra stop not found');
      return null;
    }

    const config: AlarmConfig = {
      stopName: agraStop.stopName,
      destinationLatitude: agraStop.latitude,
      destinationLongitude: agraStop.longitude,
      alarmRadius: 10, // 10km radius
      enableNotifications: true,
      enableSound: true,
      enableVibration: true,
      repeatAlerts: true,
      alertInterval: 60, // Every minute
    };

    const alarmKey = await gpsAlarmService.setDestinationAlarm(config);
    console.log('Demo alarm set for Agra:', alarmKey);
    return alarmKey;
  } catch (error) {
    console.error('Failed to set demo alarm:', error);
    return null;
  }
};

// Simulate location updates for testing
export const simulateLocationUpdate = (latitude: number, longitude: number) => {
  console.log(`Simulating location update: ${latitude}, ${longitude}`);
  
  // This would typically be handled by the GPS service's location listener
  // For demo purposes, we can trigger distance calculations manually
};

// Simulate being closer to Agra (for testing alarm trigger)
export const simulateApproachingAgra = () => {
  console.log('Simulating approach to Agra...');
  // Current mock location: 28.5355, 77.3910 (Noida)
  // Agra: 27.1767, 78.0081
  // This should be about 120km away initially
};

// Test distance calculation utility
export const testDistanceCalculation = () => {
  const currentLocation = { lat: 28.5355, lon: 77.3910 }; // Noida
  const agraLocation = { lat: 27.1767, lon: 78.0081 }; // Agra
  
  const distance = gpsAlarmService.getDistanceToStop(
    currentLocation.lat,
    currentLocation.lon,
    agraLocation.lat,
    agraLocation.lon
  );
  
  console.log(`Distance from Noida to Agra: ${distance}km`);
  return distance;
};

// Demo alarm scenarios
export const DEMO_SCENARIOS = {
  // Scenario 1: Long distance (alarm should wait)
  LONG_DISTANCE: {
    name: 'Long Distance',
    currentLocation: { lat: 28.5355, lon: 77.3910 }, // Noida
    targetLocation: { lat: 27.1767, lon: 78.0081 }, // Agra
    expectedDistance: '~120km',
    expectedBehavior: 'Alarm should wait',
  },
  
  // Scenario 2: Medium distance (approaching)
  MEDIUM_DISTANCE: {
    name: 'Medium Distance',
    currentLocation: { lat: 27.5, lon: 77.8 }, // Near Mathura
    targetLocation: { lat: 27.1767, lon: 78.0081 }, // Agra
    expectedDistance: '~45km',
    expectedBehavior: 'Alarm should still wait',
  },
  
  // Scenario 3: Close distance (alarm should trigger)
  CLOSE_DISTANCE: {
    name: 'Close Distance',
    currentLocation: { lat: 27.2, lon: 78.0 }, // Very close to Agra
    targetLocation: { lat: 27.1767, lon: 78.0081 }, // Agra
    expectedDistance: '~5km',
    expectedBehavior: 'Alarm should trigger',
  },
};

export const runDemoScenario = async (scenarioName: keyof typeof DEMO_SCENARIOS) => {
  const scenario = DEMO_SCENARIOS[scenarioName];
  console.log(`\n🚌 Running Demo Scenario: ${scenario.name}`);
  console.log(`Expected Distance: ${scenario.expectedDistance}`);
  console.log(`Expected Behavior: ${scenario.expectedBehavior}`);
  
  // Set alarm for Agra
  const alarmKey = await setDemoAlarm();
  if (!alarmKey) return;
  
  // Calculate and display current distance
  const distance = gpsAlarmService.getDistanceToStop(
    scenario.currentLocation.lat,
    scenario.currentLocation.lon,
    scenario.targetLocation.lat,
    scenario.targetLocation.lon
  );
  
  console.log(`Current calculated distance: ${distance}km`);
  
  // Simulate the location update
  // In a real scenario, this would come from GPS
  simulateLocationUpdate(scenario.currentLocation.lat, scenario.currentLocation.lon);
};

export const clearAllDemoAlarms = async () => {
  try {
    await gpsAlarmService.clearAllAlarms();
    console.log('All demo alarms cleared');
  } catch (error) {
    console.error('Failed to clear demo alarms:', error);
  }
};

// Export for easy testing
export const GPSAlarmDemo = {
  setDemoAlarm,
  simulateLocationUpdate,
  simulateApproachingAgra,
  testDistanceCalculation,
  runDemoScenario,
  clearAllDemoAlarms,
  DEMO_SCENARIOS,
};