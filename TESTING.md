# Testing Guide for Chalo Bus

## Acceptance Criteria Checklist

### ✅ Project Setup
- [x] React Native app with Expo initialized
- [x] TypeScript configuration complete
- [x] Core dependencies installed:
  - react-navigation
  - redux-toolkit
  - react-native-maps
  - expo-sqlite
  - firebase
- [x] Folder structure created:
  - src/screens
  - src/services
  - src/store
  - src/db
  - src/components
  - src/navigation
  - src/types
  - src/utils
  - src/config

### ✅ Bottom Tab Navigation
- [x] 3 tabs implemented:
  - Spot (🔍)
  - Routes (📋)
  - Stations (🗺️)
- [x] Active tab color: Deep Blue (#003D7A)
- [x] Inactive tab color: Light Gray
- [x] Smooth tab switching

### ✅ Home Screen (Spot Tab) UI
- [x] Header with "CHALO BUS" title
- [x] Settings icon in header
- [x] FROM city input with label
- [x] TO city input with label
- [x] "SEARCH BUSES" button (full width)
- [x] "OR" divider
- [x] Bus number input field
- [x] "SEARCH" button for bus number
- [x] Recent Journeys section
- [x] Recent journey cards (displaying mock data)

### ✅ City Autocomplete
- [x] 55+ Indian cities in list
- [x] Real-time filtering as user types
- [x] Shows top 5 matching cities
- [x] Modal dropdown for city selection
- [x] Displays city name and state

### ✅ State Management
- [x] Redux store configured
- [x] searchSlice with: fromCity, toCity, busNumber, searchHistory
- [x] uiSlice with: activeTab, loading
- [x] Typed hooks: useAppDispatch, useAppSelector

### ✅ SQLite Integration
- [x] Database initialization function
- [x] search_history table created
- [x] Schema includes: id, from_city, to_city, search_count, last_searched
- [x] Query to fetch recent searches
- [x] Sync Redux with SQLite on app start
- [x] Mock data seeding on first launch

### ✅ Firebase Configuration
- [x] Firebase config file created
- [x] Test/mock credentials configured
- [x] Database reference paths defined

### ✅ Styling & Design
- [x] High contrast design
- [x] Deep Blue (#003D7A) color scheme
- [x] Large readable text (16pt+ body)
- [x] Consistent spacing (8px, 16px)
- [x] SafeAreaView on all screens

### ✅ Navigation Logic
- [x] "SEARCH BUSES" navigates to SearchResults
- [x] "SEARCH" (bus number) navigates to BusTracking
- [x] Recent journey tap repeats search
- [x] Shell screens created

### ✅ Code Quality
- [x] Full TypeScript types
- [x] ESLint configuration
- [x] Reusable components created
- [x] TypeScript compilation without errors

## Manual Testing Checklist

### 1. App Launch
- [ ] App starts without errors
- [ ] Loading screen displays
- [ ] Database initializes successfully
- [ ] Mock data seeds on first launch
- [ ] App navigates to Spot tab

### 2. Navigation Testing

#### Bottom Tabs
- [ ] Tap on Spot tab - should display Home screen
- [ ] Tap on Routes tab - should display placeholder screen with 📋 icon
- [ ] Tap on Stations tab - should display placeholder screen with 🗺️ icon
- [ ] Tab icons display correctly
- [ ] Active tab shows Deep Blue color (#003D7A)
- [ ] Inactive tabs show gray color
- [ ] Smooth transitions between tabs

#### Stack Navigation
- [ ] Enter FROM and TO cities, tap "SEARCH BUSES"
  - Should navigate to SearchResults screen
  - Should display selected route
- [ ] Enter bus number, tap "SEARCH"
  - Should navigate to BusTracking screen
  - Should display bus number
- [ ] Back button returns to previous screen

### 3. City Autocomplete Testing

#### FROM City Field
- [ ] Tap on FROM field - keyboard opens
- [ ] Type "del" - dropdown shows Delhi
- [ ] Type "mum" - dropdown shows Mumbai
- [ ] Type "ban" - dropdown shows Bangalore
- [ ] Select city - field populates with city name
- [ ] Dropdown closes after selection
- [ ] Shows max 5 cities in dropdown

#### TO City Field
- [ ] Same tests as FROM city field
- [ ] Both dropdowns work independently

#### Edge Cases
- [ ] Type non-existent city - no dropdown shows
- [ ] Type empty string - no dropdown
- [ ] Tap outside dropdown - closes without selection
- [ ] Case-insensitive search (TEST: "DELHI" should match "Delhi")

### 4. Search Functionality

#### City-to-City Search
- [ ] Both fields empty - "SEARCH BUSES" button disabled (gray)
- [ ] Only FROM filled - button disabled
- [ ] Only TO filled - button disabled
- [ ] Both filled - button enabled (blue)
- [ ] Tap "SEARCH BUSES" - navigates to SearchResults
- [ ] Search adds entry to Recent Journeys

#### Bus Number Search
- [ ] Field empty - "SEARCH" button disabled
- [ ] Enter bus number - button enabled
- [ ] Tap "SEARCH" - navigates to BusTracking
- [ ] Accepts various formats: "502-A", "123", "AB-456"

### 5. Recent Journeys

#### Display
- [ ] Shows up to 5 recent searches
- [ ] Each card shows: "CityA → CityB"
- [ ] Shows time ago: "Today", "Yesterday", "3d ago"
- [ ] Shows search count if >1: "(3x)"

#### Interaction
- [ ] Tap on recent journey card
- [ ] FROM and TO fields populate
- [ ] Navigates to SearchResults
- [ ] Updates last_searched timestamp
- [ ] Increments search_count

### 6. UI/UX Testing

#### Colors
- [ ] Primary color #003D7A used for header, buttons
- [ ] White backgrounds on cards
- [ ] Light gray screen background
- [ ] Text is readable in bright conditions

#### Typography
- [ ] Header title is 24pt
- [ ] Section labels are 20pt
- [ ] Body text is 16pt
- [ ] All text is readable

#### Spacing
- [ ] Consistent padding around elements
- [ ] Cards have proper margins
- [ ] Buttons have adequate touch targets

#### Responsiveness
- [ ] Test on small screen (iPhone SE)
- [ ] Test on large screen (iPad)
- [ ] SafeAreaView handles notches correctly
- [ ] Landscape mode (if supported)

### 7. Database Testing

#### SQLite Operations
- [ ] Open app first time - 5 mock entries created
- [ ] Search new route - entry added to database
- [ ] Search existing route - search_count increments
- [ ] Close and reopen app - data persists
- [ ] Recent journeys load from SQLite

#### Data Persistence
- [ ] Perform search
- [ ] Force close app
- [ ] Reopen app
- [ ] Recent journey should still be there

### 8. Error Handling

- [ ] No internet connection - app still works (cities are local)
- [ ] Database error - app shows error message
- [ ] Invalid input - handled gracefully
- [ ] Empty states display correctly

### 9. Performance

- [ ] App starts in < 3 seconds
- [ ] City autocomplete filters in < 100ms
- [ ] Tab switches are immediate
- [ ] No lag when typing
- [ ] Smooth scrolling in Recent Journeys

### 10. Platform-Specific Testing

#### Android
- [ ] Back button works correctly
- [ ] Keyboard dismisses properly
- [ ] Status bar color correct
- [ ] App runs on Android API 24+

#### iOS
- [ ] Swipe back gesture works
- [ ] Safe area insets correct
- [ ] Keyboard dismisses properly
- [ ] App runs on iOS 14+

#### Web (Optional)
- [ ] App renders in browser
- [ ] Navigation works
- [ ] Responsive design

## Automated Testing Commands

```bash
# Type checking
npm run typecheck

# Should output: No errors

# Linting
npm run lint

# Should output: No errors or warnings
```

## Known Limitations

1. **Firebase**: Using test credentials - needs real credentials for production
2. **Maps**: React Native Maps installed but not yet integrated in Stations tab
3. **Search Results**: Placeholder screen - actual bus data not implemented
4. **Bus Tracking**: Placeholder screen - live tracking not implemented
5. **Routes Tab**: Placeholder screen - functionality not implemented
6. **Stations Tab**: Placeholder screen - map view not implemented
7. **Settings**: Icon present but no functionality
8. **Offline Mode**: Not fully implemented
9. **i18n**: Not implemented (English only)

## Expected Behavior

### Successful App Launch
1. App shows loading screen with "Loading Chalo Bus..." message
2. Database initializes
3. If first launch, 5 mock journeys are seeded
4. App displays Spot tab with:
   - "CHALO BUS" header
   - Settings icon
   - FROM and TO input fields
   - SEARCH BUSES button
   - OR divider
   - Bus number field
   - SEARCH button
   - Recent Journeys section with 5 entries

### Successful Search Flow
1. User types in FROM field: "Delhi"
2. Dropdown appears showing "Delhi, Delhi"
3. User selects Delhi
4. User types in TO field: "Agra"
5. Dropdown appears showing "Agra, Uttar Pradesh"
6. User selects Agra
7. SEARCH BUSES button becomes enabled (blue)
8. User taps SEARCH BUSES
9. App navigates to SearchResults screen
10. SearchResults shows "Delhi → Agra"
11. Entry is saved to database
12. User taps back
13. Recent Journeys now shows "Delhi → Agra (Today)" at the top

## Reporting Issues

If tests fail, please provide:
- Device/Emulator details
- OS version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs if available
