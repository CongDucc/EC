import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {GoBack} from "./GoBackButton";

interface IHeaderParams {
    goToPrevios?: () => void;
    search?: () => void;
    cartLength?: number;
    gotoCartScreen?: () => void;
}

export const HeadersComponent = ({ goToPrevios, search, cartLength, gotoCartScreen }: IHeaderParams) => {
    const [searchInput, setSearchInput] = useState("");
    
    return (
        <View style={{ backgroundColor: "#000", padding: 10, flexDirection: "row", alignItems: "center" }}>
            <GoBack onPress={goToPrevios} />
            <Pressable 
                style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginHorizontal: 7,
                    gap: 10, 
                    backgroundColor: "white", 
                    borderRadius: 10, 
                    height: 38, 
                    flex: 1
                }}
            >

                <Pressable style = {{padding: 10}} onPress={search}>
                    <AntDesign name="search1" size={20} color="blue" />
                </Pressable>

                <TextInput
                    value={searchInput}
                    onChangeText={setSearchInput}
                    placeholder="Search"
                />
            </Pressable>

            <Pressable onPress={gotoCartScreen}>
                <View style = {styles.cartNum}>
                    <Text style = {{color: "pink"}}>
                        {cartLength}
                    </Text>
                </View>
                <MaterialIcons name = "shopping-cart" size={24} color={"white"} style = {{padding: 5, marginTop: 3}} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    cartNum: {
        position: "absolute",
        right: 0,
        top: -5,
        backgroundColor: "red",
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
});


export default HeadersComponent;    