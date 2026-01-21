import {configureStore} from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['orders/loadOrdersFromStorage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
