import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { CategoryParams, CategoryStyleProps, CategoryCardProps } from '../../TypesCheck/HomeProp';

interface Props {
    item: CategoryParams;
    catProps: CategoryCardProps;
    catStyleProps: CategoryStyleProps;
}

export const CategoryCard = ({ item, catProps, catStyleProps }: Props) => {
    const isActive = item._id === catProps.activeCat;

    return (
        <TouchableOpacity
            style={[styles.container, {
                backgroundColor: isActive ? '#FFA500' : '#FFFFFF',
                width: catStyleProps.width,
                height: catStyleProps.height,
                borderRadius: catStyleProps.radius
            }]}
            onPress={catProps.onPress}
        >
            <Image
                source={{ uri: item.images[0] }}
                style={styles.image}
                resizeMode={catStyleProps.resizeMode}
            />
            <Text style={[styles.text, {
                color: isActive ? '#FFFFFF' : '#000000'
            }]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: '80%',
        height: '60%',
        borderRadius: 10,
    },
    text: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    }
});