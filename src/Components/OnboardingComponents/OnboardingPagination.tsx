import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { OnboardingPaginationParams } from '../../TypesCheck/OnboardingTypesCheck'
import OnboardingDots from './OnboardingDots'

type Props = {}

const OnboardingPagination = ({ item, x }: OnboardingPaginationParams) => {
    return (
        <View style={styles.paginationContainer}>
            {item.map((_, index) => {
                return <OnboardingDots index={index} x={x} key={index} />
            })}
        </View>
    )
}

export default OnboardingPagination

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 40
    }
})
