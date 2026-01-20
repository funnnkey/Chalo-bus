import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

type BusTrackingRouteProp = RouteProp<RootStackParamList, 'BusTracking'>;

export const BusTrackingScreen: React.FC = () => {
  const route = useRoute<BusTrackingRouteProp>();
  const navigation = useNavigation();
  const { busNumber, operatorName, fromCity, toCity, departure, arrival, fare, bayNumber } =
    route.params;

  const routeStops = useMemo(() => getRouteStops(fromCity, toCity), [fromCity, toCity]);
  const [stops, setStops] = useState<RouteStop[]>(routeStops);
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(2);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(true);

  const isOnSchedule = true;
  const delayMinutes = 0;

  useEffect(() => {
    setStops(routeStops);

    setIsFetchingLocation(true);
    const timeout = setTimeout(() => {
      setCurrentStopIndex(getCurrentStopIndex());
      setIsFetchingLocation(false);
    }, 900);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeStops]);

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
    navigation.goBack();
  };

  const handleSetAlarm = () => {
    alert('GPS-based alarm will be set when you are 5-10km from destination');
  };

  const handleShare = () => {
    alert('Share current bus location feature coming soon!');
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
        <TouchableOpacity
          style={[styles.actionButton, styles.alarmButton]}
          onPress={handleSetAlarm}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>🔔 SET ALARM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>📍 SHARE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
  },
  actionButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  actualTimeText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
  },
  alarmButton: {
    backgroundColor: COLORS.PRIMARY,
    marginRight: SPACING.SM,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  closeButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: COLORS.LIGHT_GRAY,
    flex: 1,
  },
  currentStopIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    marginTop: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
  },
  currentStopText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
  },
  etaCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    elevation: 4,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  etaCardDelayed: {
    backgroundColor: COLORS.ALERT_RED,
  },
  etaCardOnSchedule: {
    backgroundColor: '#4CAF50',
  },
  etaDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 1,
    marginVertical: SPACING.SM,
  },
  etaLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
  },
  etaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.XS,
  },
  etaTextOnColored: {
    color: COLORS.WHITE,
  },
  etaValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: COLORS.WHITE,
    borderTopColor: COLORS.LIGHT_GRAY,
    borderTopWidth: 1,
    elevation: 5,
    flexDirection: 'row',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerSubtitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    marginTop: SPACING.XS,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    justifyContent: 'center',
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    padding: SPACING.LG,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    marginTop: SPACING.MD,
  },
  locationCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginBottom: SPACING.LG,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  locationHint: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    marginBottom: SPACING.SM,
  },
  locationSubtitle: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    marginBottom: SPACING.XS,
  },
  nextStopDistance: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.XS,
  },
  nextStopInfo: {
    borderTopColor: COLORS.PRIMARY,
    borderTopWidth: 1,
    marginTop: SPACING.SM,
    paddingTop: SPACING.SM,
  },
  nextStopLabel: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: SPACING.XL,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    marginBottom: SPACING.SM,
  },
  shareButton: {
    backgroundColor: COLORS.PRIMARY,
    marginLeft: SPACING.SM,
  },
  statusBadge: {
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  statusBadgeDelayed: {
    backgroundColor: COLORS.ALERT_RED,
  },
  statusBadgeOnSchedule: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  stopChip: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.MEDIUM_GRAY,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  stopChipSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  stopChipText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
  stopChipTextSelected: {
    color: COLORS.WHITE,
  },
  stopMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.XS,
  },
  stopName: {
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  stopNameCompleted: {
    color: COLORS.DARK_GRAY,
  },
  stopNameCurrent: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.LARGE,
  },
  stopNameUpcoming: {
    color: COLORS.TEXT_SECONDARY,
  },
  stopStatusText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
  stopStatusTextCurrent: {
    color: COLORS.PRIMARY,
  },
  stopTime: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    marginLeft: SPACING.SM,
  },
  stopTimeCompleted: {
    color: COLORS.DARK_GRAY,
  },
  stopTimeCurrent: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  stopTimeUpcoming: {
    color: COLORS.MEDIUM_GRAY,
  },
  timelineCircle: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    borderWidth: 3,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  timelineCircleCompleted: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderColor: COLORS.MEDIUM_GRAY,
  },
  timelineCircleCurrent: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  timelineCircleUpcoming: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.MEDIUM_GRAY,
  },
  timelineContainer: {
    paddingLeft: SPACING.SM,
  },
  timelineContent: {
    flex: 1,
    marginLeft: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  timelineContentCurrent: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginRight: SPACING.SM,
    padding: SPACING.SM,
  },
  timelineIconCompleted: {
    color: COLORS.DARK_GRAY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timelineIconCurrent: {
    color: COLORS.WHITE,
    fontSize: 18,
  },
  timelineIconUpcoming: {
    color: COLORS.MEDIUM_GRAY,
    fontSize: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.XS,
  },
  timelineLeftSection: {
    alignItems: 'center',
    width: 40,
  },
  timelineLineBottom: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    minHeight: 20,
    width: 3,
  },
  timelineLineTop: {
    backgroundColor: COLORS.PRIMARY,
    height: 20,
    width: 3,
  },
  timelineStopHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.XS,
  },
});
