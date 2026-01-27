import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, RouteStop } from '../types';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { getCurrentStopIndex, getRouteStops } from '../utils/mockRouteData';

// Redux hooks
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setAlarm, 
  clearAlarm, 
  updateDistance, 
  markAlarmTriggered,
  selectAlarmStop,
  updateAlarmSettings,
  updateAlarmDistance,
  selectIsAlarmSet,
  selectSelectedAlarm,
  selectDistanceToStop,
  selectHasTriggered,
  selectAlarmSettings,
} from '../store/alarmSlice';

// Services and components
import GPSAlarmService from '../services/GPSAlarmService';
import { NotificationService } from '../services/NotificationService';
import { GPSTrackingService } from '../services/GPSTrackingService';
import { StopSelectionModal } from '../components/StopSelectionModal';
import { AlarmSettingsModal } from '../components/AlarmSettingsModal';
import { LocationData } from '../types';

type BusTrackingRouteProp = RouteProp<RootStackParamList, 'BusTracking'>;

export const BusTrackingScreen: React.FC = () => {
  const route = useRoute<BusTrackingRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { busNumber, operatorName, fromCity, toCity, departure, arrival, fare, bayNumber } =
    route.params;

  // Redux state
  const isAlarmSet = useAppSelector(selectIsAlarmSet);
  const selectedAlarm = useAppSelector(selectSelectedAlarm);
  const distanceToStop = useAppSelector(selectDistanceToStop);
  const hasTriggered = useAppSelector(selectHasTriggered);
  const alarmSettings = useAppSelector(selectAlarmSettings);

  // Local state
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(2);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(true);
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState<boolean>(false);

  const isOnSchedule = true;
  const delayMinutes = 0;

  // Initialize screen and request permissions
  useEffect(() => {
    const initializeScreen = async () => {
      // Get route stops
      const routeStops = getRouteStops(fromCity, toCity);
      setStops(routeStops);

      setIsFetchingLocation(true);
      const timeout = setTimeout(() => {
        setCurrentStopIndex(getCurrentStopIndex());
        setIsFetchingLocation(false);
      }, 900);

      // Request permissions
      try {
        const permissions = await GPSAlarmService.requestPermissions();
        const notificationPermission = await NotificationService.requestPermissions();
        setLocationPermissionGranted(permissions.location);
        setNotificationPermissionGranted(notificationPermission);
      } catch {
        // Error handling is done elsewhere
      }

      return () => clearTimeout(timeout);
    };

    initializeScreen();
  }, [fromCity, toCity]);

  // Set up GPS monitoring when alarm is set
  useEffect(() => {
    if (isAlarmSet && locationPermissionGranted) {
      // Start location monitoring
      GPSTrackingService.startTracking((location: LocationData) => {
        // Update distance for selected alarm
        if (selectedAlarm) {
          const distance = GPSTrackingService.calculateDistance(
            location.latitude,
            location.longitude,
            selectedAlarm.latitude,
            selectedAlarm.longitude
          );
          
          dispatch(updateDistance(distance));
          
          // Check if alarm should trigger
          if (distance <= selectedAlarm.radius && !hasTriggered) {
            dispatch(markAlarmTriggered());
            // Schedule notification
            NotificationService.scheduleBusArrivalNotification(
              busNumber,
              selectedAlarm.stopName,
              2
            );
          }
        }
      });

      // Cleanup function
      return () => {
        GPSTrackingService.stopTracking();
      };
    } else {
      // Stop monitoring if no alarm set
      GPSTrackingService.stopTracking();
    }
  }, [isAlarmSet, locationPermissionGranted, selectedAlarm, hasTriggered, dispatch, busNumber]);

  const currentStop = stops[currentStopIndex];
  const nextStop = useMemo(() => {
    return currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1] : null;
  }, [currentStopIndex, stops]);

  const etaText = useMemo((): string => {
    if (!nextStop || stops.length === 0) return 'Arrived at destination';

    const remainingStops = stops.length - currentStopIndex - 1;
    const hours = Math.floor(remainingStops * 1.5);
    const minutes = Math.floor((remainingStops * 1.5 - hours) * 60);

    if (hours === 0) return `${minutes} mins`;
    return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} mins`;
  }, [currentStopIndex, nextStop, stops.length]);

  const handleClose = () => {
    GPSTrackingService.stopTracking();
    NotificationService.cancelAllNotifications();
    navigation.goBack();
  };

  const handleSetAlarm = useCallback(async () => {
    if (!locationPermissionGranted || !notificationPermissionGranted) {
      Alert.alert(
        'Permissions Required',
        'Location and notification permissions are required for GPS alarms.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: requestPermissions },
        ]
      );
      return;
    }

    if (stops.length === 0) {
      Alert.alert('Error', 'No route stops available');
      return;
    }

    // If multiple stops, show selection modal
    if (stops.length > 1) {
      setShowStopModal(true);
    } else {
      // Single destination - set alarm directly
      const destinationStop = stops[stops.length - 1];
      handleAlarmStopSelect(destinationStop, stops.length - 1);
    }
  }, [locationPermissionGranted, notificationPermissionGranted, stops]);

  const handleAlarmStopSelect = useCallback((selectedStop: RouteStop, index: number) => {
    const alarmConfig = {
      stopName: selectedStop.stopName,
      latitude: selectedStop.latitude,
      longitude: selectedStop.longitude,
      radius: alarmSettings.repeatAlerts ? 15 : 10, // Default radius
      alarmType: getAlarmType() as 'NOTIFICATION' | 'SOUND' | 'VIBRATION' | 'ALL',
    };

    dispatch(setAlarm(alarmConfig));
    dispatch(selectAlarmStop(index));
    
    // Set alarm in service
    GPSAlarmService.setDestinationAlarm(alarmConfig);
    
    setShowStopModal(false);
  }, [dispatch, alarmSettings]);

  const getAlarmType = (): string => {
    const { notification, sound, vibration } = alarmSettings;
    if (notification && sound && vibration) return 'ALL';
    if (notification && sound) return 'SOUND';
    if (notification && vibration) return 'VIBRATION';
    if (notification) return 'NOTIFICATION';
    if (sound) return 'SOUND';
    if (vibration) return 'VIBRATION';
    return 'NOTIFICATION'; // Default
  };

  const handleClearAlarm = useCallback(() => {
    if (selectedAlarm) {
      dispatch(clearAlarm(selectedAlarm.stopName));
      GPSAlarmService.clearAlarm(selectedAlarm.stopName);
    }
  }, [dispatch, selectedAlarm]);

  const handleStopSelectionModalClose = useCallback(() => {
    setShowStopModal(false);
  }, []);

  const handleSettingsModalClose = useCallback(() => {
    setShowSettingsModal(false);
  }, []);

  const handleSettingsSave = useCallback(() => {
    setShowSettingsModal(false);
    // Settings are already updated via props
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      const permissions = await GPSAlarmService.requestPermissions();
      setLocationPermissionGranted(permissions.location);
      setNotificationPermissionGranted(permissions.notifications);
    } catch {
      // Error handling is done elsewhere
    }
  }, []);

  const handleShare = () => {
    Alert.alert('Info', 'Share current bus location feature coming soon!');
  };

  const handleSelectCurrentStop = (index: number) => {
    setIsFetchingLocation(true);
    setTimeout(() => {
      setCurrentStopIndex(index);
      setIsFetchingLocation(false);
    }, 400);
  };

  const renderTimelineStop = (stop: RouteStop, index: number) => {
    const isCompleted = index < currentStopIndex;
    const isCurrent = index === currentStopIndex;
    const isUpcoming = index > currentStopIndex;
    const isFirst = index === 0;
    const isLast = index === stops.length - 1;

    const expectedTime = stop.expectedTime;
    const actualTime = stop.actualTime ?? stop.expectedTime;

    const statusLabel = isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Upcoming';

    return (
      <View key={stop.id} style={styles.timelineItem}>
        <View style={styles.timelineLeftSection}>
          {!isFirst && <View style={styles.timelineLineTop} />}

          <View
            style={[
              styles.timelineCircle,
              isCompleted && styles.timelineCircleCompleted,
              isCurrent && styles.timelineCircleCurrent,
              isUpcoming && styles.timelineCircleUpcoming,
            ]}
          >
            {isCompleted && <Text style={styles.timelineIconCompleted}>✓</Text>}
            {isCurrent && <Text style={styles.timelineIconCurrent}>❋</Text>}
            {isUpcoming && <Text style={styles.timelineIconUpcoming}>⊘</Text>}
          </View>

          {!isLast && <View style={styles.timelineLineBottom} />}
        </View>

        <View style={[styles.timelineContent, isCurrent && styles.timelineContentCurrent]}>
          <View style={styles.timelineStopHeader}>
            <Text
              style={[
                styles.stopName,
                isCurrent && styles.stopNameCurrent,
                isCompleted && styles.stopNameCompleted,
                isUpcoming && styles.stopNameUpcoming,
              ]}
            >
              {stop.stopName}
              {isFirst && ' (START)'}
              {isLast && ' (END)'}
            </Text>

            <Text
              style={[
                styles.stopTime,
                isCurrent && styles.stopTimeCurrent,
                isCompleted && styles.stopTimeCompleted,
                isUpcoming && styles.stopTimeUpcoming,
              ]}
            >
              {expectedTime}
            </Text>
          </View>

          <View style={styles.stopMetaRow}>
            <Text style={[styles.stopStatusText, isCurrent && styles.stopStatusTextCurrent]}>
              {statusLabel}
            </Text>

            {isCompleted && (
              <Text style={styles.actualTimeText}>Actual: {actualTime}</Text>
            )}
          </View>

          {isCurrent && (
            <View style={styles.currentStopIndicator}>
              <Text style={styles.currentStopText}>YOU ARE ON THIS BUS</Text>
            </View>
          )}

          {isCurrent && nextStop && (
            <View style={styles.nextStopInfo}>
              <Text style={styles.nextStopLabel}>Next Stop: {nextStop.stopName}</Text>
              {nextStop.distance ? (
                <Text style={styles.nextStopDistance}>{nextStop.distance} km away</Text>
              ) : null}
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {operatorName} {busNumber}
            </Text>
            <Text style={styles.headerSubtitle}>
              {fromCity} → {toCity}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.statusBadge,
          isOnSchedule ? styles.statusBadgeOnSchedule : styles.statusBadgeDelayed,
        ]}
      >
        <Text style={styles.statusText}>
          Status: {isOnSchedule ? 'On Schedule ✓' : `${delayMinutes} mins late ⚠️`}
        </Text>
      </View>

      {isFetchingLocation ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Fetching live location...</Text>
        </View>
      ) : null}

      {!isFetchingLocation && (
        <View
          style={[
            styles.etaCard,
            isOnSchedule ? styles.etaCardOnSchedule : styles.etaCardDelayed,
          ]}
        >
          <View style={styles.etaRow}>
            <Text style={[styles.etaLabel, styles.etaTextOnColored]}>ETA:</Text>
            <Text style={[styles.etaValue, styles.etaTextOnColored]}>{etaText}</Text>
          </View>
          <View style={styles.etaRow}>
            <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Status:</Text>
            <Text style={[styles.etaValue, styles.etaTextOnColored]}>
              {isOnSchedule ? 'On Schedule' : `Delayed (${delayMinutes} mins)`}
            </Text>
          </View>

          {nextStop ? (
            <>
              <View style={styles.etaRow}>
                <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Next Stop:</Text>
                <Text style={[styles.etaValue, styles.etaTextOnColored]}>{nextStop.stopName}</Text>
              </View>
              {nextStop.distance ? (
                <View style={styles.etaRow}>
                  <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Distance:</Text>
                  <Text style={[styles.etaValue, styles.etaTextOnColored]}>
                    {nextStop.distance} km away
                  </Text>
                </View>
              ) : null}
            </>
          ) : null}

          <View style={styles.etaDivider} />

          <View style={styles.etaRow}>
            <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Departure:</Text>
            <Text style={[styles.etaValue, styles.etaTextOnColored]}>{departure}</Text>
          </View>
          <View style={styles.etaRow}>
            <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Arrival:</Text>
            <Text style={[styles.etaValue, styles.etaTextOnColored]}>{arrival}</Text>
          </View>
          <View style={styles.etaRow}>
            <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Fare:</Text>
            <Text style={[styles.etaValue, styles.etaTextOnColored]}>₹{fare}</Text>
          </View>
          {bayNumber ? (
            <View style={styles.etaRow}>
              <Text style={[styles.etaLabel, styles.etaTextOnColored]}>Bay:</Text>
              <Text style={[styles.etaValue, styles.etaTextOnColored]}>{bayNumber}</Text>
            </View>
          ) : null}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>Mock Current Location</Text>
          <Text style={styles.locationSubtitle}>
            Currently at: {currentStop ? currentStop.stopName : '—'}
          </Text>
          <Text style={styles.locationHint}>Tap a stop to manually update position</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stops.map((stop, index) => {
              const selected = index === currentStopIndex;
              return (
                <TouchableOpacity
                  key={stop.id}
                  style={[styles.stopChip, selected && styles.stopChipSelected]}
                  onPress={() => handleSelectCurrentStop(index)}
                  activeOpacity={0.8}
                  disabled={isFetchingLocation}
                >
                  <Text style={[styles.stopChipText, selected && styles.stopChipTextSelected]}>
                    {stop.stopName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.timelineContainer}>
          {stops.map((stop, index) => renderTimelineStop(stop, index))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!isAlarmSet ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.alarmButton]}
            onPress={handleSetAlarm}
            activeOpacity={0.8}
            disabled={!locationPermissionGranted || !notificationPermissionGranted}
          >
            <Text style={styles.actionButtonText}>
              🔔 SET ALARM
            </Text>
            {(!locationPermissionGranted || !notificationPermissionGranted) && (
              <Text style={styles.permissionWarningText}>
                Permissions required
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <View style={[styles.alarmStatusCard, hasTriggered && styles.alarmTriggeredCard]}>
              <Text style={[styles.alarmStatusTitle, hasTriggered && styles.alarmTriggeredTitle]}>
                {hasTriggered ? '🚨 ALARM TRIGGERED' : '🔔 ALARM SET ✓'}
              </Text>
              <Text style={[styles.alarmStatusDetail, hasTriggered && styles.alarmTriggeredDetail]}>
                Distance to {selectedAlarm?.stopName}: {distanceToStop > 0 ? `${distanceToStop.toFixed(1)} km` : '—'}
              </Text>
              <Text style={[styles.alarmStatusInfo, hasTriggered && styles.alarmTriggeredInfo]}>
                Will alert at: {selectedAlarm?.radius}km {hasTriggered ? '• TRIGGERED' : '• READY'}
              </Text>
            </View>
            
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.settingsButton]}
                onPress={() => setShowSettingsModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.settingsButtonText}>⚙️</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.clearAlarmButton]}
                onPress={handleClearAlarm}
                activeOpacity={0.8}
              >
                <Text style={styles.actionButtonText}>🔕</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📍 SHARE</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <StopSelectionModal
        visible={showStopModal}
        stops={stops}
        selectedStopIndex={currentStopIndex}
        onStopSelect={handleAlarmStopSelect}
        onClose={handleStopSelectionModalClose}
      />

      <AlarmSettingsModal
        visible={showSettingsModal}
        alarmDistance={10} // This would come from Redux
        alarmSettings={alarmSettings}
        onDistanceChange={(distance) => dispatch(updateAlarmDistance(distance))}
        onSettingsChange={(settings) => dispatch(updateAlarmSettings(settings))}
        onClose={handleSettingsModalClose}
        onSave={handleSettingsSave}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.WHITE,
    marginTop: SPACING.XS,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FONT_SIZES.HEADER,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    alignItems: 'center',
  },
  statusBadgeOnSchedule: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeDelayed: {
    backgroundColor: COLORS.ALERT_RED,
  },
  statusText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  loadingContainer: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    padding: SPACING.LG,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    fontWeight: '600',
  },
  etaCard: {
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    padding: SPACING.MD,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  etaCardOnSchedule: {
    backgroundColor: '#4CAF50',
  },
  etaCardDelayed: {
    backgroundColor: COLORS.ALERT_RED,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  etaLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  etaValue: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  etaTextOnColored: {
    color: COLORS.WHITE,
  },
  etaDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: SPACING.SM,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  locationCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  locationSubtitle: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  locationHint: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  stopChip: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
    backgroundColor: COLORS.WHITE,
    marginRight: SPACING.SM,
  },
  stopChipSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  stopChipText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  stopChipTextSelected: {
    color: COLORS.WHITE,
  },
  timelineContainer: {
    paddingLeft: SPACING.SM,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.XS,
  },
  timelineLeftSection: {
    width: 40,
    alignItems: 'center',
  },
  timelineLineTop: {
    width: 3,
    height: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  timelineLineBottom: {
    width: 3,
    flex: 1,
    minHeight: 20,
    backgroundColor: COLORS.PRIMARY,
  },
  timelineCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: COLORS.WHITE,
  },
  timelineCircleCompleted: {
    borderColor: COLORS.MEDIUM_GRAY,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  timelineCircleCurrent: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  timelineCircleUpcoming: {
    borderColor: COLORS.MEDIUM_GRAY,
    backgroundColor: COLORS.WHITE,
  },
  timelineIconCompleted: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    fontWeight: 'bold',
  },
  timelineIconCurrent: {
    fontSize: 18,
    color: COLORS.WHITE,
  },
  timelineIconUpcoming: {
    fontSize: 18,
    color: COLORS.MEDIUM_GRAY,
  },
  timelineContent: {
    flex: 1,
    marginLeft: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  timelineContentCurrent: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: SPACING.SM,
    marginRight: SPACING.SM,
  },
  timelineStopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.XS,
  },
  stopName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  stopNameCurrent: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.LARGE,
  },
  stopNameCompleted: {
    color: COLORS.DARK_GRAY,
  },
  stopNameUpcoming: {
    color: COLORS.TEXT_SECONDARY,
  },
  stopTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
  },
  stopTimeCurrent: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.BODY,
  },
  stopTimeCompleted: {
    color: COLORS.DARK_GRAY,
  },
  stopTimeUpcoming: {
    color: COLORS.MEDIUM_GRAY,
  },
  stopMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  stopStatusText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  stopStatusTextCurrent: {
    color: COLORS.PRIMARY,
  },
  actualTimeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  currentStopIndicator: {
    marginTop: SPACING.XS,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  currentStopText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  stopStatus: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  nextStopInfo: {
    marginTop: SPACING.SM,
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.PRIMARY,
  },
  nextStopLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  nextStopDistance: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmButton: {
    backgroundColor: COLORS.PRIMARY,
    marginRight: SPACING.SM,
  },
  shareButton: {
    backgroundColor: COLORS.PRIMARY,
    marginLeft: SPACING.SM,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  // Alarm specific styles
  permissionWarningText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.WHITE,
    opacity: 0.8,
    marginTop: SPACING.XS,
  },
  alarmStatusCard: {
    flex: 2,
    backgroundColor: `${COLORS.PRIMARY}20`,
    borderRadius: 8,
    padding: SPACING.MD,
    marginRight: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  alarmTriggeredCard: {
    backgroundColor: `${COLORS.ALERT_RED}20`,
    borderColor: COLORS.ALERT_RED,
  },
  alarmStatusTitle: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.XS,
  },
  alarmTriggeredTitle: {
    color: COLORS.ALERT_RED,
    fontSize: FONT_SIZES.BODY,
  },
  alarmStatusDetail: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    fontWeight: '600',
  },
  alarmTriggeredDetail: {
    color: COLORS.ALERT_RED,
    fontWeight: 'bold',
  },
  alarmStatusInfo: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  alarmTriggeredInfo: {
    color: COLORS.ALERT_RED,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  footerButtons: {
    flexDirection: 'row',
    marginRight: SPACING.SM,
  },
  settingsButton: {
    flex: 1,
    backgroundColor: COLORS.MEDIUM_GRAY,
    marginRight: SPACING.XS,
  },
  clearAlarmButton: {
    flex: 1,
    backgroundColor: COLORS.DARK_GRAY,
  },
  settingsButtonText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
});
