import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
