import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OrderListingScreen() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [cartQuantity, setCartQuantity] = useState(0);

    const navigation = useNavigation();
    const route = useRoute();
    const { accessToken } = route.params;

    const fetchMenuItems = useCallback(async () => {
        try {
            const response = await axios.get('https://greenfeast.space/api/recommend/menu', {
                headers: {
                    'accept': 'application/json',
                },
            });
            if (response.data.status === 'success') {
                const fetchedItems = response.data.data.map(item => ({
                    ...item,
                    quantity: 0,
                }));
                setItems(fetchedItems);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://greenfeast.space/api/order/category/get-all', {
                    headers: {
                        'accept': 'application/json',
                    },
                });
                if (response.data.status === 'success') {
                    setCategories(['Đề xuất', ...response.data.data.map(cat => cat.name)]);
                    setActiveCategory('Đề xuất');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
        fetchMenuItems(); // Đảm bảo hàm này được gọi khi khởi động
    }, [fetchMenuItems]);

    const fetchItemsByCategory = useCallback(async (categoryId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://greenfeast.space/api/order/menu/get-by-category/${categoryId}`, {
                headers: {
                    'accept': 'application/json',
                },
            });
            if (response.data.status === 'success') {
                const fetchedItems = response.data.data.map(item => ({
                    ...item,
                    quantity: 0,
                }));
                setItems(fetchedItems);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuantity = useCallback((id, amount) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item._id === id
                    ? { ...item, quantity: Math.max(item.quantity + amount, 0) }
                    : item
            );

            const updatedItem = updatedItems.find(item => item._id === id);
            if (updatedItem) {
                if (updatedItem.quantity > 0) {
                    setCart(prevCart => {
                        const itemIndex = prevCart.findIndex(cartItem => cartItem._id === id);
                        if (itemIndex === -1) {
                            return [...prevCart, updatedItem];
                        } else {
                            const newCart = [...prevCart];
                            newCart[itemIndex] = updatedItem;
                            return newCart;
                        }
                    });
                } else {
                    setCart(prevCart => prevCart.filter(cartItem => cartItem._id !== id));
                }

                setCartQuantity(prevQuantity => {
                    const quantityInCart = updatedItems.reduce((sum, item) => sum + (item.quantity > 0 ? item.quantity : 0), 0);
                    return quantityInCart;
                });
            }

            return updatedItems;
        });
    }, []);

    const goToCart = useCallback(() => {
        navigation.navigate('CartScreen', { cart, accessToken });
    }, [cart, accessToken, navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Giá: {item.price}₫</Text>
            <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                    <Ionicons
                        key={index}
                        name="star"
                        size={20}
                        color="#FFD700"
                    />
                ))}
            </View>
            <View style={styles.quantityContainer}>
                <TouchableOpacity
                    onPress={() => updateQuantity(item._id, -1)}
                    style={[styles.quantityButton, item.quantity === 0 && styles.quantityButtonDisabled]}
                    disabled={item.quantity === 0}
                >
                    <Ionicons name="remove-outline" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                    onPress={() => updateQuantity(item._id, 1)}
                    style={styles.quantityButton}
                >
                    <Ionicons name="add-outline" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryItem, activeCategory === item && styles.activeCategoryItem]}
            onPress={() => {
                setActiveCategory(item);
                const categoryId = categories.indexOf(item);
                if (categoryId === 0) {
                    fetchMenuItems(); // Gọi lại API Đề xuất
                } else {
                    fetchItemsByCategory(categoryId);
                }
            }}
        >
            <Text style={styles.categoryText}>{item}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Đặt Món</Text>
                <TouchableOpacity style={styles.cartIcon} onPress={goToCart}>
                    <Ionicons name="cart-outline" size={30} color="white" />
                    {cartQuantity > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.menuContainer}
                style={{ maxHeight: 50 }}
            />

            <FlatList
                data={items.filter(item => activeCategory === 'Đề xuất' || item.category_id === categories.indexOf(activeCategory))}
                renderItem={renderItem}
                keyExtractor={item => item._id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.itemsList}
                style={{ flex: 1 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    cartIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        right: -10,
        top: -10,
        backgroundColor: '#FFD700',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontWeight: 'bold',
    },
    menuContainer: {
        paddingVertical: 5,
    },
    categoryItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    activeCategoryItem: {
        backgroundColor: '#4CAF50',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemsList: {
        paddingHorizontal: 5,
        paddingBottom: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 10,
        width: '48%',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityButton: {
        backgroundColor: '#4CAF50',
        padding: 5,
        borderRadius: 5,
    },
    quantityButtonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
