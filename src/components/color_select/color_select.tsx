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
    onThicknessChange?: (thickness: number) => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    eraseDrawing: boolean;
    setEraseDrawing: (setter: boolean) => void;
    textMode_active: boolean;
    setTextMode_active: (setter: boolean) => void;

}


function Color_select({ onColorChange, onThicknessChange, showPicker, setShowPicker, eraseDrawing, setEraseDrawing, textMode_active, setTextMode_active }: ColorSelectProps) {
    const [selectedColor, setSelectedColor] = useState<RgbaColor>({ r: 255, g: 201, b: 14, a: 1 })
    const [lineThickness, setLineThickness] = useState(10);
    
    // Convert RGBA to CSS string for button background
    const rgbaString = `rgba(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b}, ${selectedColor.a})`
    
    const handleColorChange = (color: RgbaColor) => {
        setSelectedColor(color);
        if (onColorChange) {
            onColorChange(color);
        }
    };
    const handleThicknessChange = (value: number) => {
        setLineThickness(value);
        if(onThicknessChange){
            onThicknessChange(value)
        }
    }





    const handleIncreaseThickness = () => {
        const increase_thick = lineThickness + 5;
        handleThicknessChange(increase_thick);  // Call the handler to update parent
    };

    const handleDecreaseThickness = () => {
        if(lineThickness > 5){
            const decrease_thick = lineThickness - 5;
            handleThicknessChange(decrease_thick);  // Call the handler to update parent
        }
    };


    return(
        <div className="mapDraw_positioning">

            

            <div className="mapDraw_container">

                <div className="mapdraw_representation">

                    <div className="mapdraw_thickness_container">
                        
                        <button className="left_increment increment_color_customization" onClick={handleDecreaseThickness}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                                <g fillRule="evenodd" clipRule="evenodd">
                                    <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                    <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                                </g>
                            </svg>
                        </button>

                        <p style={{width:"2vw", textAlign:"center"}}>{lineThickness}</p>


                        <button className="right_increment increment_color_customization" onClick={handleIncreaseThickness}>
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
                        onClick={() => { setEraseDrawing(false); setShowPicker(!showPicker); setTextMode_active(false);}} 
                        style={{ backgroundColor: rgbaString, outline: showPicker ? '0.2vw solid white' : '0.2vw solid transparent' }}
                    >
                    </button>

                </div>


                {showPicker && (
                    <div className="colorPicker">
                        <div className="picker-wrapper">
                            <RgbaColorPicker color={selectedColor} onChange={handleColorChange} />
                        </div>
                        <button className="map_colorSelect_done" onClick={() => { setEraseDrawing(false); setShowPicker(false); }}>
                            Done
                        </button>
                    </div>
                )}
            </div>






            <div className="mapDraw2_container">
                

                    <button className="eraser_button" style={{outline: eraseDrawing ? '0.2vw solid white' : ''}} onClick={() => { setEraseDrawing(!eraseDrawing); setShowPicker(false); setTextMode_active(false);}}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="var(--logo_yellow)" d="M14.952 3c-1.037 0-1.872.835-3.542 2.505l-4.91 4.91l7.085 7.085l4.91-4.91C20.165 10.92 21 10.085 21 9.048c0-1.038-.835-1.873-2.505-3.543S15.99 3 14.952 3" opacity="0.5" />
                            <path fill="var(--logo_yellow)" d="M13.585 17.5L6.5 10.415l-.995.995C3.835 13.08 3 13.915 3 14.952c0 1.038.835 1.873 2.505 3.543S8.01 21 9.048 21c1.037 0 1.872-.835 3.542-2.505z" />
                            <path fill="var(--logo_yellow)" d="M9.033 21H9zm.03 0c.796-.006 1.476-.506 2.51-1.5H21a.75.75 0 0 1 0 1.5z" opacity="0.5" />
                        </svg>
                    </button>


                    <button className="createText_button" disabled={true} style={{filter:"grayscale(100%)", cursor:"not-allowed", outline: textMode_active ? '0.2vw solid white' : ''}} onClick={() => { setShowPicker(false); setEraseDrawing(false); setTextMode_active(!textMode_active); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none">
                                <path fill="var(--logo_yellow)" fillOpacity="0.16" d="M19 16h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                                <path stroke="var(--logo_yellow)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8 8h8m-8 3h8m3 5h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                            </g>
                        </svg>
                    </button>

            </div>

        </div>
    )
}

export default Color_select