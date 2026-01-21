import React from 'react';
import {View, Text} from 'react-native';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';
import {styles} from './styles';

export const NetworkStatusBar: React.FC = () => {
  const isConnected = useNetworkStatus();

  if (isConnected || isConnected === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection - Working Offline</Text>
    </View>
  );
};
