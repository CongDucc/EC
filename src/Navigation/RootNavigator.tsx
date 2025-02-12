import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import OnboardingScreen from "../Screens/OnboardingScreen"

import TabsNavigator, {TabsStackParams} from "./TabsNavigation"
import { NavigatorScreenParams } from "@react-navigation/native"


export type RootStackParams = {
    OnboardingScreen: undefined
    TabsStack: undefined
}

const RootStack = createNativeStackNavigator<RootStackParams>();
export type RootStackScreenProps<T extends keyof RootStackParams> = NativeStackScreenProps<RootStackParams, T>;

const RootNavigator = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="TabsStack"
                component={TabsNavigator}
                options={{ headerShown: false }}
            />
        </RootStack.Navigator>
    )
}

export default RootNavigator
