import {useRef, useState, useEffect} from "react"
import "./minimap.css"


import Navigation_set from "../navigation_set/navigation_set"
import Misc_set from "../misc_set/misc_set"

interface MinimapProps {
    on_minimap_click?: (relativeX: number, relativeY: number) => void;

    current_image: string;//for file import
    on_image_upload?: (file: File) => void;//for file import
    
    on_waypoint_selection_change?: (selection: number) => void;//this is passed to map.tsx. it comes from navigation_set.tsx

    on_clear_points?: () => void; //for on_clear_points() in map.tsx. 


    points_set: {id: number, x: number, y: number, type: number}[];//passed from map.tsx
}



function Minimap({ on_minimap_click, current_image, on_image_upload, on_waypoint_selection_change, on_clear_points, points_set }: MinimapProps) {
    const imageRef = useRef<HTMLImageElement>(null); //ref is used for .minimap_container
    const [minimapDimensions, setMinimapDimensions] = useState({ width: 0, height: 0 });//for waypoints on minimap

    useEffect(() => {//called on every image change
        
        
        if (imageRef.current){
            imageRef.current.onload = update_dimensions // update dimensions on image load
        }
        window.addEventListener('resize', update_dimensions) // updates on the resize
        update_dimensions();

      return () => {
        window.removeEventListener('resize', update_dimensions)
      }
    }, [current_image])

    const update_dimensions = () => {
        if(imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect()
            setMinimapDimensions({width: rect.width, height: rect.height})
        }
    }

        const calculate_waypoint_for_minimap = (point: {id: number, x: number, y: number, type: number}) => {//for scalling x y for mini map
        //gets canvas size, divides x and y, then multiplies to minimap sizes
        const main_map_image_element = document.querySelector('canvas.map_background');
        const main_map_width = main_map_image_element?.clientWidth || 1; // the '|| 1' is for null prevention
        const main_map_height = main_map_image_element?.clientHeight || 1;
        
        const button_size = window.innerWidth * 0.02; // 2vw - same as in map.tsx
        const adjusted_x = point.x + (button_size / 2);// accounts for the centering effect in map.tsx (for cursor)
        const adjusted_y = point.y + (button_size / 2);

        const relative_X = adjusted_x / main_map_width;//percentage conversion
        const relative_Y = adjusted_y / main_map_height;
        
        const minimap_X = relative_X * minimapDimensions.width;
        const minimap_Y = relative_Y * minimapDimensions.height;
        
         const waypointSize = minimapDimensions.width * 0.05;// vw doesnt seem to work as zooming doesnt have
         //the same effect it would have on the minimap. So gotta use pixels as unit... Look for better solution later
        
        return {
            x: minimap_X,
            y: minimap_Y,
            minimap_waypoint_size: waypointSize
        };
    };

    const get_point_class = (type: number) => {//for coloring the waypoints....
        switch(type) {
            case 1: return "start_fill";
            case 2: return "target_fill";
            case 3: return "navigation_fill";
            case 4: return "extraction_fill";
            default: return "navigation_fill";
        }
    };





    const handle_minimap_click = (e: React.MouseEvent<HTMLDivElement>) => {
       
        if (!imageRef.current || !on_minimap_click) return;// make sure we have image and on_minimap_click is provided in component arguement
        
        const rect = imageRef.current.getBoundingClientRect();
        
        const x = (e.clientX - rect.left) / rect.width;// gives a percentages of x location
        const y = (e.clientY - rect.top) / rect.height;// gives a percentages of y location

        //console.log(x, y)// eg 0.5, 0.5 is the middle

        on_minimap_click(x, y); //<Minimap on_minimap_click={handleMinimapClick} />
    };
    






    return(
        <>
            <div className="navigation_container">
                <img className="minimap_image" src={current_image} ref={imageRef} onClick={handle_minimap_click}/>
            
                {/* Minimap waypoints */}
                {points_set.map(point => {
                    const { x, y, minimap_waypoint_size} = calculate_waypoint_for_minimap(point);
                   

                    return (
                        <div 
                            key={`minimap-point-${point.id}`} 
                            className="minimap_waypoint"
                            style={{
                                position: 'absolute',
                                left: `${x}px`,
                                top: `${y}px`,
                                width: `${minimap_waypoint_size}px`,
                                height: `${minimap_waypoint_size}px`,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none'
                            }}
                        >
                        <button className="map_minimap_waypoint_button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="95%" height="95%" viewBox="0 0 24 24">
                                <defs>
                                    <mask id="point">
                                        <g fill="none">
                                            <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="0.75" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                            <path fill="#fff" fillOpacity="0.35" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                            <circle cx="12" cy="10" r="3" fill="#fff" />
                                        </g>
                                    </mask>
                                </defs>
                                <path className={get_point_class(point.type)} d="M0 0h24v24H0z" mask="url(#point)" />
                            </svg>
                        </button>
                        </div>
                    );
                })}
            </div>



            <Navigation_set onWaypointSelectionChange={on_waypoint_selection_change} points_set={points_set}/>

            <Misc_set onImageUpload={on_image_upload} onClearPoints={on_clear_points} />
        </>
    )
}

export default Minimap