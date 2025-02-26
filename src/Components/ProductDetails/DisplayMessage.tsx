import { View, Text, Dimensions } from 'react-native'
import React from 'react'

interface displayMessage {
    message?: string;
    visible?: () => void;
}

const { width }: any = Dimensions.get("window");

const DisplayMessage = ({ message, visible }: displayMessage) => {
    return (
        <View
            style={{
                zIndex: 9999,
                backgroundColor: 'rgba(28, 1, 40, 0.7)',
                position: 'absolute',
                bottom: 120,
                width: width,
                height: 55,
                marginTop: 15,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Text
                style={{
                    fontStyle: 'normal',
                    fontSize: 20,
                    color: 'yellow',
                    textAlign: 'center'
                }}
            >
                {message}
            </Text>
        </View>
    );
}

export default DisplayMessage;
