import { View, Text } from 'react-native';
import React from 'react';
import { TabsStackScreenProps } from '../Navigation/TabsNavigation';

const ProductDetails = ({ route, navigation }: TabsStackScreenProps<"ProductDetails">) => {
    const { productId } = route.params;

    return (
        <View>
            <Text>Product Details Screen</Text>
            <Text>Product ID: {productId}</Text>
        </View>
    );
};

export default ProductDetails;