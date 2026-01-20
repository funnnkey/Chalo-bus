import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { AlarmState } from '../types';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

interface AlarmSettingsModalProps {
  visible: boolean;
  alarmDistance: number;
  alarmSettings: AlarmState['alarmSettings'];
  onDistanceChange: (distance: number) => void;
  onSettingsChange: (settings: Partial<AlarmState['alarmSettings']>) => void;
  onClose: () => void;
  onSave?: () => void;
}

export const AlarmSettingsModal: React.FC<AlarmSettingsModalProps> = ({
  visible,
  alarmDistance,
  alarmSettings,
  onDistanceChange,
  onSettingsChange,
  onClose,
  onSave,
}) => {
  const [tempDistance, setTempDistance] = useState(alarmDistance);
  const [tempSettings, setTempSettings] = useState(alarmSettings);

  const handleDistanceSelect = (distance: number) => {
    setTempDistance(distance);
  };

  const handleSettingToggle = (setting: keyof AlarmState['alarmSettings']) => {
    setTempSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSave = () => {
    onDistanceChange(tempDistance);
    onSettingsChange(tempSettings);
    if (onSave) {
      onSave();
    }
    onClose();
  };

  const handleClose = () => {
    // Reset to original values on close
    setTempDistance(alarmDistance);
    setTempSettings(alarmSettings);
    onClose();
  };

  const distanceOptions = [5, 7, 10, 12, 15];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Alarm Settings</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Alarm Distance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alarm Distance</Text>
              <Text style={styles.sectionDescription}>
                Choose how far from your stop you want to be alerted
              </Text>
              
              <View style={styles.distanceOptions}>
                {distanceOptions.map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.distanceOption,
                      tempDistance === distance && styles.distanceOptionSelected,
                    ]}
                    onPress={() => handleDistanceSelect(distance)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.distanceText,
                      tempDistance === distance && styles.distanceTextSelected,
                    ]}>
                      {distance}km
                    </Text>
                    {tempDistance === distance && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Alarm Types Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alarm Types</Text>
              <Text style={styles.sectionDescription}>
                Select how you want to be notified
              </Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>🔔 Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Show alert on screen
                  </Text>
                </View>
                <Switch
                  value={tempSettings.notification}
                  onValueChange={() => handleSettingToggle('notification')}
                  trackColor={{ false: COLORS.MEDIUM_GRAY, true: COLORS.PRIMARY }}
                  thumbColor={tempSettings.notification ? COLORS.WHITE : COLORS.MEDIUM_GRAY}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>🔊 Sound</Text>
                  <Text style={styles.settingDescription}>
                    Play alarm sound
                  </Text>
                </View>
                <Switch
                  value={tempSettings.sound}
                  onValueChange={() => handleSettingToggle('sound')}
                  trackColor={{ false: COLORS.MEDIUM_GRAY, true: COLORS.PRIMARY }}
                  thumbColor={tempSettings.sound ? COLORS.WHITE : COLORS.MEDIUM_GRAY}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>📳 Vibration</Text>
                  <Text style={styles.settingDescription}>
                    Haptic feedback
                  </Text>
                </View>
                <Switch
                  value={tempSettings.vibration}
                  onValueChange={() => handleSettingToggle('vibration')}
                  trackColor={{ false: COLORS.MEDIUM_GRAY, true: COLORS.PRIMARY }}
                  thumbColor={tempSettings.vibration ? COLORS.WHITE : COLORS.MEDIUM_GRAY}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>🔁 Repeat Alerts</Text>
                  <Text style={styles.settingDescription}>
                    Alert every minute if still in range
                  </Text>
                </View>
                <Switch
                  value={tempSettings.repeatAlerts}
                  onValueChange={() => handleSettingToggle('repeatAlerts')}
                  trackColor={{ false: COLORS.MEDIUM_GRAY, true: COLORS.PRIMARY }}
                  thumbColor={tempSettings.repeatAlerts ? COLORS.WHITE : COLORS.MEDIUM_GRAY}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.LG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.MEDIUM_GRAY,
  },
  modalTitle: {
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: 18,
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.SM,
  },
  distanceOption: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    backgroundColor: COLORS.WHITE,
    minWidth: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceOptionSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: `${COLORS.PRIMARY}20`,
  },
  distanceText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  distanceTextSelected: {
    color: COLORS.PRIMARY,
  },
  checkMark: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    marginLeft: SPACING.XS,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  settingName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  settingDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  modalFooter: {
    padding: SPACING.LG,
    borderTopWidth: 1,
    borderTopColor: COLORS.MEDIUM_GRAY,
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
});