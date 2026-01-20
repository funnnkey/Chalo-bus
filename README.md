# Chalo Bus

A React Native mobile application for tracking and searching inter-city buses in India.

## Features

- 🔍 **Spot Tab**: Search for buses by city routes or bus number
- 📋 **Routes Tab**: View recent journeys
- 🗺️ **Stations Tab**: View station locations on map
- 📱 Real-time city autocomplete with 50+ Indian cities
- 💾 SQLite-based search history
- 🎨 High contrast UI optimized for sunlight readability

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Database**: SQLite (expo-sqlite)
- **Backend**: Firebase Realtime Database
- **Maps**: React Native Maps

## Installation

```bash
# Install dependencies
npm install

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
├── config/           # Configuration files (Firebase, etc.)
├── db/               # SQLite database functions
├── navigation/       # Navigation setup
├── screens/          # Screen components
├── store/            # Redux store and slices
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
```

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
