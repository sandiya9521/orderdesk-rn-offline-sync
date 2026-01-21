import React from 'react';
import {View, Text} from 'react-native';
import {useNetworkStatus} from '../../hooks/useNetworkStatus';
import {Strings} from '../../constants/strings';
import {styles} from './styles';

export const NetworkStatusBar: React.FC = () => {
  const isConnected = useNetworkStatus();

  if (isConnected || isConnected === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{Strings.network.offlineBanner}</Text>
    </View>
  );
};
