import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { onboardingButtonParams } from '../../TypesCheck/OnboardingTypesCheck';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../Navigation/RootNavigator';


type Props = {}

const OnboardingButton = ({ flatListIndex, flatListRef, intemLength, x }: onboardingButtonParams) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();

    const buttonAnimation = useAnimatedStyle(() => {
        return {
            width:
                flatListIndex.value === intemLength - 1 ?
                    withSpring(140) : withSpring(60),
            height: 60,
        }
    });

    const arrowAnimation = useAnimatedStyle(() => {
        return {
            opacity: flatListIndex.value === intemLength - 1 ? withSpring(0) : withSpring(1),
            width: 30,
            height: 30,
            transform: [
                {
                    translateX: flatListIndex.value === intemLength - 1 ? withSpring(100) : withSpring(0)
                }
            ]
        }
    });

    const textAnimation = useAnimatedStyle(() => {
        return {
            opacity: flatListIndex.value === intemLength - 1 ? withSpring(1) : withSpring(0),
            transform: [
                {
                    translateX: flatListIndex.value === intemLength - 1 ? withSpring(0) : withSpring(100)
                }
            ]
        }
    });

    const colorAnimation = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            x.value,
            [
                0, SCREEN_WIDTH, 2 * SCREEN_WIDTH
            ],
            ["#c80dfc", "#250dfc", "#251357"]
        );
        return {
            backgroundColor: backgroundColor
        }
    });

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (flatListIndex.value < intemLength - 1) {
                    flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
                }
                else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "TabsStack" }]
                    });                    
                }
            }}
        >

            <Animated.View
                style={[styles.container, buttonAnimation, colorAnimation]}

            >
                <Animated.Text
                    style={[styles.textButton, textAnimation]}
                >
                    Get Started
                </Animated.Text>

                <Animated.Image
                    source={(require('../../../assets/onboarding/nextIcon.png'))}
                    style={[styles.arrow, arrowAnimation]}
                />

            </Animated.View>
        </TouchableWithoutFeedback>
    );
}   

const styles = StyleSheet.create({
        container: {
            backgroundColor: "#c822fc",
            padding: 10,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
        arrow: {
            position: "absolute",
        },
        textButton: {
            color: "#fff",
            fontSize: 20,
            position: "absolute",
        }    
});

export default OnboardingButton;