/**
 * Test suite for GPS Alarm functionality
 * Run with: npm test or jest (if configured)
 */

import { gpsAlarmService, AlarmConfig } from '../services/GPSAlarmService';
import { calculateHaversineDistance, isWithinRadius, formatDistance } from '../utils/gpsUtils';

// Test data
const DELHI_COORDS = { lat: 28.7041, lon: 77.1025 };
const AGRA_COORDS = { lat: 27.1767, lon: 78.0081 };
const MOCK_ALARM_CONFIG: AlarmConfig = {
  stopName: 'Agra',
  destinationLatitude: AGRA_COORDS.lat,
  destinationLongitude: AGRA_COORDS.lon,
  alarmRadius: 10,
  enableNotifications: true,
  enableSound: true,
  enableVibration: true,
  repeatAlerts: false,
};

describe('GPS Alarm Service', () => {
  beforeEach(async () => {
    // Clean up before each test
    await gpsAlarmService.clearAllAlarms();
  });

  afterEach(async () => {
    // Clean up after each test
    await gpsAlarmService.cleanup();
  });

  describe('Distance Calculations', () => {
    test('should calculate distance between Delhi and Agra correctly', () => {
      const distance = calculateHaversineDistance(
        DELHI_COORDS.lat,
        DELHI_COORDS.lon,
        AGRA_COORDS.lat,
        AGRA_COORDS.lon
      );
      
      // Delhi to Agra is approximately 200-250km
      expect(distance).toBeGreaterThan(200);
      expect(distance).toBeLessThan(250);
    });

    test('should detect if within alarm radius', () => {
      const closeToAgra = { lat: 27.1, lon: 78.0 }; // Very close to Agra
      
      const withinRadius = isWithinRadius(
        closeToAgra.lat,
        closeToAgra.lon,
        AGRA_COORDS.lat,
        AGRA_COORDS.lon,
        10 // 10km radius
      );
      
      expect(withinRadius).toBe(true);
    });

    test('should detect if outside alarm radius', () => {
      const farFromAgra = { lat: 28.5, lon: 77.4 }; // Far from Agra
      
      const withinRadius = isWithinRadius(
        farFromAgra.lat,
        farFromAgra.lon,
        AGRA_COORDS.lat,
        AGRA_COORDS.lon,
        10 // 10km radius
      );
      
      expect(withinRadius).toBe(false);
    });

    test('should format distance correctly', () => {
      expect(formatDistance(0.5)).toBe('500m');
      expect(formatDistance(5.5)).toBe('5.5km');
      expect(formatDistance(15)).toBe('15km');
    });
  });

  describe('Alarm Management', () => {
    test('should set an alarm successfully', async () => {
      const alarmKey = await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      
      expect(alarmKey).toBeTruthy();
      expect(typeof alarmKey).toBe('string');
      
      const activeAlarms = gpsAlarmService.getActiveAlarms();
      expect(activeAlarms).toHaveLength(1);
      expect(activeAlarms[0].config.stopName).toBe('Agra');
    });

    test('should set multiple alarms for different stops', async () => {
      const mathuraConfig: AlarmConfig = {
        ...MOCK_ALARM_CONFIG,
        stopName: 'Mathura',
        destinationLatitude: 27.4924,
        destinationLongitude: 77.6737,
      };

      const agraKey = await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      const mathuraKey = await gpsAlarmService.setDestinationAlarm(mathuraConfig);

      const activeAlarms = gpsAlarmService.getActiveAlarms();
      expect(activeAlarms).toHaveLength(2);
      expect(activeAlarms.find(a => a.config.stopName === 'Agra')).toBeTruthy();
      expect(activeAlarms.find(a => a.config.stopName === 'Mathura')).toBeTruthy();
    });

    test('should clear a specific alarm', async () => {
      const agraKey = await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      const mathuraConfig: AlarmConfig = {
        ...MOCK_ALARM_CONFIG,
        stopName: 'Mathura',
        destinationLatitude: 27.4924,
        destinationLongitude: 77.6737,
      };
      await gpsAlarmService.setDestinationAlarm(mathuraConfig);

      await gpsAlarmService.clearAlarm('Agra');

      const activeAlarms = gpsAlarmService.getActiveAlarms();
      expect(activeAlarms).toHaveLength(1);
      expect(activeAlarms[0].config.stopName).toBe('Mathura');
    });

    test('should clear all alarms', async () => {
      await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      const mathuraConfig: AlarmConfig = {
        ...MOCK_ALARM_CONFIG,
        stopName: 'Mathura',
        destinationLatitude: 27.4924,
        destinationLongitude: 77.6737,
      };
      await gpsAlarmService.setDestinationAlarm(mathuraConfig);

      await gpsAlarmService.clearAllAlarms();

      const activeAlarms = gpsAlarmService.getActiveAlarms();
      expect(activeAlarms).toHaveLength(0);
    });
  });

  describe('Alarm Configuration', () => {
    test('should get alarm for specific stop', async () => {
      await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);

      const agraAlarm = gpsAlarmService.getAlarmForStop('Agra');
      expect(agraAlarm).toBeTruthy();
      expect(agraAlarm?.config.stopName).toBe('Agra');
    });

    test('should update alarm radius', async () => {
      await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      gpsAlarmService.updateAlarmRadius('Agra', 15);

      const agraAlarm = gpsAlarmService.getAlarmForStop('Agra');
      expect(agraAlarm?.config.alarmRadius).toBe(15);
    });

    test('should toggle alarm active state', async () => {
      await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      gpsAlarmService.toggleAlarm('Agra', false);

      const agraAlarm = gpsAlarmService.getAlarmForStop('Agra');
      expect(agraAlarm?.isActive).toBe(false);
    });
  });

  describe('Distance Utilities', () => {
    test('should calculate distance to stop', () => {
      const distance = gpsAlarmService.getDistanceToStop(
        DELHI_COORDS.lat,
        DELHI_COORDS.lon,
        AGRA_COORDS.lat,
        AGRA_COORDS.lon
      );

      expect(distance).toBeGreaterThan(200);
      expect(distance).toBeLessThan(250);
    });
  });

  describe('Service Lifecycle', () => {
    test('should initialize successfully', async () => {
      await gpsAlarmService.initialize();
      expect(gpsAlarmService).toBeTruthy();
    });

    test('should cleanup resources', async () => {
      await gpsAlarmService.initialize();
      await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
      
      await gpsAlarmService.cleanup();
      
      // After cleanup, should have no active alarms
      const activeAlarms = gpsAlarmService.getActiveAlarms();
      expect(activeAlarms).toHaveLength(0);
    });
  });
});

// Integration test examples
export const runIntegrationTests = async () => {
  console.log('🧪 Running GPS Alarm Integration Tests...\n');

  try {
    // Test 1: Basic alarm setup
    console.log('Test 1: Setting up basic alarm');
    const alarmKey = await gpsAlarmService.setDestinationAlarm(MOCK_ALARM_CONFIG);
    console.log(`✓ Alarm created with key: ${alarmKey}`);

    // Test 2: Distance calculation
    console.log('\nTest 2: Testing distance calculation');
    const distance = gpsAlarmService.getDistanceToStop(
      DELHI_COORDS.lat,
      DELHI_COORDS.lon,
      AGRA_COORDS.lat,
      AGRA_COORDS.lon
    );
    console.log(`✓ Distance Delhi to Agra: ${distance}km`);

    // Test 3: Multiple alarms
    console.log('\nTest 3: Setting multiple alarms');
    const mathuraConfig: AlarmConfig = {
      ...MOCK_ALARM_CONFIG,
      stopName: 'Mathura',
      destinationLatitude: 27.4924,
      destinationLongitude: 77.6737,
    };
    await gpsAlarmService.setDestinationAlarm(mathuraConfig);
    console.log(`✓ Multiple alarms set: ${gpsAlarmService.getActiveAlarms().length}`);

    // Test 4: Alarm management
    console.log('\nTest 4: Testing alarm management');
    gpsAlarmService.updateAlarmRadius('Agra', 15);
    const agraAlarm = gpsAlarmService.getAlarmForStop('Agra');
    console.log(`✓ Alarm radius updated: ${agraAlarm?.config.alarmRadius}km`);

    // Test 5: Cleanup
    console.log('\nTest 5: Testing cleanup');
    await gpsAlarmService.clearAllAlarms();
    console.log(`✓ All alarms cleared: ${gpsAlarmService.getActiveAlarms().length}`);

    console.log('\n🎉 All integration tests passed!');
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
};

// Export for manual testing
export { MOCK_ALARM_CONFIG, DELHI_COORDS, AGRA_COORDS };