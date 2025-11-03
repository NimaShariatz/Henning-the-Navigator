import "./target_picture.css"
import { useRef, useState } from "react"






function Target_picture() {

    const TargetfileInputRef = useRef<HTMLInputElement>(null);
    const [targetImage, setTargetImage] = useState<string>("");

    const handle_target_image_upload = () => {//clicks the hidden <input/>
        if (TargetfileInputRef.current) {
            TargetfileInputRef.current.click();
        }
    };
    
    const handle_file_change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setTargetImage(imageUrl);
        }
    };



    return(
        <>

            <div className="target_canvas" style={{backgroundImage: targetImage ? `url(${targetImage})` : 'none', cursor: 'crosshair'}}>
            </div>

        
            <button className="upload_target_image" onClick={handle_target_image_upload}>Upload Map</button>



            <input type="file" accept="image/*" style={{display:"none"}} ref={TargetfileInputRef} onChange={handle_file_change}/>
        
        </>
    )

}

export default Target_picture