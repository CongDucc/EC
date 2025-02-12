import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";

export interface IGoBack {
    onPress?: () => void;
}

export const GoBack = ({ onPress }: IGoBack) => {
    return (
        <Pressable onPress={onPress}>
            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
        </Pressable>
    );
}

export default GoBack;