import { useState } from "react"

import "./distance_calc.css"

function Distance_calc() {
    // Store the input value as a string to preserve leading zeros
    const [distanceValue, setDistanceValue] = useState("458")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setDistanceValue(newValue)
        //console.log(newValue)
 
    }

    const handleBlur = () => {
        if (!distanceValue || distanceValue.trim() === "") {// When the input loses focus and is empty, reset to the default value
            setDistanceValue("458")
        }
    }



    return(
        <>
            <div className="distance_setter">
                <form>
                    <input 
                        type="number" 
                        id="distance_input" 
                        name="distance_input" 
                        value={distanceValue} 
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                </form>
            </div>
        </>
    )
}

export default Distance_calc