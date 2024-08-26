import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import OrderListingScreen from './OrderListingScreen';
import OrderHistoryScreen from './OrderHistory';
import NotificationsScreen from './NotificationsScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
  const { accessToken } = route.params || {}; // Nhận accessToken từ route params
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (!accessToken) {
      console.error("No access token provided");
      return;
    }

    console.log("Access Token:", accessToken);

    // Hàm để lấy số lượng thông báo mới
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get('https://greenfeast.space/api/notification/num-notification', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          }
        });

        // Cập nhật số lượng thông báo mới từ dữ liệu trả về
        if (response.data.status === 'success') {
          console.log("Notification Count:", response.data.data);
          setNotificationCount(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Có thể thêm interval để tự động refresh số lượng thông báo mỗi x giây
    const intervalId = setInterval(fetchNotificationCount, 60000); // Refresh mỗi 60 giây

    // Cleanup interval khi component unmount
    return () => clearInterval(intervalId);

  }, [accessToken]);

  return (
    <Tab.Navigator
      initialRouteName="Đặt món"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Đặt món') {
            iconName = 'fast-food';
          } else if (route.name === 'Lịch sử') {
            iconName = 'time';
          } else if (route.name === 'Thông báo') {
            iconName = 'notifications';

            // Hiển thị số lượng thông báo mới lên biểu tượng chuông
            return (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                {notificationCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                      {notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            );
          } else if (route.name === 'Cá nhân') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5C9F67',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Đặt món"
        component={OrderListingScreen}
        initialParams={{ accessToken }}
        options={{ headerShown: false }} // Tắt AppBar
      />
      <Tab.Screen name="Lịch sử" component={OrderHistoryScreen} initialParams={{ accessToken }} />
      <Tab.Screen name="Thông báo" component={NotificationsScreen} initialParams={{ accessToken }} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} initialParams={{ accessToken }} />
    </Tab.Navigator>
  );
}

export default MainTabs;
