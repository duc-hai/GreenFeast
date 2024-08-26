import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const NotificationsScreen = ({ route }) => {
  const { accessToken } = route.params || {};
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Hàm để lấy danh sách thông báo
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://greenfeast.space/api/notification/get-notifications', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        });

        if (response.data.status === 'success') {
          setNotifications(response.data.data);
        } else {
          setError('Lỗi khi lấy thông báo');
        }
      } catch (error) {
        setError('Lỗi kết nối');
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [accessToken]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông báo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default NotificationsScreen;
