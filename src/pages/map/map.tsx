import {useState, useEffect, useRef} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"

/*
 Info:
 first the image sizes are set up. The width and height of our image is gotten.
 Then the canvas is set up with that information 
 
 */



function Map() {
    const [scale, setScale] = useState(1);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);




    const zoom_in = () => {
        
        const newScale = scale + 0.1;
        setScale(newScale);
        if (canvasRef.current) {
            canvasRef.current.style.transform = `scale(${newScale})`;
        }

    }

    const zoom_out = () => {
        const newScale = Math.max(0.1, scale - 0.1); // Prevent negative or too small scale
        setScale(newScale);
        if (canvasRef.current) {
            canvasRef.current.style.transform = `scale(${newScale})`;
        }

    }

        
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
    
    
    //re-renders based on size changes
    useEffect(() => {
        drawImage();
        console.log("Image dimensions updated:", imageDimensions);
    }, [imageDimensions]);




    return (
        <>
            <canvas
                ref={canvasRef}
                className="map_background"
                width={imageDimensions.width}
                height={imageDimensions.height}
            />

            <div className="zoom_div">
                <button onClick={zoom_in}>+</button>
                <button onClick={zoom_out}>-</button>
            </div>

        </>
    )
}

export default Map