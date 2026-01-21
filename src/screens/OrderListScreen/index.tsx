import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {loadOrdersFromStorage, syncPendingOrders, retrySyncOrder} from '../../store/thunks';
import {Button} from '../../components/Button';
import {OrderCard} from '../../components/OrderCard';
import {NetworkStatusBar} from '../../components/NetworkStatusBar';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';
import {Order, SyncStatus} from '../../types';
import {Colors} from '../../constants/colors';
import {Strings} from '../../constants/strings';
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
    Alert.alert(
      Strings.common.infoTitle,
      Strings.screens.orderList.syncedNotEditableMessage,
    );
  };

  const handleRetrySync = (orderId: string) => {
    dispatch(retrySyncOrder(orderId));
  };

  const handleSyncNow = () => {
    dispatch(syncPendingOrders());
  };

  const renderOrderItem = useCallback(
    ({item}: {item: Order}) => (
      <OrderCard
        order={item}
        onPress={() => handleOrderPress(item)}
        onRetry={
          item.syncStatus === SyncStatus.FAILED
            ? () => handleRetrySync(item.id)
            : undefined
        }
      />
    ),
    [handleOrderPress, handleRetrySync],
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{Strings.screens.orderList.emptyTitle}</Text>
      <Text style={styles.emptySubtext}>
        {Strings.screens.orderList.emptySubtitle}
      </Text>
    </View>
  );

  const pendingCount = items.filter(order => order.syncStatus === SyncStatus.PENDING).length;
  const failedCount = items.filter(order => order.syncStatus === SyncStatus.FAILED).length;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{Strings.screens.orderList.loading}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <NetworkStatusBar />
        <View style={styles.header}>
          <Text style={styles.title}>{Strings.screens.orderList.headerTitle}</Text>
          {(pendingCount > 0 || failedCount > 0) && (
            <View style={styles.syncInfo}>
              {pendingCount > 0 && (
                <Text style={styles.syncText}>
                  {pendingCount} {Strings.screens.orderList.pendingSuffix}
                </Text>
              )}
              {failedCount > 0 && (
                <Text style={[styles.syncText, styles.failedText]}>
                  {failedCount} {Strings.screens.orderList.failedSuffix}
                </Text>
              )}
            </View>
          )}
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          style={styles.list}
          renderItem={renderOrderItem}
          contentContainerStyle={items.length !== 0 ? styles.listContent : styles.listContentEmpty}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isSyncing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
        />
        <View style={styles.footer}>
          <Button
            title={Strings.screens.orderList.createOrderButton}
            onPress={handleCreatePress}
            fullWidth
          />
          {isConnected && pendingCount > 0 && (
            <Button
              title={Strings.screens.orderList.syncNowButton}
              onPress={handleSyncNow}
              disabled={isSyncing}
              loading={isSyncing}
              variant="success"
              fullWidth
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
