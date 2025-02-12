import { View, Text, Platform, ScrollView } from "react-native";
import React from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider"

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
  const gotoCartScreen = () => {
    navigation.navigate("Cart");
  };

  const sliderImage = [
    require("../../assets/product1.jpg"),
    require("../../assets/product2.jpg"),
    require("../../assets/product3.jpg")
];

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <HeadersComponent gotoCartScreen={gotoCartScreen} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageSlider images={sliderImage} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
