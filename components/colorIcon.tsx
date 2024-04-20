import React from 'react'
import { IconButton, Surface, TouchableRipple } from 'react-native-paper'

const ColorIcon = ({ value, selected, handleClick }: { value: string, selected: boolean, handleClick: (state: string) => void; }) => {

    return (
        <Surface style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            backgroundColor: value,
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
                {selected ? <IconButton iconColor='white' icon={'check-circle'} /> : <></>}
            </TouchableRipple>
        </Surface>
    )
}

export default ColorIcon