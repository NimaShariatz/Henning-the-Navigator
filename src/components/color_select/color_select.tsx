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
    const [lineThickness, setLineThickness] = useState(1);
    
    // Convert RGBA to CSS string for button background
    const rgbaString = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`
    
    const handleColorChange = (color: RgbaColor) => {
        setSelectedColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
    };





    const handleIncreaseThickness = () => {
        const increase_thick = lineThickness + 1
        setLineThickness(increase_thick);
    };

    const handleDecreaseThickness = () => {
        if(lineThickness > 0){
            const decrease_thick = lineThickness - 1
            setLineThickness(decrease_thick);
        }
    };


    return(
        <div className="mapDraw_container">

            <div className="mapdraw_representation">

                <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                    
                    <button className="left_increment" onClick={handleDecreaseThickness}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                            <g fillRule="evenodd" clipRule="evenodd">
                                <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                            </g>
                        </svg>
                    </button>

                    <p>{lineThickness}</p>


                    <button className="right_increment" onClick={handleIncreaseThickness}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                            <g fillRule="evenodd" clipRule="evenodd">
                                <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                            </g>
                        </svg>
                    </button>

                </div>


                <button 
                    className="map_colorSelect_button"
                    onClick={() => setShowPicker(!showPicker)} 
                    style={{ backgroundColor: rgbaString, outline: showPicker ? '0.2vw solid white' : '0.2vw solid transparent' }}
                >
                </button>


            </div>


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