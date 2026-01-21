import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OrderListScreen} from '../screens/OrderListScreen';
import {CreateOrderScreen} from '../screens/CreateOrderScreen';
import {EditOrderScreen} from '../screens/EditOrderScreen';
import {Colors} from '../constants/colors';
import {Strings} from '../constants/strings';

export type RootStackParamList = {
  OrderList: undefined;
  CreateOrder: undefined;
  EditOrder: {orderId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OrderList"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.surface,
          },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}>
        <Stack.Screen
          name="OrderList"
          component={OrderListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateOrder"
          component={CreateOrderScreen}
          options={{title: Strings.screens.createOrder.submitButton}}
        />
        <Stack.Screen
          name="EditOrder"
          component={EditOrderScreen}
          options={{title: Strings.screens.editOrder.screenTitle}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
