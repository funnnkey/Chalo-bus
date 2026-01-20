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
} from '../store/searchSlice';
import {
  SearchInput,
  CityDropdown,
  RecentJourneyCard,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, INDIAN_CITIES } from '../utils/constants';
import { getSearchHistory, addSearchHistory } from '../db/database';
import { RootStackParamList } from '../types';

type SpotScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SpotScreen: React.FC = () => {
  const navigation = useNavigation<SpotScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { fromCity, toCity, busNumber, searchHistory } = useAppSelector(
    (state) => state.search
  );

  const [fromCityDropdownVisible, setFromCityDropdownVisible] = useState(false);
  const [toCityDropdownVisible, setToCityDropdownVisible] = useState(false);

  const loadSearchHistory = async () => {
    const history = await getSearchHistory();
    dispatch(setSearchHistory(history));
  };

  useEffect(() => {
    loadSearchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchBuses = async () => {
    if (fromCity && toCity) {
      await addSearchHistory(fromCity, toCity);
      await loadSearchHistory();
      navigation.navigate('SearchResults', { fromCity, toCity });
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
    dispatch(setFromCity(from));
    dispatch(setToCity(to));
    await addSearchHistory(from, to);
    await loadSearchHistory();
    navigation.navigate('SearchResults', { fromCity: from, toCity: to });
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

          <TouchableOpacity
            style={[
              styles.searchButton,
              (!fromCity || !toCity) && styles.searchButtonDisabled,
            ]}
            onPress={handleSearchBuses}
            disabled={!fromCity || !toCity}
          >
            <Text style={styles.searchButtonText}>SEARCH BUSES</Text>
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
  busNumberSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: SPACING.MD,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    backgroundColor: COLORS.LIGHT_GRAY,
    flex: 1,
  },
  dividerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },
  dividerLine: {
    backgroundColor: COLORS.MEDIUM_GRAY,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    marginHorizontal: SPACING.MD,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.MD,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.TITLE,
    fontWeight: 'bold',
  },
  recentSection: {
    marginTop: SPACING.LG,
    padding: SPACING.MD,
  },
  scrollView: {
    flex: 1,
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    marginTop: SPACING.SM,
    padding: SPACING.MD,
  },
  searchButtonDisabled: {
    backgroundColor: COLORS.MEDIUM_GRAY,
  },
  searchButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
  },
  searchSection: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    elevation: 2,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.MD,
  },
  settingsButton: {
    padding: SPACING.SM,
  },
  settingsIcon: {
    fontSize: FONT_SIZES.HEADER,
  },
});
