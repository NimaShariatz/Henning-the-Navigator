import {useState, useEffect, useRef} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"


import Minimap from "../../components/minimap.tsx";
/*
 Info:
 first the image sizes are set up. The width and height of our image is gotten.
 Then the canvas is set up with that information 
 
 */

function Map() {

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
        
    const drawImage = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        
        if (canvas && img) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                
                //perphaps here we can add default markers and stuff...
            }
        }
    };

    //canvas setup
    useEffect(() => {
        const img = new Image();
        img.src = starting_map;
        
        img.onload = () => {
            setImageDimensions({
                width: img.width,
                height: img.height
            });
            
            imageRef.current = img;
            
            drawImage();
        };
    }, []);
    
    
    
    useEffect(() => {
        drawImage();
        console.log("Image dimensions updated:", imageDimensions);
        
       
        if (containerRef.current && imageDimensions.width > 0) {

            containerRef.current.style.minWidth = `${imageDimensions.width}px`;
            containerRef.current.style.minHeight = `${imageDimensions.height}px`;
        }
    }, [imageDimensions]);

    return (
        <>
            <div className="map_container" ref={containerRef}>
                <canvas
                    ref={canvasRef}
                    className="map_background"
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                />
            </div>

            <Minimap/>

        </>
    )
}

export default Map