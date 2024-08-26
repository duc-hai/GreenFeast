import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from './src/components/CustomDialog';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const verified = await AsyncStorage.getItem('email_verified');
        setIsEmailVerified(verified === 'true');
        const token = await AsyncStorage.getItem('access_token');
        setAccessToken(token);
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkEmailVerification();
  }, []);

  const handleSendCode = async () => {
    try {
      const response = await fetch('https://greenfeast.space/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Alert.alert('Thông báo', 'Mã xác nhận đã được gửi tới email của bạn.');
        setCodeSent(true);
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Gửi mã thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('https://greenfeast.space/api/user/verify-otp-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp: verificationCode }),
      });

      if (response.ok) {
        Alert.alert('Thông báo', 'Xác thực email thành công.');
        setDialogVisible(false);
        setIsEmailVerified(true); // Cập nhật trạng thái sau khi xác thực
        await AsyncStorage.setItem('email_verified', 'true');
        navigation.navigate('MainTabs', { accessToken });
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Xác thực mã thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const openDialog = () => {
    if (!accessToken) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập trước khi xác thực email.');
      return;
    }
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cá nhân</Text>
      
      {!isEmailVerified && (
        <TouchableOpacity style={styles.verifyButton} onPress={openDialog}>
          <Text style={styles.verifyButtonText}>Xác thực Email</Text>
        </TouchableOpacity>
      )}

      <CustomDialog
        visible={isDialogVisible}
        onClose={() => setDialogVisible(false)}
        email={email}
        setEmail={setEmail}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        onSendCode={handleSendCode}
        onVerifyCode={handleVerifyCode}
        codeSent={codeSent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6cbf73',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#263A29',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
