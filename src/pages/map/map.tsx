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


    //--------------------------
    const [points, setPoints] = useState<{id: number, x: number, y: number, type: number}[]>([]);
    const [point_counter, setNextPointId] = useState(1);
    const [selectedNavType, setSelectedNavType] = useState(-1)
        
    const handle_map_click = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || selectedNavType === -1) return;
        
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const x_raw = e.clientX - rect.left + container.scrollLeft //get cord from place clicked
        const y_raw = e.clientY - rect.top + container.scrollTop //get cord from place clicked
        //console.log(e.clientX, rect.left, container.scrollLeft)

        if(canvasRef.current){
            if( x_raw > canvasRef.current.width|| y_raw > canvasRef.current.height){
                console.log("out of map bounds")
                return
            }
        }
        
        //for preventing too many next to each other
        const button_size = window.innerWidth * 0.02; //button is 2vw

        const x_cord = x_raw - (button_size / 2);//centres the button based on where user clicked
        const y_cord = y_raw - (button_size / 2);

        const collision_radius = button_size * 1.3 // multiplier radius! for the 'for' statement
        for (const button of points) {
            const distance = Math.sqrt(Math.pow(button.x - x_cord, 2) + Math.pow(button.y - y_cord, 2));
            //console.log(distance)
            
            if (distance < collision_radius) {// so if within radius, do not make the thing
                return;
            }

        }//for
        //for preventing too many next to each other

        const brand_new_button = {
            id: point_counter,
            x: x_cord,
            y: y_cord,
            type: selectedNavType // Store the selected navigation type with the button
           
        }

        setPoints([...points, brand_new_button]);
        setNextPointId(point_counter + 1)

    }//handle_map_click
    const handle_remove_point = (id: number) => {
        setPoints(points.filter(button => button.id !== id));
        //Subtract -1 from all ids ahead of current. Then delete the point
    };

    const handle_waypoint_selection_change = (selection: number) => {
        setSelectedNavType(selection);
        console.log("Waypoint selection received in Map:", selection);
    };

    const get_point_class = (type: number) => {
        switch(type) {
            case 1: return "navigation_fill";
            case 2: return "secondary_fill";
            case 3: return "start_fill";
            case 4: return "target_fill";
            case 5: return "extraction_fill";
            default: return "navigation_fill";
        }
    };
    const clear_all_points = () => {
        setPoints([]);
        setNextPointId(1);
    };

    
    //----------------------



    const handle_image_upload = (file: File) => {// Handle image upload from Misc_set
        const imageUrl = URL.createObjectURL(file);
        setCurrentImage(imageUrl);
        clear_all_points()
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
    //-------------------


    //minimap click content. Will first call function Minimap in minimap.tsx
    const handle_minimap_click = (relativeX: number, relativeY: number) => {
        
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
            <div className="map_container" ref={containerRef} onClick={handle_map_click}> 
                <canvas
                    ref={canvasRef}
                    className="map_background"
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                />


                {points.map(button => (
                    <div key={button.id} className="map_icon_div" style={{left: `${button.x}px`, top: `${button.y}px`}}>
                        <button className="map_waypoint_button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                <defs>
                                    <mask id="point">
                                        <g fill="none">
                                            <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="0.75" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                            <path fill="#fff" fillOpacity="0.35" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                            <circle cx="12" cy="10" r="3" fill="#fff" />
                                        </g>
                                    </mask>
                                </defs>
                                <path className={get_point_class(button.type)} d="M0 0h24v24H0z" mask="url(#point)" />
                            </svg>
                        </button>
                        <button 
                            className="remove_button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering map click by accident when clicking the remove!!!
                                handle_remove_point(button.id);}}
                        >
                            ×
                        </button>
                    </div>
                ))}

            </div>

            <Minimap 
                on_minimap_click={handle_minimap_click} 
                current_image={currentImage}
                on_image_upload={handle_image_upload}
                on_waypoint_selection_change={handle_waypoint_selection_change}
                on_clear_points={clear_all_points}


                points_set = {points}
            />

        </>
    )
}

export default Map