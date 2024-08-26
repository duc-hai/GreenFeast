import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Picker,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import axios from 'axios';

const OrderScreen = ({ navigation, route }) => {
  const { cart, notes, totalPrice, accessToken } = route.params;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('79'); // Mặc định là Hồ Chí Minh
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoValue, setPromoValue] = useState(0);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardMap, setWardMap] = useState({});
  const [promotions, setPromotions] = useState([]);
  const [promotionMap, setPromotionMap] = useState({});
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          'https://greenfeast.space/api/order/online/provinces'
        );
        if (response.data.status === 'success') {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (province) {
      fetchDistricts(province);
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      fetchWards(district);
    }
  }, [district]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(
          'https://greenfeast.space/api/order/promotion'
        );
        if (response.data.status === 'success') {
          setPromotions(response.data.data);
          const promoMap = {};
          response.data.data.forEach((promotion) => {
            promoMap[promotion._id] = promotion;
          });
          setPromotionMap(promoMap);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `https://greenfeast.space/api/order/online/districts/${provinceId}`
      );
      if (response.data.status === 'success') {
        setDistricts(response.data.data);
        setDistrict('');
        setWard('');
        setWards([]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(
        `https://greenfeast.space/api/order/online/wards/${districtId}`
      );
      if (response.data.status === 'success') {
        setWards(response.data.data);
        const newWardMap = {};
        response.data.data.forEach((ward) => {
          newWardMap[ward.id] = ward;
        });
        setWardMap(newWardMap);
        setWard('');
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchShippingFee = async (lat, lng) => {
    try {
      const response = await axios.post(
        'https://greenfeast.space/api/order/online/shipping-fee',
        { latitude: lat, longitude: lng },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.status === 'success') {
        setShippingFee(response.data.data.shippingFee);
      } else {
        console.error('Failed to fetch shipping fee:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
    }
  };

  const handlePromotionChange = (selectedPromoCode) => {
    setPromoCode(selectedPromoCode);
    const selectedPromo = promotionMap[selectedPromoCode];
    if (selectedPromo) {
      setPromoValue(parseFloat(selectedPromo.promotion_value) || 0);
    } else {
      setPromoValue(0);
    }
  };

  const handleWardChange = (selectedWardId) => {
    setWard(selectedWardId);
    const selectedWard = wardMap[selectedWardId];
    if (selectedWard) {
      setLatitude(selectedWard.latitude);
      setLongitude(selectedWard.longitude);

      const provinceName = provinces.find(
        (prov) => prov.id === province
      )?.name;
      const districtName = districts.find(
        (dist) => dist.id === district
      )?.name;
      const fullAddress = `${address}, ${selectedWard.name}, ${districtName}, ${provinceName}`;
      setAddress(fullAddress);

      fetchShippingFee(selectedWard.latitude, selectedWard.longitude);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleOrder = async () => {
    if (
      !name ||
      !phone ||
      !province ||
      !district ||
      !ward ||
      !address.trim()
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin, bao gồm địa chỉ cụ thể.');
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Lỗi', 'Vui lòng chọn phương thức thanh toán.');
      return;
    }

    const discountValue = (totalPrice * promoValue) / 100;
    const totalValue = totalPrice + shippingFee - discountValue;

    try {
      const orderResponse = await axios.post(
        'https://greenfeast.space/api/order/online',
        {
          menu: cart.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            note: notes[item._id] || '',
          })),
          note: note,
          payment_method: paymentMethod,
          delivery: {
            name,
            phone_number: phone,
            province: provinces.find((prov) => prov.id === province)?.name,
            district: districts.find((dist) => dist.id === district)?.name,
            ward: wardMap[ward]?.name,
            longitude,
            latitude,
            address,
          },
          time_receive: null,
          promotion_id: promoCode || null,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (orderResponse.data.status === 'success') {
        if (paymentMethod === 'cod') {
          Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt thành công.');
          navigation.navigate('SuccessScreen');
        } else {
          const paymentResponse = await axios.post(
            'https://greenfeast.space/api/payment/create-payment-url',
            {
              amount: totalValue,
              orderId: generateRandomOrderId(),
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );

          if (paymentResponse.data.status === 'success') {
            const paymentUrl = paymentResponse.data.data.vnpUrl;
            Linking.openURL(paymentUrl).catch((err) => {
              console.error('Error opening URL:', err);
              Alert.alert(
                'Lỗi',
                'Không thể mở liên kết thanh toán. Vui lòng thử lại sau.'
              );
            });
          } else {
            Alert.alert(
              'Lỗi',
              paymentResponse.data.message || 'Có lỗi xảy ra khi tạo liên kết thanh toán.'
            );
          }
        }
      } else {
        Alert.alert(
          'Lỗi',
          orderResponse.data.message || 'Có lỗi xảy ra khi đặt đơn hàng.'
        );
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt đơn hàng. Vui lòng thử lại sau.');
    }
  };

  const generateRandomOrderId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Thông tin giao hàng</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tỉnh/Thành phố</Text>
        <Picker
          selectedValue={province}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setProvince(itemValue);
            setDistrict('');
            setWard('');
            setAddress('');
            setShippingFee(0);
          }}
        >
          <Picker.Item label="Chọn tỉnh/thành phố" value="" />
          {provinces.map((prov) => (
            <Picker.Item key={prov.id} label={prov.name} value={prov.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Quận/Huyện</Text>
        <Picker
          selectedValue={district}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setDistrict(itemValue);
            setWard('');
            setAddress('');
            setShippingFee(0);
          }}
          enabled={province !== ''}
        >
          <Picker.Item label="Chọn quận/huyện" value="" />
          {districts.map((dist) => (
            <Picker.Item key={dist.id} label={dist.name} value={dist.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phường/Xã</Text>
        <Picker
          selectedValue={ward}
          style={styles.picker}
          onValueChange={handleWardChange}
          enabled={district !== ''}
        >
          <Picker.Item label="Chọn phường/xã" value="" />
          {wards.map((w) => (
            <Picker.Item key={w.id} label={w.name} value={w.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Địa chỉ cụ thể</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ cụ thể (số nhà, tên đường)"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ghi chú cho đơn hàng (nếu có)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập ghi chú"
          value={note}
          onChangeText={setNote}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phương thức thanh toán</Text>
        <Picker
          selectedValue={paymentMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Chọn phương thức thanh toán" value="" />
          <Picker.Item label="Thanh toán online" value="online" />
          <Picker.Item label="Thanh toán khi nhận hàng" value="cod" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mã khuyến mãi</Text>
        <Picker
          selectedValue={promoCode}
          style={styles.picker}
          onValueChange={handlePromotionChange}
        >
          <Picker.Item label="Chọn mã khuyến mãi (nếu có)" value="" />
          {promotions.map((promo) => (
            <Picker.Item key={promo._id} label={promo.name} value={promo._id} />
          ))}
        </Picker>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tiền món ăn:</Text>
          <Text style={styles.summaryText}>{formatCurrency(totalPrice)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Phí ship:</Text>
          <Text style={styles.summaryText}>{formatCurrency(shippingFee)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Khuyến mãi:</Text>
          <Text style={styles.discountText}>
            -{formatCurrency((totalPrice * promoValue) / 100)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalText}>
            {formatCurrency(totalPrice + shippingFee - (totalPrice * promoValue) / 100)}
          </Text>
        </View>
      </View>

      <Text style={styles.noteText}>
        Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleOrder}>
        <Text style={styles.buttonText}>Đặt món</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555555',
  },
  input: {
    height: 48,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 48,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  summaryContainer: {
    marginVertical: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#333333',
  },
  discountText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  noteText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
