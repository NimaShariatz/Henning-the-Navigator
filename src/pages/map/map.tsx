
import {useState, useEffect, useRef} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"



function Map() {
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Create a new Image object to get the dimensions
        const img = new Image();
        img.src = starting_map;
        
        // When the image loads, get its dimensions
        img.onload = () => {
            setImageDimensions({
                width: img.width,
                height: img.height
            });
        };
    }, []);




    return (
        <>
            <div 
                ref={mapRef}
                className="map_background" 
                style={{ 
                    backgroundImage: `url(${starting_map})`,
                    width: `${imageDimensions.width}px`,
                    height: `${imageDimensions.height}px`

                }}
            >
            </div>


        </>
    )

}
export default Map