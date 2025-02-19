import React, { useState, useRef } from "react";
import { View, Dimensions, Animated, StyleSheet, Image } from "react-native";
import { useInterval } from "../../Hooks/useInterval";
import { ImageSourcePropType } from "react-native";

interface ImageProps {
    images: ImageSourcePropType[];
}

const Max_Width = Dimensions.get("screen").width;

const ImageSlider = ({ images }: ImageProps) => {
    const animation = useRef(new Animated.Value(0));
    const [currentImage, setCurrentImage] = useState(0);

    const handleAnimation = () => {
        let newCurrentImage = currentImage + 1;
        if (newCurrentImage >= images.length) {
            newCurrentImage = 0;
        }

        Animated.spring(animation.current, {
            toValue: -(Max_Width * newCurrentImage),
            useNativeDriver: true,
        }).start();

        setCurrentImage(newCurrentImage);
    };

    useInterval(() => handleAnimation(), 3000);

    return (
        <View style={styles.sliderContainer}>
            <Animated.View
                style={[
                    styles.slider,
                    {
                        transform: [{ translateX: animation.current }],
                        width: Max_Width * images.length,
                    },
                ]}
            >
                {images.map((image, index) => (
                    <Image
                        key={index}
                        source={image}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ))}
            </Animated.View>
            <View style={styles.dotContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: currentImage === index ? '#FFA500' : '#ccc' }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        height: 220,
        overflow: 'hidden',
        position: 'relative'
    },
    slider: {
        height: '100%',
        flexDirection: 'row'
    },
    image: {
        width: Max_Width,
        height: '100%'
    },
    dotContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4
    }
});

export default ImageSlider;