import { View, Text, Platform, ScrollView, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider";
import { ProductListParams, CategoryParams } from "../TypesCheck/HomeProp";
import { CategoryCard } from "../Components/HomeScreenComponents/CategoryCard";
import { fetchCategories, fetchProductsByCatID } from '../middleware/HomeMiddleware';

const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const [getCategory, setGetCategory] = useState<CategoryParams[]>([]);
  const [getProductsByCatID, setGetProductsByCatID] = useState<ProductListParams[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sliderImages = [
    require("../../assets/product1.jpg"),
    require("../../assets/product2.jpg"),
    require("../../assets/product3.jpg"),
  ];

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
    if (activeCat) {
      const loadProducts = async () => {
        setIsProductLoading(true);
        try {
          await fetchProductsByCatID({ setGetProductsByCatID, catID: activeCat });
        } catch (err) {
          setError('Failed to load products');
        } finally {
          setIsProductLoading(false);
        }
      };
      loadProducts();
    }
  }, [activeCat]);

  return (
    <SafeAreaView style={styles.container}>
      <HeadersComponent gotoCartScreen={() => navigation.navigate("Cart")} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Slider Section */}
        <View style={styles.sliderWrapper}>
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getCategory.map((item) => (
                <CategoryCard
                  key={item._id}
                  item={item}
                  catProps={{
                    activeCat,
                    onPress: () => setActiveCat(item._id)
                  }}
                  catStyleProps={{
                    width: 100,
                    height: 100,
                    radius: 10,
                    resizeMode: "cover"
                  }}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Products Section */}
        <View style={styles.productSection}>
          <Text style={styles.sectionTitle}>Products</Text>
          {isProductLoading ? (
            <Text style={styles.loadingText}>Loading products...</Text>
          ) : getProductsByCatID.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getProductsByCatID.map((product) => (
                <View key={product._id} style={styles.productCard}>
                  <Image
                    source={{
                      uri: product.images[0].replace('localhost:8888', Platform.OS === 'android' ? '10.106.20.189:9000' : 'localhost:9000')
                    }}
                    style={styles.productImage}
                    resizeMode="cover"
                    defaultSource={require('../../assets/placeholder.jpg')} // Add fallback image
                  />
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noProductsText}>
              {activeCat ? 'No products in this category' : 'Select a category to view products'}
            </Text>
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
  sliderWrapper: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  categorySection: {
    padding: 15,
  },
  productSection: {
    padding: 15,
    marginTop: 10,
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
  }
});

export default HomeScreen;