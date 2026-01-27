# Chalo Bus

A React Native mobile application for tracking and searching both inter-city and local government buses in India.

## Features

- 🔍 **Spot Tab**: Search for buses by city routes, bus stops, or bus number
- 📋 **Routes Tab**: View recent journeys
- 🗺️ **Stations Tab**: View station locations on map
- 🚌 **Local Bus Search**: Find buses between bus stops (Delhi, Mumbai)
- 📱 Real-time city autocomplete with 50+ Indian cities
- 🔔 **Smart Notifications**: Get alerts when your bus is approaching
- 📍 **GPS Tracking**: Real-time location tracking and arrival predictions
- 💾 SQLite-based search history with offline caching
- 🎨 High contrast UI optimized for sunlight readability
- 🌐 **Multi-City Support**: Delhi and Mumbai local buses

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: SQLite (expo-sqlite) + AsyncStorage
- **Backend**: Firebase Realtime Database
- **Maps**: React Native Maps
- **Location**: Expo Location
- **Notifications**: Expo Notifications
- **Offline Storage**: AsyncStorage for caching

## Installation

```bash
# Install dependencies
npm install

# Install new dependencies for enhanced features
npm install @react-native-async-storage/async-storage expo-location

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── BusStopDropdown.tsx    # Bus stop search dropdown
│   └── ...
├── config/           # Configuration files (Firebase, etc.)
├── db/               # SQLite database functions
├── navigation/       # Navigation setup
├── screens/          # Screen components
│   ├── BusRouteResultsScreen.tsx  # Local bus routes
│   └── ...
├── services/         # Business logic services
│   ├── NotificationService.ts     # Push notifications
│   ├── GPSTrackingService.ts      # Real-time GPS
│   └── OfflineStorageService.ts   # Offline caching
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
    ├── delhiBusData.ts        # Delhi bus stops & routes
    ├── mumbaiBusData.ts       # Mumbai bus stops & routes
    └── cityService.ts         # Multi-city management
```

## New Features Added

### 🚌 Local Bus Tracking
- **Bus Stop Search**: Search between specific bus stops (e.g., Kashmiri Gate to Laxmi Nagar)
- **Live Arrival Times**: "Next bus in 3 minutes" with real-time updates
- **Route Information**: Complete route with all stops, timings, and fares
- **Bus Occupancy**: Shows if bus is crowded, moderate, or has seats available

### 🔔 Smart Notifications
- **Arrival Alerts**: Get notified when your bus is approaching your stop
- **Customizable Alerts**: Choose notification, sound, vibration, or all
- **Background Tracking**: Works even when app is in background

### 📍 GPS & Real-time Tracking
- **Live Location**: Real-time bus location tracking
- **Distance Calculation**: Shows exact distance to your destination
- **Route Progress**: Visual timeline showing completed, current, and upcoming stops

### 🌐 Multi-City Support
- **Delhi**: 15+ major bus stops, 4 DTC routes with live data
- **Mumbai**: BEST bus routes and stops
- **Expandable**: Easy to add more cities

### 💾 Offline Features
- **Data Caching**: Works offline with cached route data
- **Smart Sync**: Auto-refreshes data every 24 hours
- **Search History**: Persistent search history across app restarts

## Usage Examples

### For Local Buses (Delhi/Mumbai)
1. Toggle to "LOCAL BUSES" mode
2. Search "Kashmiri Gate" → "Laxmi Nagar"
3. See available routes (Route 34, Route 405)
4. Get live timing: "Next bus: 3 min"
5. Track live with GPS alerts

### For Inter-City Buses
1. Toggle to "INTER-CITY" mode
2. Search "Delhi" → "Agra"
3. View available operators and timings
4. Track journey with live updates

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

## Color Scheme

- **Primary**: Deep Blue (#003D7A)
- **Background**: Light Gray (#F5F5F5)
- **Text**: Black (#000000)
- **Alert**: Red (#D32F2F)

## Requirements

- Node.js 18+
- Expo CLI
- iOS 14+ / Android API 24+

## License

Private - All rights reserved
