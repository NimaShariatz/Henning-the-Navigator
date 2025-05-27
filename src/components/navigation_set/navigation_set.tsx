import {useState, useEffect, useRef} from "react"

import "./navigation_set.css"

interface NavigationSetProps {
    onWaypointSelectionChange?: (selection: number) => void;// exclusively just for passing which point is selected to minimap.tsx
    points_set: {id: number, x: number, y: number, type: number}[];//passed from map.tsx
}



function Navigation_set({ onWaypointSelectionChange, points_set }: NavigationSetProps){
    const navigation = useRef<HTMLButtonElement>(null);
    const secondary = useRef<HTMLButtonElement>(null);
    const start = useRef<HTMLButtonElement>(null);
    const target = useRef<HTMLButtonElement>(null);
    const extraction = useRef<HTMLButtonElement>(null);
    
    


    const [waypointSelection, setWaypointSelection] = useState(-1)



    const [targetSetMovement, setTargetSetMovement] = useState(false)



    const toggle_waypoint_suggestion = (value: number) => {
        const newSelection = waypointSelection === value ? -1 : value;
        setWaypointSelection(newSelection);
        
        if (onWaypointSelectionChange) {//if its then notify the component of the change
            onWaypointSelectionChange(newSelection);
        }
    };
    
    useEffect(() => {

        const selectionMap = [
            { value: 1, ref: navigation },
            { value: 2, ref: secondary },
            { value: 3, ref: start },
            { value: 4, ref: target },
            { value: 5, ref: extraction }
        ];
        

        selectionMap.forEach(item => {
            if (item.ref.current) {
                if (waypointSelection === item.value) { //the button clicked
                    item.ref.current.style.outline = "0.2vw solid white";
                    item.ref.current.style.opacity = "1";
                } else {
                    item.ref.current.style.outline = "none";
                    item.ref.current.style.opacity = "0.8";
                }
            }
        });




        const has_one_start_point = points_set.some(point => point.type === 3);//Check if points_set contains at least one start point. true or false
        
        
    
        const has_one_target_point = points_set.some(point => point.type === 4);//Check for target point. true or false
        


        if(!has_one_start_point){// if we dont have a start point, set selection to it!
            setWaypointSelection(3);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(3);
            }
        }else if(!has_one_target_point){// if we dont have a target point, set selection to it!
            setWaypointSelection(4);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(4);
            }
        } else if ((has_one_start_point && waypointSelection === 3) || (has_one_start_point && waypointSelection === 4)){// if we got both but selection is on either, remove it
            setWaypointSelection(-1);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(-1);
            }
        }


        if (navigation.current && secondary.current && start.current && target.current && extraction.current) {
            

            
            
            if (!has_one_start_point && !has_one_target_point) {
                navigation.current.style.opacity = "0.3";
                navigation.current.style.cursor = "not-allowed";
                navigation.current.disabled = true;
                navigation.current.style.filter = "grayscale(1)"

                secondary.current.style.opacity = "0.3";
                secondary.current.style.cursor = "not-allowed";
                secondary.current.disabled = true;
                secondary.current.style.filter = "grayscale(1)"

                start.current.style.cursor = "pointer";
                start.current.disabled = false;
                start.current.style.filter = "none"

                target.current.style.opacity = "0.3";
                target.current.style.cursor = "not-allowed";
                target.current.disabled = true;
                target.current.style.filter = "grayscale(1)"

                extraction.current.style.opacity = "0.3";
                extraction.current.style.cursor = "not-allowed";
                extraction.current.disabled = true;
                extraction.current.style.filter = "grayscale(1)"

                
            }else if(has_one_start_point && !has_one_target_point){
                navigation.current.style.opacity = "0.3";
                navigation.current.style.cursor = "not-allowed";
                navigation.current.disabled = true;
                navigation.current.style.filter = "grayscale(1)"

                secondary.current.style.opacity = "0.3";
                secondary.current.style.cursor = "not-allowed";
                secondary.current.disabled = true;
                secondary.current.style.filter = "grayscale(1)"



                start.current.style.opacity = "0.3";
                start.current.style.cursor = "not-allowed";
                start.current.disabled = true;
                start.current.style.filter = "grayscale(1)"

                target.current.style.cursor = "pointer";
                target.current.disabled = false;
                target.current.style.filter = "none"

                extraction.current.style.opacity = "0.3";
                extraction.current.style.cursor = "not-allowed";
                extraction.current.disabled = true;
                extraction.current.style.filter = "grayscale(1)"

            
            }else if(!has_one_start_point && has_one_target_point){
                navigation.current.style.opacity = "0.3";
                navigation.current.style.cursor = "not-allowed";
                navigation.current.disabled = true;
                navigation.current.style.filter = "grayscale(1)"

                secondary.current.style.opacity = "0.3";
                secondary.current.style.cursor = "not-allowed";
                secondary.current.disabled = true;
                secondary.current.style.filter = "grayscale(1)"


                start.current.style.cursor = "pointer";
                start.current.disabled = false;
                start.current.style.filter = "none"

                target.current.style.opacity = "0.3";
                target.current.style.cursor = "not-allowed";
                target.current.disabled = true;
                target.current.style.filter = "grayscale(1)"

                extraction.current.style.opacity = "0.3";
                extraction.current.style.cursor = "not-allowed";
                extraction.current.disabled = true;
                extraction.current.style.filter = "grayscale(1)"


            } else {
                navigation.current.style.cursor = "pointer";
                navigation.current.disabled = false;
                navigation.current.style.filter = "none"

                secondary.current.style.cursor = "pointer";
                secondary.current.disabled = false;
                secondary.current.style.filter = "none"

                start.current.style.opacity = "0.3";
                start.current.style.cursor = "not-allowed";
                start.current.disabled = true;
                start.current.style.filter = "grayscale(1)"

                target.current.style.opacity = "0.3";
                target.current.style.cursor = "not-allowed";
                target.current.disabled = true;
                target.current.style.filter = "grayscale(1)"

                extraction.current.style.cursor = "pointer";
                extraction.current.disabled = false;
                extraction.current.style.filter = "none"
                

            }

            if(has_one_start_point){
                start.current.style.opacity = "0.3";
                start.current.style.cursor = "not-allowed";
                start.current.disabled = true;
                start.current.style.filter = "grayscale(1)"
            }
            if(has_one_target_point){
                target.current.style.opacity = "0.3";
                target.current.style.cursor = "not-allowed";
                target.current.disabled = true;
                target.current.style.filter = "grayscale(1)"
            }




        }//if
        
    }, [waypointSelection, points_set]);














    //---------------
    const movement_button_svg = useRef<SVGSVGElement>(null);
    const targets_button_container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        
        if (movement_button_svg.current && targets_button_container.current){
            if (targetSetMovement){
                movement_button_svg.current.style.transform = 'rotate(180deg)'
                targets_button_container.current.style.transform = 'translateX(-22vw)'

            }else{
                movement_button_svg.current.style.transform = 'rotate(180deg)'
                targets_button_container.current.style.transform = 'translateX(0)'

            }
        }

        
    }, [targetSetMovement])
    



    //--------------









    return(
        <>
        
            <div className="navigation_button_set"> {/* Note it is not onClick={handleButtonClick(0)} as this would immediatley execute it. rather than create an event handler. so its activating on render than on click */}

                <button className="minimap_button" onClick={() => toggle_waypoint_suggestion(1)} ref={navigation}>
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
                        <path className="navigation_fill" d="M0 0h24v24H0z" mask="url(#point)" />
                    </svg>
                </button>

               <button className="minimap_button"  onClick={() => toggle_waypoint_suggestion(2)} ref={secondary}>
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
                        <path className="secondary_fill" d="M0 0h24v24H0z" mask="url(#point)" />
                    </svg>
                </button>

               <button className="minimap_button"  onClick={() => toggle_waypoint_suggestion(3)} ref={start}>
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
                        <path className="start_fill" d="M0 0h24v24H0z" mask="url(#point)" />
                    </svg>
                </button>

               <button className="minimap_button"  onClick={() => toggle_waypoint_suggestion(4)} ref={target}>
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
                        <path className="target_fill" d="M0 0h24v24H0z" mask="url(#point)" />
                    </svg>
                </button>

                <button className="minimap_button"  onClick={() => toggle_waypoint_suggestion(5)} ref={extraction}>
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
                        <path className="extraction_fill" d="M0 0h24v24H0z" mask="url(#point)" />
                    </svg>
                </button>

            </div>




            

            <div className="target_icons_set" ref={targets_button_container}>

                <div className="target_icons_row">
                    

                    <div className="target_set">

                    </div>

                    <div className="movement_set">
                        <button className="movement_button" onClick={() => setTargetSetMovement(!targetSetMovement)}>
                            <svg ref={movement_button_svg} className="movement_button_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
	                            <path className="chevron_fill_2" d="m503.933 255.933l.041-.041l-68.081-68.082l-6.221-6.175l-5.122-5.085L315.516 67.516l-79.462 79.463L345.075 256L236.054 365.021l79.462 79.463l109.021-109.021l.041.041l.067-.067l68.081-68.082L504 256Zm-188.417 143.3l-34.207-34.208L390.33 256L281.309 146.979l34.207-34.208l97.707 97.707l11.355 11.273L458.827 256l-34.249 34.249l-.041-.041l-.067.067Z" />
	                            <path className="chevron_fill" d="m282.792 256l-.067-.067l.041-.041l-68.082-68.082L203.4 176.6L94.308 67.516l-79.463 79.463L123.866 256L14.845 365.021l79.463 79.463L203.4 335.4l.041.041l68.082-68.082ZM203.3 290.316l-.041-.041L94.308 399.229L60.1 365.021L169.121 256L60.1 146.979l34.208-34.208l97.707 97.707l11.279 11.2L237.619 256Z" />
                            </svg>
                        </button>
                    </div>


                </div>

            </div>

        </>
    )
}
export default Navigation_set