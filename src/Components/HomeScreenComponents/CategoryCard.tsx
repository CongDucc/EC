import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { getImageUrl } from '../../middleware/HomeMiddleware';
import { Props } from '../../TypesCheck/HomeProp';

export const CategoryCard = ({ item, catProps, catStyleProps }: Props) => {
    const imageUrl = getImageUrl(item.images[0]);
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
                source={{
                    uri: getImageUrl(item.images[0]) || undefined
                }}
                style={styles.image}
                resizeMode={catStyleProps.resizeMode}
                defaultSource={require('../../../assets/cat404.jpg')}
                onError={(e) => {
                    console.log('Category image load error:', e.nativeEvent.error);
                }}
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
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    text: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
    }
});