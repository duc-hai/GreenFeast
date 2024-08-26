import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';

export default function CartScreen({ route, navigation }) {
    const { cart, accessToken } = route.params;
    console.log(accessToken);
    const [notes, setNotes] = useState({}); // Để lưu ghi chú cho từng mục

    // Tính toán tổng số lượng và tổng tiền
    const getTotalQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.quantity * (item.discount_price || item.price), 0);
    };

    const handleNoteChange = (id, note) => {
        setNotes(prevNotes => ({ ...prevNotes, [id]: note }));
    };

    const handleNext = () => {
        navigation.navigate('OrderScreen', { cart, notes, totalPrice: getTotalPrice(), accessToken });
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItemContainer}>
            <View style={styles.cartItemContent}>
                <View style={styles.cartItemImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                </View>
                <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemQuantity}>Số lượng: {item.quantity}</Text>
                    <Text style={styles.cartItemPrice}>Giá: {item.quantity * (item.discount_price || item.price)}₫</Text>
                </View>
            </View>
            <TextInput
                style={styles.noteInput}
                multiline
                numberOfLines={3}
                value={notes[item._id] || ''}
                onChangeText={(note) => handleNoteChange(item._id, note)}
                placeholder="Nhập ghi chú cho món này (nếu có)"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={styles.cartList}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Tổng số lượng: {getTotalQuantity()}</Text>
                <Text style={styles.summaryText}>Tổng tiền: {getTotalPrice()}₫</Text>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Tiếp theo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15,
    },
    cartList: {
        flexGrow: 1,
        marginBottom: 20,
    },
    cartItemContainer: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    cartItemContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    cartItemImageContainer: {
        width: 100,
        height: 100,
        marginRight: 15,
        overflow: 'hidden',
        borderRadius: 10,
    },
    cartItemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cartItemQuantity: {
        fontSize: 16,
        color: '#555',
    },
    cartItemPrice: {
        fontSize: 18,
        color: '#333',
        marginTop: 5,
    },
    noteInput: {
        marginTop: 10,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        width: '100%',
        height: 80,
        backgroundColor: '#FAFAFA',
    },
    summaryContainer: {
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
