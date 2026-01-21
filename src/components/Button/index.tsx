import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {Colors} from '../../constants/colors';
import {styles} from './styles';

export type ButtonVariant = 'primary' | 'secondary' | 'success';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const variantStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'success'
        ? styles.success
        : styles.secondary;

  const textColorStyle =
    variant === 'secondary'
      ? styles.textOnSecondary
      : variant === 'success'
        ? styles.textOnSuccess
        : styles.textOnPrimary;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? Colors.textPrimary : Colors.white}
        />
      ) : (
        <Text style={[styles.textBase, textColorStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
