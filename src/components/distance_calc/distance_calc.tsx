import { useState, useEffect } from "react"

import "./distance_calc.css"


interface DistanceCalcProps {
    showUI: boolean;
    onDistanceChange?: (distance: number) => void;
    currentMapUrl?: string; // Add this new prop
}








function Distance_calc({showUI, onDistanceChange, currentMapUrl }: DistanceCalcProps) {
    const [distanceValue, setDistanceValue] = useState("50") // has to be string and not number, otherwise a zero placed in front of it every time. for some reason...




    useEffect(() => {
        if (currentMapUrl) {
            // Extract map name from URL to determine appropriate default distance
            const urlParts = currentMapUrl.split('/');
            const filename = urlParts[urlParts.length - 1];
            const mapName = filename.split('.')[0];
            // Set different default distances based on map name
            // You can customize these values based on your maps
            switch (mapName) {
                case 'Arras':
                    setDistanceValue("163");
                    break;
                case 'Kuban':
                    setDistanceValue("277");
                    break;
                case 'Lapino':
                    setDistanceValue("400");
                    break;
                case 'Moscow':
                    setDistanceValue("437");
                    break;
                case 'Normandy':
                    setDistanceValue("452");
                    break;
                case 'Novosokolniki':
                    setDistanceValue("400");
                    break;
                case 'Prokhorovka':
                    setDistanceValue("802");
                    break;
                case 'Rheinland':
                    setDistanceValue("350");
                    break;
                case 'Stalingrad':
                    setDistanceValue("392");
                    break;
                case 'Vluki':
                    setDistanceValue("481");
                    break;
                case 'Western_front':
                    setDistanceValue("281");
                    break;
                default:
                    setDistanceValue("50"); // Default value
            }
        }
    }, [currentMapUrl]);



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
            <div className="distance_setter" style={{ width: calculatedWidth, display: showUI ? 'flex' : 'none' }}>
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