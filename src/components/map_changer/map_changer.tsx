import { useState, useEffect } from 'react';
import './map_changer.css';
import { Arras, Kuban, Lapino, Moscow, Normandy, Novosokolniki, Prokhorovka, Rheinland, Stalingrad, Vluki, Western_front } from "../../static/constants.tsx"

interface MapChangerProps {
  currentImage: string;
  onChangeMap: (newMapUrl: string) => void;
  customMapName?: string;  // Add this optional property
}

function Map_changer({ currentImage, onChangeMap, customMapName }: MapChangerProps) {
    const [currentMapName, setCurrentMapName] = useState<string>('');
    
    // Create an array of map data with names and URLs
    const maps = [
        { name: 'Arras', url: Arras },
        { name: 'Kuban', url: Kuban },
        { name: 'Lapino', url: Lapino },
        { name: 'Moscow', url: Moscow },
        { name: 'Normandy', url: Normandy },
        { name: 'Novosokolniki', url: Novosokolniki },
        { name: 'Prokhorovka', url: Prokhorovka },
        { name: 'Rheinland', url: Rheinland },
        { name: 'Stalingrad', url: Stalingrad },
        { name: 'Vluki', url: Vluki },
        { name: 'Western_front', url: Western_front }
    ];

    useEffect(() => {
        // If a custom map name is provided, use it
        if (customMapName) {
            setCurrentMapName(customMapName);
            return;
        }
        
        // Otherwise extract map name from URL
        const urlParts = currentImage.split('/');
        const filename = urlParts[urlParts.length - 1];
        let mapName = filename.split('.')[0];
        

        
        setCurrentMapName(mapName);
    }, [currentImage, customMapName]);

    // Handle clicking the next map button
    const handleNextMap = () => {
        const currentIndex = maps.findIndex(map => map.name === currentMapName);
        const nextIndex = (currentIndex + 1) % maps.length;
        onChangeMap(maps[nextIndex].url);
    };

    return (
        <div className='map_changer_container'>
            <p>{currentMapName}</p>
            <button onClick={handleNextMap}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20">
                    <g fill="var(--logo_yellow)" fillRule="evenodd" clipRule="evenodd">
                        <path d="M15.499 9.134a1 1 0 0 1 0 1.732l-10 5.769A1 1 0 0 1 4 15.769V4.23a1 1 0 0 1 1.5-.866z" />
                        <path d="M5.5 16.635a1 1 0 0 1-1.5-.866V4.23a1 1 0 0 1 1.5-.866l9.999 5.769a1 1 0 0 1 0 1.732zM10.997 10L7 7.694v4.612z" />
                    </g>
                </svg>
            </button>
        </div>
    );
}

export default Map_changer;