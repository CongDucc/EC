
import { View, Text } from 'react-native'
import React from 'react'
import { TabsStackScreenProps } from '../Navigation/TabsNavigation'

type Props = {}

const CartScreen = ({navigation, route} : TabsStackScreenProps<"Cart">) => {
  return (
    <View>
      <Text>CartScreen</Text>
    </View>
  )
}

export default CartScreen