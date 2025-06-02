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
    const radar = useRef<HTMLButtonElement>(null);
    const factory = useRef<HTMLButtonElement>(null);
    const railway = useRef<HTMLButtonElement>(null);
    const refinery = useRef<HTMLButtonElement>(null);
    const tank = useRef<HTMLButtonElement>(null);
    const convoy = useRef<HTMLButtonElement>(null);
    const truck = useRef<HTMLButtonElement>(null);
    const emplacement = useRef<HTMLButtonElement>(null);
    const artillery = useRef<HTMLButtonElement>(null);
    const airfield = useRef<HTMLButtonElement>(null);
    const airfield_2 = useRef<HTMLButtonElement>(null);
    const change = useRef<HTMLButtonElement>(null);

    const selectionMap = [
        { value: 1, ref: start },
        { value: 2, ref: target },
        { value: 3, ref: navigation },
        { value: 4, ref: extraction },
        { value: 5, ref: radar },
        { value: 6, ref: factory },
        { value: 7, ref: railway },
        { value: 8, ref: refinery },
        { value: 9, ref: tank },
        { value: 10, ref: convoy },
        { value: 11, ref: truck },
        { value: 12, ref: emplacement },
        { value: 13, ref: artillery },
        { value: 14, ref: airfield },
        { value: 15, ref: airfield_2 },
        { value: 16, ref: change }
    ];
    


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


        if (navigation.current && start.current && target.current && extraction.current && radar.current && factory.current && railway.current && refinery.current && tank.current && convoy.current && truck.current && emplacement.current && artillery.current && airfield.current && airfield_2.current && change.current) {
            

            
            
            if ( (!has_one_start_point && !has_one_target_point) || (!has_one_start_point && has_one_target_point)) {        


                
                selectionMap.forEach(item => {// Disable all target buttons when there's no start and target point
                    
                    if (item.ref.current) {
                        if (item.value !== 1) {
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.disabled = true;
                        }else{//except for start
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                        }
                    }

                });


                
            }else if(has_one_start_point && !has_one_target_point){


                selectionMap.forEach(item => {// Disable all
                    
                    if (item.ref.current) {
                        if (item.value !== 2) {
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.disabled = true;
                        }else{//except for target
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                        }
                    }

                });

  


            
            } else {

                
                selectionMap.forEach(item => {// Disable all
                    
                    if (item.ref.current) {
                        if ((item.value !== 1) && (item.value !== 2)) {
                            item.ref.current.classList.remove("button_disabled");
                            item.ref.current.disabled = false;
                        }else{//except for target
                            item.ref.current.classList.add("button_disabled");
                            item.ref.current.disabled = true;
                        }
                    }

                });

                
            }





        }//if
        
    }, [waypointSelection, points_set]);














    //---------------
    const movement_button_svg = useRef<SVGSVGElement>(null);
    const targets_button_container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        
        if (movement_button_svg.current && targets_button_container.current){
            if (targetSetMovement){
                movement_button_svg.current.style.transform = 'rotate(0deg)'
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




            

            <div className="target_icons_set" ref={targets_button_container}>

                <div className="target_icons_row">
                    
                    <div className="target_set">
                        <div>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(5)} ref={radar}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <g fill="none">
                                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                        <path fill="#ae3232" d="M5.269 4.026c.557-.628 1.463-.628 2.044-.148l.105.095l4.848 4.847l.087-.087a1 1 0 0 1 
                                        1.497 1.32l-.083.094l-.087.087l4.347 4.348c.572.572.614 1.557-.053 2.15a8.97 8.97 0 0 1-4.466 2.142l-.341.051l.98 1.318a1.1 1.1 0 0 
                                        1-.766 1.751l-.116.006h-6.58a1.1 1.1 0 0 1-1.058-1.403l.04-.115l1.254-3.051A8.99 8.99 0 0 1 3 10a8.97 8.97 0 0 1 2.269-5.974m3.426 14.348L8.028 20h3.446l-.819-1.1a9 9 0 0 1-1.582-.387l-.378-.14ZM6.407 5.79a7 
                                        7 0 0 0 9.803 9.803l-3.944-3.944l-1.559 1.558a1 1 0 0 1-1.414-1.414l1.558-1.559zm7.7-.737a3.5 3.5 0 0 1 2.859 2.96a1 1 0 0 1-1.958.393l-.023-.115a1.5 1.5 
                                        0 0 0-1.07-1.233l-.155-.035a1 1 0 0 1 .348-1.97ZM14 2a6 6 0 0 1 6 6a1 1 0 0 1-1.993.117L18 8a4 4 0 0 0-4-4a1 1 0 1 1 0-2" />
                                    </g>
                                </svg>
                            </button>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(6)} ref={factory}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 24 24">
                                    <path fill="#ae3232" d="M12 12V9.95l-5 2V10l-3 1.32V20h16v-8zm-3 6H7v-4h2zm4 0h-2v-4h2zm4 0h-2v-4h2z" opacity="0.3" />
                                    <path fill="#ae3232" d="M22 22H2V10l7-3v2l5-2v3h3l1-8h3l1 8zM12 9.95l-5 2V10l-3 1.32V20h16v-8h-8zM11 18h2v-4h-2zm-4 0h2v-4H7zm10-4h-2v4h2z" />
                                </svg>
                            </button>

                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(7)} ref={railway}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 512 512">
	                                <path fill="#ae3232" d="M18 112v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39zM18 169v30h476v-30zm0 48v78h38v-78zm102 0v78h48v-78zm112 0v78h48v-78zm112 0v78h48v-78zm112 0v78h38v-78zM18 313v30h476v-30zm0 48v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39z" />
                                </svg>
                            </button>

                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(8)} ref={refinery}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 512 512">
                                    <path fill="#ae3232" d="M288 133v18h160v-18zm41 34v16h78v-16zM64 201c-5.75 0-10.406 1.939-15.074 6.023c-4.668 
                                    4.085-9.078 10.48-12.701 18.631C28.978 241.96 25 265 25 288s3.978 46.041 11.225 62.346c3.623 8.152 8.033 14.546 12.7 
                                    18.63C53.595 373.062 58.25 375 64 375h5.055l2-17.994l.89-8.006h80.11l2.888 26H183V201zm137 0v46h46v-46zm64 0v174h28.055l2-17.994l.89-8.006h80.11l2.888 
                                    26H448c5.75 0 10.406-1.94 15.074-6.023c4.668-4.085 9.08-10.48 12.703-18.631c7.247-16.304 11.225-39.343 
                                    11.225-62.342c0-23-3.976-46.04-11.223-62.344c-3.623-8.152-8.034-14.55-12.703-18.635c-4.668-4.084-9.326-6.024-15.076-6.025zm-64 64v46h46v-46zm0 64v46h46v-46zM88.057 367l-14 126h75.886l-13.998-126zm224 0l-14 126h75.886l-13.998-126zM183 384v110h18v-37h46v37h18V384h-18v55h-46v-55zm226 
                                    9v30h30v-30zm6.803 48c5.844 19.928 16.417 32.884 28.318 40.563C462.214 493.235 482 493 490 493v-18c-8 0-23.214-.235-36.121-8.563c-7.548-4.87-14.772-12.42-19.473-25.437z" />
                                </svg>
                            </button>

                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(9)} ref={tank}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 32 32">
                                    <path fill="#ae3232" d="M30 13v-2H18.618l-.723-1.447A1 1 0 0 0 17 9H9a1 1 0 0 0-1 1v5H4v2h18.638l3.6 3H3a1 1 0 0 0-1 1v2a5.006 5.006 0 0 0 5 5h18a5.006 5.006 0 0 0 5-5v-2a1 1 0 0 0-.36-.769l-6-5A1 1 0 0 0 23 15h-2.382l-1-2Zm-2 10a3.003 3.003 0 0 1-3 3H7a3.003 3.003 0 0 1-3-3v-1h24Zm-18-8v-4h6.382l2 4Z" />
                                </svg>
                            </button>

                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(10)} ref={convoy}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 24 24">
                                    <path fill="#ae3232" d="M9 4h5.446a1 1 0 0 1 .848.47L18.75 10h4.408a.5.5 0 0 1 .439.74L19.637 18H19a6 6 0 0 1-1.535-.198L20.63 12H3.4l1.048 5.824A6 6 0 0 1 3 18h-.545l-1.24-6.821A1 1 0 0 1 2.197 10H3V5a1 1 0 0 1 1-1h1V1h4zm-4 6h11.392l-2.5-4H5zM3 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 11 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 19 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 11 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 3 22H1v-2z" />
                                </svg>
                            </button>
                        </div>




                        <div>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(11)} ref={truck}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 512 512">
                                    <path fill="#ae3232" fillRule="evenodd" d="M138.667 341.333c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m256 0c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m-96-192v149.333H320v-128h106.667L469.334 256v106.666h-22.4C441.991 338.322 420.468 320 394.666 320s-47.325 18.322-52.266 42.666H190.933C185.992 338.322 164.47 320 138.667 320s-47.325 18.322-52.266 42.666H42.667V149.333zM256 192H85.334v106.666H256zm144.3 21.333h-37.632v42.666h58.965z" />
                                </svg>
                            </button>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(12)} ref={emplacement}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <path fill="#ae3232" d="M6 6.39v4.7c0 4 2.55 7.7 6 8.83c3.45-1.13 6-4.82 6-8.83v-4.7l-6-2.25z" opacity="0.3" />
                                    <path fill="#ae3232" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5zm6 9.09c0 4-2.55 7.7-6 8.83c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6 2.25z" />
                                </svg>                                
                            </button>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(13)} ref={artillery}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 512 512">
	                                <path fill="#ae3232" d="m372.386 52.97l-14.822 13.064l103.244 117.142l14.822-13.064zm-30.23 26.646l-36.649 32.303l15.549 17.64zm16.865 16.346l-20.442 48.382l-1.457 3.448l19.012 21.57l21.897-51.832zm-67.537 28.318L119.939 275.485l.054.062l-1.294 1.141c-19.625 17.298-36.277 35.67-49.407 53.91l92.854 105.356c19.745-10.734 40.062-24.948 59.687-42.246l1.295-1.143l.055.063l6.23-5.493l165.313-145.713zm102.615 11.482l-20.443 48.385l-1.456 3.445l20.838 23.641l21.897-51.83zm36.904 41.873l-20.441 48.385l-.973 2.303l37.194-32.783zM58.583 346.723c-4.228 6.959-7.93 13.848-11.015 20.592c-6.73 
                                    14.712-10.7 28.778-11.157 41.78c-.457 13.001 2.827 25.259 10.93 34.452c8.103 9.194 19.85 13.989 32.805 15.168c12.955 1.18 27.408-.992 42.847-5.822c7.078-2.214 14.377-5.02 21.811-8.342z" />
                                </svg>
                            </button>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(14)} ref={airfield}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 24 24">
                                    <path fill="#ae3232" d="M20.633 2.276c-.726-.117-1.501.127-2.174.371c-.972.354-2.07.93-2.646 1.506l-1.61 1.703l-5.334-2.02a1.8 1.8 0 0 0-1.93.354L5.46 5.587c-.34.321-.3.89.083 1.16l4.696 3.303l-.862.912c-.52.52-.996 1.028-1.355 1.522a4.7 4.7 0 0 0-.432.707l-2.139-.844c-.66-.26-1.393-.07-1.886.397l-1.08 1.02a.757.757 0 0 0 .048 1.131l3.651 2.922l2.922 3.651c.28.35.822.373 1.13.047l1.022-1.08c.465-.492.657-1.226.396-1.885l-.844-2.138c.247-.12.483-.27.707-.433c.494-.359 1.002-.835 1.522-1.354l.912-.863l3.304 4.696a.758.758 0 0 0 1.159.083l1.397-1.48a1.8 1.8 0 0 0 .353-1.93l-2.019-5.334l1.703-1.61c.577-.577 1.152-1.674 
                                    1.506-2.646c.244-.672.488-1.448.371-2.174a1.27 1.27 0 0 0-1.09-1.091" opacity="0.5" />
                                    <path fill="#ae3232" fillRule="evenodd" d="M20.633 2.276c.224.035.51.125.738.353c.229.229.318.514.353.738c.037.23.03.473.005.7c-.052.458-.195.976-.376 1.474c-.354.972-.93 2.07-1.506 2.646l-.015.015l-1.688 1.595l2.02 5.334a1.8 1.8 0 0 1-.354 1.93l-1.397 1.48a.757.757 0 0 1-1.16-.083l-3.303-4.696l-.912.863c-.52.519-1.028.995-1.522 1.354c-.224.163-.46.313-.707.433l.844 2.138c.26.66.07 1.393-.396 1.886l-1.022 1.08a.757.757 0 0 1-1.13-.047l-2.922-3.652l-3.651-2.922a.757.757 0 0 1-.047-1.13l1.08-1.021c.492-.466 1.226-.658 1.885-.397l2.139.845c.12-.248.27-.484.432-.708c.359-.494.835-1.002 1.355-1.522l.862-.912l-4.696-3.304a.757.757 0 0 
                                    1-.083-1.159l1.48-1.397a1.8 1.8 0 0 1 1.93-.353l5.334 2.019l1.595-1.688l.015-.015C16.39 3.576 17.487 3 18.46 2.647c.498-.181 1.016-.324 1.474-.376c.227-.025.47-.032.7.005M16.88 
                                    5.207l-1.93 2.042a.75.75 0 0 1-.811.187L8.325 5.235l-.03-.012a.3.3 0 0 0-.326.057l-.813.768l4.654 3.274c.368.26.423.801.113 1.129L10.458 12l-.014.014c-.513.513-.922.954-1.21 1.35c-.291.403-.406.688-.425.891a.757.757 0 0 1-1.022.627l-2.888-1.141c-.262-.104-.6.371-.757.52l3.043 2.436a1 1 0 0 1 .118.117l2.435 3.043c.149-.157.624-.495.52-.757l-1.14-2.887a.757.757 0 0 1 .626-1.023c.203-.019.488-.134.89-.426c.397-.287.838-.696 1.35-1.209l.016-.014l1.55-1.465a.758.758 0 0 1 1.128.113l3.274 4.654l.768-.813a.3.3 0 0 0 .058-.325l-.013-.03l-2.2-5.815a.75.75 0 0 1 .186-.81l2.042-1.931c.347-.351.826-1.2 
                                    1.15-2.092c.148-.405.292-.842.306-1.277c-.435.014-.872.158-1.277.306c-.891.324-1.74.803-2.092 1.15" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button className="target_button" onClick={() => toggle_waypoint_suggestion(15)} ref={airfield_2}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                    <path fill="#ae3232" d="M13.105 12.609v2.279a.12.12 0 0 0 .061.105l.622.355a.49.49 0 0 1 .242.365l.049.413a.243.243 0 0 1-.307.263l-1.641-.459a.5.5 0 0 0-.262 0l-1.641.459a.244.244 0 0 1-.308-.263l.05-.413a.49.49 0 0 1 .242-.365l.621-.355a.12.12 0 0 0 .062-.105v-2.279a.122.122 0 0 0-.137-.121l-3.485.435A.242.242 0 0 1 7 12.682v-.624a.49.49 0 0 1 .316-.455l3.5-1.313a.12.12 0 0 0 .079-.114v-.741a4.8 4.8 0 0 1 .1-.981a1.015 1.015 0 0 1 1.2-.833a1.06 1.06 0 0 1 .819.9l.015.094a6 6 0 0 1 .077.976v.587a.12.12 
                                    0 0 0 .079.114l3.5 1.313a.49.49 0 0 1 .316.455v.624a.243.243 0 0 1-.274.241l-3.484-.435a.12.12 0 0 0-.138.119" />
                                    <path fill="#ae3232" d="M12 21.933A9.933 9.933 0 1 1 21.933 12A9.944 9.944 0 0 1 12 21.933m0-18.866A8.933 8.933 0 1 0 20.933 12A8.943 8.943 0 0 0 12 3.067" />
                                </svg>
                            </button>
                        </div>
                    </div>



                    <div className="switch_buttons">
                        <button className="target_button" onClick={() => toggle_waypoint_suggestion(16)} ref={change}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="75%" viewBox="0 0 24 24">
                                <path d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0" />
                            </svg>
                        </button>
                    </div>



                    <div className="chevron_button_container">
                        <button className="chevron_button" onClick={() => setTargetSetMovement(!targetSetMovement)}>
                            <svg ref={movement_button_svg} className="chevron_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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