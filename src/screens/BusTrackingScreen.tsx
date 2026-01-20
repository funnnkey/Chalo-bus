import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

type BusTrackingRouteProp = RouteProp<RootStackParamList, 'BusTracking'>;

export const BusTrackingScreen: React.FC = () => {
  const route = useRoute<BusTrackingRouteProp>();
  const { busNumber } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BUS TRACKING</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.busNumberText}>Bus #{busNumber}</Text>
        <Text style={styles.placeholderText}>📍</Text>
        <Text style={styles.placeholderSubtitle}>
          Live tracking information will appear here
        </Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  busNumberText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.LG,
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  placeholderSubtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
