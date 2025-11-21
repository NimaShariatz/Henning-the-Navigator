import {useEffect, useRef} from "react"

import "./navigation_set.css"

interface NavigationSetProps {
    onWaypointSelectionChange?: (selection: number) => void;// exclusively just for passing which point is selected to minimap.tsx
    points_set: {id: number, x: number, y: number, type: number}[];//passed from map.tsx
    selectedWaypoint: number;
    showPicker: boolean;
    eraseDrawing: boolean;
    textMode_active: boolean;
}



function Navigation_set({ onWaypointSelectionChange, points_set, selectedWaypoint, showPicker, eraseDrawing, textMode_active }: NavigationSetProps){
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
    







    const handleWaypointSelection = (waypointType: number) => {
        const newSelection = selectedWaypoint === waypointType ? -1 : waypointType;
        if (onWaypointSelectionChange) {
            onWaypointSelectionChange(newSelection);
        }
    };
    

    
    useEffect(() => {
        // Handle button visual selection states
        selectionMap.forEach(item => {
            if (item.ref.current) {
                if (selectedWaypoint === item.value) {
                    item.ref.current.classList.add("button_selected");
                } else {
                    item.ref.current.classList.remove("button_selected");
                }
            }
        });

        const has_one_start_point = points_set.some(point => point.type === 1);
        const has_one_target_point = points_set.some(point => point.type === 2);
        
        // Auto-select waypoints based on requirements
        if (!has_one_start_point && selectedWaypoint !== 1) {
            onWaypointSelectionChange?.(1);
        } else if (has_one_start_point && !has_one_target_point && selectedWaypoint !== 2) {
            onWaypointSelectionChange?.(2);
        } else if (has_one_start_point && has_one_target_point && (selectedWaypoint === 1 || selectedWaypoint === 2)) {
            onWaypointSelectionChange?.(-1);
        }

        // Handle button disabled states
        if (!navigation.current || !start.current || !target.current || !extraction.current) return;

        if (showPicker || eraseDrawing || textMode_active) {
            // Disable all buttons when drawing tools are active
            selectionMap.forEach(item => {
                if (item.ref.current) {
                    item.ref.current.disabled = true;
                    item.ref.current.style.cursor = "not-allowed";
                    onWaypointSelectionChange?.(-1);
                }
            });
        } else if (!has_one_start_point) {
            // Only enable start button
            selectionMap.forEach(item => {
                if (item.ref.current) {
                    if (item.value === 1) {
                        item.ref.current.disabled = false;
                        item.ref.current.style.cursor = "pointer";
                    } else {;
                        item.ref.current.disabled = true;
                        item.ref.current.style.cursor = "not-allowed";
                    }
                }
            });
        } else if (!has_one_target_point) {
            // Only enable target button
            selectionMap.forEach(item => {
                if (item.ref.current) {
                    if (item.value === 2) {
                        item.ref.current.disabled = false;
                        item.ref.current.style.cursor = "pointer";
                    } else {
                        item.ref.current.disabled = true;
                        item.ref.current.style.cursor = "not-allowed";
                    }
                }
            });
        } else {
            // Enable navigation and extraction, disable start and target
            selectionMap.forEach(item => {
                if (item.ref.current) {
                    if (item.value === 3 || item.value === 4) {
                        item.ref.current.disabled = false;
                        item.ref.current.style.cursor = "pointer";
                    } else {
                        item.ref.current.disabled = true;
                        item.ref.current.style.cursor = "not-allowed";
                    }
                }
            });
        }
    }, [selectedWaypoint, points_set, showPicker, eraseDrawing, textMode_active]);







    return(
        <>
        
            <div className="navigation_button_set"> {/* Note it is not onClick={handleButtonClick(0)} as this would immediatley execute it. rather than create an event handler. so its activating on render than on click */}

                <button className="navigation_button" onClick={() => handleWaypointSelection(4)} ref={extraction}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <defs>
                            <mask id="point-extraction">
                                <g fill="none">
                                    <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                    <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                    <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                </g>
                            </mask>
                        </defs>
                        <path className="extraction_fill" d="M0 0h24v24H0z" mask="url(#point-extraction)" />
                    </svg>
                </button>

                <button className="navigation_button"  onClick={() => handleWaypointSelection(3)} ref={navigation}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <defs>
                            <mask id="point-navigation">
                                <g fill="none">
                                    <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                    <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                    <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                </g>
                            </mask>
                        </defs>
                        <path className="navigation_fill" d="M0 0h24v24H0z" mask="url(#point-navigation)" />
                    </svg>
                </button>

                <button className="navigation_button"  onClick={() => handleWaypointSelection(2)} ref={target}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <defs>
                            <mask id="point-target">
                                <g fill="none">
                                    <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                    <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                    <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                </g>
                            </mask>
                        </defs>
                        <path className="target_fill" d="M0 0h24v24H0z" mask="url(#point-target)" />
                    </svg>
                </button>

                <button className="navigation_button"  onClick={() => handleWaypointSelection(1)} ref={start}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <defs>
                            <mask id="point-start">
                                <g fill="none">
                                    <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />
                                    <path fill="#fff" fillOpacity="0.25" d="M19 10c0 5.016-5.119 8.035-6.602 8.804a.86.86 0 0 1-.796 0C10.119 18.034 5 15.016 5 10a7 7 0 0 1 14 0" />
                                    <circle cx="12" cy="10" r="3" fillOpacity="0.85" fill="#fff" />
                                </g>
                            </mask>
                        </defs>
                        <path className="start_fill" d="M0 0h24v24H0z" mask="url(#point-start)" />
                    </svg>
                </button>

            </div>














        </>
    )
}
export default Navigation_set