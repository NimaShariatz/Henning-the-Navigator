import {useState, useEffect, useRef} from "react"

import "./navigation_set.css"

interface NavigationSetProps {
    onWaypointSelectionChange?: (selection: number) => void;// exclusively just for passing which point is selected to minimap.tsx
    points_set: {id: number, x: number, y: number, type: number}[];//passed from map.tsx
}



function Navigation_set({ onWaypointSelectionChange, points_set }: NavigationSetProps){
    const extraction = useRef<HTMLButtonElement>(null);
    const navigation = useRef<HTMLButtonElement>(null);
    const start = useRef<HTMLButtonElement>(null);
    const target = useRef<HTMLButtonElement>(null);

    const selectionMap = [
        { value: 1, ref: start },
        { value: 2, ref: target },
        { value: 3, ref: navigation },
        { value: 4, ref: extraction }
    ];
    


    const [waypointSelection, setWaypointSelection] = useState(-1);





    const toggle_waypoint_suggestion = (value: number) => {
        const newSelection = waypointSelection === value ? -1 : value;
        setWaypointSelection(newSelection);
        
        if (onWaypointSelectionChange) {//if its then notify the component of the change
            onWaypointSelectionChange(newSelection);
        }
    };
    

    
    useEffect(() => {

        selectionMap.forEach(item => {
            if (item.ref.current) {
                if (waypointSelection === item.value) { //the button clicked
                    item.ref.current.classList.add("button_selected")
                } else {
                    item.ref.current.classList.remove("button_selected")
                }
            }
        });


        const has_one_start_point = points_set.some(point => point.type === 1);//Check if points_set contains at least one start point. true or false
    
        const has_one_target_point = points_set.some(point => point.type === 2);//Check for target point. true or false
        
        if(!has_one_start_point){// if we dont have a start point, set selection to it!
            setWaypointSelection(1);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(1);
            }
        }else if(!has_one_target_point){// if we dont have a target point, set selection to it!
            setWaypointSelection(2);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(2);
            }
        } else if ((has_one_start_point && waypointSelection === 1) || (has_one_start_point && waypointSelection === 2)){// if we got both but selection is on either, remove it
            setWaypointSelection(-1);
            if (onWaypointSelectionChange) {
                onWaypointSelectionChange(-1);
            }
        }


        if (navigation.current && start.current && target.current && extraction.current) {
    
            
            if ( (!has_one_start_point && !has_one_target_point) || (!has_one_start_point && has_one_target_point)) {        


                
                selectionMap.forEach(item => {// Disable all target buttons when there's no start and target point
                    
                    if (item.ref.current) {
                        if (item.value !== 1) {
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.disabled = true;
                            item.ref.current.style.cursor = "not-allowed"
                        }else{//except for start
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                            item.ref.current.style.cursor = "pointer"
                        }
                    }

                });


                
            }else if(has_one_start_point && !has_one_target_point){


                selectionMap.forEach(item => {// Disable all
                    
                    if (item.ref.current) {
                        if (item.value !== 2) {
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.style.cursor = "not-allowed"
                            item.ref.current.disabled = true;
                        }else{//except for target
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                            item.ref.current.style.cursor = "pointer"
                        }
                    }

                });

  


            
            } else {

                
                selectionMap.forEach(item => {// Disable all
                    
                    if (item.ref.current) {
                        if ((item.value !== 1) && (item.value !== 2)) {
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                            item.ref.current.style.cursor = "pointer"
                        }else{//except for target and start
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.disabled = true;
                            item.ref.current.style.cursor = "not-allowed"
                        }
                    }

                });

                
            }





        }//if
        
    }, [waypointSelection, points_set]);






    return(
        <>
        
            <div className="navigation_button_set"> {/* Note it is not onClick={handleButtonClick(0)} as this would immediatley execute it. rather than create an event handler. so its activating on render than on click */}

                <button className="navigation_button" onClick={() => toggle_waypoint_suggestion(4)} ref={extraction}>
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

               <button className="navigation_button"  onClick={() => toggle_waypoint_suggestion(3)} ref={navigation}>
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

               <button className="navigation_button"  onClick={() => toggle_waypoint_suggestion(2)} ref={target}>
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

                <button className="navigation_button"  onClick={() => toggle_waypoint_suggestion(1)} ref={start}>
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

            </div>














        </>
    )
}
export default Navigation_set