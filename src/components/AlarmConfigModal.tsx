import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { AlarmConfig } from '../services/GPSAlarmService';
import { RouteStop } from '../types';

interface AlarmConfigModalProps {
  visible: boolean;
  onClose: () => void;
  onSetAlarm: (config: AlarmConfig) => void;
  availableStops: RouteStop[];
  currentLocation?: { latitude: number; longitude: number };
}

export const AlarmConfigModal: React.FC<AlarmConfigModalProps> = ({
  visible,
  onClose,
  onSetAlarm,
  availableStops,
  currentLocation,
}) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(availableStops.length - 1); // Default to last stop (destination)
  const [alarmRadius, setAlarmRadius] = useState<string>('10');
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true);
  const [enableSound, setEnableSound] = useState<boolean>(true);
  const [enableVibration, setEnableVibration] = useState<boolean>(true);
  const [repeatAlerts, setRepeatAlerts] = useState<boolean>(true);
  const [alertInterval, setAlertInterval] = useState<string>('60');

  const selectedStop = availableStops[selectedStopIndex];
  const estimatedDistance = selectedStop?.distance || 0;

  const handleSetAlarm = () => {
    if (!selectedStop) {
      Alert.alert('Error', 'Please select a stop');
      return;
    }

    const radius = parseFloat(alarmRadius);
    if (isNaN(radius) || radius < 1 || radius > 50) {
      Alert.alert('Error', 'Alarm radius must be between 1 and 50 km');
      return;
    }

    const interval = parseInt(alertInterval);
    if (isNaN(interval) || interval < 30 || interval > 600) {
      Alert.alert('Error', 'Alert interval must be between 30 and 600 seconds');
      return;
    }

    const config: AlarmConfig = {
      stopName: selectedStop.stopName,
      destinationLatitude: selectedStop.latitude,
      destinationLongitude: selectedStop.longitude,
      alarmRadius: radius,
      enableNotifications,
      enableSound,
      enableVibration,
      repeatAlerts,
      alertInterval: interval,
    };

    onSetAlarm(config);
    onClose();
  };

  const renderStopItem = (stop: RouteStop, index: number) => {
    const isSelected = index === selectedStopIndex;
    const isLast = index === availableStops.length - 1;

    return (
      <TouchableOpacity
        key={stop.id}
        style={[styles.stopItem, isSelected && styles.stopItemSelected]}
        onPress={() => setSelectedStopIndex(index)}
      >
        <View style={styles.stopInfo}>
          <Text style={[styles.stopName, isSelected && styles.stopNameSelected]}>
            {stop.stopName}
            {isLast && ' (DESTINATION)'}
          </Text>
          <Text style={styles.stopTime}>{stop.expectedTime}</Text>
          {stop.distance && (
            <Text style={styles.stopDistance}>{stop.distance} km from current</Text>
          )}
        </View>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Set GPS Alarm</Text>
          <TouchableOpacity onPress={handleSetAlarm} style={styles.setButton}>
            <Text style={styles.setButtonText}>SET</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Stop</Text>
            <Text style={styles.sectionSubtitle}>
              Choose which stop to set an alarm for
            </Text>
            {availableStops.map((stop, index) => renderStopItem(stop, index))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alarm Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Alarm Distance (km)</Text>
              <TextInput
                style={styles.radiusInput}
                value={alarmRadius}
                onChangeText={setAlarmRadius}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>
            <Text style={styles.settingHint}>
              Alarm will trigger when you're within {alarmRadius} km of {selectedStop?.stopName}
            </Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Repeat Alerts</Text>
              <TouchableOpacity
                style={[styles.toggle, repeatAlerts && styles.toggleActive]}
                onPress={() => setRepeatAlerts(!repeatAlerts)}
              >
                <Text style={[styles.toggleText, repeatAlerts && styles.toggleTextActive]}>
                  {repeatAlerts ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {repeatAlerts && (
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Repeat Interval (seconds)</Text>
                <TextInput
                  style={styles.intervalInput}
                  value={alertInterval}
                  onChangeText={setAlertInterval}
                  keyboardType="numeric"
                  placeholder="60"
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alert Methods</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <TouchableOpacity
                style={[styles.toggle, enableNotifications && styles.toggleActive]}
                onPress={() => setEnableNotifications(!enableNotifications)}
              >
                <Text style={[styles.toggleText, enableNotifications && styles.toggleTextActive]}>
                  {enableNotifications ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sound</Text>
              <TouchableOpacity
                style={[styles.toggle, enableSound && styles.toggleActive]}
                onPress={() => setEnableSound(!enableSound)}
              >
                <Text style={[styles.toggleText, enableSound && styles.toggleTextActive]}>
                  {enableSound ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Vibration</Text>
              <TouchableOpacity
                style={[styles.toggle, enableVibration && styles.toggleActive]}
                onPress={() => setEnableVibration(!enableVibration)}
              >
                <Text style={[styles.toggleText, enableVibration && styles.toggleTextActive]}>
                  {enableVibration ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {estimatedDistance > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Estimated Distance</Text>
              <Text style={styles.infoText}>
                Approximately {estimatedDistance} km to {selectedStop?.stopName}
              </Text>
              {estimatedDistance < parseFloat(alarmRadius) && (
                <Text style={styles.warningText}>
                  ⚠️ Selected stop is closer than alarm distance
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.MEDIUM_GRAY,
  },
  closeButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  setButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 6,
  },
  setButtonText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.MD,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  stopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 8,
    marginBottom: SPACING.SM,
  },
  stopItemSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  stopNameSelected: {
    color: COLORS.PRIMARY,
  },
  stopTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  stopDistance: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    marginTop: SPACING.XS,
  },
  checkmark: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  settingLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  settingHint: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    fontStyle: 'italic',
  },
  toggle: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  toggleText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.WHITE,
  },
  radiusInput: {
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 6,
    padding: SPACING.SM,
    fontSize: FONT_SIZES.BODY,
    textAlign: 'center',
    minWidth: 60,
  },
  intervalInput: {
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 6,
    padding: SPACING.SM,
    fontSize: FONT_SIZES.SMALL,
    textAlign: 'center',
    minWidth: 80,
  },
  infoSection: {
    backgroundColor: COLORS.PRIMARY + '10',
    borderRadius: 10,
    padding: SPACING.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  infoTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  infoText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  warningText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.ALERT_RED,
    fontWeight: '600',
  },
});