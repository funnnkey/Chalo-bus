import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initDatabase, getSearchHistory } from './src/db/database';
import { seedMockData } from './src/db/seedData';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from './src/utils/constants';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = async () => {
    try {
      await initDatabase();

      const existingHistory = await getSearchHistory();
      if (existingHistory.length === 0) {
        await seedMockData();
      }

      setIsReady(true);
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize app');
      setIsReady(true);
    }
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading Chalo Bus...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
        <StatusBar style="light" />
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: COLORS.ALERT_RED,
    fontSize: 16,
    padding: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
    marginTop: 16,
  },
});
