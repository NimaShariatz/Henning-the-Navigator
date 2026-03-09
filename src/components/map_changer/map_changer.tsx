import { useState, useEffect } from 'react';
import './map_changer.css';
import { Arras, Kuban, Lapino, Moscow, Normandy, Novosokolniki, Prokhorovka, Rheinland, Stalingrad, Vluki, Western_front } from "../../static/constants.tsx"

interface MapChangerProps {
    showUI: boolean;
    currentImage: string;
    onChangeMap: (newMapUrl: string) => void;
    customMapName?: string;
}

function Map_changer({showUI, currentImage, onChangeMap, customMapName }: MapChangerProps) {    
    const [currentMapName, setCurrentMapName] = useState<string>('');
    const [showOptions, setShowOptions] = useState<boolean>(false);
    
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
            //console.log(currentImage, customMapName)
            return;
        }
        
        // Otherwise extract map name from URL
        const urlParts = currentImage.split('/');
        const filename = urlParts[urlParts.length - 1];
        const mapName = filename.split('.')[0];
        

        
        setCurrentMapName(mapName);
        //console.log(currentImage, customMapName)
    }, [currentImage, customMapName]);

    // Handle clicking the next map button
    const handleMapSelect = (mapName: string) => {
        const selectedMap = maps.find(map => map.name === mapName);
        if (selectedMap) {
            onChangeMap(selectedMap.url);
            setShowOptions(false); // Hide options after selection
        }
    };


    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    return (
        <div className='map_changeSelection_container' style={{ display: showUI ? 'block' : 'none' }}>
            <div className='map_changeSelection_current'>
                <p>{currentMapName}</p>
                <button onClick={toggleOptions} style={{transform: showOptions ? 'rotate(180deg)' : '' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16">
                        <path fill="var(--logo_yellow)" d="M9.312 14.223a1.5 1.5 0 0 1-2.629 0l-5.5-10a1.5 1.5 0 0 1 1.315-2.222h10.999a1.5 1.5 0 0 1 1.314 2.223z" />
                    </svg>
                </button>
            </div>
            <div className='map_changeSelection_options' style={{ display: showOptions ? 'flex' : 'none' }}>
                {maps.map((map) => (
                    <button key={map.name} onClick={() => handleMapSelect(map.name)}>
                        {map.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Map_changer;