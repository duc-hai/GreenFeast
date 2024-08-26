import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Card, Dialog, Portal, Button, IconButton } from 'react-native-paper';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OrderHistoryScreen = ({ route }) => {
  const { accessToken } = route.params; 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://greenfeast.space/api/order/online/history-list', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });
        setOrders(response.data.data); 
        setLoading(false);
      } catch (err) {
        setError('Không thể tải lịch sử đơn hàng');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  const fetchOrderDetail = async (orderId) => {
    try {
      const response = await axios.get(`https://greenfeast.space/api/order/online/history-detail/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      setSelectedOrder(response.data.data);
      setVisible(true);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải thông tin chi tiết đơn hàng');
    }
  };

  const hideDialog = () => setVisible(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => fetchOrderDetail(item._id)}>
      <Card style={styles.orderCard}>
        <Card.Title title={`Tổng cộng: ${item.total.toLocaleString()} VND`} subtitle={`Trạng thái: ${item.status}`} />
        <Card.Content>
          <Text style={styles.orderTime}>Thời gian: {new Date(item.time).toLocaleString()}</Text>
          {item.menu_detail.map((menuItem, index) => (
            <View key={index} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Tên món: {menuItem.name}</Text>
              <Text style={styles.menuItemText}>Số lượng: {menuItem.quantity}</Text>
              <Text style={styles.menuItemText}>Giá: {menuItem.price.toLocaleString()} VND</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Chi tiết đơn hàng</Dialog.Title>
          <Dialog.Content>
            {selectedOrder && (
              <View style={styles.dialogContent}>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="account" size={20} color="#000" />
                  <Text style={styles.dialogText}>Người đặt hàng: {selectedOrder.order_person.name}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="truck-delivery" size={20} color="#000" />
                  <Text style={styles.dialogText}>Người giao hàng: {selectedOrder.delivery_person.name}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#000" />
                  <Text style={styles.dialogText}>Địa chỉ giao hàng: {selectedOrder.delivery_information.address}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="clock" size={20} color="#000" />
                  <Text style={styles.dialogText}>Thời gian: {new Date(selectedOrder.time).toLocaleString()}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="currency-vnd" size={20} color="#000" />
                  <Text style={styles.dialogText}>Tổng cộng: {selectedOrder.total.toLocaleString()} VND</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="information" size={20} color="#000" />
                  <Text style={styles.dialogText}>Trạng thái: {selectedOrder.status}</Text>
                </View>
                <View style={styles.dialogRow}>
                  <MaterialCommunityIcons name="note" size={20} color="#000" />
                  <Text style={styles.dialogText}>Ghi chú: {selectedOrder.note}</Text>
                </View>
                <View style={styles.menuItemsContainer}>
                  {selectedOrder.menu_detail.map((menuItem, index) => (
                    <View key={index} style={styles.menuItem}>
                      <Text style={styles.menuItemText}>Tên món: {menuItem.name}</Text>
                      <Text style={styles.menuItemText}>Số lượng: {menuItem.quantity}</Text>
                      <Text style={styles.menuItemText}>Giá: {menuItem.price.toLocaleString()} VND</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Đóng</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  orderCard: {
    marginVertical: 8,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItem: {
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dialogContent: {
    marginTop: 10,
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dialogText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  menuItemsContainer: {
    marginTop: 10,
  },
});

export default OrderHistoryScreen;
