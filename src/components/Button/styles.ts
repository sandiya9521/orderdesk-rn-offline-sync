import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/colors';

export const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },

  // Disabled
  disabled: {
    backgroundColor: Colors.borderStrong,
    opacity: 0.6,
  },

  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  textOnPrimary: {
    color: Colors.white,
  },
  textOnSuccess: {
    color: Colors.white,
  },
  textOnSecondary: {
    color: Colors.textPrimary,
  },
});
