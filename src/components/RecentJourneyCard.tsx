import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchHistory } from '../types';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface RecentJourneyCardProps {
  journey: SearchHistory;
  onPress: () => void;
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const RecentJourneyCard: React.FC<RecentJourneyCardProps> = ({
  journey,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.routeContainer}>
        <Text style={styles.routeText}>
          {journey.fromCity} → {journey.toCity}
        </Text>
      </View>
      <View style={styles.metaContainer}>
        <Text style={styles.timeText}>{formatTimeAgo(journey.lastSearched)}</Text>
        {journey.searchCount > 1 && (
          <Text style={styles.countText}>({journey.searchCount}x)</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.MEDIUM_GRAY,
  },
  routeContainer: {
    marginBottom: SPACING.XS,
  },
  routeText: {
    fontSize: FONT_SIZES.BODY,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  countText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
  },
});
