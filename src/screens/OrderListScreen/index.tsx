import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {loadOrdersFromStorage, syncPendingOrders, retrySyncOrder} from '../../store/thunks';
import {OrderCard} from '../../components/OrderCard';
import {NetworkStatusBar} from '../../components/NetworkStatusBar';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';
import {Order, SyncStatus} from '../../types';
import {styles} from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OrderListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const isConnected = useNetworkStatus();
  const {items, isLoading, isSyncing} = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(loadOrdersFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected && items.some(order => order.syncStatus === SyncStatus.PENDING)) {
      dispatch(syncPendingOrders());
    }
  }, [isConnected, dispatch, items]);

  const handleRefresh = useCallback(() => {
    dispatch(loadOrdersFromStorage());
    if (isConnected) {
      dispatch(syncPendingOrders());
    }
  }, [dispatch, isConnected]);

  const handleCreatePress = () => {
    navigation.navigate('CreateOrder');
  };

  const handleOrderPress = (order: Order) => {
    if (order.syncStatus !== SyncStatus.SYNCED) {
      navigation.navigate('EditOrder', {orderId: order.id});
      return;
    }
    Alert.alert('Info', 'This order is already synced and cannot be edited.');
  };

  const handleRetrySync = (orderId: string) => {
    dispatch(retrySyncOrder(orderId));
  };

  const handleSyncNow = () => {
    dispatch(syncPendingOrders());
  };

  const pendingCount = items.filter(order => order.syncStatus === SyncStatus.PENDING).length;
  const failedCount = items.filter(order => order.syncStatus === SyncStatus.FAILED).length;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NetworkStatusBar />
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        {(pendingCount > 0 || failedCount > 0) && (
          <View style={styles.syncInfo}>
            {pendingCount > 0 && (
              <Text style={styles.syncText}>{pendingCount} pending</Text>
            )}
            {failedCount > 0 && (
              <Text style={[styles.syncText, styles.failedText]}>
                {failedCount} failed
              </Text>
            )}
          </View>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <OrderCard
            order={item}
            onPress={() => handleOrderPress(item)}
            onRetry={
              item.syncStatus === SyncStatus.FAILED
                ? () => handleRetrySync(item.id)
                : undefined
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Create your first order to get started</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePress}
          activeOpacity={0.7}>
          <Text style={styles.createButtonText}>Create Order</Text>
        </TouchableOpacity>
        {isConnected && pendingCount > 0 && (
          <TouchableOpacity
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleSyncNow}
            disabled={isSyncing}
            activeOpacity={0.7}>
            {isSyncing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.syncButtonText}>Sync Now</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
