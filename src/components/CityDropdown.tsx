import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { City } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface CityDropdownProps {
  cities: City[];
  searchQuery: string;
  onSelectCity: (city: string) => void;
  visible: boolean;
  onClose: () => void;
}

export const CityDropdown: React.FC<CityDropdownProps> = ({
  cities,
  searchQuery,
  onSelectCity,
  visible,
  onClose,
}) => {
  const filteredCities = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return cities
      .filter(city => city.name.toLowerCase().includes(query))
      .slice(0, 5);
  }, [cities, searchQuery]);

  if (!visible || filteredCities.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdown}>
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelectCity(item.name);
                  onClose();
                }}
              >
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.stateName}>{item.state}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  cityName: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    elevation: 5,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    borderBottomColor: COLORS.LIGHT_GRAY,
    borderBottomWidth: 1,
    padding: SPACING.MD,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.MD,
  },
  stateName: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.XS,
  },
});
