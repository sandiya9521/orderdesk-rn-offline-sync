import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/store';
import {AppNavigator} from './src/navigation/AppNavigator';
import {useAppDispatch, useAppSelector} from './src/store/hooks';
import {loadOrdersFromStorage, syncPendingOrders} from './src/store/thunks';
import {useNetworkStatus} from './src/hooks/useNetworkStatus';
import {SyncStatus} from './src/types';

function AppContent() {
  const dispatch = useAppDispatch();
  const isConnected = useNetworkStatus();
  const pendingCount = useAppSelector(
    state => state.orders.items.filter(o => o.syncStatus === SyncStatus.PENDING).length,
  );
  const isSyncing = useAppSelector(state => state.orders.isSyncing);

  useEffect(() => {
    // Load orders from storage on app start
    dispatch(loadOrdersFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // Auto-sync whenever we're online AND there are pending records.
    // This fixes the edge case where network becomes available before orders finish loading.
    if (isConnected && pendingCount > 0 && !isSyncing) {
      dispatch(syncPendingOrders());
    }
  }, [isConnected, pendingCount, isSyncing, dispatch]);

  return <AppNavigator />;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
