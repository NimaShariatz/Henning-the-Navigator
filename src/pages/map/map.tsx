import {useState, useEffect, useRef} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"


import Minimap from "../../components/minimap/minimap.tsx";
/*
 Info:
 first the image sizes are set up. The width and height of our image is gotten.
 Then the canvas is set up with that information 
 
 */

function Map() {

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [currentImage, setCurrentImage] = useState(starting_map);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);
        
    
    const handleImageUpload = (file: File) => {// Handle image upload from Misc_set
        const imageUrl = URL.createObjectURL(file);
        setCurrentImage(imageUrl);
    };


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
        img.src = currentImage;
        
        img.onload = () => {
            setImageDimensions({
                width: img.width,
                height: img.height
            });
            
            imageRef.current = img;
            
            drawImage();
        };
    }, [currentImage]); // Now this effect runs whenever currentImage changes
    
    
    
    useEffect(() => {
        drawImage();

        
        const canvas = canvasRef.current;
        if (canvas) {//sets the canvas dimensions to be the image dimensions

            canvas.style.minWidth = `${imageDimensions.width}px`;
            canvas.style.minHeight = `${imageDimensions.height}px`;
        }    
        
    }, [imageDimensions]);



    //minimap click content. Will first call function Minimap in minimap.tsx
    const handleMinimapClick = (relativeX: number, relativeY: number) => {
        
        if (!containerRef.current) return;
        

        const target_x = imageDimensions.width * relativeX;// size of our image * percentage calculated from minimap.tsx 
        const target_y = imageDimensions.height * relativeY;// size of our image * percentage calculated from minimap.tsx - fixed bug
        
        //we got the place to scroll to by now. the following code sorts out scrolling to the center
        const container = containerRef.current;
        const viewport_width = container.clientWidth;// gives the width and height, which does not include overflow distance
        const viewport_height = container.clientHeight;// gives the width and height, which does not include overflow distance


        const scrollLeft = Math.max(0, target_x - viewport_width / 2);
        const scrollTop = Math.max(0, target_y - viewport_height / 2);


        //console.log(viewport_width, viewport_height)

        containerRef.current.scrollTo({
            left: scrollLeft,
            top: scrollTop
        });



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

            <Minimap 
                on_minimap_click={handleMinimapClick} 
                current_image={currentImage}
                on_image_upload={handleImageUpload}
            />

        </>
    )
}

export default Map