import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomDialog from './src/components/CustomDialog';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  const navigation = useNavigation();

  // Đăng nhập và lưu token
  const handleLogin = async () => {
    try {
      const response = await fetch('https://greenfeast.space/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.access_token;
        const userId = data.data.data._id;

        console.log(token);
        await AsyncStorage.setItem('access_token', token);
        setAccessToken(token);
        setUserId(userId);

        if (data.data.data.email_verified) {
          navigation.navigate('MainTabs', { accessToken: token });
        } else {
          setShowVerificationPrompt(true);
        }
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  // Gửi mã xác nhận đến email
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

  // Xác thực mã xác nhận
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
        navigation.navigate('MainTabs', { accessToken });
      } else {
        const errorData = await response.json();
        Alert.alert('Lỗi', errorData.message || 'Xác thực mã thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  // Mở Dialog xác thực email
  const openDialog = () => {
    if (!accessToken) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập trước khi xác thực email.');
      return;
    }
    setDialogVisible(true);
  };

  // Xác nhận không muốn xác thực email và chuyển tiếp đến MainTabs
  const handleSkipVerification = () => {
    setShowVerificationPrompt(false);
    navigation.navigate('MainTabs', { accessToken });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Hiển thị hộp thoại yêu cầu xác thực email nếu chưa xác thực */}
      {showVerificationPrompt && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>Bạn có muốn xác thực email không?</Text>
          <TouchableOpacity style={styles.button} onPress={openDialog}>
            <Text style={styles.buttonText}>Có</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSkipVerification}>
            <Text style={styles.buttonText}>Không</Text>
          </TouchableOpacity>
        </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#6cbf73',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#263A29',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: '#263A29',
    borderWidth: 1,
  },
  verifyButtonText: {
    color: '#263A29',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promptContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default LoginScreen;
