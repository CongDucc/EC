import {
  View,
  Text,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
import React, { useState, useEffect } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider";
import { ProductListParams, CategoryParams } from "../TypesCheck/HomeProp";
import { CategoryCard } from "../Components/HomeScreenComponents/CategoryCard";
import { fetchCategories, fetchProductsByCatID, fetchProductsByPrice, getImageUrl } from '../middleware/HomeMiddleware';
import { CartState } from "../TypesCheck/productCartTypes";
import { useSelector } from "react-redux";
import DisplayMessage from "../Components/ProductDetails/DisplayMessage";

const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const [getCategory, setGetCategory] = useState<CategoryParams[]>([]);
  const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [activePrice, setActivePrice] = useState<number | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cart = useSelector((state: CartState) => state.cart.cart);
  const [message, setMessage] = React.useState("");
  const [displayMessage, setDisplayMessage] = React.useState<boolean>(false);

  const sliderImages = [
    require('../../assets/product1.jpg'),
    require('../../assets/product2.jpg'),
    require('../../assets/product3.jpg'),
  ];

  const { width } = Dimensions.get('window');

  const gotoCartScreen = () => {
    if (cart.length === 0) {
      setMessage("Cart is empty. Please add products to cart.");
      setDisplayMessage(true);
      setTimeout(() => {
        setDisplayMessage(false);
      }, 3000);
    } else {
      navigation.navigate("TabsStack", { screen: "Cart" });
    }
  };

  const goToPreviousScreen = () => {
    if (navigation.canGoBack()) {
      console.log("Chuyển về trang trước.");
      navigation.goBack();
    } else {
      console.log("Không thể quay lại, chuyển về trang Onboarding.");
      navigation.navigate("OnboardingScreen"); // Điều hướng fallback nếu không quay lại được
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      setIsCategoryLoading(true);
      try {
        await fetchCategories({ setGetCategory });
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Category loading error:', err);
      } finally {
        setIsCategoryLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsProductLoading(true);
      try {
        if (activeCat) {
          await fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
        } else if (activePrice !== null) {
          await fetchProductsByPrice({ setGetProductsByCatID, maxPrice: activePrice });
        } else {
          await fetchProductsByCatID({ setGetProductsByCatID, catID: '' });
        }
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Product loading error:', err);
      } finally {
        setIsProductLoading(false);
      }
    };
    loadProducts();
  }, [activeCat, activePrice]);

  const handlePriceFilter = (price: number | null) => {
    setActivePrice(price);
    setActiveCat("");
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? 1 : 0, flex: 1, backgroundColor: "white" }}>
      {displayMessage && <DisplayMessage message={message} visible={() => setDisplayMessage(!displayMessage)} />}
      <HeadersComponent gotoCartScreen={gotoCartScreen} cartLength={cart.length} goToPrevios={goToPreviousScreen} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Slider Section */}
        <View style={styles.sliderSection}>
          <ImageSlider images={sliderImages} />
        </View>

        {/* Categories Section */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          {isCategoryLoading ? (
            <Text style={styles.loadingText}>Loading categories...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {getCategory.map((item, index) => (
                <CategoryCard
                  key={index}
                  item={{
                    name: item.name,
                    images: [item.images[0]],
                    _id: item._id
                  }}
                  catStyleProps={{
                    height: 70,
                    width: 70,
                    radius: 35,
                    resizeMode: "cover",
                  }}
                  catProps={{
                    activeCat: activeCat,
                    onPress: () => {
                      setActiveCat(item._id);
                      setActivePrice(null);
                    },
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Price Filters Section */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Price Filters</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterButton, !activePrice && !activeCat && styles.activeFilter]}
              onPress={() => {
                handlePriceFilter(null);
                setActiveCat("");
              }}
            >
              <Text style={[styles.filterText, !activePrice && !activeCat && styles.activeFilterText]}>
                All Prices
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activePrice === 200 && styles.activeFilter]}
              onPress={() => handlePriceFilter(200)}
            >
              <Text style={[styles.filterText, activePrice === 200 && styles.activeFilterText]}>
                Under $200
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activePrice === 1000 && styles.activeFilter]}
              onPress={() => handlePriceFilter(1000)}
            >
              <Text style={[styles.filterText, activePrice === 1000 && styles.activeFilterText]}>
                Under $1000
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>
            {activeCat ? 'Selected Category' : activePrice ? `Products under $${activePrice}` : 'All Products'}
          </Text>
          {isProductLoading ? (
            <Text style={styles.loadingText}>Loading products...</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getProductsByCatID?.length > 0 ? (
                getProductsByCatID.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.productCard}
                    onPress={() => navigation.navigate("ProductDetails", {
                      _id: item._id,
                      name: item.name,
                      price: item.price,
                      oldPrice: item.oldPrice,
                      description: item.description,
                      images: item.images,
                      inStock: true,
                      quantity: 1
                    })}
                  >
                    <Image
                      source={{
                        uri: getImageUrl(item.images[0]) || undefined
                      }}
                      style={styles.productImage}
                      resizeMode="cover"
                      defaultSource={require('../../assets/cat404.jpg')}
                      onError={(e) => {
                        console.log('Image load error:', e.nativeEvent.error);
                      }}
                    />
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noProductsText}>No products available</Text>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  sliderSection: {
    height: 200,
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  categorySection: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingVertical: 10,
    gap: 15,
  },
  productSection: {
    padding: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 10,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    padding: 10,
  },
  noProductsText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  productCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ECC71',
  },
  filterSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilter: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;