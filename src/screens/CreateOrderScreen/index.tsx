import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {useAppDispatch} from '../../store/hooks';
import {createOrder} from '../../store/thunks';
import {Button} from '../../components/Button';
import {Input} from '../../components/Input';
import {Strings} from '../../constants/strings';
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
      newErrors.title = Strings.validation.titleRequired;
    }

    if (!amount.trim()) {
      newErrors.amount = Strings.validation.amountRequired;
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = Strings.validation.amountPositive;
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
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(createOrder({title: title.trim(), amount: parseFloat(amount)}));
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        Strings.common.errorTitle,
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <Text style={styles.screenTitle}>{Strings.screens.createOrder.screenTitle}</Text>
            <Input
              label={Strings.order.titleLabel}
              value={title}
              onChangeText={setTitle}
              placeholder={Strings.order.titlePlaceholder}
              error={errors.title}
              autoCapitalize="words"
              maxLength={30}
            />
            <Input
              label={Strings.order.amountLabel}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder={Strings.order.amountPlaceholder}
              keyboardType="decimal-pad"
              error={errors.amount}
            />
            <View style={styles.buttonContainer}>
              <Button
                title={Strings.common.cancel}
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.button}
              />
              <Button
                title={Strings.screens.createOrder.submitButton}
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
