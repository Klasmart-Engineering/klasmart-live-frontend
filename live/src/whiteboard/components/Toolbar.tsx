import React, { useState } from 'react'
import { ColorResult, CompactPicker } from 'react-color'
import { Slider, Button } from '@material-ui/core'
import { useWhiteboard } from '../context-provider/WhiteboardContextProvider'

export function Toolbar () : JSX.Element {
    const { state, actions: { clear, setBrush } } = useWhiteboard()

    const [selectColor, setSelectColor] = useState(false)

    const handleSetColor = (color: ColorResult) => { 
        const newBrush = {...state.brushParameters}
        
        setSelectColor(false)
        
        newBrush.style = color.hex
        setBrush(newBrush)
    }

    const handleSetLineWidth = (value: number | number[]) => {
        if (typeof value !== 'number') {
            return
        }
        
        const newBrush = {...state.brushParameters}

        newBrush.width = value
        setBrush(newBrush)
    }

    const handleDisplayColor = () => { 
        setSelectColor(!selectColor)
    }

    return (
        <div>
            { selectColor ? <CompactPicker color={state.brushParameters.style} onChangeComplete={c => handleSetColor(c)}/> : <></> }
        <Slider min={1.0} max={6.0} value={state.brushParameters.width} onChange={(_e, value) => handleSetLineWidth(value)} />
        <br />
        <Button color="primary" onClick={handleDisplayColor}>Color</Button>
        <Button color="primary" onClick={clear}>Clear</Button>
    </div>
  )
}
