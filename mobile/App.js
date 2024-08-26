import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';  // Import the Provider from react-native-paper
import LoginScreen from './src/screens/LoginScreen';
import OrderListingScreen from './src/screens/OrderListingScreen';
import CartScreen from './src/screens/CartScreen';
import OrderScreen from './src/screens/OrderScreen';
import PromotionsScreen from './src/screens/PromotionsScreen';
import VNPayReturnScreen from './src/screens/VNPayReturnScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import OrderHistoryScreen from './src/screens/OrderHistory';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MainTabs from './src/screens/MainTabs';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>  
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: "Giỏ hàng" }} />
          <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PromotionsScreen" component={PromotionsScreen} options={{ title: "Khuyến mãi" }} />
          <Stack.Screen name="OrderScreen" component={OrderScreen} options={{
            title: "Chi tiết đơn hàng",
            headerStyle: {
              backgroundColor: '#5C9F67',
            },
            headerTitleStyle: {
              color: '#CBD2C0',
              fontSize: 20,
            },
            headerTitleAlign: 'center',
          }} />
          <Stack.Screen name="VNPayReturnScreen" component={VNPayReturnScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider> 
  );
}
