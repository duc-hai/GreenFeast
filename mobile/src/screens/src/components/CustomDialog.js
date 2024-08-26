import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const CustomDialog = ({
  visible,
  onClose,
  email,
  setEmail,
  verificationCode,
  setVerificationCode,
  onSendCode,
  onVerifyCode,
  codeSent
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.dialogContainer}>
          <Text style={styles.dialogTitle}>Xác thực Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            editable={!codeSent}
          />
          {codeSent && (
            <TextInput
              style={styles.input}
              placeholder="Mã xác nhận"
              placeholderTextColor="#666"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
          )}
          <View style={styles.buttonContainer}>
            {!codeSent ? (
              <TouchableOpacity style={styles.button} onPress={onSendCode}>
                <Text style={styles.buttonText}>Gửi mã</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={onVerifyCode}>
                <Text style={styles.buttonText}>Xác nhận mã</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#263A29',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default CustomDialog;
