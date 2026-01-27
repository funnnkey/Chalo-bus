import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import {
  findRoutesBetweenStops,
  getNextBusArrival,
  DELHI_BUS_STOPS,
  BusRoute,
} from '../utils/delhiBusData';

type BusRouteResultsRouteProp = RouteProp<RootStackParamList, 'BusRouteResults'>;
type BusRouteResultsNavigationProp = StackNavigationProp<RootStackParamList, 'BusRouteResults'>;

export const BusRouteResultsScreen: React.FC = () => {
  const route = useRoute<BusRouteResultsRouteProp>();
  const navigation = useNavigation<BusRouteResultsNavigationProp>();
  const { fromStop, toStop } = route.params;

  const fromStopData = DELHI_BUS_STOPS.find(stop => stop.name === fromStop);
  const toStopData = DELHI_BUS_STOPS.find(stop => stop.name === toStop);

  const availableRoutes = useMemo(() => {
    if (!fromStopData || !toStopData) return [];
    return findRoutesBetweenStops(fromStopData.id, toStopData.id);
  }, [fromStopData, toStopData]);

  const handleTrackRoute = (busRoute: BusRoute) => {
    navigation.navigate('BusTracking', {
      busNumber: busRoute.routeNumber,
      operatorName: busRoute.operatorName,
      fromCity: fromStop,
      toCity: toStop,
      departure: busRoute.firstBus,
      arrival: busRoute.lastBus,
      fare: busRoute.fare,
    });
  };

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'LOW': return '#4CAF50';
      case 'MEDIUM': return '#FF9800';
      case 'HIGH': return '#FF5722';
      case 'FULL': return '#F44336';
      default: return COLORS.TEXT_SECONDARY;
    }
  };

  const getOccupancyText = (occupancy: string) => {
    switch (occupancy) {
      case 'LOW': return 'Seats Available';
      case 'MEDIUM': return 'Moderate';
      case 'HIGH': return 'Crowded';
      case 'FULL': return 'Full';
      default: return 'Unknown';
    }
  };

  if (availableRoutes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>NO DIRECT ROUTES</Text>
          <Text style={styles.routeText}>
            {fromStop} → {toStop}
          </Text>
        </View>
        <View style={styles.noRoutesContainer}>
          <Text style={styles.noRoutesText}>
            No direct bus routes found between these stops.
          </Text>
          <Text style={styles.suggestionText}>
            Try searching for nearby stops or use metro/other transport.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BUS ROUTES</Text>
        <Text style={styles.routeText}>
          {fromStop} → {toStop}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {availableRoutes.map((busRoute) => {
          const nextArrival = getNextBusArrival(fromStopData!.id, busRoute.routeNumber);
          
          return (
            <View key={busRoute.routeNumber} style={styles.routeCard}>
              <View style={styles.routeHeader}>
                <View>
                  <Text style={styles.routeNumber}>Route {busRoute.routeNumber}</Text>
                  <Text style={styles.operatorName}>{busRoute.operatorName}</Text>
                </View>
                <View style={styles.fareContainer}>
                  <Text style={styles.fareText}>₹{busRoute.fare}</Text>
                </View>
              </View>

              <View style={styles.routeDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Next Bus:</Text>
                  <Text style={styles.nextBusTime}>
                    {nextArrival} min
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Frequency:</Text>
                  <Text style={styles.detailValue}>Every {busRoute.frequency} min</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Service Hours:</Text>
                  <Text style={styles.detailValue}>
                    {busRoute.firstBus} - {busRoute.lastBus}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.occupancyText, { color: getOccupancyColor('MEDIUM') }]}>
                    {getOccupancyText('MEDIUM')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => handleTrackRoute(busRoute)}
                activeOpacity={0.8}
              >
                <Text style={styles.trackButtonText}>TRACK LIVE ▶</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
    padding: SPACING.MD,
  },
  headerTitle: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  routeText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.WHITE,
    marginTop: SPACING.XS,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.MD,
  },
  routeCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  routeNumber: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  operatorName: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
  fareContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 20,
  },
  fareText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  routeDetails: {
    marginBottom: SPACING.MD,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  detailLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  nextBusTime: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  occupancyText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  noRoutesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  noRoutesText: {
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  suggestionText: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});