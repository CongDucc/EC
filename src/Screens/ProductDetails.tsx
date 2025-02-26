import {
    View,
    Image,
    Text,
    Platform,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Pressable
} from 'react-native'
import React, { useState } from 'react'
import { TabsStackScreenProps } from '../Navigation/TabsNavigation'
import HeaderComponent, { HeadersComponent } from '../Components/HeaderComponents/HeaderComponent'
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { getImageUrl } from '../middleware/HomeMiddleware'
import { addToCart } from '../redux/CartReducer'
import { useDispatch, useSelector } from 'react-redux'
import { CartState, ProductListParams } from '../TypesCheck/productCartTypes'
import DisplayMessage from '../Components/ProductDetails/DisplayMessage'

const { width } = Dimensions.get('window')

const ProductDetails = ({ navigation, route }: TabsStackScreenProps<"ProductDetails">) => {
    const { _id, name, price, oldPrice, description, images } = route.params;
    const [quantity, setQuantity] = useState(1);
    const [inStock] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const cart = useSelector((state: CartState) => state.cart.cart);
    const dispatch = useDispatch();
    const [addedToCart, setAddedToCart] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [displayMessage, setDisplayMessage] = React.useState<boolean>(false);
    const productItemObj: ProductListParams = route.params as ProductListParams;

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const addItemToCart = (ProductItemObj: ProductListParams) => {
        if (ProductItemObj.quantity <= 0) {
            setMessage("Product is out of stock.");
            setDisplayMessage(true);
            setTimeout(() => {
                setDisplayMessage(false);
            }, 3000);
        } else {
            const findItem = cart.find((product) => product._id === ProductItemObj._id);
            if (findItem) {
                setMessage("Product is already in cart.");
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                }, 3000);
            } else {
                setAddedToCart(!addedToCart);
                dispatch(addToCart(ProductItemObj));
                setMessage("Product added to cart successfully.");
                setDisplayMessage(true);
                setTimeout(() => {
                    setDisplayMessage(false);
                }, 3000);
            }
        }
    };



    const gotoCartScreen = () => {
        if (cart.length === 0) {
            setMessage("Cart is empty. Please add products to cart.");
            setDisplayMessage(true);
            setTimeout(() => {
                setDisplayMessage(false);
            }, 3000);
        } else {
            navigation.navigate("TabsStack", {
                screen: "Cart",
                params: {} // Add empty params object
            });
        }
    };

    const goToPreviousScreen = () => {
        if (navigation.canGoBack()) {
            console.log("Chuyển về trang trước.");
            navigation.goBack();
        } else {
            console.log("Không thể quay lại, chuyển về trang Onboarding.");
            navigation.navigate("OnboardingScreen");  // Điều hướng fallback nếu không quay lại được
        }
    };

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase' && quantity < 10) {
            setQuantity(prev => prev + 1)
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }




    return (
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? 20 : 0, flex: 1, backgroundColor: "white" }}>
            {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
            <HeadersComponent gotoCartScreen={gotoCartScreen} cartLength={cart.length} goToPrevios={goToPreviousScreen} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            images?.[0]
                                ? { uri: getImageUrl(images[0]) || '' }
                                : require('../../assets/cat404.jpg')
                        }
                        style={styles.productImage}
                        resizeMode="cover"
                        defaultSource={require('../../assets/cat404.jpg')}
                    />
                    {/* Heart Button */}
                    <TouchableOpacity
                        style={styles.heartButton}
                        onPress={toggleFavorite}
                    >
                        <AntDesign
                            name={isFavorite ? "heart" : "hearto"}
                            size={24}
                            color={isFavorite ? "#FF6B6B" : "#fff"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.contentContainer}>
                    {/* Name */}
                    <Text style={styles.productName}>{name}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{description}</Text>

                    {/* Price Section */}
                    <View style={styles.priceContainer}>
                        {oldPrice && (
                            <Text style={styles.oldPrice}>${oldPrice}</Text>
                        )}
                        <Text style={[styles.price, !!oldPrice && styles.discountedPrice]}>
                            ${price}
                        </Text>
                    </View>

                    {/* Stock Status */}
                    <View style={styles.stockContainer}>
                        <Feather
                            name={inStock ? "check-circle" : "x-circle"}
                            size={20}
                            color={inStock ? "#2ECC71" : "#FF6B6B"}
                        />
                        <Text style={[
                            styles.stockStatus,
                            { color: inStock ? "#2ECC71" : "#FF6B6B" }
                        ]}>
                            {inStock ? "In Stock" : "Out of Stock"}
                        </Text>
                    </View>

                    {/* Quantity Section */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantity:</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange('decrease')}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleQuantityChange('increase')}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Delivery Section */}
                    <View style={styles.deliveryContainer}>
                        <Text style={styles.deliveryTitle}>Delivery</Text>
                        <View style={styles.deliveryInfoContainer}>
                            <Feather name="truck" size={20} color="#2ECC71" />
                            <View style={styles.deliveryTextContainer}>
                                <Text style={styles.deliveryStatus}>
                                    Delivery is available
                                </Text>
                                <Text style={styles.deliveryAddress}>
                                    Delivery to: 7/1 Đ. Thành Thái, Phường 14, Quận 10, Hồ Chí Minh 700000
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.addToCartButton, !inStock && styles.disabledButton]}
                    disabled={!inStock}
                    onPress={() => addItemToCart({
                        _id,
                        name,
                        price,
                        oldPrice,
                        description,
                        images: [images[0] || ''],
                        quantity,
                        inStock
                    })}
                >
                    <Text style={styles.addToCartText}>
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Text>
                </TouchableOpacity>
            </View>
            {displayMessage && (
                <View style={styles.notificationContainer}>
                    <Text style={styles.notificationText}>{message}</Text>
                </View>
            )}




        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? 20 : 0,
    },
    scrollContent: {
        flexGrow: 1,
    },
    imageContainer: {
        width: width,
        height: width * 0.8,
        backgroundColor: '#f5f5f5',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2ECC71',
    },
    oldPrice: {
        fontSize: 18,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    discountedPrice: {  // Add this style
        marginLeft: 10,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stockStatus: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityLabel: {
        fontSize: 16,
        color: '#333',
        marginRight: 15,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    quantityButton: {
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    quantityButtonText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    quantityValue: {
        paddingHorizontal: 20,
        fontSize: 16,
    },
    bottomContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    addToCartButton: {
        backgroundColor: '#2ECC71',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    heartButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        borderRadius: 20,
        zIndex: 1,
    },
    deliveryContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    deliveryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    deliveryInfoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    deliveryTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    deliveryStatus: {
        fontSize: 16,
        color: '#2ECC71',
        fontWeight: '500',
        marginBottom: 5,
    },
    deliveryAddress: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },

    notificationContainer: {
        position: 'absolute',
        top: Platform.OS === "android" ? 80 : 60,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        borderRadius: 8,
        zIndex: 999,
        alignItems: 'center',
    },
    notificationText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProductDetails;