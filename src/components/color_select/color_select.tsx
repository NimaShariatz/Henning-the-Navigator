import "./color_select.css"

import { useState } from "react"
import { RgbaColorPicker } from "react-colorful"

interface RgbaColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface ColorSelectProps {
    onColorChange?: (color: RgbaColor) => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
}

function Color_select({ onColorChange, showPicker, setShowPicker }: ColorSelectProps) {
    const [selectedColor, setSelectedColor] = useState<RgbaColor>({ r: 0, g: 0, b: 0, a: 1 })
    
    // Convert RGBA to CSS string for button background
    const rgbaString = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`
    
    const handleColorChange = (color: RgbaColor) => {
        setSelectedColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
    };

    return(
        <div className="mapDraw_container">
            <button 
                className="map_colorSelect_button"
                onClick={() => setShowPicker(!showPicker)} 
                style={{ backgroundColor: rgbaString, outline: showPicker ? '0.2vw solid white' : '0.2vw solid transparent' }}
            >
            </button>

            {showPicker && (
                <div className="colorPicker">
                    <div className="picker-wrapper">
                        <RgbaColorPicker color={selectedColor} onChange={handleColorChange} />
                    </div>
                    <button className="map_colorSelect_done" onClick={() => setShowPicker(false)}>
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}

export default Color_select