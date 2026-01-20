# Chalo Bus - Architecture Documentation

## Application Flow

### 1. App Initialization (App.tsx)
```
App Launch
    ↓
Initialize SQLite Database
    ↓
Check for existing search history
    ↓
Seed mock data (if first launch)
    ↓
Render Navigation
```

### 2. Navigation Structure

```
RootNavigator (Stack)
    ├── MainTabs (Bottom Tabs)
    │   ├── Spot Tab (Home/Search)
    │   ├── Routes Tab (Recent Journeys)
    │   └── Stations Tab (Map View)
    ├── SearchResults Screen
    └── BusTracking Screen
```

### 3. Spot Screen (Home) Flow

```
User Input (FROM/TO City)
    ↓
City Autocomplete Filter
    ↓
Select City from Dropdown
    ↓
Tap "SEARCH BUSES"
    ↓
Save to Search History (SQLite)
    ↓
Navigate to SearchResults Screen

OR

User Input (Bus Number)
    ↓
Tap "SEARCH"
    ↓
Navigate to BusTracking Screen
```

### 4. Data Flow

```
Component
    ↓
useAppDispatch (Redux Action)
    ↓
Redux Slice Reducer
    ↓
State Updated
    ↓
useAppSelector (Get Updated State)
    ↓
Re-render Component

Persistence:
Redux State ←→ SQLite Database
```

### 5. Component Hierarchy

```
SpotScreen
    ├── SearchInput (FROM city)
    ├── CityDropdown (City selection modal)
    ├── SearchInput (TO city)
    ├── CityDropdown (City selection modal)
    ├── Button (SEARCH BUSES)
    ├── SearchInput (Bus Number)
    ├── Button (SEARCH)
    └── RecentJourneyCard[] (Search history list)
```

### 6. State Management

```
Redux Store
    ├── searchSlice
    │   ├── fromCity: string
    │   ├── toCity: string
    │   ├── busNumber: string
    │   └── searchHistory: SearchHistory[]
    └── uiSlice
        ├── activeTab: string
        └── loading: boolean
```

### 7. Database Schema

```
search_history
    ├── id (INTEGER PRIMARY KEY)
    ├── from_city (TEXT)
    ├── to_city (TEXT)
    ├── search_count (INTEGER)
    └── last_searched (DATETIME)
```

## Key Features Implemented

### ✅ Completed
- React Native app with Expo
- TypeScript configuration
- Bottom tab navigation (3 tabs)
- Home screen (Spot tab) with full UI
- City autocomplete (55+ Indian cities)
- Search input components
- Redux state management
- SQLite database with search history
- Mock data seeding
- Firebase configuration (test credentials)
- High contrast UI theme
- Navigation to placeholder screens
- Recent journeys display
- Responsive design

### 🚧 Future Implementation
- Firebase Realtime Database integration
- React Native Maps integration
- Actual bus search results
- Live bus tracking
- User authentication
- Multi-language support (i18n)
- Push notifications
- Offline mode
- Route optimization

## File Structure

```
chalo-bus/
├── App.tsx                          # Main app entry point
├── index.ts                         # Expo entry file
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── .eslintrc.js                     # ESLint configuration
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── ARCHITECTURE.md                  # This file
├── assets/                          # Images and assets
└── src/
    ├── components/                  # Reusable components
    │   ├── SearchInput.tsx
    │   ├── CityDropdown.tsx
    │   ├── RecentJourneyCard.tsx
    │   └── index.ts
    ├── config/                      # Configuration files
    │   └── firebase.ts
    ├── db/                          # Database layer
    │   ├── database.ts
    │   └── seedData.ts
    ├── navigation/                  # Navigation setup
    │   ├── RootNavigator.tsx
    │   └── BottomTabNavigator.tsx
    ├── screens/                     # Screen components
    │   ├── SpotScreen.tsx
    │   ├── RoutesScreen.tsx
    │   ├── StationsScreen.tsx
    │   ├── SearchResultsScreen.tsx
    │   ├── BusTrackingScreen.tsx
    │   └── index.ts
    ├── services/                    # External services (future)
    ├── store/                       # Redux store
    │   ├── index.ts
    │   ├── hooks.ts
    │   ├── searchSlice.ts
    │   └── uiSlice.ts
    ├── types/                       # TypeScript types
    │   └── index.ts
    └── utils/                       # Utility functions
        └── constants.ts
```

## Color Theme

| Color Name     | Hex Code  | Usage                          |
|----------------|-----------|--------------------------------|
| PRIMARY        | #003D7A   | Headers, buttons, active tabs  |
| WHITE          | #FFFFFF   | Backgrounds, text on primary   |
| LIGHT_GRAY     | #F5F5F5   | Screen backgrounds             |
| MEDIUM_GRAY    | #CCCCCC   | Borders, inactive states       |
| DARK_GRAY      | #666666   | Secondary text                 |
| ALERT_RED      | #D32F2F   | Errors, alerts                 |
| TEXT_PRIMARY   | #000000   | Main text                      |
| TEXT_SECONDARY | #666666   | Supporting text                |

## Testing the App

### Prerequisites
- Node.js 18+
- Expo CLI
- Expo Go app (for mobile testing)

### Running the App

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS**
   ```bash
   npm run ios
   ```

4. **Run on Web**
   ```bash
   npm run web
   ```

### Development Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Clear cache and restart
expo start -c
```

## Performance Considerations

- **Bundle Size**: Currently optimized for <15MB target
- **Offline Support**: City list is hardcoded (no internet needed)
- **Database**: SQLite for fast local storage
- **State Management**: Redux Toolkit for efficient state updates
- **Navigation**: React Navigation with lazy loading support

## Security Notes

⚠️ **Firebase Configuration**: Currently uses test/mock credentials. Replace with actual Firebase project credentials before production deployment.

## Accessibility

- Large, readable text (minimum 16pt for body)
- High contrast colors for sunlight visibility
- Touch targets sized appropriately
- SafeAreaView for notch support
- Clear visual hierarchy
