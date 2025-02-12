import { View, Text, useWindowDimensions, StyleSheet } from 'react-native'
import React from 'react'
import { onboardingDotParams } from '../../TypesCheck/OnboardingTypesCheck'
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle } from 'react-native-reanimated'

type Props = {}

const OnboardingDots = ({ index, x }: onboardingDotParams) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();

    const animatedDotStyle = useAnimatedStyle(() => {
        const widthAnimation = interpolate(x.value, 
            [
                (index - 1) * SCREEN_WIDTH, 
                index * SCREEN_WIDTH, 
                (index + 1) * SCREEN_WIDTH
            ],
            [10, 30, 10], 
            Extrapolation.CLAMP
        );

        const opacityAnimation = interpolate(x.value, 
            [
                (index - 1) * SCREEN_WIDTH, 
                index * SCREEN_WIDTH, 
                (index + 1) * SCREEN_WIDTH
            ],
            [1, 2, 1], 
            Extrapolation.CLAMP
        );

        return {
            width: widthAnimation,
            opacity: opacityAnimation
        }
    });

    const colorAnimation = useAnimatedStyle(() => {
        const background = interpolateColor(x.value,
            [
                0,
                SCREEN_WIDTH,
                2 * SCREEN_WIDTH
            ],
            ["#8a14d4", "#39d4ba", "#F14546"],
        )
        return {
            backgroundColor: background
        }
    })
    return (
        <Animated.View style={[styles.dots, animatedDotStyle, colorAnimation]} />
    )
};

export default OnboardingDots;

const styles = StyleSheet.create({
    dots: {
        height: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    }
});
