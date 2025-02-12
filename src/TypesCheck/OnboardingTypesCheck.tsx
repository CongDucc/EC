import { AnimationObject } from "lottie-react-native";
import { SharedValue, AnimatedRef } from "react-native-reanimated";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

export interface OnboardingPrograms {
    _id: string;
    text: string;
    textColor: string;
    backgroundColor: string;
    imageUrl: AnimationObject;
}

export interface OnboardingItemsObj {
    item: OnboardingPrograms;
    index: number;
    x: SharedValue<number>;
}

export interface OnboardingPaginationParams {
    item: OnboardingPrograms[];
    x: SharedValue<number>;
}

export interface onboardingDotParams {
    index: number;
    x: SharedValue<number>;
}

export interface onboardingButtonParams {
    flatListIndex: SharedValue<number>;
    flatListRef: AnimatedRef<FlatList <OnboardingPrograms>>;
    intemLength: number;
    x: SharedValue<number>;
}

