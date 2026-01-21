import {StyleSheet} from 'react-native';
import {Colors} from '../../constants/colors';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});
