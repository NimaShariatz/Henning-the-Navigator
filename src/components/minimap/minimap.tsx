import {useRef} from "react"
import "./minimap.css"

import { starting_map } from "../../static/constants"

import Navigation_set from "../navigation_set/navigation_set"
import Misc_set from "../misc_set/misc_set"

interface MinimapProps {
    on_minimap_click?: (relativeX: number, relativeY: number) => void;
}


function Minimap({ on_minimap_click }: MinimapProps) {
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
                <img className="minimap_image" src={starting_map} ref={imageRef} onClick={handle_minimap_click}/>
            </div>




            <Navigation_set/>

            <Misc_set/>






        </>
    )
}

export default Minimap