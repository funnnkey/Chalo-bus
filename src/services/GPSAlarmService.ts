import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { AlarmConfig, LocationData } from '../types';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class GPSAlarmService {
  private static instance: GPSAlarmService;
  private activeAlarms: Map<string, AlarmConfig> = new Map();
  private triggeredAlarms: Set<string> = new Set();
  private locationSubscription: { 
    unsubscribe: () => void; 
    interval?: ReturnType<typeof setInterval>;
  } | null = null;
  private currentLocation: LocationData | null = null;

  private constructor() {}

  public static getInstance(): GPSAlarmService {
    if (!GPSAlarmService.instance) {
      GPSAlarmService.instance = new GPSAlarmService();
    }
    return GPSAlarmService.instance;
  }

  /**
   * Request necessary permissions for notifications, location, and audio
   */
  public async requestPermissions(): Promise<{
    notifications: boolean;
    location: boolean;
    audio: boolean;
  }> {
    try {
      // Request notification permissions
      const notificationSettings = await Notifications.requestPermissionsAsync();
      const notificationsGranted = notificationSettings.status === 'granted';

      // Request location permissions (this would typically be handled by the app)
      const locationGranted = true; // Assume location permission is granted

      // Request audio permissions
      const audioPermission = await Audio.requestPermissionsAsync();
      const audioGranted = audioPermission.status === 'granted';

      return {
        notifications: notificationsGranted,
        location: locationGranted,
        audio: audioGranted,
      };
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return {
        notifications: false,
        location: false,
        audio: false,
      };
    }
  }

  /**
   * Set up GPS location monitoring
   */
  public startLocationMonitoring(onLocationUpdate: (location: LocationData) => void): void {
    try {
      // In a real implementation, this would use geolocation
      // For now, we'll simulate location updates
      const simulateLocation = () => {
        if (this.activeAlarms.size > 0) {
          // Simulate gradual movement towards destination
          const mockLocation: LocationData = {
            latitude: 28.6139 + Math.random() * 0.1, // Around Delhi
            longitude: 77.2090 + Math.random() * 0.1,
            accuracy: 10,
            speed: 60, // 60 km/h
            timestamp: Date.now(),
          };
          
          this.currentLocation = mockLocation;
          onLocationUpdate(mockLocation);
          
          // Check distance to all active alarms
          this.checkAlarms(mockLocation);
        }
      };

      // Update location every 10 seconds (as specified)
      this.locationSubscription = {
        unsubscribe: () => {
          // Clear interval if using setInterval
        }
      };

      // Start simulation
      const interval = setInterval(simulateLocation, 10000);
      
      // Store the interval for cleanup
      this.locationSubscription.interval = interval;
      this.locationSubscription.unsubscribe = () => clearInterval(interval);
    } catch (error) {
      console.error('Error starting location monitoring:', error);
    }
  }

  /**
   * Stop GPS location monitoring
   */
  public stopLocationMonitoring(): void {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
      this.locationSubscription = null;
    }
    this.currentLocation = null;
  }

  /**
   * Set a destination alarm
   */
  public async setDestinationAlarm(config: AlarmConfig): Promise<void> {
    try {
      this.activeAlarms.set(config.stopName, config);
      this.triggeredAlarms.delete(config.stopName); // Reset triggered status
      
      // Update notification badge
      if (this.activeAlarms.size > 0) {
        await Notifications.setBadgeCountAsync(this.activeAlarms.size);
      }
    } catch (error) {
      console.error('Error setting destination alarm:', error);
    }
  }

  /**
   * Clear a specific alarm
   */
  public clearAlarm(stopName: string): void {
    try {
      this.activeAlarms.delete(stopName);
      this.triggeredAlarms.delete(stopName);
      
      // Update notification badge
      if (this.activeAlarms.size > 0) {
        Notifications.setBadgeCountAsync(this.activeAlarms.size);
      } else {
        Notifications.setBadgeCountAsync(0);
      }
    } catch (error) {
      console.error('Error clearing alarm:', error);
    }
  }

  /**
   * Clear all alarms
   */
  public clearAllAlarms(): void {
    try {
      this.activeAlarms.clear();
      this.triggeredAlarms.clear();
      Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing all alarms:', error);
    }
  }

  /**
   * Get all active alarms
   */
  public getActiveAlarms(): AlarmConfig[] {
    return Array.from(this.activeAlarms.values());
  }

  /**
   * Check if any alarm should be triggered
   */
  private async checkAlarms(location: LocationData): Promise<void> {
    for (const [stopName, config] of this.activeAlarms) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        config.latitude,
        config.longitude
      );

      // Check if within alarm radius and hasn't been triggered yet
      if (distance <= config.radius && !this.triggeredAlarms.has(stopName)) {
        await this.triggerAlarm(stopName, config, distance);
        this.triggeredAlarms.add(stopName);
      }
    }
  }

  /**
   * Trigger an alarm with configured notification, sound, and haptic
   */
  private async triggerAlarm(
    stopName: string,
    config: AlarmConfig,
    distance: number
  ): Promise<void> {
    try {
      // Send notification
      if (config.alarmType === 'NOTIFICATION' || config.alarmType === 'ALL') {
        await this.sendNotification(stopName, distance);
      }

      // Play sound
      if (config.alarmType === 'SOUND' || config.alarmType === 'ALL') {
        await this.playAlarmSound();
      }

      // Haptic feedback
      if (config.alarmType === 'VIBRATION' || config.alarmType === 'ALL') {
        await this.triggerHapticFeedback();
      }

      // Handle repeat alerts if enabled (this would be managed by Redux state)
    } catch (error) {
      console.error('Error triggering alarm:', error);
    }
  }

  /**
   * Send local notification
   */
  private async sendNotification(stopName: string, distance: number): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚨 Approaching Your Stop',
          body: `${stopName} is ${distance.toFixed(1)} km away. Wake up!`,
          badge: 1,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Play alarm sound
   */
  private async playAlarmSound(): Promise<void> {
    try {
      // In a real implementation, you would load and play a custom alarm sound
      // For now, we'll use a system sound effect
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
        { shouldPlay: true }
      );
      
      // Auto-unload after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  }

  /**
   * Trigger haptic feedback
   */
  private async triggerHapticFeedback(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Add additional vibration for emphasis
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get current location
   */
  public getCurrentLocation(): LocationData | null {
    return this.currentLocation;
  }

  /**
   * Test alarm functionality (for development)
   */
  public async testAlarm(stopName: string = 'Test Stop'): Promise<void> {
    const testConfig: AlarmConfig = {
      stopName,
      latitude: 28.6139, // Delhi
      longitude: 77.2090,
      radius: 5, // 5km
      alarmType: 'ALL',
    };

    // Set alarm
    this.setDestinationAlarm(testConfig);
    
    // Trigger immediately for testing
    await this.triggerAlarm(stopName, testConfig, 5.0);
  }
}

export const GPSAlarmServiceInstance = GPSAlarmService.getInstance();
export default GPSAlarmServiceInstance;