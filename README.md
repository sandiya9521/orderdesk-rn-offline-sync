# OrderDesk - Offline-Capable Order Management App

A React Native application demonstrating offline-first architecture with automatic synchronization capabilities. Built with TypeScript, Redux Toolkit, and Redux Thunk.

## Features

- ✅ **Order List Screen**: Display orders with title, amount, created date, and sync status
  - Pull-to-refresh functionality
  - Empty state with helpful message
  - Pending and failed sync count indicators
  - Optimized FlatList with extracted render functions
- ✅ **Create Order Screen**: Form with comprehensive validation
  - Title field: Required, 30 character maximum
  - Amount field: Required, numeric only (with decimal point support), positive numbers
  - Real-time input validation and filtering
  - Loading states and error handling
- ✅ **Edit Order Screen**: Edit existing records before they are synced
  - Same validation rules as create screen
  - Sync status display
  - Prevents editing of synced orders
- ✅ **Offline Support**: App works seamlessly without internet connectivity
- ✅ **Auto Sync**: Automatically syncs pending records when network is restored
- ✅ **Manual Sync**: "Sync Now" button for manual synchronization
- ✅ **Manual Retry**: Retry option for failed syncs on individual orders
- ✅ **Network Status**: Visual indicator when offline

## Technical Stack

- **React Native** 0.83.1 with TypeScript 5.8.3
- **React** 19.2.0
- **Redux Toolkit** 2.11.2 for state management
- **Redux Thunk** 3.1.0 for async operations
- **React Navigation** 7.x (Native Stack) for navigation
- **AsyncStorage** 2.2.0 for local persistence
- **NetInfo** 11.4.1 for network detection
- **React Native Safe Area Context** 5.6.2 for safe area handling

## Project Structure

```
orderdesk/
├── src/
│   ├── constants/               # App-wide constants
│   │   ├── colors.ts            # Centralized color palette
│   │   └── strings.ts           # Centralized UI strings
│   ├── components/              # Reusable UI components
│   │   ├── Button/
│   │   │   ├── index.tsx       # Button component
│   │   │   └── styles.ts       # Button styles
│   │   ├── Input/
│   │   │   ├── index.tsx       # Input component with error handling
│   │   │   └── styles.ts       # Input styles
│   │   ├── OrderCard/
│   │   │   ├── index.tsx       # Order card component
│   │   │   └── styles.ts       # Order card styles
│   │   └── NetworkStatusBar/
│   │       ├── index.tsx       # Network status indicator
│   │       └── styles.ts       # Network bar styles
│   ├── hooks/                   # Custom React hooks
│   │   └── useNetworkStatus.ts  # Network connectivity hook
│   ├── navigation/              # Navigation configuration
│   │   └── AppNavigator.tsx     # Stack navigator setup
│   ├── screens/                 # Screen components
│   │   ├── OrderListScreen/
│   │   │   ├── index.tsx       # Order list with FlatList
│   │   │   └── styles.ts       # List screen styles
│   │   ├── CreateOrderScreen/
│   │   │   ├── index.tsx       # Create order form
│   │   │   └── styles.ts       # Create screen styles
│   │   └── EditOrderScreen/
│   │       ├── index.tsx       # Edit order form
│   │       └── styles.ts       # Edit screen styles
│   ├── services/                # Business logic services
│   │   ├── storage.ts           # AsyncStorage wrapper
│   │   └── sync.ts              # Sync service (mock API)
│   ├── store/                   # Redux store configuration
│   │   ├── index.ts             # Store setup
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   ├── slices/              # Redux slices
│   │   │   └── ordersSlice.ts   # Orders state management
│   │   └── thunks.ts            # Async thunks (CRUD operations)
│   └── types/                   # TypeScript type definitions
│       └── index.ts             # Order, SyncStatus, and payload types
├── App.tsx                      # Root component with Redux Provider
├── index.js                     # Entry point
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js >= 20
- React Native development environment set up
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **For iOS (macOS only):**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start Metro bundler:**
   ```bash
   npm start
   ```

4. **Run on iOS:**
   ```bash
   npm run ios
   ```

5. **Run on Android:**
   ```bash
   npm run android
   ```

## How It Works

### Offline-First Architecture

1. **Local Storage**: 
   - All orders are persisted locally using AsyncStorage
   - Data is loaded on app start from local storage
   - Works completely offline without network dependency

2. **Sync Status**: Each order has a sync status tracked in the state:
   - `PENDING`: Created offline, waiting to sync
   - `SYNCED`: Successfully synced to server (locked from editing)
   - `FAILED`: Sync attempt failed (can retry)

3. **Auto Sync**: 
   - Network status is monitored via `useNetworkStatus` hook
   - When network is restored, pending orders are automatically synced
   - Sync happens in the background without user interaction

4. **Manual Operations**: 
   - "Sync Now" button for manual synchronization of all pending orders
   - "Retry Sync" button on individual failed orders
   - Pull-to-refresh to reload and sync orders

### State Management

- **Redux Toolkit**: Centralized state management with modern Redux patterns
- **Redux Thunk**: Handles async operations (API calls, storage operations)
- **Actions**: Synchronous state updates via slice reducers
- **Thunks**: Async operations with side effects (create, update, sync)
- **Selectors**: Efficient data access from Redux store

### Network Detection

- Uses `@react-native-community/netinfo` to detect network connectivity
- Custom hook `useNetworkStatus` provides reactive network state
- Automatically triggers sync when network is restored
- Visual indicator (NetworkStatusBar) shows when offline
- Sync queue processing ensures all pending orders are synced

### Data Flow

1. **Create/Edit Order**: 
   - User fills form → Validation → Local storage → Redux state update
   - Order marked as `PENDING` if offline, or `SYNCED` if online

2. **Sync Process**: 
   - Network detected → Fetch pending orders → API call → Update status
   - Failed syncs marked as `FAILED` with retry capability
   - Successful syncs marked as `SYNCED` and locked from editing

3. **Persistent Storage**: 
   - All state changes are immediately persisted to AsyncStorage
   - App can be closed and reopened with data intact
   - Sync queue maintained across app sessions

## Usage

1. **Create Order**: 
   - Tap "Create Order" button
   - Enter title (max 30 characters, required)
   - Enter amount (numeric only, positive numbers, required)
   - Submit to create order (stored locally)

2. **View Orders**: 
   - All orders displayed in a list with sync status badges
   - Shows pending and failed sync counts in header
   - Pull down to refresh and sync

3. **Edit Order**: 
   - Tap on an unsynced order to edit
   - Synced orders cannot be edited (shows info alert)
   - Same validation rules apply as create screen

4. **Sync**: 
   - Pending orders sync automatically when network is restored
   - Use "Sync Now" button for manual synchronization
   - Sync status is displayed on each order card

5. **Retry**: 
   - Failed syncs can be retried using the "Retry Sync" button on the order card
   - Only appears for orders with failed sync status

## Form Validation Rules

### Title Field
- **Required**: Cannot be empty
- **Max Length**: 30 characters
- **Input Type**: Text with auto-capitalization

### Amount Field
- **Required**: Cannot be empty
- **Input Type**: Numeric only (decimal-pad keyboard)
- **Validation**: 
  - Only numbers and one decimal point allowed
  - Must be a valid positive number (> 0)
  - Non-numeric characters are automatically filtered out
  - Duplicate decimal points are prevented

## Sync Service

The sync service (`src/services/sync.ts`) is currently a mock implementation that:
- Simulates network delay (1 second) to demonstrate async behavior
- Has a 10% failure rate for testing sync failure scenarios
- Returns synced orders with updated server ID and timestamp
- Handles batch synchronization of multiple orders

## Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (macOS only)

## Development Notes

- **UI Design**: Minimal and functional design focused on usability
- **Code Quality**: Emphasis on clean code, proper architecture, and maintainability
- **Offline Capabilities**: Full offline support with seamless sync when online
- **Sync Service**: Currently mocked for demonstration; ready for backend integration
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Strict type checking enabled for better code reliability
- **Performance**: Optimized with memoization and efficient rendering patterns

## Limitations & Future Improvements

- Backend API is currently mocked; can be replaced with a real REST or GraphQL service
- Conflict resolution strategy is basic and can be enhanced
- Background sync could be extended using headless tasks

## License

This project is intended for learning and demonstration purposes.
