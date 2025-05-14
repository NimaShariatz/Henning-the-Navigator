import {useRef} from "react"
import "./minimap.css"

import { starting_map } from "../static/constants"

function Minimap() {

    


    return(
        <>
            <div className="minimap_container">
                <img className="minimap_image" src={starting_map} />
                <div className="minimap_block"></div>
            </div>
        </>
    )
}

export default Minimap