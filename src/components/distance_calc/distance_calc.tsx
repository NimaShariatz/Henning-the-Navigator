import { useState, useEffect } from "react"

import "./distance_calc.css"


interface DistanceCalcProps{
    onDistanceChange?: (distance: number) => void;
}








function Distance_calc( { onDistanceChange }: DistanceCalcProps ) {

    const [distanceValue, setDistanceValue] = useState("458")// has to be string and not number, otherwise a zero placed in front of it every time. for some reason...

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setDistanceValue(newValue)
        //console.log(newValue)
 
    }

    const handleBlur = () => {
        if (!distanceValue || distanceValue.trim() === "") {// When the input loses focus and is empty, reset to the default value
            setDistanceValue("458")
        }
        if (Number(distanceValue) < 50){
            setDistanceValue("50")
        }else if (Number(distanceValue) > 1000){
            setDistanceValue("1000")
        }
    }

    // Calculate width based on the distanceValue
    const calculatedWidth = distanceValue ? `${Number(distanceValue)}px` : "458px"




    
    useEffect(() => {// Call the callback whenever distanceValue changes
        if (onDistanceChange) {
            onDistanceChange(Number(distanceValue));
        }
    }, [distanceValue, onDistanceChange]);


    


    return(
        <>
            <div className="distance_setter" style={{ width: calculatedWidth }}>
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