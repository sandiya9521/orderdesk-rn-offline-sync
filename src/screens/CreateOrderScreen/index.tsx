import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAppDispatch} from '../../store/hooks';
import {createOrder} from '../../store/thunks';
import {Input} from '../../components/Input';
import {styles} from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CreateOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{title?: string; amount?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {title?: string; amount?: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Amount must be a valid positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(createOrder({title: title.trim(), amount: parseFloat(amount)}));
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.screenTitle}>Create New Order</Text>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter order title"
            error={errors.title}
            autoCapitalize="words"
          />
          <Input
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.7}>
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Create Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
