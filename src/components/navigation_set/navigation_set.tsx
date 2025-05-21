import {useState, useEffect, useRef} from "react"

import "./navigation_set.css"

function Navigation_set(){
    
    
    
    const [currentSelection, setCurrentSelection] = useState({selection: 0});

    const handleButtonClick = (selectionIndex: number) => {
        setCurrentSelection({selection: selectionIndex});
        console.log(selectionIndex);

    }
    const getButtonStyle = (buttonIndex: number) => {
    return buttonIndex === currentSelection.selection 
            ? { outline: '0.2vw solid white' } 
            : {}
    }






    return(
        <>
        
            <div className="navigation_button_set"> {/* Note it is not onClick={handleButtonClick(0)} as this would immediatley execute it. rather than create an event handler. so its activating on render than on click */}

                <button className="minimap_button" onClick={() => handleButtonClick(0)} style={getButtonStyle(0)}>
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

               <button className="minimap_button"  onClick={() => handleButtonClick(1)} style={getButtonStyle(1)}>
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

               <button className="minimap_button"  onClick={() => handleButtonClick(2)} style={getButtonStyle(2)}>
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

               <button className="minimap_button"  onClick={() => handleButtonClick(3)} style={getButtonStyle(3)}>
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

                <button className="minimap_button"  onClick={() => handleButtonClick(4)} style={getButtonStyle(4)}>
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

        </>
    )
}
export default Navigation_set