import React from 'react'
import { View } from 'react-native'
import { Text, Surface, TouchableRipple, MD3Colors } from 'react-native-paper'
const LineThickness = ({ value, color, selected, handleClick }: { value: number, selected: boolean, color: string, handleClick: (state: number) => void; }) => {
    return (
        <Surface style={{
            width: 80,
            height: 40,
            borderColor: selected ? MD3Colors.primary40 : '#eeeeee',
            borderRadius: 5,
            borderWidth: 2,
            backgroundColor: selected ? MD3Colors.primary90 : 'white',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <TouchableRipple
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 50,
                }}
                onPress={() => handleClick(value)}
                rippleColor="rgba(0, 0, 0, .32)"
            >
                <>
                    <View style={{ gap: 2, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: '600' }}>{value}</Text>
                        <Text>px </Text>
                    </View>
                    <View style={{
                        width: '90%',
                        height: value,
                        backgroundColor: color
                    }}>
                    </View>
                </>
            </TouchableRipple>
        </Surface >

    )
}

export default LineThickness