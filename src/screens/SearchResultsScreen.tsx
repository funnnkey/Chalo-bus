import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchResultsNavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;

interface BusResult {
  busNumber: string;
  operatorName: string;
  departure: string;
  arrival: string;
  fare: number;
  bayNumber: string;
}

export const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsRouteProp>();
  const navigation = useNavigation<SearchResultsNavigationProp>();
  const { fromCity, toCity } = route.params;

  const busResults = useMemo<BusResult[]>(() => {
    return [
      {
        busNumber: '502-A',
        operatorName: 'UPSRTC',
        departure: '09:00 AM',
        arrival: '03:30 PM',
        fare: 250,
        bayNumber: '4',
      },
      {
        busNumber: '112-B',
        operatorName: 'State Transport',
        departure: '10:15 AM',
        arrival: '05:00 PM',
        fare: 220,
        bayNumber: '2',
      },
      {
        busNumber: 'X15-EXP',
        operatorName: 'Private Express',
        departure: '11:00 AM',
        arrival: '04:45 PM',
        fare: 320,
        bayNumber: '1',
      },
    ];
  }, []);

  const handleTrackBus = (bus: BusResult) => {
    navigation.navigate('BusTracking', {
      busNumber: bus.busNumber,
      operatorName: bus.operatorName,
      fromCity,
      toCity,
      departure: bus.departure,
      arrival: bus.arrival,
      fare: bus.fare,
      bayNumber: bus.bayNumber,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SEARCH RESULTS</Text>
        <Text style={styles.routeText}>
          {fromCity} → {toCity}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {busResults.map((bus) => (
          <View key={bus.busNumber} style={styles.busCard}>
            <View style={styles.busCardHeader}>
              <Text style={styles.busOperator}>{bus.operatorName}</Text>
              <Text style={styles.busNumber}>{bus.busNumber}</Text>
            </View>

            <View style={styles.busDetailsRow}>
              <Text style={styles.busDetailLabel}>Departure:</Text>
              <Text style={styles.busDetailValue}>{bus.departure}</Text>
            </View>
            <View style={styles.busDetailsRow}>
              <Text style={styles.busDetailLabel}>Arrival:</Text>
              <Text style={styles.busDetailValue}>{bus.arrival}</Text>
            </View>
            <View style={styles.busDetailsRow}>
              <Text style={styles.busDetailLabel}>Fare:</Text>
              <Text style={styles.busDetailValue}>₹{bus.fare}</Text>
            </View>
            <View style={styles.busDetailsRow}>
              <Text style={styles.busDetailLabel}>Bay:</Text>
              <Text style={styles.busDetailValue}>{bus.bayNumber}</Text>
            </View>

            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => handleTrackBus(bus)}
              activeOpacity={0.8}
            >
              <Text style={styles.trackButtonText}>TRACK▶</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  busCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    elevation: 2,
    marginBottom: SPACING.MD,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  busCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  busDetailLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
  },
  busDetailValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  busDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  busNumber: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  busOperator: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: COLORS.LIGHT_GRAY,
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
  },
  routeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    marginTop: SPACING.XS,
  },
  scrollContent: {
    padding: SPACING.MD,
  },
  scrollView: {
    flex: 1,
  },
  trackButton: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    marginTop: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  trackButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
});
