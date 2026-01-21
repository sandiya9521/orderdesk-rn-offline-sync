export const Strings = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    errorTitle: 'Error',
    infoTitle: 'Info',
  },

  order: {
    titleLabel: 'Title',
    amountLabel: 'Amount',
    titlePlaceholder: 'Enter order title',
    amountPlaceholder: '0.00',
  },

  screens: {
    orderList: {
      headerTitle: 'Orders',
      loading: 'Loading orders...',
      emptyTitle: 'No orders yet',
      emptySubtitle: 'Create your first order to get started',
      createOrderButton: 'Create Order',
      syncNowButton: 'Sync Now',
      pendingSuffix: 'pending',
      failedSuffix: 'failed',
      syncedNotEditableMessage: 'This order is already synced and cannot be edited.',
    },
    createOrder: {
      screenTitle: 'Create New Order',
      submitButton: 'Create Order',
    },
    editOrder: {
      screenTitle: 'Edit Order',
      updateButton: 'Update Order',
      statusLabel: 'Status: ',
      notFoundMessage: 'Order not found',
    },
  },

  validation: {
    titleRequired: 'Title is required',
    amountRequired: 'Amount is required',
    amountPositive: 'Amount must be a valid positive number',
  },

  errors: {
    orderNotFound: 'Order not found',
    cannotEditSyncedOrders: 'Cannot edit synced orders',
    syncNetworkFailed: 'Network error: Failed to sync order',
    storageSaveFailed: 'Failed to save orders to storage',
    storageLoadFailed: 'Failed to load orders from storage',
    storageClearFailed: 'Failed to clear orders from storage',
  },

  orderCard: {
    createdPrefix: 'Created: ',
    updatedPrefix: 'Updated: ',
    retrySync: 'Retry Sync',
  },

  network: {
    offlineBanner: 'No Internet Connection - Working Offline',
  },
} as const;

