import React, {useState, useEffect, useRef} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"


import Minimap from "../../components/minimap/minimap.tsx";
import Distance_calc from "../../components/distance_calc/distance_calc.tsx";
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

    const [showInfoContainer, setShowInfoContainer] = useState(true);

    const [totalDistance, setTotalDistance] = useState(0)
    const [isKilometers, setIsKilometers] = useState(true);

    //--------------------------
    const [points, setPoints] = useState<{id: number, x: number, y: number, type: number}[]>([]);

    const [selectedNavType, setSelectedNavType] = useState(-1)
        
    const [mapDistance, setMapDistance] = useState(458)
    const [linePositions, setLinePositions] = useState<{
        id: string;
        currentPoint: { id: number, x: number, y: number, type: number };
        nextPoint: { id: number, x: number, y: number, type: number };
        position: {current_point_x: number; current_point_y: number; next_point_x: number; next_point_y: number} 
    }[]>([]);



    
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


        if(selectedNavType > 0 && selectedNavType < 5){ //---IF 1-4---
            for (const button of points) {
                const distance = Math.sqrt(Math.pow(button.x - x_cord, 2) + Math.pow(button.y - y_cord, 2));
                //console.log(distance)
                
                if (distance < collision_radius) {// so if within radius, do not make the thing
                    return;
                }

            }//for
            //for preventing too many next to each other

            const nav_exists = points.find(point => point.type === 3)
            const target_exists = points.find(point => point.type === 2)
            const start_exists = points.find(point => point.type === 1)

            if((start_exists && selectedNavType===1) || (target_exists && selectedNavType === 2)){
                return
            }


            if(selectedNavType === 1) {// if type is 1, id must be 1
                
                
                const brand_new_button = {
                    id: 1,
                    x: x_cord,
                    y: y_cord,
                    type: selectedNavType // Store the selected navigation type with the button
                
                }

                setPoints([...points, brand_new_button]);


            } else if (selectedNavType === 2) {// if type is target, check if navs exist. set it to after nav. else after start

                if(nav_exists){
                
                    const navPoints = points.filter(point => point.type === 3);
                    if (navPoints.length > 0) {
                        const highestNavId = Math.max(...navPoints.map(point => point.id));//max navpoint id
                        
                        const updated_points = increment_points_fromID_onwards(highestNavId);                    
                        const new_point = {id: highestNavId + 1, x: x_cord, y: y_cord, type: selectedNavType};
                        
                        setPoints([...updated_points, new_point]);
                        return;
                    }

                }else{

                    const updated_points = increment_points_fromID_onwards(1)// +1 to all ids > 1 to make room for id=2
                    const new_point = {id: 2, x: x_cord, y: y_cord, type: selectedNavType};
                    
                    setPoints([...updated_points, new_point]); // Set the combined array as the new state
                    
                    return;
                }

            }else if (selectedNavType === 3) {// if type is waypoint, set id to before target
                

                const navPoints = points.filter(point => point.type === 3);
                if(navPoints.length > 0){
                    const highestNavId = Math.max(...navPoints.map(point => point.id));//max navpoint id
                    const updated_points = increment_points_fromID_onwards(highestNavId);
                    const new_point = {id: highestNavId + 1, x: x_cord, y: y_cord, type: selectedNavType};
                    setPoints([...updated_points, new_point]);
                    return;
                } else{
                    //console.log(navPoints.length, target_exists)
                    if(target_exists){
                        const updated_points = increment_points_fromID_onwards(target_exists.id - 1)
                        const new_point = {id: target_exists.id, x: x_cord, y: y_cord, type: selectedNavType};
                        setPoints([...updated_points, new_point]);
                        return
                    }
                }
            


            } else if (selectedNavType === 4){//can just do points.length + 1 as there is nothing after 4, but better safe than sorry...

                const extractPoints = points.filter(point => point.type === 4);
                if (extractPoints.length > 0){
                    const highest_extract_id = Math.max(...extractPoints.map(point => point.id));//max navpoint id
                    const updated_points = increment_points_fromID_onwards(highest_extract_id);
                    const new_point = {id: highest_extract_id + 1, x: x_cord, y: y_cord, type: selectedNavType};
                    setPoints([...updated_points, new_point]);
                    return;
                }else{
                    if(target_exists){
                        const updated_points = increment_points_fromID_onwards(target_exists.id)
                        const newPoint = {id: target_exists.id + 1, x: x_cord, y: y_cord, type: selectedNavType};
                        setPoints([...updated_points, newPoint]);
                        return

                    }
                }


            }//if else





        }else{//ELSE IF ITS A TARGET (waypoint)
            return

        }


        
    }//handle_map_click

    const increment_points_fromID_onwards = (id: number) => {// For shifting IDs 
        const updated_points = points.map(point => {
            if (point.id > id) { 
                return {...point, id: point.id + 1};// if greater than id
            }
            return point;//if less than id
        });
        return updated_points;
    }
    

    const handle_remove_nav_point = (id: number) => {

        const point_to_remove = points.find(button => button.id === id);

        if (point_to_remove?.type === 1){//if start, then just delete it
            setPoints(points.filter(button => button.id !== id));

        } else {// Remove the point and decrement every ID ahead by 1
        
            const updatedPoints = points.filter(button => button.id !== id)
                .map(button => {
                    
                    if (button.id > id) {
                        return { ...button, id: button.id - 1 };
                    }
                    return button;
                });
            
            setPoints(updatedPoints);
        }

    };

    const handle_waypoint_selection_change = (selection: number) => {
        setSelectedNavType(selection);
        //console.log("Waypoint selection received in Map:", selection);
    };

    const get_point_class = (type: number) => {
        switch(type) {
            case 1: return "start_fill";
            case 2: return "target_fill";
            case 3: return "navigation_fill";
            case 4: return "extraction_fill";
            default: return "navigation_fill";
        }
    };
    const get_point_id_color_class= (type: number) => {
        switch(type) {
            case 1: return "start_color";
            case 2: return "target_color";
            case 3: return "navigation_color";
            case 4: return "extraction_color";
            default: return "navigation_color";
        }
    };




    const clear_all_points = () => {
        setPoints([]);
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




    //line creation
    const get_line_color = (from: number) => {
        if (from === 1) {
            return "var(--waypoint_start_id_color)"

        }else if ( from === 2 ){
            return "var(--waypoint_target_id_color)"
        }else if ( from === 3 ){
            return "var(--waypoint_navigation_id_color)"
        }else if ( from === 4 ){
            return "var(--waypoint_extraction_id_color)"
        }//elseIf
    }

    const line_positioning = (current_point:{id: number, x: number, y: number, type: number}, next_point: {id: number, x: number, y: number, type: number}) => {
        // Get current window dimensions to account for zoom
        const viewportWidth = window.innerWidth;
        
        // Calculate button size dynamically based on current viewport width
        const button_size = viewportWidth * 0.02;
        const center_offset = button_size / 2;

        return {
            current_point_x: current_point.x + center_offset,
            current_point_y: current_point.y + center_offset,
            next_point_x: next_point.x + center_offset,
            next_point_y: next_point.y + center_offset
        }
    }


    useEffect(() => {
        // First effect: Handle resize events for proper line connections
        const handleResize = () => {
            setPoints([...points]); // Force a re-render when window is resized
        };

        window.addEventListener('resize', handleResize);
        
        // Second effect: Calculate and store line positions
        const sortedPoints = [...points].sort((a, b) => a.id - b.id);
        const newLinePositions = [];
        
        for (let i = 0; i < sortedPoints.length - 1; i++) {
            const currentPoint = sortedPoints[i];
            const nextPoint = sortedPoints[i + 1];
            const line_position = line_positioning(currentPoint, nextPoint);
            
            newLinePositions.push({//FOR CALCULATIONS
                id: `${currentPoint.id} - to - ${nextPoint.id}`,
                currentPoint,
                nextPoint,
                position: line_position
            });
        }
        
        setLinePositions(newLinePositions);
        

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [points]); // Only run when points change

    //line creation

    const toggleInfoContainer = () => {
        setShowInfoContainer(!showInfoContainer);
    };





    const toggleUnitType = () => {
        setIsKilometers(!isKilometers);
    };



    useEffect(() => {
        // Reset total distance
        let newTotalDistance = 0;
        
        // Calculate the sum of all distances
        linePositions.forEach(line => {
            const dx = line.position.next_point_x - line.position.current_point_x;
            const dy = line.position.next_point_y - line.position.current_point_y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            const pixelLength = length;
            let distance = (pixelLength / mapDistance) * 10;
            
            if (!isKilometers) {
                distance = distance * 0.621371;
            }
            
            const actualDistance = Math.round(distance * 10) / 10;
            newTotalDistance += actualDistance;
        });
        
        // Update the total distance once after all calculations
        setTotalDistance(newTotalDistance);
    }, [linePositions, mapDistance, isKilometers]);




    //distance calculations
    const handleDistanceChange = (distance: number) => {
        setMapDistance(distance);
        //console.log("Distance in Map:", distance);
    };

    const calculations = ( currentPoint:({ id: number, x: number, y: number, type: number }), nextPoint: { id: number, x: number, y: number, type: number }, position: {current_point_x: number; current_point_y: number; next_point_x: number; next_point_y: number} ) => {
        const dx = position.next_point_x - position.current_point_x;
        const dy = position.next_point_y - position.current_point_y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        const pixelLength = length;
        let distance = (pixelLength / mapDistance) * 10;
        
        if (!isKilometers) {
            distance = distance * 0.621371;
        }
        
        const actualDistance = Math.round(distance * 10) / 10;
    

    
        return(
            <div className="information_row_container">
                <div className="information_waypoint_row">
                    <button className="information_waypoint">
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
                            <path className={get_point_class(currentPoint.type)} d="M0 0h24v24H0z" mask="url(#point)" />
                        </svg>
                        <p className={`waypoint_id ${get_point_id_color_class(currentPoint.type)}`}>{currentPoint.id}</p>
                    </button>


                    <svg 
                        style={{height: "1vw", width:"75%", margin: "1vw 0.5vw"}}
                    >
                        <line 
                            x1="0" 
                            y1="1" 
                            x2="100%" 
                            y2="1" 
                            stroke={get_line_color(nextPoint.type)}
                            strokeWidth="0.4vw"
                        />
                    </svg>



                    <button className="information_waypoint">
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
                            <path className={get_point_class(nextPoint.type)} d="M0 0h24v24H0z" mask="url(#point)" />
                        </svg>
                        <p className={`waypoint_id ${get_point_id_color_class(nextPoint.type)}`}>{nextPoint.id}</p>
                    </button>

                </div>

                <div className="waypoint_statistics">
                    <p>Distance: {actualDistance}</p> 
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'km' : 'mi'}</button>

                    <p>Heading: ???</p>
                </div>

            </div>
        )
    }













    return (
        <>
            <div className="map_container" ref={containerRef} onClick={handle_map_click}> 
                <canvas
                    ref={canvasRef}
                    className="map_background"
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                />

                {/* SVG overlay for lines */}
                <svg 
                    className="waypoint_lines_overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                    }}
                >
                    {linePositions.map(line => (
                        <line 
                            className="waypoint_lines"
                            key={line.id}
                            x1={line.position.current_point_x} 
                            y1={line.position.current_point_y}
                            x2={line.position.next_point_x}
                            y2={line.position.next_point_y}
                            stroke={get_line_color(line.nextPoint.type)}
                        />
                    ))}
                </svg>
                {/* SVG overlay for lines */}




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
                            <p className={`waypoint_id ${get_point_id_color_class(button.type)}`}>{button.id}</p>
                        </button>
                        <button 
                            className="remove_button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering map click by accident when clicking the remove!!!
                                handle_remove_nav_point(button.id)}}
                        >
                            ×
                        </button>



                    </div>
                ))}{/* waypoints */}
            </div>



            <div className="information_container" style={{ display: showInfoContainer ? 'block' : 'none' }}>

                {linePositions.map(line=> (
                    <div key = {line.id}>
                        <div>{calculations(line.currentPoint, line.nextPoint, line.position)}</div>
                    </div>

                ))}


                {linePositions.length === 0 && (
                    <div>
                        <p>No waypoints connected yet</p>
                    </div>
                )}


            </div>



            <Minimap 
                on_minimap_click={handle_minimap_click} 
                current_image={currentImage}
                on_image_upload={handle_image_upload}
                on_waypoint_selection_change={handle_waypoint_selection_change}
                on_clear_points={clear_all_points}
                toggle_info_container={toggleInfoContainer}

                points_set = {points}
            />


            <Distance_calc onDistanceChange={handleDistanceChange} />{/* pass */}


        </>
    )
}

export default Map