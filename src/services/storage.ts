import AsyncStorage from '@react-native-async-storage/async-storage';
import {Order} from '../types';
import {Strings} from '../constants/strings';

const STORAGE_KEY = '@orderDesk:orders';

export const storageService = {
  /**
   * Save orders to local storage
   */
  async saveOrders(orders: Order[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(orders);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      throw new Error(Strings.errors.storageSaveFailed);
    }
  },

  /**
   * Load orders from local storage
   */
  async loadOrders(): Promise<Order[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      throw new Error(Strings.errors.storageLoadFailed);
    }
  },

  /**
   * Clear all orders from storage
   */
  async clearOrders(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      throw new Error(Strings.errors.storageClearFailed);
    }
  },
};
