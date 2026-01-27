import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import { BusStop } from '../utils/delhiBusData';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface BusStopDropdownProps {
  stops: BusStop[];
  searchQuery: string;
  onSelectStop: (stopName: string) => void;
  visible: boolean;
  onClose: () => void;
}

export const BusStopDropdown: React.FC<BusStopDropdownProps> = ({
  stops,
  searchQuery,
  onSelectStop,
  visible,
  onClose,
}) => {
  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStopItem = ({ item }: { item: BusStop }) => (
    <TouchableOpacity
      style={styles.stopItem}
      onPress={() => {
        onSelectStop(item.name);
        onClose();
      }}
    >
      <Text style={styles.stopName}>{item.name}</Text>
      <Text style={styles.stopArea}>{item.area}</Text>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
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
            data={filteredStops}
            renderItem={renderStopItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    maxHeight: 300,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  list: {
    maxHeight: 300,
  },
  stopItem: {
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  stopName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  stopArea: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
  },
});