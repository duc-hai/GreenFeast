import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const PromotionsScreen = () => {
    const [promotions, setPromotions] = useState([]);
    const [promotionMap, setPromotionMap] = useState(new Map());
    const [selectedPromotionId, setSelectedPromotionId] = useState(null);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Gọi API để lấy danh sách khuyến mãi
        axios.get('https://greenfeast.space/api/order/promotion')
            .then(response => {
                const promoList = response.data.data;
                setPromotions(promoList);
                const promoMap = new Map();
                promoList.forEach(promotion => {
                    promoMap.set(promotion._id, promotion);
                });
                setPromotionMap(promoMap);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedPromotionId) {
            // Tìm kiếm thông tin khuyến mãi từ map
            const promotion = promotionMap.get(selectedPromotionId);
            setSelectedPromotion(promotion);
        } else {
            setSelectedPromotion(null);
        }
    }, [selectedPromotionId, promotionMap]);

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
                <Text>Đã xảy ra lỗi: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Chọn khuyến mãi:</Text>
            <Picker
                selectedValue={selectedPromotionId}
                onValueChange={(itemValue) => setSelectedPromotionId(itemValue)}
                style={styles.picker}
            >
                {promotions.map((promotion) => (
                    <Picker.Item 
                        key={promotion._id} 
                        label={promotion.name} 
                        value={promotion._id} 
                    />
                ))}
            </Picker>
            
            {selectedPromotion && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.promotionName}>{selectedPromotion.name}</Text>
                    <Text>Giá trị khuyến mãi: {selectedPromotion.promotion_value}</Text>
                    <Text>Áp dụng từ: {new Date(selectedPromotion.start_at).toLocaleDateString()}</Text>
                    <Text>Đến: {new Date(selectedPromotion.end_at).toLocaleDateString()}</Text>
                    <Text>Điều kiện áp dụng: {selectedPromotion.condition_apply}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    picker: {
        width: '100%',
        height: 50,
        marginVertical: 16,
    },
    detailsContainer: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    promotionName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PromotionsScreen;
