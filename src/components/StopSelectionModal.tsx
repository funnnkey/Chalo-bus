import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RouteStop, AlarmConfig } from '../types';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

interface StopSelectionModalProps {
  visible: boolean;
  stops: RouteStop[];
  selectedStopIndex?: number;
  onStopSelect: (stop: RouteStop, index: number) => void;
  onClose: () => void;
}

export const StopSelectionModal: React.FC<StopSelectionModalProps> = ({
  visible,
  stops,
  selectedStopIndex,
  onStopSelect,
  onClose,
}) => {
  const handleStopSelect = (stop: RouteStop, index: number) => {
    onStopSelect(stop, index);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Alarm Stop</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.stopsList} showsVerticalScrollIndicator={false}>
            {stops.map((stop, index) => {
              const isSelected = index === selectedStopIndex;
              const isLast = index === stops.length - 1;

              return (
                <TouchableOpacity
                  key={stop.id}
                  style={[
                    styles.stopItem,
                    isSelected && styles.stopItemSelected,
                    isLast && styles.stopItemLast,
                  ]}
                  onPress={() => handleStopSelect(stop, index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stopInfo}>
                    <Text style={[
                      styles.stopName,
                      isSelected && styles.stopNameSelected,
                    ]}>
                      {stop.stopName}
                      {index === 0 && ' (START)'}
                      {isLast && ' (END)'}
                    </Text>
                    <Text style={[
                      styles.stopTime,
                      isSelected && styles.stopTimeSelected,
                    ]}>
                      Expected: {stop.expectedTime}
                    </Text>
                    {stop.distance && (
                      <Text style={[
                        styles.stopDistance,
                        isSelected && styles.stopDistanceSelected,
                      ]}>
                        {stop.distance} km from previous
                      </Text>
                    )}
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>
              Choose which stop you want to be alerted about
            </Text>
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
    maxHeight: '70%',
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
  stopsList: {
    maxHeight: 400,
  },
  stopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  stopItemSelected: {
    backgroundColor: `${COLORS.PRIMARY}10`,
  },
  stopItemLast: {
    borderBottomWidth: 0,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  stopNameSelected: {
    color: COLORS.PRIMARY,
  },
  stopTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  stopTimeSelected: {
    color: COLORS.PRIMARY,
  },
  stopDistance: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  stopDistanceSelected: {
    color: COLORS.PRIMARY,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.MEDIUM_GRAY,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  modalFooterText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});