import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setFromCity,
  setToCity,
  setBusNumber,
  setSearchHistory,
  setFromStop,
  setToStop,
  setSearchType,
} from '../store/searchSlice';
import {
  SearchInput,
  CityDropdown,
  BusStopDropdown,
  RecentJourneyCard,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, INDIAN_CITIES } from '../utils/constants';
import { DELHI_BUS_STOPS, searchBusStops } from '../utils/delhiBusData';
import { getSearchHistory, addSearchHistory } from '../db/database';
import { RootStackParamList } from '../types';

type SpotScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SpotScreen: React.FC = () => {
  const navigation = useNavigation<SpotScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { fromCity, toCity, busNumber, searchHistory, fromStop, toStop, searchType } = useAppSelector(
    (state) => state.search
  );

  const [fromCityDropdownVisible, setFromCityDropdownVisible] = useState(false);
  const [toCityDropdownVisible, setToCityDropdownVisible] = useState(false);
  const [fromStopDropdownVisible, setFromStopDropdownVisible] = useState(false);
  const [toStopDropdownVisible, setToStopDropdownVisible] = useState(false);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    const history = await getSearchHistory();
    dispatch(setSearchHistory(history));
  };

  const handleSearchBuses = async () => {
    if (searchType === 'CITY' && fromCity && toCity) {
      await addSearchHistory(fromCity, toCity);
      await loadSearchHistory();
      navigation.navigate('SearchResults', { fromCity, toCity });
    } else if (searchType === 'STOP' && fromStop && toStop) {
      navigation.navigate('BusRouteResults', { fromStop, toStop });
    }
  };

  const handleSearchBusNumber = () => {
    if (busNumber) {
      navigation.navigate('BusTracking', {
        busNumber,
        operatorName: 'UPSRTC',
        fromCity: 'Delhi',
        toCity: 'Agra',
        departure: '09:00 AM',
        arrival: '03:30 PM',
        fare: 250,
        bayNumber: '4',
      });
    }
  };

  const handleRecentJourneyPress = async (from: string, to: string) => {
    if (searchType === 'CITY') {
      dispatch(setFromCity(from));
      dispatch(setToCity(to));
      await addSearchHistory(from, to);
      await loadSearchHistory();
      navigation.navigate('SearchResults', { fromCity: from, toCity: to });
    } else {
      dispatch(setFromStop(from));
      dispatch(setToStop(to));
      navigation.navigate('BusRouteResults', { fromStop: from, toStop: to });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CHALO BUS</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchTypeToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchType === 'CITY' && styles.toggleButtonActive,
              ]}
              onPress={() => dispatch(setSearchType('CITY'))}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  searchType === 'CITY' && styles.toggleButtonTextActive,
                ]}
              >
                INTER-CITY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                searchType === 'STOP' && styles.toggleButtonActive,
              ]}
              onPress={() => dispatch(setSearchType('STOP'))}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  searchType === 'STOP' && styles.toggleButtonTextActive,
                ]}
              >
                LOCAL BUSES
              </Text>
            </TouchableOpacity>
          </View>

          {searchType === 'CITY' ? (
            <>
              <SearchInput
                label="FROM:"
                value={fromCity}
                onChangeText={(text) => {
                  dispatch(setFromCity(text));
                  if (text) {
                    setFromCityDropdownVisible(true);
                  }
                }}
                placeholder="Enter city name"
                onFocus={() => {
                  if (fromCity) {
                    setFromCityDropdownVisible(true);
                  }
                }}
              />

              <CityDropdown
                cities={INDIAN_CITIES}
                searchQuery={fromCity}
                onSelectCity={(city) => {
                  dispatch(setFromCity(city));
                }}
                visible={fromCityDropdownVisible}
                onClose={() => setFromCityDropdownVisible(false)}
              />

              <SearchInput
                label="TO:"
                value={toCity}
                onChangeText={(text) => {
                  dispatch(setToCity(text));
                  if (text) {
                    setToCityDropdownVisible(true);
                  }
                }}
                placeholder="Enter city name"
                onFocus={() => {
                  if (toCity) {
                    setToCityDropdownVisible(true);
                  }
                }}
              />

              <CityDropdown
                cities={INDIAN_CITIES}
                searchQuery={toCity}
                onSelectCity={(city) => {
                  dispatch(setToCity(city));
                }}
                visible={toCityDropdownVisible}
                onClose={() => setToCityDropdownVisible(false)}
              />
            </>
          ) : (
            <>
              <SearchInput
                label="FROM STOP:"
                value={fromStop}
                onChangeText={(text) => {
                  dispatch(setFromStop(text));
                  if (text) {
                    setFromStopDropdownVisible(true);
                  }
                }}
                placeholder="Enter bus stop name"
                onFocus={() => {
                  if (fromStop) {
                    setFromStopDropdownVisible(true);
                  }
                }}
              />

              <BusStopDropdown
                stops={searchBusStops(fromStop)}
                searchQuery={fromStop}
                onSelectStop={(stop) => {
                  dispatch(setFromStop(stop));
                }}
                visible={fromStopDropdownVisible}
                onClose={() => setFromStopDropdownVisible(false)}
              />

              <SearchInput
                label="TO STOP:"
                value={toStop}
                onChangeText={(text) => {
                  dispatch(setToStop(text));
                  if (text) {
                    setToStopDropdownVisible(true);
                  }
                }}
                placeholder="Enter bus stop name"
                onFocus={() => {
                  if (toStop) {
                    setToStopDropdownVisible(true);
                  }
                }}
              />

              <BusStopDropdown
                stops={searchBusStops(toStop)}
                searchQuery={toStop}
                onSelectStop={(stop) => {
                  dispatch(setToStop(stop));
                }}
                visible={toStopDropdownVisible}
                onClose={() => setToStopDropdownVisible(false)}
              />
            </>
          )}

          <TouchableOpacity
            style={[
              styles.searchButton,
              (searchType === 'CITY' && (!fromCity || !toCity)) ||
              (searchType === 'STOP' && (!fromStop || !toStop))
                ? styles.searchButtonDisabled
                : null,
            ]}
            onPress={handleSearchBuses}
            disabled={
              (searchType === 'CITY' && (!fromCity || !toCity)) ||
              (searchType === 'STOP' && (!fromStop || !toStop))
            }
          >
            <Text style={styles.searchButtonText}>
              {searchType === 'CITY' ? 'SEARCH BUSES' : 'FIND ROUTES'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.busNumberSection}>
          <SearchInput
            label="BUS NUMBER:"
            value={busNumber}
            onChangeText={(text) => dispatch(setBusNumber(text))}
            placeholder="e.g., 502-A"
          />

          <TouchableOpacity
            style={[
              styles.searchButton,
              !busNumber && styles.searchButtonDisabled,
            ]}
            onPress={handleSearchBusNumber}
            disabled={!busNumber}
          >
            <Text style={styles.searchButtonText}>SEARCH</Text>
          </TouchableOpacity>
        </View>

        {searchHistory.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Journeys</Text>
            {searchHistory.map((journey) => (
              <RecentJourneyCard
                key={journey.id}
                journey={journey}
                onPress={() =>
                  handleRecentJourneyPress(journey.fromCity, journey.toCity)
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  settingsButton: {
    padding: SPACING.SM,
  },
  settingsIcon: {
    fontSize: FONT_SIZES.HEADER,
  },
  searchSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    marginTop: SPACING.MD,
    marginHorizontal: SPACING.MD,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.SM,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.MEDIUM_GRAY,
  },
  searchButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.MEDIUM_GRAY,
  },
  dividerText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginHorizontal: SPACING.MD,
  },
  busNumberSection: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    marginHorizontal: SPACING.MD,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentSection: {
    padding: SPACING.MD,
    marginTop: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  searchTypeToggle: {
    flexDirection: 'row',
    marginBottom: SPACING.MD,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  toggleButtonText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  toggleButtonTextActive: {
    color: COLORS.WHITE,
  },
});
