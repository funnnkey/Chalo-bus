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
  placeholderText: {
    fontSize: 64,
    marginBottom: SPACING.MD,
  },
  placeholderTitle: {
    fontSize: FONT_SIZES.HEADER,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  placeholderSubtitle: {
    fontSize: FONT_SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});
