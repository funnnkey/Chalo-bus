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
  busCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  busCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  busOperator: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  busNumber: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  busDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  busDetailLabel: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  busDetailValue: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    marginTop: SPACING.MD,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
});
