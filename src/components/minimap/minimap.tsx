import {useRef} from "react"
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
            </div>

            <Navigation_set onWaypointSelectionChange={on_waypoint_selection_change} points_set={points_set}/>

            <Misc_set onImageUpload={on_image_upload} onClearPoints={on_clear_points} />
        </>
    )
}

export default Minimap