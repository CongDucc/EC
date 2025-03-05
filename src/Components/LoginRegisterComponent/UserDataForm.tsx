import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Animated, StyleSheet, Easing, TextInput, View, Text, KeyboardTypeOptions } from "react-native";

const width = (Dimensions.get("screen").width * 2) / 3 + 50;

interface IUserForm {
    label: string;
    duration?: number;
    labelColor?: string;
    text?: string;
    updateText?: (text: string) => void;
    isPasswordField?: boolean;
    error?: string;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
}

export const UserDataForm = ({
    label,
    duration = 300,
    labelColor = "black",
    text = "",
    updateText = () => {},
    isPasswordField = false,
    error,
    keyboardType = "default",
    maxLength,
}: IUserForm) => {
    const transY = useRef(new Animated.Value(0)).current;
    const borderWidth = useRef(new Animated.Value(1)).current;
    
    // Set initial state for labels if text exists
    useEffect(() => {
        if (text) {
            transformAnimation(-13);
            animatedBorderWidth(2);
        }
    }, []);
    
    const borderColor = borderWidth.interpolate({
        inputRange: [1, 2],
        outputRange: ["black", error ? "#cc0000" : "orange"],
        extrapolate: "clamp",
    });
    
    const labelColorAnimation = borderWidth.interpolate({
        inputRange: [1, 2],
        outputRange: ["grey", error ? "#cc0000" : labelColor],
        extrapolate: "clamp",
    });
    
    const animStyle = {
        transform: [{ translateY: transY }],
    };
    
    const labelFontSize = borderWidth.interpolate({
        inputRange: [1, 2],
        outputRange: [14, 10],
        extrapolate: "clamp",
    });
    
    const labelBackgroundColor = borderWidth.interpolate({
        inputRange: [1, 2],
        outputRange: ["#fff", "#eee"],
        extrapolate: "clamp",
    });
    
    const labelPadding = borderWidth.interpolate({
        inputRange: [1, 2],
        outputRange: [4, 0],
        extrapolate: "clamp",
    });
    
    const transformAnimation = (toValue: number) => {
        Animated.timing(transY, {
            toValue,
            duration,
            useNativeDriver: true,
            easing: Easing.ease,
        }).start();
    };
    
    const animatedBorderWidth = (toValue: number) => {
        Animated.timing(borderWidth, {
            toValue,
            duration,
            useNativeDriver: false,
            easing: Easing.ease,
        }).start();
    };
    
    const onFocusHandle = () => {
        transformAnimation(-13);
        animatedBorderWidth(2);
    };
    
    const onBlurHandler = () => {
        if (text) return;
        transformAnimation(0);
        animatedBorderWidth(1);
    };

    return (
        <View>
            <Animated.View
                style={[
                    st.container,
                    { borderWidth: borderWidth, borderColor: borderColor },
                    error ? st.errorContainer : {},
                ]}
            >
                <Animated.View style={[st.animatedStyle, animStyle]}>
                    <Animated.Text
                        style={{
                            color: labelColorAnimation,
                            fontSize: labelFontSize,
                            backgroundColor: labelBackgroundColor,
                            padding: labelPadding,
                        }}
                    >
                        {label}
                    </Animated.Text>
                </Animated.View>
                <TextInput
                    style={st.input}
                    value={text}
                    onChangeText={updateText}
                    editable={true}
                    onFocus={onFocusHandle}
                    onBlur={onBlurHandler}
                    blurOnSubmit
                    autoCapitalize={"none"}
                    secureTextEntry={isPasswordField}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                />
            </Animated.View>
            {error ? <Text style={st.errorText}>{error}</Text> : null}
        </View>
    );
};

const st = StyleSheet.create({
    container: {
        marginTop: 20,
        height: 58,
        backgroundColor: "#fff",
        borderRadius: 8,
        width: width,
        alignSelf: "center",
    },
    errorContainer: {
        borderColor: "#cc0000",
    },
    input: {
        fontSize: 13,
        height: 35,
        color: "#000",
        padding: 10,
    },
    animatedStyle: {
        top: 5,
        left: 15,
        position: "absolute",
        borderRadius: 90,
        zIndex: 10,
    },
    errorText: {
        color: "#cc0000",
        fontSize: 12,
        marginTop: 4,
        marginLeft: 15,
        marginBottom: -12,
    }
});