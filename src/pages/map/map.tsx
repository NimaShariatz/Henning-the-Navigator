
import {useState} from "react"

import { starting_map } from "../../static/constants.tsx"
import "./map.css"



function Map() {




    return (
        <>
            <div 
                
                className="map_background" 
                style={{ 
                    backgroundImage: `url(${starting_map})`

                }}

            >
            </div>
        


        </>
    )


}
export default Map