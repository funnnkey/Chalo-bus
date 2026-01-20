# Quick Start Guide - Chalo Bus

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)
- **Expo Go app** on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd chalo-bus
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

   This will install all required packages including:
   - React Native & Expo
   - React Navigation
   - Redux Toolkit
   - SQLite
   - Firebase
   - And more...

## Running the App

### Option 1: Using Expo Go (Recommended for quick testing)

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Scan the QR code**:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code

3. The app will load on your device!

### Option 2: Using Emulator/Simulator

#### Android Emulator
1. Ensure Android Studio is installed with an emulator
2. Start an emulator
3. Run:
   ```bash
   npm run android
   ```

#### iOS Simulator (Mac only)
1. Ensure Xcode is installed
2. Run:
   ```bash
   npm run ios
   ```

### Option 3: Web Browser

```bash
npm run web
```

The app will open in your default browser at `http://localhost:8081`

## First Launch

On first launch, the app will:
1. Initialize SQLite database
2. Create the `search_history` table
3. Seed 5 mock journey records
4. Display the Spot tab (Home screen)

## Testing the App

### Basic Flow

1. **Search for buses**:
   - Tap the FROM field
   - Type "Delhi" - select from dropdown
   - Tap the TO field
   - Type "Agra" - select from dropdown
   - Tap "SEARCH BUSES"
   - You'll navigate to SearchResults screen

2. **Search by bus number**:
   - Scroll down to "BUS NUMBER" field
   - Type "502-A"
   - Tap "SEARCH"
   - You'll navigate to BusTracking screen

3. **Use Recent Journeys**:
   - Scroll to "Recent Journeys" section
   - Tap on any journey (e.g., "Delhi → Agra (Today)")
   - The search will be repeated automatically

4. **Navigate tabs**:
   - Tap the "Routes" tab (📋)
   - Tap the "Stations" tab (🗺️)
   - Tap back to "Spot" tab (🔍)

## Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Clear Cache

If you encounter issues:
```bash
npx expo start -c
```

## Project Structure at a Glance

```
chalo-bus/
├── App.tsx                    # Main app entry
├── src/
│   ├── components/           # Reusable UI components
│   ├── screens/              # Screen components
│   ├── navigation/           # Navigation setup
│   ├── store/                # Redux store
│   ├── db/                   # SQLite database
│   ├── config/               # Configuration (Firebase)
│   ├── types/                # TypeScript types
│   └── utils/                # Constants and utilities
└── package.json              # Dependencies
```

## Key Features to Test

✅ **City Autocomplete**: Type in FROM/TO fields to see real-time city suggestions

✅ **Search History**: Your searches are saved and appear in "Recent Journeys"

✅ **Persistent Data**: Close and reopen the app - your history is still there!

✅ **Navigation**: Smooth transitions between tabs and screens

✅ **High Contrast UI**: Designed to be readable in bright sunlight

## Troubleshooting

### App won't start

1. Clear node_modules:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Expo cache:
   ```bash
   npx expo start -c
   ```

### Database errors

The app will automatically reinitialize the database on next launch.

### Type errors

Run type checking to see specific errors:
```bash
npm run typecheck
```

### Dependencies issues

Reinstall dependencies:
```bash
npm install
```

## Next Steps

After testing the basic flow:

1. **Explore the Code**:
   - Start with `src/screens/SpotScreen.tsx`
   - Check out `src/store/searchSlice.ts` for state management
   - Look at `src/db/database.ts` for SQLite operations

2. **Read Documentation**:
   - `ARCHITECTURE.md` - Detailed architecture overview
   - `TESTING.md` - Complete testing guide
   - `README.md` - Project overview

3. **Customize**:
   - Update Firebase credentials in `src/config/firebase.ts`
   - Add more cities in `src/utils/constants.ts`
   - Modify colors in `src/utils/constants.ts`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run in web browser |
| `npm run typecheck` | Check TypeScript types |
| `npm run lint` | Run ESLint |

## Support

For issues or questions:
1. Check `TESTING.md` for known limitations
2. Review `ARCHITECTURE.md` for implementation details
3. Check the console logs for error messages

## What's Next?

This is the initial setup with the Spot tab UI. Future tasks will include:

- 🚌 Implementing actual bus search results
- 📍 Live bus tracking with GPS
- 🗺️ Map integration in Stations tab
- 🔥 Firebase Realtime Database integration
- 🔔 Push notifications
- 👤 User authentication
- 🌐 Multi-language support

Happy coding! 🚀
