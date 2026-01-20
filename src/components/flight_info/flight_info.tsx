import React from 'react';
import { useState, useEffect } from 'react';
import "./flight_info.css"
import Target_picture from "../target_picture/target_picture";

interface Flight_infoProps {
    showInfoContainer: boolean;
    showUI: boolean;
    
    // Flight notes
    flightNotes: string;
    handleInput_flightNotes_Change: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    
    // Drawing related
    drawColor: {r: number, g: number, b: number, a: number};
    eraseDrawing: boolean;
    Targetdrawings: {
        id: string;
        points: {x: number, y: number}[];
        color: {r: number, g: number, b: number, a: number};
        thickness: number;
    }[];
    setTargetdrawings: React.Dispatch<React.SetStateAction<{
        id: string;
        points: {x: number, y: number}[];
        color: {r: number, g: number, b: number, a: number};
        thickness: number;
    }[]>>;

    drawline_thickness: number;
    
    // Line positions and calculations
    linePositions: {
        id: string;
        currentPoint: {id: number, x: number, y: number, type: number};
        nextPoint: {id: number, x: number, y: number, type: number};
        position: {current_point_x: number; current_point_y: number; next_point_x: number; next_point_y: number};
    }[];
    
    // Distance statistics
    mapDistance: number,


    isKilometers: boolean;
    toggleUnitType: () => void;
    

    // Helper functions and refs
    get_point_class: (type: number) => string;
    get_point_id_color_class: (type: number) => string;
    get_line_color: (from: number) => string | undefined;
    containerRef: React.RefObject<HTMLDivElement | null>;

}










function Flight_info({
        showInfoContainer, 
        showUI,
        flightNotes,
        handleInput_flightNotes_Change,
        drawColor,
        eraseDrawing,
        Targetdrawings,
        drawline_thickness,
        setTargetdrawings,
        linePositions,
        mapDistance,

        isKilometers,
        toggleUnitType,


        get_point_class,
        get_point_id_color_class,
        get_line_color,
        containerRef,
        
    }: Flight_infoProps){





    const [planeHeading, setPlaneHeading] = useState("");
    const [distanceCalcInput, setDistanceCalcInput] = useState("");
    const [speedCalcInput, setSpeedCalcInput] = useState("");

    const [windHeading, setWindHeading] = useState("");
    const [windSpeed, setWindSpeed] = useState("");

    const [totalWaypointDistance, setTotalWaypointDistance] = useState(0);
    const [totalExtractDisstance, setTotalExtractDisstance] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);



    const [timerMode, setTimerMode] = useState(1);
    

    const [combatTimer, setCombatTimer] = useState({ combatMinutes: "30", combatSeconds: "00", combatMaxMinutes: "30", combatMaxSeconds: "00" });
    const [emergencyTimer, setEmergencyTimer] = useState({ emergencyMinutes: "05", emergencySeconds: "00", emergencyMaxMinutes: "05", emergencyMaxSeconds: "00" });





    const handleRightIncrement = () => {
        const currentValue = Number(planeHeading) || 0;
        let newValue = currentValue + 1;
        if (newValue >= 360) {
            newValue = 0;
        }
        setPlaneHeading(String(newValue));
    };
    const handleLeftIncrement = () => {
        const currentValue = Number(planeHeading) || 0;
        let newValue = currentValue - 1;
        if (newValue <= 0) {
            newValue = 359;
        }
        setPlaneHeading(String(newValue));
    };

    const handeInput_Heading_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value
        if (Number(newValue) > 360){
            newValue = "359"
        }else if (Number(newValue) < 0){
            newValue = "0"
        }
        setPlaneHeading(newValue)
    }

    const handeInput_Distance_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setDistanceCalcInput(newValue)
    }
    const handleInput_Speed_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSpeedCalcInput(newValue)
    }
    
    const handeInput_windHeading_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value
        if (Number(newValue) < 0){
            newValue = "0"
        }
        setWindHeading(newValue)
    }
    const handeInput_windSpeed_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setWindSpeed(newValue)
    }


    const time_speed_calculations = () => {// is autmaitcally called everytime handleInput is called on

        const distance = Number(distanceCalcInput);
        

        const time = distance / Number(speedCalcInput)


        // Convert time to hours and minutes
        const hours = Math.floor(time);
        const minutes = Math.round((time - hours) * 60);

        let timeDisplay = "";
        if (hours > 0) {// if there are hours
            timeDisplay += `${hours} hour${hours !== 1 ? 's' : ''}`;// if hour is not 1, make it hours
        }
        if (minutes > 0 || hours === 0) {
            if (hours > 0) timeDisplay += ' ';// if there are hours, add a space 
            timeDisplay += `${minutes} minute${minutes !== 1 ? 's' : ''}`;// add minute or minutes
        }
        if (timeDisplay === "") {// if empty...
            timeDisplay = "0 minutes";
        }
        
        return(
            <p>{timeDisplay}</p>
        )

    }




    const bombing_calculations = () => {
        const sight_wind_heading_figure = Number(planeHeading) - Number(windHeading)
        const sight_wind_speed = windSpeed + "m/s"

        let heading_output = ""
        if(sight_wind_heading_figure < 0){
            heading_output =  Math.abs(sight_wind_heading_figure) + " right"
        }else if (sight_wind_heading_figure > 0){
            heading_output =  Math.abs(sight_wind_heading_figure) + " left"
        }else{
            heading_output = String(sight_wind_heading_figure)
        }

        return(
            <p>{heading_output}  @{sight_wind_speed}</p>
        )
    }

    const handlesetTimerMode = (timer_select: number) => {
        const newSelection = timerMode === timer_select ? -1 : timer_select;
        setTimerMode(newSelection);
    };


    const handleInput_Combat_Change = (field: keyof typeof combatTimer) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;


        // Limit to 2 digits
        if (newValue.length > 2) {
            newValue = newValue.slice(0, 2);
        }
        
        // Validate seconds to be max 59
        if ((field === 'combatSeconds' || field === 'combatMaxSeconds') && parseInt(newValue) > 59) {
            newValue = '59';
        }
        
        // Validate minutes to be max 99
        if ((field === 'combatMinutes' || field === 'combatMaxMinutes') && parseInt(newValue) > 99) {
            newValue = '99';
        }



        setCombatTimer({ ...combatTimer, [field]: newValue });
    };

    const handleInput_Emergency_Change = (field: keyof typeof emergencyTimer) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;
    
            // Limit to 2 digits
            if (newValue.length > 2) {
                newValue = newValue.slice(0, 2);
            }
            
            // Validate seconds to be max 59
            if ((field === 'emergencySeconds' || field === 'emergencyMaxSeconds') && parseInt(newValue) > 59) {
                newValue = '59';
            }
            
            // Validate minutes to be max 99
            if ((field === 'emergencyMinutes' || field === 'emergencyMaxMinutes') && parseInt(newValue) > 99) {
                newValue = '99';
            }
        setEmergencyTimer({ ...emergencyTimer, [field]: newValue });
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
    

        //angle stuff. no need for useEffect as it doesnt care about distance and such
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        angle = angle + 90; // to make 0 north instead ofeast
        angle = (angle + 360) % 360;//within 360 range
        const heading = Math.round(angle);
    
    
        return(
            <div className="information_row_container">
                <div className="information_waypoint_row">
                    <button className="information_waypoint" onClick={scroll_to_waypoint_from_info(currentPoint.x, currentPoint.y)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                            <defs>
                                <mask id="point_information">
                                    <g fill="none">
                                        <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                    </g>
                                </mask>
                            </defs>
                            <path className={get_point_class(currentPoint.type)} d="M0 0h24v24H0z" mask="url(#point_information)" />
                        </svg>
                        <p className={`waypoint_id ${get_point_id_color_class(currentPoint.type)}`}>{currentPoint.id}</p>
                    </button>


                    <svg 
                        style={{height: "1vw", width:"75%", marginInline: "0.5vw", marginTop:"0.7vw"}}
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



                    <button className="information_waypoint" onClick={scroll_to_waypoint_from_info(nextPoint.x, nextPoint.y)}>
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

                    <p className="heading_number">Heading: {heading}°</p>
                </div>

            </div>
        )
    }
    const scroll_to_waypoint_from_info = (position_x: number, position_y: number) => () => {
        if(containerRef.current){
        const container = containerRef.current;
        const viewport_width = container.clientWidth;// gives the width and height, which does not include overflow distance
        const viewport_height = container.clientHeight;// gives the width and height, which does not include overflow distance
        const scrollLeft = Math.max(0, position_x - viewport_width / 2);
        const scrollTop = Math.max(0, position_y - viewport_height / 2);
            containerRef.current.scrollTo({
                left: scrollLeft,
                top: scrollTop
            })
        }
    }








    useEffect(() => {//for getting total distances of things...
    
        let newTotalDistance = 0;
        let newWaypointDistance = 0;
        let newExtractDistance = 0;
        
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

            if(line.nextPoint.type === 2 || line.nextPoint.type === 3){
                newWaypointDistance += actualDistance
            }
            if(line.nextPoint.type === 4){
                newExtractDistance+= actualDistance
            }

            newTotalDistance += actualDistance;
        });
        
        newWaypointDistance = Math.round(newWaypointDistance * 10) / 10
        setTotalWaypointDistance(newWaypointDistance);//updates

        newExtractDistance = Math.round(newExtractDistance * 10) / 10
        setTotalExtractDisstance(newExtractDistance);//updates

        newTotalDistance = Math.round(newTotalDistance * 10) / 10
        setTotalDistance(newTotalDistance);//updates

    }, [linePositions, mapDistance, isKilometers]);//when points are added or removed, distance is changed, or isKilometers changes



    
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        
        if (timerMode === 2) {
            // Countdown when combat mode is active
            interval = setInterval(() => {
                setCombatTimer(prev => {
                    const totalSeconds = (parseInt(prev.combatMinutes) || 0) * 60 + (parseInt(prev.combatSeconds) || 0);
                    
                    if (totalSeconds <= 0) {
                        return prev;
                    }
                    
                    const newTotalSeconds = totalSeconds - 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        combatMinutes: String(newMinutes).padStart(2, '0'),
                        combatSeconds: String(newSeconds).padStart(2, '0')
                    };
                });
                
                
                setEmergencyTimer(prev => {
                    const currentTotalSeconds = (parseInt(prev.emergencyMinutes) || 0) * 60 + (parseInt(prev.emergencySeconds) || 0);
                    const maxTotalSeconds = (parseInt(prev.emergencyMaxMinutes) || 0) * 60 + (parseInt(prev.emergencyMaxSeconds) || 0);
                    
                    if (currentTotalSeconds >= maxTotalSeconds) {
                        return prev;
                    }
                    
                    const newTotalSeconds = currentTotalSeconds + 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        emergencyMinutes: String(newMinutes).padStart(2, '0'),
                        emergencySeconds: String(newSeconds).padStart(2, '0')
                    };
                });
            }, 1000);
        } else if (timerMode === 3) {
            // Countdown when emergency mode is active
            interval = setInterval(() => {
                setEmergencyTimer(prev => {
                    const totalSeconds = (parseInt(prev.emergencyMinutes) || 0) * 60 + (parseInt(prev.emergencySeconds) || 0);
                    
                    if (totalSeconds <= 0) {
                        return prev;
                    }
                    
                    const newTotalSeconds = totalSeconds - 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        emergencyMinutes: String(newMinutes).padStart(2, '0'),
                        emergencySeconds: String(newSeconds).padStart(2, '0')
                    };
                });

                setCombatTimer(prev => {
                    const currentTotalSeconds = (parseInt(prev.combatMinutes) || 0) * 60 + (parseInt(prev.combatSeconds) || 0);
                    const maxTotalSeconds = (parseInt(prev.combatMaxMinutes) || 0) * 60 + (parseInt(prev.combatMaxSeconds) || 0);
                    
                    if (currentTotalSeconds >= maxTotalSeconds) {
                        return prev;
                    }
                    
                    const newTotalSeconds = currentTotalSeconds + 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        combatMinutes: String(newMinutes).padStart(2, '0'),
                        combatSeconds: String(newSeconds).padStart(2, '0')
                    };
                });
            }, 1000);
        } else if(timerMode === 1) {
            // Count both timers back up to max when neither mode is active
            interval = setInterval(() => {
                setCombatTimer(prev => {
                    const currentTotalSeconds = (parseInt(prev.combatMinutes) || 0) * 60 + (parseInt(prev.combatSeconds) || 0);
                    const maxTotalSeconds = (parseInt(prev.combatMaxMinutes) || 0) * 60 + (parseInt(prev.combatMaxSeconds) || 0);
                    
                    if (currentTotalSeconds >= maxTotalSeconds) {
                        return prev;
                    }
                    
                    const newTotalSeconds = currentTotalSeconds + 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        combatMinutes: String(newMinutes).padStart(2, '0'),
                        combatSeconds: String(newSeconds).padStart(2, '0')
                    };
                });

                setEmergencyTimer(prev => {
                    const currentTotalSeconds = (parseInt(prev.emergencyMinutes) || 0) * 60 + (parseInt(prev.emergencySeconds) || 0);
                    const maxTotalSeconds = (parseInt(prev.emergencyMaxMinutes) || 0) * 60 + (parseInt(prev.emergencyMaxSeconds) || 0);
                    
                    if (currentTotalSeconds >= maxTotalSeconds) {
                        return prev;
                    }
                    
                    const newTotalSeconds = currentTotalSeconds + 1;
                    const newMinutes = Math.floor(newTotalSeconds / 60);
                    const newSeconds = newTotalSeconds % 60;
                    
                    return {
                        ...prev,
                        emergencyMinutes: String(newMinutes).padStart(2, '0'),
                        emergencySeconds: String(newSeconds).padStart(2, '0')
                    };
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerMode]);





    
    return(
        <div className="information_container" style={{ display: (showInfoContainer && showUI) ? 'block' : 'none' }}>
            <h1 className='information_container_title'>Flight Information</h1>
            <p className="calculation_header_text">Flight Notes</p>
            <textarea className="flight_notes" onChange={handleInput_flightNotes_Change} value={flightNotes} placeholder="Fuel, formations and loadouts..."></textarea>
            <p className="calculation_header_text">Target Site</p>
            <Target_picture drawing_color={drawColor} drawline_thickness={drawline_thickness} eraser={eraseDrawing} Targetdrawings={Targetdrawings} onTargetDrawingsChange={setTargetdrawings}/>


            {linePositions.map(line=> (
                <div key = {line.id}>
                    <div>{calculations(line.currentPoint, line.nextPoint, line.position)}</div>
                </div>
            ))}

            <div className="total_statistics">
                <div>
                    <p>Total Target Distance: {totalWaypointDistance}</p> 
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'km' : 'mi'}</button>
                </div>

                <div>
                    <p>Total Egress Distance: {totalExtractDisstance}
                    </p> 
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'km' : 'mi'}</button>
                </div>

                <div>
                    <p>Total Distance: {totalDistance}</p> 
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'km' : 'mi'}</button>
                </div>
            </div>


            <div className="calculations_container">
                <p className="calculation_header_text">Distance Speed Calculator</p>
                <div>
                    <p>Distance:</p>
                    <form><input className='calculations_inputField' type="number" onChange={handeInput_Distance_Change} value={distanceCalcInput}></input></form>
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'km' : 'mi'}</button>
                </div>
                <div>
                    <p>Speed:</p>
                    <form><input className='calculations_inputField' type="number" onChange={handleInput_Speed_Change} value={speedCalcInput}></input></form>
                    <button className="distance_marker" onClick={toggleUnitType}>{isKilometers ? 'kph' : 'mph'}</button>
                </div>
                <div>
                    <p>Time:</p>
                    {time_speed_calculations()}
                </div>
            </div>

            <div className="calculations_container">
                <p className="calculation_header_text">Bombsight Calculator</p>
                <div>
                    <p>Plane Heading</p>

                    <button className="left_increment" onClick={handleLeftIncrement}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                            <g fillRule="evenodd" clipRule="evenodd">
                                <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                            </g>
                        </svg>
                    </button>

                    <form><input className='calculations_inputField' type="number" onChange={handeInput_Heading_Change} value={planeHeading}></input></form>

                    <button className="right_increment" onClick={handleRightIncrement}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                            <g fillRule="evenodd" clipRule="evenodd">
                                <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                                <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                            </g>
                        </svg>
                    </button>
                </div>

                <div>
                    <p>Wind Heading</p>
                    <form><input className='calculations_inputField' onChange={handeInput_windHeading_Change} value={windHeading} type="number"></input></form>
                </div>

                <div>
                    <p>Wind Speed &#40;m/s&#41;</p>
                    <form><input className='calculations_inputField' onChange={handeInput_windSpeed_Change} value={windSpeed} type="number"></input></form>
                </div>

                <div>
                    <p>Sight Wind Heading: </p>
                    {bombing_calculations()}
                </div>

            </div>



            <div className="engineManagement_container">
                <p className="calculation_header_text">Engine Management</p>
                <div>
                    <div className='engine_mode_container engine_continuous_container' style={{backgroundColor: timerMode === 1 ? 'rgba(119, 255, 95, 0.2)' : 'transparent'}}>
                        <button className='engine_mode_button engine_continuous_button' onClick={() => handlesetTimerMode(1)}>continuous</button>  
                    </div>
                </div>

                <div>
                    <div className='engine_mode_container engine_combat_container' style={{backgroundColor: timerMode === 2 ? 'rgba(255, 217, 48, 0.2)' : 'transparent'}}>
                        <button className='engine_mode_button engine_combat_button' onClick={() => handlesetTimerMode(2)}>combat</button>

                        <form className='timer_form_container'>
                            <input className='timer_inputField' type="number" 
                                value={combatTimer.combatMinutes}
                                onChange={handleInput_Combat_Change('combatMinutes')}
                            />
                                <p className='timer_colon'>:</p>
                            <input className='timer_inputField' type="number"
                                value={combatTimer.combatSeconds}
                                onChange={handleInput_Combat_Change('combatSeconds')}
                            />
                        </form>

                        <form className='timer_form_container'>
                            <small>Max</small>
                            <input className='timer_inputField_maxInput' type="number"
                                value={combatTimer.combatMaxMinutes}
                                onChange={handleInput_Combat_Change('combatMaxMinutes')}
                            />
                                <p className='timer_colon_maxInput'>:</p>
                            <input className='timer_inputField_maxInput' type="number"
                                value={combatTimer.combatMaxSeconds}
                                onChange={handleInput_Combat_Change('combatMaxSeconds')}
                            />
                        </form>

                    </div>
                </div>

                <div>
                    <div className='engine_mode_container engine_emergency_container' style={{backgroundColor: timerMode === 3 ? 'rgba(255, 47, 47, 0.2)' : 'transparent'}}>
                        <button className='engine_mode_button engine_emergency_button' onClick={() => handlesetTimerMode(3)}>emergency</button>



                        <form className='timer_form_container'>
                            <input className='timer_inputField' type="number" 
                                value={emergencyTimer.emergencyMinutes}
                                onChange={handleInput_Emergency_Change('emergencyMinutes')}
                            />
                                <p className='timer_colon'>:</p>
                            <input className='timer_inputField' type="number"
                                value={emergencyTimer.emergencySeconds}
                                onChange={handleInput_Emergency_Change('emergencySeconds')}
                            />
                        </form>

                        <form className='timer_form_container'>
                            <small>Max</small>
                            <input className='timer_inputField_maxInput' type="number"
                                value={emergencyTimer.emergencyMaxMinutes}
                                onChange={handleInput_Emergency_Change('emergencyMaxMinutes')}
                            />
                                <p className='timer_colon_maxInput'>:</p>
                            <input className='timer_inputField_maxInput' type="number"
                                value={emergencyTimer.emergencyMaxSeconds}
                                onChange={handleInput_Emergency_Change('emergencyMaxSeconds')}
                            />
                        </form>




                    </div>
                </div>
            </div>





        </div>
    )
}

export default Flight_info;