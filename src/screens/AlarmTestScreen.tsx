import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import GPSAlarmService from '../services/GPSAlarmService';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

export const AlarmTestScreen: React.FC = () => {
  const testSingleAlarm = async () => {
    try {
      await GPSAlarmService.testAlarm('Delhi Bus Stop');
      Alert.alert('Success', 'Test alarm triggered! Check your notifications.');
    } catch {
      Alert.alert('Error', 'Failed to trigger test alarm');
    }
  };

  const testMultipleAlarms = async () => {
    try {
      // Test multiple alarms
      await GPSAlarmService.setDestinationAlarm({
        stopName: 'Delhi',
        latitude: 28.6139,
        longitude: 77.2090,
        radius: 5,
        alarmType: 'ALL',
      });

      await GPSAlarmService.setDestinationAlarm({
        stopName: 'Agra',
        latitude: 27.1767,
        longitude: 78.0081,
        radius: 10,
        alarmType: 'NOTIFICATION',
      });

      Alert.alert('Success', 'Multiple alarms set! Check active alarms.');
    } catch {
      Alert.alert('Error', 'Failed to set multiple alarms');
    }
  };

  const testDistanceCalculation = () => {
    const distance = GPSAlarmService.calculateDistance(
      28.6139, 77.2090, // Delhi
      27.1767, 78.0081  // Agra
    );
    
    Alert.alert('Distance Test', `Distance Delhi to Agra: ${distance.toFixed(2)} km`);
  };

  const clearAllAlarms = () => {
    GPSAlarmService.clearAllAlarms();
    Alert.alert('Success', 'All alarms cleared');
  };

  const getActiveAlarms = () => {
    const alarms = GPSAlarmService.getActiveAlarms();
    Alert.alert('Active Alarms', alarms.length > 0 ? 
      alarms.map(alarm => `${alarm.stopName} (${alarm.radius}km)`).join('\n') : 
      'No active alarms'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Alarm Test Screen</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testSingleAlarm}>
        <Text style={styles.buttonText}>🔔 Test Single Alarm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testMultipleAlarms}>
        <Text style={styles.buttonText}>🔔 Test Multiple Alarms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={testDistanceCalculation}>
        <Text style={styles.buttonText}>📏 Test Distance Calculation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.testButton} onPress={getActiveAlarms}>
        <Text style={styles.buttonText}>📋 Get Active Alarms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearAllAlarms}>
        <Text style={styles.buttonText}>🗑️ Clear All Alarms</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LG,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
  },
  testButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    borderRadius: 8,
    marginBottom: SPACING.MD,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: COLORS.ALERT_RED,
    padding: SPACING.MD,
    borderRadius: 8,
    marginBottom: SPACING.MD,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
});

export default AlarmTestScreen;