import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Order, SyncStatus} from '../../types';
import {Strings} from '../../constants/strings';
import {styles} from './styles';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onRetry?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({order, onPress, onRetry}) => {
  const getStatusBadgeStyle = (status: SyncStatus) => {
    switch (status) {
      case SyncStatus.SYNCED:
        return styles.statusBadgeSynced;
      case SyncStatus.PENDING:
        return styles.statusBadgePending;
      case SyncStatus.FAILED:
        return styles.statusBadgeFailed;
      default:
        return styles.statusBadgeDefault;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{order.title}</Text>
        <View style={[styles.statusBadge, getStatusBadgeStyle(order.syncStatus)]}>
          <Text style={styles.statusText}>{order.syncStatus}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.amount}>${order.amount.toFixed(2)}</Text>
        <Text style={styles.date}>
          {Strings.orderCard.createdPrefix}
          {formatDate(order.createdAt)}
        </Text>
        {order.updatedAt && (
          <Text style={styles.date}>
            {Strings.orderCard.updatedPrefix}
            {formatDate(order.updatedAt)}
          </Text>
        )}
      </View>
      {order.syncStatus === SyncStatus.FAILED && onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{Strings.orderCard.retrySync}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
