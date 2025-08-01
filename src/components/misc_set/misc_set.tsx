import "./misc_set.css"
import { useRef } from "react"

interface MiscSetProps {
    onImageUpload?: (file: File) => void;
    onClearPoints?: () => void; // just for accessing clear_all_points() in map.tsx
    toggleInfoContainer?: () => void;

    onDataImport?: (data: {points: {id: number, x: number, y: number, type: number}[], flightNotes: string}) => void; // for intaking JSON on upload


    points?: {id: number, x: number, y: number, type: number}[];
    flightNotes: string;
}

function Misc_set({ onImageUpload, onClearPoints, toggleInfoContainer, onDataImport, points = [], flightNotes }: MiscSetProps){
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jsonInputRef = useRef<HTMLInputElement>(null);
    
    //file changing stuff
    /*Logic:
    when folder is clicked, handle_image_upload(misc_set.tsx) is called.
    it clicks the <input/>. fileInputRef.click()
    when an image is selected, handle_file_change is called
    it calls onImageUpload which takes it as an arguement
    in the Map component, handleImageUpload is passed
    to Minimap component which is then passed to Misc_set

    handleImageUpload in map.tsx creates an object URL
    from the file and updates the state with the new image URL,
    so it updates main map and minimap
    
    */


    const handle_image_upload = () => {//clicks the hidden <input/>
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handle_file_change = (e: React.ChangeEvent<HTMLInputElement>) => { //this is what <input/> calls
        const files = e.target.files;
        if (files && files.length > 0 && onImageUpload) {
            onImageUpload(files[0]);// sets onImageUpload variable to this.
        }
    };
    //file changing stuff







    //download functionality
    const handle_download = () => {
        const data = {
            points: points,
            flightNotes,
            exportDate: new Date().toISOString()

        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `navigation_data_${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    };
    //download functionality


    //upload functionality
    const handle_json_upload = () => {//clicks the hidden JSON <input/>
        if (jsonInputRef.current) {
            jsonInputRef.current.click();
        }
    };


    const handle_json_file_change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const result = event.target?.result;
                    if (typeof result === 'string') {
                        const data = JSON.parse(result);
                        
                        // Validate the JSON structure - only check for points now
                        if (data.points && Array.isArray(data.points)) {
                            // Get canvas dimensions for bounds checking
                            const canvas = document.querySelector('canvas.map_background') as HTMLCanvasElement;
                            const canvasWidth = canvas?.clientWidth || 0;
                            const canvasHeight = canvas?.clientHeight || 0;
                            
                            // Validate each point has the required structure and is within canvas bounds
                            const validPoints = data.points.every((point: any) => {
                                const hasValidStructure = (
                                    typeof point.id === 'number' &&
                                    typeof point.x === 'number' &&
                                    typeof point.y === 'number' &&
                                    typeof point.type === 'number'
                                );
                                
                                const isWithinBounds = (
                                    point.x >= 0 && point.x <= canvasWidth &&
                                    point.y >= 0 && point.y <= canvasHeight
                                );
                                
                                return hasValidStructure && isWithinBounds;
                            });
                            
                            if (validPoints && onDataImport) {
                                onDataImport({
                                    points: data.points,
                                    flightNotes: data.flightNotes
                                });
                            } else {
                                // More specific error message
                                if (canvasWidth === 0 || canvasHeight === 0) {
                                    alert('Cannot validate point positions: Canvas not found or has no dimensions.');
                                } else {
                                    alert(`Please check the file structure and ensure all points are within canvas bounds (${canvasWidth} x ${canvasHeight}).`);
                                }
                            }
                        } else {
                            alert('Invalid JSON file format. Missing points data.');
                        }
                    }
                } catch (error) {
                    alert('Error reading JSON file. Please check if the file is valid JSON.');
                    console.error('JSON parsing error:', error);
                }
            };
            
            reader.readAsText(file);
        }
        
        // Reset the input value to allow selecting the same file again
        e.target.value = '';
    };



    //clear points stuff
    const handle_clear_points = () => {
        if (onClearPoints) {
            onClearPoints();
        }
    };
    //clear points stuff


    return(
        <>
            <div className="misc_button_set">

                <button className="option_button" onClick={toggleInfoContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                        <g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 
                            0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path className="info_fill" fill="#ae3232" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m-.01 6c.558 0 1.01.452 1.01 1.01v5.124A1 1 0 0 1 12.5 18h-.49A1.01 1.01 0 0 1 11 16.99V12a1 1 0 1 1 0-2zM12 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
                        </g>
                    </svg>
                </button>

                {/* Added onClick handler to the folder button */}
                <button className="option_button" onClick={handle_image_upload}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                        <path className="map_upload_fill" d="m5 18.31l3-1.16V5.45L5 6.46zm11 .24l3-1.01V5.69l-3 1.17z" opacity="0.3" />
                        <path className="map_upload_fill" d="m20.5 3l-.16.03L15 5.1L9 3L3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1l5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5M8 17.15l-3 1.16V6.46l3-1.01zm6 1.38l-4-1.4V5.47l4 1.4zm5-.99l-3 1.01V6.86l3-1.16z" />
                    </svg>
                </button>


                <button className="option_button" onClick={handle_download}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                        <path className="download_fill" d="M12 15.575q-.2 0-.375-.062T11.3 15.3l-3.6-3.6q-.3-.3-.288-.7t.288-.7q.3-.3.713-.312t.712.287L11 12.15V5q0-.425.288-.712T12 4t.713.288T13 5v7.15l1.875-1.875q.3-.3.713-.288t.712.313q.275.3.288.7t-.288.7l-3.6 3.6q-.15.15-.325.213t-.375.062M6 20q-.825 0-1.412-.587T4 18v-2q0-.425.288-.712T5 15t.713.288T6 16v2h12v-2q0-.425.288-.712T19 15t.713.288T20 16v2q0 .825-.587 1.413T18 20z" />
                    </svg>
                </button>

                <button className="option_button" onClick={handle_json_upload}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 28 28">
                        <path className="folder_fill" d="M2 6.75A3.75 3.75 0 0 1 5.75 3h3.672c.729 0 1.428.29 1.944.805L13.25 5.69l-2.944 2.945A1.25 1.25 0 0 1 9.422 9H2zm.004 3.75v9.75A3.75 3.75 0 0 0 5.754 24H22.25A3.75 3.75 0 0 0 26 20.25V9.75A3.75 3.75 0 0 0 22.25 6h-7.19l-3.694 3.695a2.75 2.75 0 0 1-1.944.805z" />
                    </svg>
                </button>

                <button className="option_button" onClick={handle_clear_points}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="65%" height="65%" viewBox="0 0 24 24">
                        <g fill="none" fillRule="evenodd">
                            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                            <path className="clear_fill" d="M17.278 2.613a1 1 0 0 1 1.89.643l-.038.11l-2.61 6.42l.657.175c1.05.281 1.924 1.134 2.09 2.298c.142 1 .275 2.52.092 4.086c-.182 1.552-.69 3.278-1.947 4.546c-.462.466-1.125.54-1.573.548c-.511.008-1.1-.07-1.705-.19c-1.216-.242-2.674-.69-4.054-1.166l-.414-.145l-.813-.294l-.78-.291l-.734-.283l-.978-.388l-.822-.335l-.817-.345a1 1 0 0 1-.228-1.708c1.377-1.08 2.67-2.322 3.761-3.469l.529-.564l.25-.274l.472-.527l.22-.252l.594-.695l.337-.406a3.1 3.1 0 0 1 2.981-1.087l.199.046l.737.197zM10.5 13.348a44 44 0 0 1-3.479 3.444q.863.349 1.733.68a7.3 7.3 0 0 0 1.426-1.338a7 7 0 0 0 .488-.654l.142-.232a1 1 0 0 1 1.747.973c-.234.42-.527.814-.832 1.184a10 10 0 0 1-.792.856c.462.158.924.308 1.372.446c.373-.257.81-.785 1.206-1.385q.239-.36.452-.74l.204-.384a1 1 0 0 1 1.793.887c-.229.462-.496.909-.78 1.339a11 11 0 0 1-.634.868l.421.082c.362.067.744.114 1.089.043c.766-.815 1.163-1.998 1.316-3.305q.053-.456.068-.904zm2.819-2.35a1.09 1.09 0 0 0-1.116.378l-.243.293l5.398 1.446l-.047-.392l-.024-.182c-.037-.253-.216-.491-.511-.61l-.116-.038zM5.565 7.716l.064.14A3.26 3.26 0 0 0 6.866 9.22l.1.058a.068.068 0 0 1 0 .118l-.1.058A3.26 3.26 0 0 0 5.63 10.82l-.064.139a.071.071 0 0 1-.13 0l-.064-.14a3.26 3.26 0 0 0-1.237-1.364l-.1-.058a.068.068 0 0 1 0-.118l.1-.058A3.26 3.26 0 0 0 5.37 7.855l.064-.139a.071.071 0 0 1 .13 0Zm2.832-4.859c.04-.09.166-.09.206 0l.102.222a5.2 5.2 0 0 0 1.97 2.171l.157.093a.108.108 0 0 1 0 .189l-.158.092a5.2 5.2 0 0 0-1.97 2.172l-.1.222a.113.113 0 0 1-.207 0l-.102-.222a5.2 5.2 0 0 0-1.97-2.172l-.158-.092a.108.108 0 0 1 0-.189l.159-.093a5.2 5.2 0 0 0 1.97-2.171l.1-.222Z" />
                        </g>
                    </svg>
                </button>
                

                <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handle_file_change}
                />
                <input 
                type="file" 
                ref={jsonInputRef}
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handle_json_file_change}
                />
            </div>
        </>
    )
}
export default Misc_set