import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {updateOrderAction} from '../../store/thunks';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {styles} from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, 'EditOrder'>;

export const EditOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const dispatch = useAppDispatch();
  const {orderId} = route.params;
  const order = useAppSelector(state =>
    state.orders.items.find(o => o.id === orderId),
  );

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{title?: string; amount?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setTitle(order.title);
      setAmount(order.amount.toString());
    } else {
      Alert.alert('Error', 'Order not found', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [order, navigation]);

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

  const handleAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const filteredText = text
      .replace(/[^0-9.]/g, '') // Remove all non-numeric characters except decimal point
      .replace(/\.(?=.*\.)/g, ''); // Remove duplicate decimal points
    
    setAmount(filteredText);
  };

  const handleSubmit = async () => {
    if (!order) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        updateOrderAction({
          id: order.id,
          title: title.trim(),
          amount: parseFloat(amount),
        }),
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <Text style={styles.screenTitle}>Edit Order</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status: </Text>
              <Text style={styles.statusValue}>{order.syncStatus}</Text>
            </View>
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter order title"
              error={errors.title}
              autoCapitalize="words"
              maxLength={30}
            />
            <Input
              label="Amount"
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={errors.amount}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.button}
              />
              <Button
                title="Update Order"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                style={styles.button}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
