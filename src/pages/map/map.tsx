import React, {useState, useEffect, useRef, useCallback} from "react"


import { Arras, Kuban, Lapino, Moscow, Normandy, Novosokolniki, Prokhorovka, Rheinland, Stalingrad, Vluki, Western_front, button_viewWidth_size } from "../../static/constants.tsx"
import "./map.css"
import Minimap from "../../components/minimap/minimap.tsx";
import Distance_calc from "../../components/distance_calc/distance_calc.tsx";
import Map_changer from "../../components/map_changer/map_changer.tsx";
import Color_select from "../../components/color_select/color_select.tsx";
import Flight_info from "../../components/flight_info/flight_info.tsx";

import { checkCollision, centerCoordinates, calculateCollisionRadius } from "../../helpers/collision_check.tsx";

/*----firebase specific setup content*/
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

/*----firebase specific setup content*/



const knownMaps = [Arras, Kuban, Lapino, Moscow, Normandy, Novosokolniki, Prokhorovka, Rheinland, Stalingrad, Vluki, Western_front];







function Map() {

    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [currentImage, setCurrentImage] = useState(Stalingrad);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [customMapName, setCustomMapName] = useState<string | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);

    const [showInfoContainer, setShowInfoContainer] = useState(false);


    const [isKilometers, setIsKilometers] = useState(true);

    //--------------------------
    const [points, setPoints] = useState<{id: number, x: number, y: number, type: number}[]>([]);
    const [selectedNavType, setSelectedNavType] = useState(-1);
    const [targetColor, setTargetColor] = useState(false);
    const [targets, settargets] = useState<{id: number, x: number, y: number, type: number, targetName: string, isBlue: boolean}[]>([]);
    const [selectedTargetType, setSelectedTargetType] = useState(-1);// gets to <minimap> then to target_set. gets set in there
    const [pointIsSelected, setPointIsSelected] = useState(false);
    const [selectedWaypointId, setSelectedWaypointId] = useState<number | null>(null);
    //--------------------------
    const [showPicker, setShowPicker] = useState(false);
    const [drawColor, setDrawColor] = useState<{r: number, g: number, b: number, a: number}>({ r: 255, g: 201, b: 14, a: 1 });
    const [drawline_thickness, setDrawline_thickness] = useState(10);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);//for throttling in setCurrentDrawing
    const [drawings, setDrawings] = useState<{
        id: string;
        points: {x: number, y: number}[];
        color: {r: number, g: number, b: number, a: number};
        thickness: number;
    }[]>([]);
    const [currentDrawing, setCurrentDrawing] = useState<{x: number, y: number}[]>([]);
    const [eraseDrawing, setEraseDrawing] = useState(false);

    const [Targetdrawings, setTargetdrawings] = useState<{
        id: string;
        points: {x: number, y: number}[];
        color: {r: number, g: number, b: number, a: number};
        thickness: number;
    }[]>([]);


    const [textMode_active, setTextMode_active] = useState(false);
    const [textCreations, setTextCreation] = useState<{
        id: number,
        x: number,
        y: number,
        text: string,
    }[]>([]);
    const [hoveredTextId, setHoveredTextId] = useState<number | null>(null);

    //--------------------------



    const [mapDistance, setMapDistance] = useState(50)
    const [linePositions, setLinePositions] = useState<{
        id: string;
        currentPoint: { id: number, x: number, y: number, type: number };
        nextPoint: { id: number, x: number, y: number, type: number };
        position: {current_point_x: number; current_point_y: number; next_point_x: number; next_point_y: number} 
    }[]>([]);


    const [flightNotes, setFlightNotes] = useState("")
    

    
    const [showUI, setShowUI] = useState(true);
    const handleShowUI = () => {
        setShowUI(!showUI);
    }




    /*----firebase specific setup content*/
    const { sessionId } = useParams();
    const isLoadingRef = useRef(true);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isUpdatingFromDBRef = useRef(false); // NEW: Track DB updates
    const indicatorRef = useRef<HTMLButtonElement>(null);



    const flashIndicatorGreen = () => {
        if (indicatorRef.current) {
            const element = indicatorRef.current;
            element.classList.remove('flash-green');
            void element.offsetWidth;
            element.classList.add('flash-green');
            
            // Remove class when animation completes
            element.addEventListener('animationend', () => {
                element.classList.remove('flash-green');
            }, { once: true }); // 'once: true' automatically removes the listener after it fires
        }
    };



    const saveNavigationData = useCallback(async () => {// uses useCallback
        if (!sessionId || isLoadingRef.current || isUpdatingFromDBRef.current) return;
        
        try {
            const sessionRef = doc(db, 'navigationInstances', sessionId);
            
            const navigationData = {
                map: currentImage,
                points,
                targets,
                drawings,
                Targetdrawings,
                flightNotes,
                textCreations
            };
                        
            await updateDoc(sessionRef, {
                navigationData,
                updatedAt: new Date()
            });

            flashIndicatorGreen();

        } catch (error) {
            console.error('Error saving navigation data:', error);
        }
    }, [sessionId, points, targets, drawings, Targetdrawings, flightNotes, textCreations, currentImage]);


    useEffect(() => {
        if (!sessionId || isLoadingRef.current || isUpdatingFromDBRef.current) return;
        
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(() => {
            saveNavigationData();
        }, 200);
        
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [sessionId, saveNavigationData]); // uses useCallback. was previously [points, targets, drawings, Targetdrawings, flightNotes, textCreations] which triggered uselessly


    useEffect(() => {
        if (!sessionId) return;
        
        const sessionRef = doc(db, 'navigationInstances', sessionId);
        
        const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
            isUpdatingFromDBRef.current = true; // SET FLAG BEFORE UPDATES
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                if (data.navigationData) {
                    const navData = data.navigationData;
                    if (navData.map && knownMaps.includes(navData.map)) setCurrentImage(navData.map);
                    if (navData.points) setPoints(navData.points);
                    if (navData.targets) settargets(navData.targets);
                    if (navData.drawings) setDrawings(navData.drawings);
                    if (navData.Targetdrawings) setTargetdrawings(navData.Targetdrawings);
                    if (navData.flightNotes !== undefined) setFlightNotes(navData.flightNotes);
                    if (navData.textCreations) setTextCreation(navData.textCreations);
                    
                    //console.log('Navigation data loaded/updated');
                }

                isLoadingRef.current = false;
            } else {
                isLoadingRef.current = false;
            }
            
            // RESET FLAG AFTER UPDATES (with small delay for state batching)
            setTimeout(() => {
                isUpdatingFromDBRef.current = false;
            }, 50);
        }, (error) => {
            console.error('Error listening to navigation data:', error);
            isLoadingRef.current = false;
            isUpdatingFromDBRef.current = false;
        });
        
        return () => unsubscribe();
    }, [sessionId]);









    /*----firebase specific setup content*/
















    
    const handle_map_click = (e: React.MouseEvent<HTMLDivElement>) => {
        //console.log("Nav!", selectedNavType , " Target! ", selectedTargetType)

        if (showPicker || eraseDrawing) {
            return;
        }


        if (!containerRef.current || (selectedNavType === -1 && selectedTargetType === -1 && textMode_active === false && pointIsSelected === false)) return;

        
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const x_raw = e.clientX - rect.left + container.scrollLeft //get cord from place clicked
        const y_raw = e.clientY - rect.top + container.scrollTop //get cord from place clicked
        //console.log(e.clientX, rect.left, container.scrollLeft)

        if(canvasRef.current){
            if( x_raw > canvasRef.current.width|| y_raw > canvasRef.current.height){
                console.log("out of map bounds")
                return
            }
        }        
            
        
        const { x: x_cord, y: y_cord } = centerCoordinates(x_raw, y_raw);
        const collision_radius = calculateCollisionRadius();


        
        //Handle comment creation
        if(textMode_active && selectedNavType === -1 && selectedTargetType === -1){
            const new_text = {
                id: textCreations.length > 0 ? Math.max(...textCreations.map(t => t.id)) + 1 : 1,
                x: x_cord,
                y: y_cord,
                text: ''
            }
            
            setTextCreation([...textCreations, new_text]);
            return;
        }



        // Handle target placement
        if(selectedTargetType > 0 && selectedNavType === -1){ 
            const new_target = {
                id: targets.length > 0 ? Math.max(...targets.map(t => t.id)) + 1 : 1,
                x: x_cord,
                y: y_cord,
                type: selectedTargetType,
                targetName: '',
                isBlue: targetColor // Store the current color state when target is created
            };

            settargets([...targets, new_target]);
            return;
        }



        //Handle navigation point placement
        if(selectedNavType > 0 && selectedNavType < 5 && selectedTargetType === -1 && pointIsSelected === false){ //---IF 1-4 and point is not selected---
            // Check for collision with existing points
            if (checkCollision(x_cord, y_cord, points, collision_radius)) {
                return;
            }

            

            const nav_exists = points.find(point => point.type === 3)
            const target_exists = points.find(point => point.type === 2)
            const start_exists = points.find(point => point.type === 1)

            if((start_exists && selectedNavType===1) || (target_exists && selectedNavType === 2)){
                return
            }


            if(selectedNavType === 1) {// if type is 1, id must be 1
                
                
                const brand_new_button = {
                    id: 1,
                    x: x_cord,
                    y: y_cord,
                    type: selectedNavType // Store the selected navigation type with the button
                
                }

                setPoints([...points, brand_new_button]);


            } else if (selectedNavType === 2) {// if type is target, check if navs exist. set it to after nav. else after start

                if(nav_exists){
                
                    const navPoints = points.filter(point => point.type === 3);
                    if (navPoints.length > 0) {
                        const highestNavId = Math.max(...navPoints.map(point => point.id));//max navpoint id
                        
                        const updated_points = increment_points_fromID_onwards(highestNavId);                    
                        const new_point = {id: highestNavId + 1, x: x_cord, y: y_cord, type: selectedNavType};
                        
                        setPoints([...updated_points, new_point]);
                        return;
                    }

                }else{

                    const updated_points = increment_points_fromID_onwards(1)// +1 to all ids > 1 to make room for id=2
                    const new_point = {id: 2, x: x_cord, y: y_cord, type: selectedNavType};
                    
                    setPoints([...updated_points, new_point]); // Set the combined array as the new state
                    
                    return;
                }

            }else if (selectedNavType === 3) {// if type is waypoint, set id to before target
                

                const navPoints = points.filter(point => point.type === 3);
                if(navPoints.length > 0){
                    const highestNavId = Math.max(...navPoints.map(point => point.id));//max navpoint id
                    const updated_points = increment_points_fromID_onwards(highestNavId);
                    const new_point = {id: highestNavId + 1, x: x_cord, y: y_cord, type: selectedNavType};
                    setPoints([...updated_points, new_point]);
                    return;
                } else{
                    //console.log(navPoints.length, target_exists)
                    if(target_exists){
                        const updated_points = increment_points_fromID_onwards(target_exists.id - 1)
                        const new_point = {id: target_exists.id, x: x_cord, y: y_cord, type: selectedNavType};
                        setPoints([...updated_points, new_point]);
                        return
                    }
                }
            


            } else if (selectedNavType === 4){//can just do points.length + 1 as there is nothing after 4, but better safe than sorry...

                const extractPoints = points.filter(point => point.type === 4);
                if (extractPoints.length > 0){
                    const highest_extract_id = Math.max(...extractPoints.map(point => point.id));//max navpoint id
                    const updated_points = increment_points_fromID_onwards(highest_extract_id);
                    const new_point = {id: highest_extract_id + 1, x: x_cord, y: y_cord, type: selectedNavType};
                    setPoints([...updated_points, new_point]);
                    return;
                }else{
                    if(target_exists){
                        const updated_points = increment_points_fromID_onwards(target_exists.id)
                        const newPoint = {id: target_exists.id + 1, x: x_cord, y: y_cord, type: selectedNavType};
                        setPoints([...updated_points, newPoint]);
                        return

                    }
                }

            }//if else
        }else if(pointIsSelected === true && selectedWaypointId !== null){
            // Check for collision with other points (excluding the one being moved)
            if (checkCollision(x_cord, y_cord, points, collision_radius, selectedWaypointId)) {
                // If collision detected, just deselect without moving
                setPointIsSelected(false);
                setSelectedWaypointId(null);
                return;
            }
            
            // Update the position of the selected waypoint
            const updatedPoints = points.map(point => 
                point.id === selectedWaypointId 
                    ? { ...point, x: x_cord, y: y_cord }
                    : point
            );
            
            setPoints(updatedPoints);
            setPointIsSelected(false);
            setSelectedWaypointId(null);
        }
    }//handle_map_click
    
    const handle_waypoint_position_change = (waypointId: number) => {
        setSelectedWaypointId(waypointId);
        setPointIsSelected(true);

    }





    const isPointNearLine = (//for erasing only. calculates if a point (eraser cursor) is close enough to a line segment to "erase" it
        point: {x: number, y: number},
        lineStart: {x: number, y: number},
        lineEnd: {x: number, y: number},
        threshold: number
    ): boolean => {
        const dx = lineEnd.x - lineStart.x;
        const dy = lineEnd.y - lineStart.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return false;
        
        const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (length * length)));
        const projectionX = lineStart.x + t * dx;
        const projectionY = lineStart.y + t * dy;
        
        const distance = Math.sqrt(Math.pow(point.x - projectionX, 2) + Math.pow(point.y - projectionY, 2));
        return distance <= threshold;
    };










    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        // Allow interaction when either showPicker is true OR eraseDrawing is true
        if ((!showPicker && !eraseDrawing) || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left + container.scrollLeft;
        const y = e.clientY - rect.top + container.scrollTop;

        setIsDrawing(true);
        
        // Only start a new drawing if not erasing
        if (!eraseDrawing) {
            setCurrentDrawing([{x, y}]);
        }
    };

    

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // Allow interaction when either showPicker is true OR eraseDrawing is true
        if (!isDrawing || (!showPicker && !eraseDrawing) || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left + container.scrollLeft;
        const y = e.clientY - rect.top + container.scrollTop;

        // If erasing, check for intersections with existing drawings
        if (eraseDrawing) {
            
            const viewportWidth = window.innerWidth * 0.01;// Throttle eraser to improve performance
            
            if (lastPointRef.current) {
                const dx = x - lastPointRef.current.x;
                const dy = y - lastPointRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only erase if mouse has moved enough
                if (distance < viewportWidth) return;
            }
            
            lastPointRef.current = {x, y};
            
            const eraserRadius = drawline_thickness;
            
            setDrawings(prevDrawings => 
                prevDrawings.filter(drawing => {
                    // Check if any segment of this drawing intersects with the eraser point
                    for (let i = 0; i < drawing.points.length - 1; i++) {
                        if (isPointNearLine(
                            {x, y},
                            drawing.points[i],
                            drawing.points[i + 1],
                            eraserRadius
                        )) {
                            return false; // Remove this drawing
                        }
                    }
                    return true; // Keep this drawing
                })
            );
            return; // Don't add points when erasing
        }

        
        const viewportWidth = window.innerWidth * 0.01;// Only update if the point has moved significantly (throttle for drawing)
        
        if (lastPointRef.current) {
            const dx = x - lastPointRef.current.x;
            const dy = y - lastPointRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < viewportWidth) return;
        }
        
        lastPointRef.current = {x, y};
        setCurrentDrawing(prev => [...prev, {x, y}]);
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        
        // Only save the drawing if not erasing and there are points(note: make '... > 0' if you want to save single click lines)
        if (!eraseDrawing && currentDrawing.length > 1) {
            const newDrawing = {
                id: `drawing-${Date.now()}`,
                points: currentDrawing,
                color: {...drawColor},
                thickness: drawline_thickness
            };

            setDrawings(prev => [...prev, newDrawing]);
        }
        
        setIsDrawing(false);
        setCurrentDrawing([]);
    };

    const handleMouseLeave = () => {
        if (isDrawing) {
            handleMouseUp();
        }
    };

    const increment_points_fromID_onwards = (id: number) => {// For shifting IDs 
        const updated_points = points.map(point => {
            if (point.id > id) { 
                return {...point, id: point.id + 1};// if greater than id
            }
            return point;//if less than id
        });
        return updated_points;
    }
    

    const handle_remove_nav_point = (id: number) => {

        const point_to_remove = points.find(button => button.id === id);
        setPointIsSelected(false)
        setSelectedWaypointId(null)
        if (point_to_remove?.type === 1){//if start, then just delete it
            setPoints(points.filter(button => button.id !== id));

        } else {// Remove the point and decrement every ID ahead by 1
        
            const updatedPoints = points.filter(button => button.id !== id)
                .map(button => {
                    
                    if (button.id > id) {
                        return { ...button, id: button.id - 1 };
                    }
                    return button;
                });
            
            setPoints(updatedPoints);
        }

    };

    const handle_remove_target = (id: number) => {
        settargets(targets.filter(target => target.id !== id));
    };

    const handle_remove_text = (id: number) => {
        setTextCreation(textCreations.filter(text => text.id !== id));
    }

    const get_target_svg = (type: number, isBlue: boolean) => {
        const fillColor = isBlue ? 'var(--blue_target)' : 'var(--red_target)';
        
        switch(type) {
            case 1: // radar
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill={fillColor} d="M5.269 4.026c.557-.628 1.463-.628 2.044-.148l.105.095l4.848 4.847l.087-.087a1 1 0 0 1 
                            1.497 1.32l-.083.094l-.087.087l4.347 4.348c.572.572.614 1.557-.053 2.15a8.97 8.97 0 0 1-4.466 2.142l-.341.051l.98 1.318a1.1 1.1 0 0 
                            1-.766 1.751l-.116.006h-6.58a1.1 1.1 0 0 1-1.058-1.403l.04-.115l1.254-3.051A8.99 8.99 0 0 1 3 10a8.97 8.97 0 0 1 2.269-5.974m3.426 14.348L8.028 20h3.446l-.819-1.1a9 9 0 0 1-1.582-.387l-.378-.14ZM6.407 5.79a7 
                            7 0 0 0 9.803 9.803l-3.944-3.944l-1.559 1.558a1 1 0 0 1-1.414-1.414l1.558-1.559zm7.7-.737a3.5 3.5 0 0 1 2.859 2.96a1 1 0 0 1-1.958.393l-.023-.115a1.5 1.5 
                            0 0 0-1.07-1.233l-.155-.035a1 1 0 0 1 .348-1.97ZM14 2a6 6 0 0 1 6 6a1 1 0 0 1-1.993.117L18 8a4 4 0 0 0-4-4a1 1 0 1 1 0-2" />
                        </g>
                    </svg>
                );
            case 2:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="75%" height="75%" viewBox="0 0 24 24">
                        <path fill={fillColor} d="M12 12V9.95l-5 2V10l-3 1.32V20h16v-8zm-3 6H7v-4h2zm4 0h-2v-4h2zm4 0h-2v-4h2z" opacity="0.3" />
                        <path fill={fillColor} d="M22 22H2V10l7-3v2l5-2v3h3l1-8h3l1 8zM12 9.95l-5 2V10l-3 1.32V20h16v-8h-8zM11 18h2v-4h-2zm-4 0h2v-4H7zm10-4h-2v4h2z" />
                    </svg>
                );
            case 3:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="75%" height="75%" viewBox="0 0 24 24">
                        <path fill={fillColor} d="M19 15h-2v-2h2m0 6h-2v-2h2M13 7h-2V5h2m0 6h-2V9h2m0 6h-2v-2h2m0 6h-2v-2h2m-6-6H5V9h2m0 6H5v-2h2m0 6H5v-2h2m8-6V5l-3-3l-3 3v2H3v14h18V11z" />
                    </svg>
                );
            case 4:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="75%" height="75%" viewBox="0 0 512 512">
                        <path fill={fillColor} d="M18 112v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39zM18 169v30h476v-30zm0 48v78h38v-78zm102 0v78h48v-78zm112 0v78h48v-78zm112 0v78h48v-78zm112 0v78h38v-78zM18 313v30h476v-30zm0 48v39h38v-39zm102 0v39h48v-39zm112 0v39h48v-39zm112 0v39h48v-39zm112 0v39h38v-39z" />
                    </svg>

                );
            case 5:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="90%" height="90%" viewBox="0 0 30 30">
                        <path fill={fillColor} d="M4.25 12.68v-.32c0-.1.03-.18.1-.25s.15-.1.25-.1h7.58c.1 0 .18.03.25.1s.1.15.1.25v.32c0 .1-.03.18-.1.25s-.15.1-.25.1h-.44v1.65h2.12c.02-.28.14-.52.35-.71s.46-.29.75-.29s.53.1.74.29s.32.43.35.71h1.32v-3.39a.52.52 0 0 1-.35-.16c-.1-.1-.15-.23-.15-.37v-.31c0-.14.05-.27.16-.38s.24-.16.39-.16h1.99c.15 0 .28.05.38.16s.15.23.15.38v.31c0 .14-.05.27-.14.37s-.2.16-.34.16v3.39h1.56c.27 0 .51.1.71.3s.3.44.3.71v2.93l3.73 4.87h-4.74v-3.04h-.71c.11.26.16.54.16.83c0 .61-.21 1.12-.64 1.56c-.43.43-.95.65-1.55.65c-.61 0-1.12-.22-1.56-.65a2.13 2.13 0 0 1-.65-1.56c0-.29.05-.57.16-.83h-1c.11.27.17.55.17.83c0 .61-.22 1.12-.65 1.56s-.95.65-1.56.65s-1.12-.22-1.55-.65s-.64-.95-.64-1.56c0-.29.05-.57.16-.83H9.97c.12.29.18.57.18.83c0 .61-.22 1.12-.65 1.56s-.95.65-1.56.65s-1.12-.22-1.56-.65s-.65-.95-.65-1.56c0-.29.06-.57.17-.84c-.24-.04-.45-.15-.61-.34s-.24-.41-.24-.66v-.86h-.02v-5.55H4.6c-.1 0-.18-.03-.25-.1a.33.33 0 0 1-.1-.25m2.05 3.94c0 .21.07.39.22.54s.33.22.54.22H8.5c.21 0 .39-.07.53-.22s.22-.33.22-.54v-2.3a.7.7 0 0 0-.22-.53a.7.7 0 0 0-.53-.22H7.07c-.21 0-.39.07-.54.23c-.15.15-.22.32-.22.52v2.3zm9.48-11.19c0 .41.16.76.47 1.04c0 .2.09.43.26.68s.36.4.56.44c.04.22.15.41.31.57c.16.15.36.25.59.3c-.11.11-.16.24-.16.39q0 .27.18.45t.45.18c.18 0 .33-.06.46-.19c.13-.12.19-.28.19-.45c0-.02 0-.05-.01-.09s-.01-.08-.01-.1h.03c.21 0 .39-.08.54-.23s.23-.34.23-.55c0-.1-.04-.22-.12-.38c.17-.09.31-.25.41-.47h.45c.39-.02.73-.17 1-.45c.28-.28.42-.61.42-1.01q0-.51-.33-.9c-.22-.26-.5-.43-.83-.52c-.08-.4-.29-.73-.62-.99s-.71-.39-1.12-.39s-.77.13-1.08.38s-.52.58-.62.97h-.11q-.615 0-1.08.39c-.31.25-.46.57-.46.93" />
                    </svg>
                    
                );
            case 6:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="75%" height="75%" viewBox="0 0 512 512">
                        <path fill={fillColor} d="M288 133v18h160v-18zm41 34v16h78v-16zM64 201c-5.75 0-10.406 1.939-15.074 6.023c-4.668 
                        4.085-9.078 10.48-12.701 18.631C28.978 241.96 25 265 25 288s3.978 46.041 11.225 62.346c3.623 8.152 8.033 14.546 12.7 
                        18.63C53.595 373.062 58.25 375 64 375h5.055l2-17.994l.89-8.006h80.11l2.888 26H183V201zm137 0v46h46v-46zm64 0v174h28.055l2-17.994l.89-8.006h80.11l2.888 
                        26H448c5.75 0 10.406-1.94 15.074-6.023c4.668-4.085 9.08-10.48 12.703-18.631c7.247-16.304 11.225-39.343 
                        11.225-62.342c0-23-3.976-46.04-11.223-62.344c-3.623-8.152-8.034-14.55-12.703-18.635c-4.668-4.084-9.326-6.024-15.076-6.025zm-64 64v46h46v-46zm0 64v46h46v-46zM88.057 367l-14 126h75.886l-13.998-126zm224 0l-14 126h75.886l-13.998-126zM183 384v110h18v-37h46v37h18V384h-18v55h-46v-55zm226 
                        9v30h30v-30zm6.803 48c5.844 19.928 16.417 32.884 28.318 40.563C462.214 493.235 482 493 490 493v-18c-8 0-23.214-.235-36.121-8.563c-7.548-4.87-14.772-12.42-19.473-25.437z" />
                    </svg>
                    
                );
            case 7:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="85%" height="85%" viewBox="0 0 32 32">
                        <path fill={fillColor} d="M30 13v-2H18.618l-.723-1.447A1 1 0 0 0 17 9H9a1 1 0 0 0-1 1v5H4v2h18.638l3.6 3H3a1 1 0 0 0-1 1v2a5.006 5.006 0 0 0 5 5h18a5.006 5.006 0 0 0 5-5v-2a1 1 0 0 0-.36-.769l-6-5A1 1 0 0 0 23 15h-2.382l-1-2Zm-2 10a3.003 3.003 0 0 1-3 3H7a3.003 3.003 0 0 1-3-3v-1h24Zm-18-8v-4h6.382l2 4Z" />
                    </svg>
                    
                );
            case 8:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="75%" height="75%" viewBox="0 0 24 24">
                        <path fill={fillColor} d="M9 4h5.446a1 1 0 0 1 .848.47L18.75 10h4.408a.5.5 0 0 1 .439.74L19.637 18H19a6 6 0 0 1-1.535-.198L20.63 12H3.4l1.048 5.824A6 6 0 0 1 3 18h-.545l-1.24-6.821A1 1 0 0 1 2.197 10H3V5a1 1 0 0 1 1-1h1V1h4zm-4 6h11.392l-2.5-4H5zM3 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 11 20a5.98 5.98 0 0 0 4-1.528A5.98 5.98 0 0 0 19 20h2v2h-2a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 11 22a7.96 7.96 0 0 1-4-1.07A7.96 7.96 0 0 1 3 22H1v-2z" />
                    </svg>
                    
                );

            case 9:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="87%" height="87%" viewBox="0 0 512 512">
                        <path fill={fillColor} d="M18 151v18h37v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h46v30h18v-30h37v-18zm0 66v30h23v179.1c7.95-1.8 15.9-3.1 23-3.1c13.18 0 24.7 4.6 35.2 8.6c1.3.5 2.5 1 3.8 1.4V284.3l37.2-37.3h231.5l37.3 36.7V433c1.3-.4 2.5-.9 3.8-1.4c10.5-4 22-8.6 35.2-8.6c7.1 0 15.1 1.3 23 3.1V247h23v-30zm46 226c-16.54.8-31.84 5.3-46 9.4v18.8c2.59-.8 5.39-1.7 8.35-2.6C39.27 464.7 55.18 461 64 461s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s18.3 3.4 28.8 7.4s22 8.6 35.2 8.6s24.7-4.6 35.2-8.6s20-7.4 28.8-7.4s24.7 3.7 37.6 7.6c3 .9 5.8 1.8 8.4 2.6v-18.8c-14.8-4-32-9.2-46-9.4c-13.2 0-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4s-22-8.6-35.2-8.6s-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4s-22-8.6-35.2-8.6s-24.7 4.6-35.2 8.6s-20 7.4-28.8 7.4s-18.3-3.4-28.8-7.4S77.18 443 64 443" />
                    </svg>
                )
            case 10:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="87%" height="87%" viewBox="0 0 512 512">
                        <path fill={fillColor} fillRule="evenodd" d="M138.667 341.333c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m256 0c17.673 0 32 14.327 32 32s-14.327 32-32 32s-32-14.327-32-32s14.327-32 32-32m-96-192v149.333H320v-128h106.667L469.334 256v106.666h-22.4C441.991 338.322 420.468 320 394.666 320s-47.325 18.322-52.266 42.666H190.933C185.992 338.322 164.47 320 138.667 320s-47.325 18.322-52.266 42.666H42.667V149.333zM256 192H85.334v106.666H256zm144.3 21.333h-37.632v42.666h58.965z" />
                    </svg>
                    
                );
            case 11:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="85%" height="85%" viewBox="0 0 24 24">
                        <path fill={fillColor} d="M6 6.39v4.7c0 4 2.55 7.7 6 8.83c3.45-1.13 6-4.82 6-8.83v-4.7l-6-2.25z" opacity="0.3" />
                        <path fill={fillColor} d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5zm6 9.09c0 4-2.55 7.7-6 8.83c-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25l6 2.25z" />
                    </svg> 
                    
                );
            case 12:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="80%" height="80%" viewBox="0 0 512 512">
                        <path fill={fillColor} d="m372.386 52.97l-14.822 13.064l103.244 117.142l14.822-13.064zm-30.23 26.646l-36.649 32.303l15.549 17.64zm16.865 16.346l-20.442 48.382l-1.457 3.448l19.012 21.57l21.897-51.832zm-67.537 28.318L119.939 275.485l.054.062l-1.294 1.141c-19.625 17.298-36.277 35.67-49.407 53.91l92.854 105.356c19.745-10.734 40.062-24.948 59.687-42.246l1.295-1.143l.055.063l6.23-5.493l165.313-145.713zm102.615 11.482l-20.443 48.385l-1.456 3.445l20.838 23.641l21.897-51.83zm36.904 41.873l-20.441 48.385l-.973 2.303l37.194-32.783zM58.583 346.723c-4.228 6.959-7.93 13.848-11.015 20.592c-6.73 
                        14.712-10.7 28.778-11.157 41.78c-.457 13.001 2.827 25.259 10.93 34.452c8.103 9.194 19.85 13.989 32.805 15.168c12.955 1.18 27.408-.992 42.847-5.822c7.078-2.214 14.377-5.02 21.811-8.342z" />
                    </svg>
                    
                );
            case 13:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="88%" height="88%" viewBox="0 0 24 24">
                        <path fill={fillColor} d="M13.105 12.609v2.279a.12.12 0 0 0 .061.105l.622.355a.49.49 0 0 1 .242.365l.049.413a.243.243 0 0 1-.307.263l-1.641-.459a.5.5 0 0 0-.262 0l-1.641.459a.244.244 0 0 1-.308-.263l.05-.413a.49.49 0 0 1 .242-.365l.621-.355a.12.12 0 0 0 .062-.105v-2.279a.122.122 0 0 0-.137-.121l-3.485.435A.242.242 0 0 1 7 12.682v-.624a.49.49 0 0 1 .316-.455l3.5-1.313a.12.12 0 0 0 .079-.114v-.741a4.8 4.8 0 0 1 .1-.981a1.015 1.015 0 0 1 1.2-.833a1.06 1.06 0 0 1 .819.9l.015.094a6 6 0 0 1 .077.976v.587a.12.12 
                        0 0 0 .079.114l3.5 1.313a.49.49 0 0 1 .316.455v.624a.243.243 0 0 1-.274.241l-3.484-.435a.12.12 0 0 0-.138.119" />
                        <path fill={fillColor} d="M12 21.933A9.933 9.933 0 1 1 21.933 12A9.944 9.944 0 0 1 12 21.933m0-18.866A8.933 8.933 0 1 0 20.933 12A8.943 8.943 0 0 0 12 3.067" />
                    </svg>
                    
                );
            case 14:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="73%" height="73%" viewBox="0 0 512 512">
                        <path fill={fillColor} d="m472.7 22.8l-38.5 44.91L448 84.24l48-34.65zm-50.4 55.05L312.2 178.7l-25.3 8.1l-66.3 69.6l22.8 24.7l69.3-65.4l12.9-21.5L435.7 93.27zm-8.7 72.65l-19.9 25.6l10.3 13.4l26.6-19.6zm-32.4 37.1l-68.5 62.3l-16 3.6l-42.1 39.2l20.7 22.3l43.6-39.5l6.4-13.8l65.2-62.4zm-245.8 67.3c-26.6.3-52.06 25.8-52.33 52.4c-.33 17.8 9.08 34.4 24.53 43.3l23.6-7.6c-18-2.1-31.59-17.5-31.39-35.7c0-19.7 15.89-35.7 35.59-35.7c10-.2 19.5 3.8 26.4 11v-17c-8-4.7-17.1-11-26.4-10.7m44.5 8.2v78.5L120.5 365v23.5h145v-55.2l-65.4-70.2zM87.51 407.2l-43.29 43h13.47l11.54 8l35.57-27.3h107.6l11.5 19.3H245l6.1-19.3h23.4l97.3 28.2l9.6-8.9h16l-106.5-43zm-50.68 59.9l-20.85 22.1h62.55l-20.84-22.1zm187.07 0L203 489.2h62.9L245 467.1zm160.7 0l-19.3 22.1h61L407 467.1z" />
                    </svg>
                    
                );
            case 15:
                return(
                    <svg xmlns="http://www.w3.org/2000/svg" className="map_target_svg" width="90%" height="90%" viewBox="0 0 32 32">
                        <path fill={fillColor} d="M29.391 14.527L17.473 2.609C17.067 2.203 16.533 2 16 2s-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 24a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m1.125-6.752v1.877h-2.25V15H17c1.034 0 1.875-.841 1.875-1.875S18.034 11.25 17 11.25h-2a1.877 1.877 0 0 0-1.875 1.875v.5h-2.25v-.5A4.13 4.13 0 0 1 15 9h2a4.13 4.13 0 0 1 4.125 4.125a4.13 4.13 0 0 1-4 4.123" />
                        <path fill="none" d="M16 21a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 16 21m1.125-3.752a4.13 4.13 0 0 0 4-4.123A4.13 4.13 0 0 0 17 9h-2a4.13 4.13 0 0 0-4.125 4.125v.5h2.25v-.5c0-1.034.841-1.875 1.875-1.875h2c1.034 0 1.875.841 1.875 1.875S18.034 15 17 15h-2.125v4.125h2.25z" />
                    </svg>
                    
                );
          
        }
    };


    const handleWaypointSelectionChange = (selection: number) => {
        setSelectedNavType(selection);
        setSelectedTargetType(-1)
        //console.log("Waypoint selection received in Map:", selection);
    };

    const handle_target_color_change = (isBlue: boolean) => {
        setTargetColor(isBlue);
    };
    const handleTargetSelectionChange = (selection: number) => {
        setSelectedTargetType(selection);
        setSelectedNavType(-1)
        //console.log("Target selection received in Map:", selection);
    };

    useEffect(() => {
        if(showPicker || eraseDrawing || textMode_active){
            setSelectedNavType(-1);
            setSelectedTargetType(-1);
        }
    }, [showPicker, eraseDrawing, textMode_active]);

    

    const get_point_class = (type: number) => {
        switch(type) {
            case 1: return "start_fill";
            case 2: return "target_fill";
            case 3: return "navigation_fill";
            case 4: return "extraction_fill";
            default: return "navigation_fill";
        }
    };
    const get_point_id_color_class= (type: number) => {
        switch(type) {
            case 1: return "start_color";
            case 2: return "target_color";
            case 3: return "navigation_color";
            case 4: return "extraction_color";
            default: return "navigation_color";
        }
    };




    const clear_all_points = () => {
        setPoints([]);
        settargets([]);
        setDrawings([]);
        setTextCreation([]);
    };

    
    //----------------------



    const handle_image_upload = (file: File) => {// Handle image upload from Misc_set
        const imageUrl = URL.createObjectURL(file);
        // Extract the filename without extension
        const fileName = file.name.split('.')[0];
        setCustomMapName(fileName);
        setCurrentImage(imageUrl);
    };


    const drawImage = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        
        if (canvas && img) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                
                //perphaps here we can add default markers and stuff...
            }
        }
    };


    //canvas setup
    useEffect(() => {
        const img = new Image();
        img.src = currentImage;
        
        img.onload = () => {
            setImageDimensions({
                width: img.width,
                height: img.height
            });
            
            imageRef.current = img;
            
            drawImage();
        };
    }, [currentImage]); // Now this effect runs whenever currentImage changes
    
    
    
    useEffect(() => {
        drawImage();

        
        const canvas = canvasRef.current;
        if (canvas) {//sets the canvas dimensions to be the image dimensions

            canvas.style.minWidth = `${imageDimensions.width}px`;
            canvas.style.minHeight = `${imageDimensions.height}px`;
        
        }    
        
    }, [imageDimensions]);
    //-------------------


    //minimap click content. Will first call function Minimap in minimap.tsx
    const handle_minimap_click = (relativeX: number, relativeY: number) => {
        
        if (!containerRef.current) return;
        

        const target_x = imageDimensions.width * relativeX;// size of our image * percentage calculated from minimap.tsx 
        const target_y = imageDimensions.height * relativeY;// size of our image * percentage calculated from minimap.tsx - fixed bug
        
        //we got the place to scroll to by now. the following code sorts out scrolling to the center
        const container = containerRef.current;
        const viewport_width = container.clientWidth;// gives the width and height, which does not include overflow distance
        const viewport_height = container.clientHeight;// gives the width and height, which does not include overflow distance


        const scrollLeft = Math.max(0, target_x - viewport_width / 2);
        const scrollTop = Math.max(0, target_y - viewport_height / 2);


        //console.log(viewport_width, viewport_height)

        containerRef.current.scrollTo({
            left: scrollLeft,
            top: scrollTop
        });



    };
    //minimap click content




    //line creation
    const get_line_color = (from: number) => {
        if (from === 1) {
            return "var(--waypoint_start_id_color)"

        }else if ( from === 2 ){
            return "var(--waypoint_target_id_color)"
        }else if ( from === 3 ){
            return "var(--waypoint_navigation_id_color)"
        }else if ( from === 4 ){
            return "var(--waypoint_extraction_id_color)"
        }//elseIf
    }

    const line_positioning = (current_point:{id: number, x: number, y: number, type: number}, next_point: {id: number, x: number, y: number, type: number}) => {
        // Get current window dimensions to account for zoom
        const viewportWidth = window.innerWidth;
        
        // Calculate button size dynamically based on current viewport width
        const button_size = viewportWidth * button_viewWidth_size;
        const center_offset = button_size / 2;

        return {
            current_point_x: current_point.x + center_offset,
            current_point_y: current_point.y + center_offset,
            next_point_x: next_point.x + center_offset,
            next_point_y: next_point.y + center_offset
        }
    }


    useEffect(() => {
        // First effect: Handle resize events for proper line connections
        const handleResize = () => {
            setPoints([...points]); // Force a re-render when window is resized
        };

        window.addEventListener('resize', handleResize);
        
        // Second effect: Calculate and store line positions
        const sortedPoints = [...points].sort((a, b) => a.id - b.id);
        const newLinePositions = [];
        
        for (let i = 0; i < sortedPoints.length - 1; i++) {
            const currentPoint = sortedPoints[i];
            const nextPoint = sortedPoints[i + 1];
            const line_position = line_positioning(currentPoint, nextPoint);
            
            newLinePositions.push({//FOR CALCULATIONS
                id: `${currentPoint.id} - to - ${nextPoint.id}`,
                currentPoint,
                nextPoint,
                position: line_position
            });
        }
        
        setLinePositions(newLinePositions);
        

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [points]); // Only run when points change

    //line creation

    const toggleInfoContainer = () => {
        setShowInfoContainer(!showInfoContainer);
    };





    const toggleUnitType = () => {
        setIsKilometers(!isKilometers);
    };








    //distance calculations
    const handleDistanceChange = (distance: number) => {
        setMapDistance(distance);
        //console.log("Distance in Map:", distance);
    };





    const getWaypointInfo = (button: {id: number, x: number, y: number, type: number}) => {
        // Find the line that starts from this waypoint
        const lineFromPoint = linePositions.find(line => line.currentPoint.id === button.id);//see if we can find the point ahead of current
        
        if (!lineFromPoint) {//if does NOT exist, just quit
            return { distance: '-', heading: '-' };
        }
        
        const dx = lineFromPoint.position.next_point_x - lineFromPoint.position.current_point_x;
        const dy = lineFromPoint.position.next_point_y - lineFromPoint.position.current_point_y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        const pixelLength = length;
        let distance = (pixelLength / mapDistance) * 10;
        
        if (!isKilometers) {
            distance = distance * 0.621371;
        }
        
        const actualDistance = Math.round(distance * 10) / 10;
        
        // Calculate heading
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = angle + 90;
        angle = (angle + 360) % 360;
        const heading = Math.round(angle);
        
        return { distance: actualDistance, heading };
    };
    const getWaypointInfo_style = ( x: number, y: number ) => {

        if(containerRef.current && canvasRef.current){
            const X_percentage_realm = Math.round((x / canvasRef.current.width) * 100)
            const Y_percentage_realm = Math.round((y / canvasRef.current.height) * 100)

            if(X_percentage_realm < 2){
                return "tooltip_waypoint_text_right"
            }else if(X_percentage_realm > 98){
                return "tooltip_waypoint_text_left"
            }else if(Y_percentage_realm < 2){
                return "tooltip_waypoint_text_bottom"
            }
        }
        return "tooltip_waypoint_text_top"//default as top
    }








    const handle_data_import = (data: {
        map: string,
        points: {id: number, x: number, y: number, type: number}[], 
        targets: {id: number, x: number, y: number, type: number, targetName: string; isBlue: boolean}[],
        drawings?: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}, thickness: number}[],
        Targetdrawings?: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}, thickness: number}[],
        flightNotes?: string
        textCreations?: {id: number, x: number, y: number, text: string}[];
    }) => {
        if (knownMaps.includes(data.map)) { //if its not one of the ones in henning, then do nothing for map
            setCurrentImage(data.map);
        }
        setPoints(data.points || []);
        settargets(data.targets || []);
        setDrawings(data.drawings || []);
        setTargetdrawings(data.Targetdrawings || []);
        setFlightNotes(data.flightNotes || "");
        setTextCreation(data.textCreations || []);
    };





    const handleInput_flightNotes_Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setFlightNotes(newValue)
        //console.log(newValue)
    }
    const handle_target_name_change = (targetId: number, newName: string) => {
        settargets(targets.map(target => 
            target.id === targetId 
                ? { ...target, targetName: newName }
                : target
        ));
    };
    const handle_text_textField_change = (textID: number, newText: string) => {
        setTextCreation(textCreations.map(text => 
            text.id === textID 
                ? { ...text, text: newText }
                : text
        ));
    };












    return (
        <>
           <div 
                className="map_container" 
                ref={containerRef} 
                onClick={handle_map_click}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: (showPicker || eraseDrawing || textMode_active) ? 'crosshair' : 'default' }}
            >             
                <canvas
                    ref={canvasRef}
                    className="map_background"
                    width={imageDimensions.width}
                    height={imageDimensions.height}
                />

                {/* SVG overlay for lines */}
                <svg 
                    className="waypoint_lines_overlay"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: imageDimensions.width,
                        height: imageDimensions.height,
                    }}
                >
                    {linePositions.map(line => (
                        <line 
                            className="waypoint_lines"
                            key={line.id}
                            x1={line.position.current_point_x} 
                            y1={line.position.current_point_y}
                            x2={line.position.next_point_x}
                            y2={line.position.next_point_y}
                            stroke={get_line_color(line.nextPoint.type)}
                        />
                    ))}


                    {drawings.map(drawing => (                        
                        (
                            // Render multiple points as polyline
                            <polyline
                                key={drawing.id}
                                points={drawing.points.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={`rgba(${drawing.color.r}, ${drawing.color.g}, ${drawing.color.b}, ${drawing.color.a})`}
                                strokeWidth={drawing.thickness}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )
                    ))}


                    {/* Render current drawing */}
                    {isDrawing && currentDrawing.length > 0 && (
                        <polyline
                            points={currentDrawing.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={`rgba(${drawColor.r}, ${drawColor.g}, ${drawColor.b}, ${drawColor.a})`}
                            strokeWidth={drawline_thickness}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}


                </svg>
                {/* SVG overlay for lines */}




                {points.map(button => (
                    <div key={button.id} className="map_waypoint_div" style={{left: `${button.x}px`, top: `${button.y}px`}}>
                        <button className="map_waypoint_button tooltip_waypoint_needed" onClick={() => handle_waypoint_position_change(button.id)} style={{opacity: selectedWaypointId=== button.id ? "1" : "0.7", outline: selectedWaypointId=== button.id ? "0.2vw solid var(--logo_yellow)" : "none"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="85%" height="85%" viewBox="0 0 24 24">
                                <defs>
                                    <mask id="point">
                                        <g fill="none">
                                            <path stroke="#ffffff" strokeLinecap="round" strokeOpacity="1" d="M19.361 18c.746.456 1.139.973 1.139 1.5s-.393 1.044-1.139 1.5s-1.819.835-3.111 1.098s-2.758.402-4.25.402s-2.958-.139-4.25-.402S5.385 21.456 4.639 21S3.5 20.027 3.5 19.5s.393-1.044 1.139-1.5" />


                                        </g>
                                    </mask>
                                </defs>
                                <path className={get_point_class(button.type)} d="M0 0h24v24H0z" mask="url(#point)" />
                            </svg>
                            <p className={`waypoint_id ${get_point_id_color_class(button.type)}`}>{button.id}</p>

                            <span className={`tooltip_waypoint_text ${getWaypointInfo_style(button.x, button.y)}`}>Distance: {getWaypointInfo(button).distance} {isKilometers ? 'km' : 'mi'} <br/> Heading: {getWaypointInfo(button).heading}°</span>

                        </button>
                        <button 
                            className="remove_button" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering map click by accident when clicking the remove!!!
                                handle_remove_nav_point(button.id)}}
                        >
                            ×
                        </button>

                    </div>
                ))}{/* waypoints */}



                {targets.map(target => (
                    <div key={`target-${target.id}`} className="map_target_div" style={{left: `${target.x}px`, top: `${target.y}px`}}>
                        <div>
                            <button className={`map_target_button ${target.isBlue ? 'target_map_blue_colorSetter' : 'target_map_red_colorSetter'}`}>
                                {get_target_svg(target.type, target.isBlue)}
                            </button>
                            <button 
                                className="remove_button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handle_remove_target(target.id);
                                }}
                            >
                                ×
                            </button>
                            <input type="text" className="target_textfield"  placeholder="" value={target.targetName} style={{opacity: (target.targetName=='') ? "0.3" : "1"}}
                                onChange={(e) => {
                                    
                                    handle_target_name_change(target.id, e.target.value);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}>

                            </input>
                        </div>
                    </div>
                ))}{/* targets */}




                {textCreations.map(text => (
                    <div key={`text-${text.id}`} className="map_text_div" style={{left: `${text.x}px`, top: `${text.y}px`, zIndex: (hoveredTextId === text.id) ? 'var(--map_text_onhover)' : 'var(--map_text_z)'}}>
                        <div>

                            {hoveredTextId !== text.id && (
                                <>
                                    <button className="map_text_button" onMouseEnter={() => setHoveredTextId(text.id)} onMouseLeave={() => setHoveredTextId(null)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"} viewBox="0 0 24 24">
                                            <g fill="var(--background_1)">
                                                <path fill="var(--logo_yellow)" fillOpacity="0.16" d="M19 16h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                                                <path stroke="var(--logo_yellow)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8 8h8m-8 3h8m3 5h-2.525a.99.99 0 0 0-.775.375l-2.925 3.65a1 1 0 0 1-1.562 0l-2.925-3.65A.99.99 0 0 0 7.512 16H5c-1.662 0-3-1.338-3-3V6c0-1.662 1.338-3 3-3h14c1.663 0 3 1.338 3 3v7c0 1.662-1.337 3-3 3" />
                                            </g>
                                        </svg>
                                    </button>

                                    <button 
                                        className="remove_button" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handle_remove_text(text.id);
                                        }}
                                    >
                                        ×
                                    </button>
                                </>
                            )}{/* so if not hovered on, show the button. else dont. */}


                            {hoveredTextId === text.id && (

                                    <textarea className="map_text_inputField" value={text.text} placeholder="comment..."
                                    onClick={(e) => {e.stopPropagation();}}
                                    onMouseEnter={() => setHoveredTextId(text.id)}//set it to the id we hoverin
                                    onMouseLeave={() => setHoveredTextId(null)} 
                                        onChange={(e) => {
                                            handle_text_textField_change(text.id, e.target.value);
                                        }}
                                    ></textarea>
           
                                
                            )}{/* if it matches id were hoverin, show it */}

                        </div>

                    </div>

                ))}{/* texts */}


            </div>



            
            <Flight_info
                showInfoContainer={showInfoContainer}
                showUI={showUI}
                flightNotes={flightNotes}
                handleInput_flightNotes_Change={handleInput_flightNotes_Change}
                drawColor={drawColor}
                eraseDrawing={eraseDrawing}
                Targetdrawings={Targetdrawings}
                drawline_thickness={drawline_thickness}
                setTargetdrawings={setTargetdrawings}
                linePositions={linePositions}
                mapDistance={mapDistance}

                isKilometers={isKilometers}
                toggleUnitType={toggleUnitType}
                get_point_class={get_point_class}
                get_point_id_color_class={get_point_id_color_class}
                get_line_color={get_line_color}
                containerRef={containerRef}
            />



            <button className="UI_dissappear_button" style={{filter: showUI ? 'grayscale(100%)' : "none"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" onClick={() => handleShowUI()}>
                    <g fill="none" stroke="var(--logo_yellow)" strokeWidth="1.2">
                        <path fill="var(--logo_yellow)" fillOpacity="0.25" d="M6.887 5.172c.578-.578.867-.868 1.235-1.02S8.898 4 9.716 4h4.61c.826 0 1.239 0 1.61.155c.37.155.66.45 1.239 1.037l1.674 1.699c.568.576.852.865 1.002 1.23c.149.364.149.768.149 1.578v4.644c0 .818 0 1.226-.152 1.594s-.441.656-1.02 1.235l-1.656 1.656c-.579.579-.867.867-1.235 1.02c-.368.152-.776.152-1.594.152H9.7c-.81 0-1.214 0-1.579-.15c-.364-.149-.653-.433-1.229-1.001l-1.699-1.674c-.588-.58-.882-.87-1.037-1.24S4 15.152 4 14.326v-4.61c0-.818 0-1.226.152-1.594s.442-.657 1.02-1.235z" />
                        <path strokeLinecap="round" d="m8 11l.422.211a8 8 0 0 0 7.156 0L16 11m-4 1.5V14m-3-2l-.5 1m6.5-1l.5 1" />
                    </g>
                </svg>
            </button>

            <button ref={indicatorRef} className="data_updateLoad_indicator" style={{display: sessionId ? 'block' : 'none'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                    <path fill="currentcolor" d="M12 4a5.51 5.51 0 0 0-5.5 5.5c0 2.47 1.49 3.89 2.35 4.5h6.3c.86-.61 2.35-2.03 2.35-4.5C17.5 6.47 15.03 4 12 4" opacity="0.45" />
                    <path fill="currentcolor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2m-4-5h8v2H8zm4-15C7.86 2 4.5 5.36 4.5 9.5c0 3.82 2.66 5.86 3.77 6.5h7.46c1.11-.64 3.77-2.68 3.77-6.5C19.5 5.36 16.14 2 12 2m3.15 12h-6.3c-.86-.61-2.35-2.03-2.35-4.5C6.5 6.47 8.97 4 12 4s5.5 2.47 5.5 5.5c0 2.47-1.49 3.89-2.35 4.5" />
                </svg>
            </button>

            
            
            <Minimap
                imageDimensions={imageDimensions}
                showUI={showUI}
                on_minimap_click={handle_minimap_click} 
                currentImage={currentImage}
                on_image_upload={handle_image_upload}
                selectedWaypoint={selectedNavType}
                selectedTarget={selectedTargetType}
                on_waypoint_selection_change={handleWaypointSelectionChange}
                on_target_selection_change={handleTargetSelectionChange}
                pointIsSelected = {pointIsSelected}
                showpicker = {showPicker}
                eraseDrawing = {eraseDrawing}
                textMode_active = {textMode_active}

                on_target_color_change={handle_target_color_change}
                on_clear_points={clear_all_points}
                toggle_info_container={toggleInfoContainer}
                points_set={points}
                targets_set={targets}
                drawings_set={drawings}
                Targetdrawings_set={Targetdrawings}
                flightNotes={flightNotes}
                textCreations={textCreations}
                on_data_import={handle_data_import}


            />
        

            <Distance_calc showUI={showUI} onDistanceChange={handleDistanceChange} currentMapUrl={currentImage}/>{/* pass */}

            <Color_select 
                showUI={showUI}
                onColorChange={setDrawColor} 
                onThicknessChange={setDrawline_thickness}
                showPicker={showPicker} 
                setShowPicker={setShowPicker}
                eraseDrawing={eraseDrawing}
                setEraseDrawing={setEraseDrawing}

                textMode_active={textMode_active}
                setTextMode_active={setTextMode_active}

            />

            <Map_changer 
                showUI={showUI}
                currentImage={currentImage}
                customMapName={customMapName}
                onChangeMap={(newMapUrl) => {
                    setCurrentImage(newMapUrl);
                    setCustomMapName(undefined); // Reset custom name when switching to a predefined map
                    //clear_all_points(); // Clear points when changing map
                }}
            />

        </>
    )
}

export default Map