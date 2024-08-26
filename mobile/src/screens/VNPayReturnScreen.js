import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';

const VNPayReturnScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    const processPaymentResult = async () => {
      const {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
        vnp_SecureHash,
      } = route.params;

      try {
        const response = await axios.post(
          'https://greenfeast.space/api/payment/vnpay-return',
          {
            vnp_Amount,
            vnp_BankCode,
            vnp_BankTranNo,
            vnp_CardType,
            vnp_OrderInfo,
            vnp_PayDate,
            vnp_ResponseCode,
            vnp_TmnCode,
            vnp_TransactionNo,
            vnp_TransactionStatus,
            vnp_TxnRef,
            vnp_SecureHash,
          },
          {
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          Alert.alert('Payment Successful', 'Your payment has been processed successfully!');
          navigation.navigate('OrderSuccess'); 
        } else {
          Alert.alert('Payment Failed', 'There was an issue with your payment.');
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        Alert.alert('Error', 'There was an issue processing your payment result.');
      }
    };

    processPaymentResult();
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Processing Payment Result...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'blue',
  },
});

export default VNPayReturnScreen;
