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

        
        const canvas = canvasRef.current;
        if (canvas) {//sets the canvas dimensions to be the image dimensions

            canvas.style.minWidth = `${imageDimensions.width}px`;
            canvas.style.minHeight = `${imageDimensions.height}px`;
        }    
        
    }, [imageDimensions]);



    //minimap click content. First calls function Minimap in minimap.tsx
    const handleMinimapClick = (relativeX: number, relativeY: number) => {
        
        if (!containerRef.current) return;
        
        

        containerRef.current.scrollTo({
            left: 800,
            top: 400,
            behavior: 'smooth'
        });


        console.log(relativeX, relativeY);
    };
    //minimap click content



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

            <Minimap on_minimap_click={handleMinimapClick} />{/* on_minimap_click(x, y) in minimap.tsx*/}

        </>
    )
}

export default Map