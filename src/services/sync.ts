import {Order, SyncStatus} from '../types';
import {Strings} from '../constants/strings';

/**
 * Mock API service for syncing orders
 * In a real app, this would make actual HTTP requests
 */
export const syncService = {
  /**
   * Set > 0 (e.g. 0.1) to simulate failures and test FAILED / retry flows.
   * Keep at 0 for normal behavior.
   */
  failureRate: 0,

  /**
   * Sync a single order to the server
   */
  async syncOrder(order: Order): Promise<Order> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Optional simulated failures for testing purposes
    if (this.failureRate > 0 && Math.random() < this.failureRate) {
      throw new Error(Strings.errors.syncNetworkFailed);
    }

    // Return synced order with updated status
    return {
      ...order,
      syncStatus: SyncStatus.SYNCED,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Sync multiple orders in batch
   */
  async syncOrders(orders: Order[]): Promise<Order[]> {
    const results: Order[] = [];
    
    for (const order of orders) {
      try {
        const syncedOrder = await this.syncOrder(order);
        results.push(syncedOrder);
      } catch (error) {
        // Mark as failed if sync fails
        results.push({
          ...order,
          syncStatus: SyncStatus.FAILED,
        });
      }
    }

    return results;
  },
};
