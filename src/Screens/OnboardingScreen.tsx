import { View, Text, ViewToken } from "react-native";
import React, { useState } from "react";
import { RootStackScreenProps } from "../Navigation/RootNavigator";
import { OnboardingPrograms } from "../TypesCheck/OnboardingTypesCheck";
import { OnboardingData } from "../Data/EcommerceAppData";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import OnboardingItems from "../Components/OnboardingComponents/OnboardingItems";
import { ReanimatedFlatList } from "react-native-reanimated/lib/typescript/component/FlatList";
import OnboardingPagination from "../Components/OnboardingComponents/OnboardingPagination";
import OnboardingButton from "../Components/OnboardingComponents/OnboardingButton";
import { useAnimatedRef } from "react-native-reanimated";

type Props = {}

const OnboardingScreen = ({ navigation, route }: RootStackScreenProps<"OnboardingScreen">) => {
    const [onboardingItems, setOnboardingItems] = useState<OnboardingPrograms[]>(OnboardingData);
    const flatListRef = useAnimatedRef<ReanimatedFlatList<OnboardingPrograms>>();
    const x = useSharedValue(0);

    const flatListIndex = useSharedValue(0);
    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            x.value = event.contentOffset.x;
        }
    });

    const onViewableItemsChanged = ({
        viewableItems,
    }: {
        viewableItems: ViewToken[]
    }) => {
        if (viewableItems[0].index !== null) {

            flatListIndex.value = viewableItems[0].index;
        }

    }


    return (
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                ref={flatListRef}
                onScroll={onScrollHandler}
                data={onboardingItems}
                renderItem={({ item, index }) => (
                    <OnboardingItems item={item} index={index} x={x} />
                )}
                keyExtractor={item => item._id}
                scrollEventThrottle={17}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    minimumViewTime: 300,
                    viewAreaCoveragePercentThreshold: 10
                }}
            />

            <View
                style={{}}
            >
                <OnboardingPagination item={onboardingItems} x={x} />
                <OnboardingButton
                    x={x} intemLength={onboardingItems.length}
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                />
            </View>

        </View>
    );
};

export default OnboardingScreen;
