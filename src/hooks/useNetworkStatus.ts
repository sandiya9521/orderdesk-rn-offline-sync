import {useEffect, useState} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const computeIsOnline = (state: NetInfoState) => {
    const connected = state.isConnected ?? false;
    const reachable = state.isInternetReachable;
    if (reachable === null || reachable === undefined) {
      return connected;
    }
    return connected && reachable;
  };

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(computeIsOnline(state));
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(computeIsOnline(state));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isConnected;
};
