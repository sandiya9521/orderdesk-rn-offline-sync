import {ThunkAction} from 'redux-thunk';
import {RootState} from './index';
import {AnyAction} from '@reduxjs/toolkit';
import {Order, SyncStatus, CreateOrderPayload, UpdateOrderPayload} from '../types';
import {storageService} from '../services/storage';
import {syncService} from '../services/sync';
import {Strings} from '../constants/strings';
import {
  setLoading,
  setSyncing,
  setOrders,
  addOrder,
  updateOrder,
  setLastSyncTime,
} from './slices/ordersSlice';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

/**
 * Load orders from local storage on app start
 */
export const loadOrdersFromStorage = (): AppThunk => async dispatch => {
  try {
    dispatch(setLoading(true));
    const orders = await storageService.loadOrders();
    dispatch(setOrders(orders));
  } catch (error) {
    // Error handling - show default error message
    console.error('Failed to load orders:', error);
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Create a new order
 */
export const createOrder = (payload: CreateOrderPayload): AppThunk => async dispatch => {
  try {
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: payload.title,
      amount: payload.amount,
      createdAt: new Date().toISOString(),
      syncStatus: SyncStatus.PENDING,
    };

    dispatch(addOrder(newOrder));
    
    // Save to storage
    const currentOrders = await storageService.loadOrders();
    await storageService.saveOrders([...currentOrders, newOrder]);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
};

/**
 * Update an existing order (only if not synced)
 */
export const updateOrderAction = (
  payload: UpdateOrderPayload,
): AppThunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const existingOrder = state.orders.items.find(order => order.id === payload.id);

    if (!existingOrder) {
      throw new Error(Strings.errors.orderNotFound);
    }

    if (existingOrder.syncStatus === SyncStatus.SYNCED) {
      throw new Error(Strings.errors.cannotEditSyncedOrders);
    }

    const updatedOrder: Order = {
      ...existingOrder,
      title: payload.title,
      amount: payload.amount,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateOrder(updatedOrder));

    // Update in storage
    const currentOrders = await storageService.loadOrders();
    const updatedOrders = currentOrders.map(order =>
      order.id === payload.id ? updatedOrder : order,
    );
    await storageService.saveOrders(updatedOrders);
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
};

/**
 * Sync pending orders to server
 */
export const syncPendingOrders = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const pendingOrders = state.orders.items.filter(
    order => order.syncStatus === SyncStatus.PENDING,
  );

  if (pendingOrders.length === 0 || state.orders.isSyncing) {
    return;
  }

  try {
    dispatch(setSyncing(true));

    // Sync orders one by one
    const syncedOrders: Order[] = [];
    const failedOrders: Order[] = [];

    for (const order of pendingOrders) {
      try {
        const syncedOrder = await syncService.syncOrder(order);
        syncedOrders.push(syncedOrder);
        dispatch(updateOrder(syncedOrder));
      } catch (error) {
        const failedOrder: Order = {
          ...order,
          syncStatus: SyncStatus.FAILED,
        };
        failedOrders.push(failedOrder);
        dispatch(updateOrder(failedOrder));
      }
    }

    // Update storage with synced orders
    const currentOrders = await storageService.loadOrders();
    const updatedOrders = currentOrders.map(order => {
      const synced = syncedOrders.find(so => so.id === order.id);
      const failed = failedOrders.find(fo => fo.id === order.id);
      return synced || failed || order;
    });
    await storageService.saveOrders(updatedOrders);

    dispatch(setLastSyncTime(new Date().toISOString()));
  } catch (error) {
    console.error('Failed to sync orders:', error);
  } finally {
    dispatch(setSyncing(false));
  }
};

/**
 * Retry syncing a failed order
 */
export const retrySyncOrder = (orderId: string): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const order = state.orders.items.find(o => o.id === orderId);

  if (!order || order.syncStatus !== SyncStatus.FAILED) {
    return;
  }

  try {
    // Reset to pending status
    const pendingOrder: Order = {
      ...order,
      syncStatus: SyncStatus.PENDING,
    };
    dispatch(updateOrder(pendingOrder));

    // Update storage
    const currentOrders = await storageService.loadOrders();
    const updatedOrders = currentOrders.map(o => (o.id === orderId ? pendingOrder : o));
    await storageService.saveOrders(updatedOrders);

    // Attempt sync
    await dispatch(syncPendingOrders());
  } catch (error) {
    console.error('Failed to retry sync:', error);
  }
};
