import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface AlarmConfig {
  stopName: string;
  destinationLatitude: number;
  destinationLongitude: number;
  alarmRadius: number; // in kilometers (default: 10km)
  enableNotifications: boolean;
  enableSound: boolean;
  enableVibration: boolean;
  repeatAlerts: boolean; // Repeat every minute if within range
  alertInterval?: number; // in seconds (default: 60)
}

export interface ActiveAlarm {
  config: AlarmConfig;
  hasTriggered: boolean;
  lastTriggered?: Date;
  currentDistance: number; // in kilometers
  isActive: boolean;
}

export class GPSAlarmService {
  private static instance: GPSAlarmService;
  private activeAlarms: Map<string, ActiveAlarm> = new Map();
  private locationSubscription: Location.LocationSubscription | null = null;
  private notificationListener: { remove: () => void } | null = null;
  private soundObject: Audio.Sound | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GPSAlarmService {
    if (!GPSAlarmService.instance) {
      GPSAlarmService.instance = new GPSAlarmService();
    }
    return GPSAlarmService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request notification permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
      }

      // Configure audio session for sound playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Preload alarm sound
      await this.loadAlarmSound();

      // Set up notification listener for when app is opened from notification
      this.notificationListener = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log('Notification received:', notification);
        }
      );

      this.isInitialized = true;
      console.log('GPS Alarm Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize GPS Alarm Service:', error);
    }
  }

  private async loadAlarmSound(): Promise<void> {
    try {
      // For demo purposes, we'll use a system sound or create a simple beep
      // In a real app, you might load a custom sound file from assets
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'default' }, // This will use the default notification sound
        { shouldPlay: false }
      );
      this.soundObject = sound;
    } catch (error) {
      console.warn('Could not load alarm sound, will use system notification sound');
    }
  }

  async setDestinationAlarm(config: AlarmConfig): Promise<string> {
    await this.initialize();

    const alarmKey = `${config.stopName}_${Date.now()}`;
    const activeAlarm: ActiveAlarm = {
      config,
      hasTriggered: false,
      currentDistance: Infinity,
      isActive: true,
    };

    this.activeAlarms.set(alarmKey, activeAlarm);

    // Start location tracking if not already started
    if (!this.locationSubscription) {
      await this.startLocationTracking();
    }

    console.log(`Alarm set for ${config.stopName} with radius ${config.alarmRadius}km`);
    return alarmKey;
  }

  async clearAlarm(stopName: string): Promise<void> {
    const alarmKeysToRemove: string[] = [];
    
    for (const [key, alarm] of this.activeAlarms.entries()) {
      if (alarm.config.stopName === stopName) {
        alarmKeysToRemove.push(key);
      }
    }

    alarmKeysToRemove.forEach(key => {
      this.activeAlarms.delete(key);
    });

    // Stop location tracking if no more alarms
    if (this.activeAlarms.size === 0 && this.locationSubscription) {
      this.stopLocationTracking();
    }

    console.log(`Cleared ${alarmKeysToRemove.length} alarm(s) for ${stopName}`);
  }

  async clearAllAlarms(): Promise<void> {
    this.activeAlarms.clear();
    this.stopLocationTracking();
    console.log('All alarms cleared');
  }

  private async startLocationTracking(): Promise<void> {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permissions not granted');
        return;
      }
      
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 100, // Or every 100 meters
        },
        (location) => {
          this.handleLocationUpdate(location);
        }
      );
    } catch (error) {
      console.error('Failed to start location tracking:', error);
    }
  }

  private stopLocationTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  private handleLocationUpdate(location: Location.LocationObject): void {
    const { latitude, longitude } = location.coords;
    
    for (const [alarmKey, alarm] of this.activeAlarms.entries()) {
      if (!alarm.isActive) continue;

      const distance = this.calculateHaversineDistance(
        latitude,
        longitude,
        alarm.config.destinationLatitude,
        alarm.config.destinationLongitude
      );

      alarm.currentDistance = distance;
      
      // Check if we should trigger the alarm
      if (distance <= alarm.config.alarmRadius && !alarm.hasTriggered) {
        this.triggerAlarm(alarmKey, alarm);
      }
      
      // Handle repeat alerts
      if (alarm.config.repeatAlerts && alarm.hasTriggered && alarm.lastTriggered) {
        const timeSinceLastTrigger = Date.now() - alarm.lastTriggered.getTime();
        const intervalMs = (alarm.config.alertInterval || 60) * 1000;
        
        if (timeSinceLastTrigger >= intervalMs) {
          this.triggerAlarm(alarmKey, alarm);
        }
      }
    }
  }

  private calculateHaversineDistance(
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
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private async triggerAlarm(alarmKey: string, alarm: ActiveAlarm): Promise<void> {
    const now = new Date();
    alarm.hasTriggered = true;
    alarm.lastTriggered = now;

    console.log(`🚨 ALARM TRIGGERED for ${alarm.config.stopName}! Distance: ${alarm.currentDistance}km`);

    try {
      // Send notification
      if (alarm.config.enableNotifications) {
        await this.sendAlarmNotification(alarm);
      }

      // Play sound
      if (alarm.config.enableSound) {
        await this.playAlarmSound();
      }

      // Trigger haptic feedback
      if (alarm.config.enableVibration) {
        await this.triggerHapticFeedback();
      }

    } catch (error) {
      console.error('Error triggering alarm:', error);
    }
  }

  private async sendAlarmNotification(alarm: ActiveAlarm): Promise<void> {
    const distance = Math.round(alarm.currentDistance);
    const stopName = alarm.config.stopName;
    
    const message = distance > 0 
      ? `${stopName} is ${distance} km away. Wake up!`
      : `You've reached ${stopName}!`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚌 Bus Stop Alarm',
        body: message,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 1000, 500, 1000],
      },
      trigger: null, // Send immediately
    });
  }

  private async playAlarmSound(): Promise<void> {
    try {
      if (this.soundObject) {
        await this.soundObject.replayAsync();
      } else {
        // Fallback: play system notification sound through notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Alarm',
            body: 'Alarm triggered',
            sound: 'default',
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.warn('Could not play alarm sound:', error);
    }
  }

  private async triggerHapticFeedback(): Promise<void> {
    try {
      // Heavy impact for strong feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // Add additional vibration for older devices
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Could not trigger haptic feedback:', error);
    }
  }

  getActiveAlarms(): ActiveAlarm[] {
    return Array.from(this.activeAlarms.values()).filter(alarm => alarm.isActive);
  }

  getAlarmForStop(stopName: string): ActiveAlarm | null {
    for (const alarm of this.activeAlarms.values()) {
      if (alarm.config.stopName === stopName && alarm.isActive) {
        return alarm;
      }
    }
    return null;
  }

  updateAlarmRadius(stopName: string, newRadius: number): void {
    for (const alarm of this.activeAlarms.values()) {
      if (alarm.config.stopName === stopName) {
        alarm.config.alarmRadius = newRadius;
      }
    }
  }

  toggleAlarm(stopName: string, isActive: boolean): void {
    for (const alarm of this.activeAlarms.values()) {
      if (alarm.config.stopName === stopName) {
        alarm.isActive = isActive;
      }
    }
  }

  // Get distance to a specific stop (for UI display)
  getDistanceToStop(
    currentLat: number,
    currentLon: number,
    stopLat: number,
    stopLon: number
  ): number {
    return this.calculateHaversineDistance(currentLat, currentLon, stopLat, stopLon);
  }

  async cleanup(): Promise<void> {
    this.stopLocationTracking();
    
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    
    if (this.soundObject) {
      await this.soundObject.unloadAsync();
      this.soundObject = null;
    }
    
    this.isInitialized = false;
    console.log('GPS Alarm Service cleaned up');
  }
}

// Export singleton instance
export const gpsAlarmService = GPSAlarmService.getInstance();