import { useEffect, useState } from "react"

import { stalingrad } from "../../static/constants.tsx"
import "./map.css"



function Map() {
    return (
        <>
            <div className="map_background" style={{ backgroundImage: `url(${stalingrad})` }}>

            </div>
        </>
    )


}
export default Map