import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

export const RoutesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ROUTES</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>📋</Text>
        <Text style={styles.placeholderTitle}>Recent Journeys</Text>
        <Text style={styles.placeholderSubtitle}>
          Your recent bus routes will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.LIGHT_GRAY,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.LG,
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
  placeholderSubtitle: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.BODY,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  placeholderTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    marginBottom: SPACING.SM,
  },
});
