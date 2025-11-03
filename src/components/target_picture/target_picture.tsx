import "./target_picture.css"
import { useRef, useState, useEffect } from "react"


interface Target_picture{
    drawing_color: {r: number, g: number, b: number, a: number};
    eraser: boolean;

    Targetdrawings: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}}[];
    onTargetDrawingsChange: (drawings: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}}[]) => void;
}

function Target_picture({ drawing_color, eraser, Targetdrawings, onTargetDrawingsChange }: Target_picture) {
    const containerRef = useRef<HTMLDivElement>(null);

    const TargetfileInputRef = useRef<HTMLInputElement>(null);
    const [targetImage, setTargetImage] = useState<string>("");

    const [isDrawing, setIsDrawing] = useState(false);
    const [currentDrawing, setCurrentDrawing] = useState<{x: number, y: number}[]>([]);

    const lastPointRef = useRef<{x: number, y: number} | null>(null);
    const [thicknessAdjuster, setThicknessAdjuster] = useState(0);

    useEffect(() => {
        const adjustedThickness = (window.innerWidth) / 350;
        setThicknessAdjuster(adjustedThickness);
    }, [window.innerWidth]);
    
    
    const isPointNearLine = (
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
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        
        // Calculate relative position (0-1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setIsDrawing(true);
        
        if (!eraser) {
            setCurrentDrawing([{x, y}]);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        
        // Calculate relative position (0-1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        if (eraser) {
            const moveThreshold = 0.01; // 1% movement threshold
            
            if (lastPointRef.current) {
                const dx = x - lastPointRef.current.x;
                const dy = y - lastPointRef.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < moveThreshold) return;
            }
            
            lastPointRef.current = {x, y};
            
            const eraserRadius = 0.02; // 2% of container size
            
            onTargetDrawingsChange(
                Targetdrawings.filter(drawing => {
                    for (let i = 0; i < drawing.points.length - 1; i++) {
                        if (isPointNearLine(
                            {x, y},
                            drawing.points[i],
                            drawing.points[i + 1],
                            eraserRadius
                        )) {
                            return false;
                        }
                    }
                    return true;
                })
            );
            return;
        }

        const moveThreshold = 0.01; // 1% movement threshold
        
        if (lastPointRef.current) {
            const dx = x - lastPointRef.current.x;
            const dy = y - lastPointRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < moveThreshold) return;
        }
        
        lastPointRef.current = {x, y};
        setCurrentDrawing(prev => [...prev, {x, y}]);
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        
        // Only save drawings with more than one point (no single clicks). note: make '... > 0' if you want to save single click lines
        if (!eraser && currentDrawing.length > 1) {
            const newDrawing = {
                id: `drawing-${Date.now()}`,
                points: currentDrawing,
                color: {...drawing_color},
            };

            onTargetDrawingsChange([...Targetdrawings, newDrawing]);
        }
        
        setIsDrawing(false);
        setCurrentDrawing([]);
    };

    const handleMouseLeave = () => {
        if (isDrawing) {
            handleMouseUp();
        }
    };

    const handle_target_image_upload = () => {
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

    const handle_remove_target = () => {
        if (targetImage) {
            URL.revokeObjectURL(targetImage);
        }
        setTargetImage("");
        if (TargetfileInputRef.current) {
            TargetfileInputRef.current.value = "";
        }
    };

    const handle_clear_drawings = () => {
        onTargetDrawingsChange([]);
    };

    return(
        <>
            <div className="target_canvas" ref={containerRef} 
                style={{
                    backgroundImage: targetImage ? `url(${targetImage})` : 'none', 
                    cursor: 'crosshair',
                    position: 'relative'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <svg 
                    className="drawing_overlay"
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                >
                    {Targetdrawings.map(drawing => (

                       /* drawing.points.length === 1 ? ( for single click drawing. which is disabled in handleMouseUp.
                            <circle
                                key={drawing.id}
                                cx={drawing.points[0].x}
                                cy={drawing.points[0].y}
                                r={drawing.thickness / 500}
                                fill={`rgba(${drawing.color.r}, ${drawing.color.g}, ${drawing.color.b}, ${drawing.color.a})`}
                            />
                        ) : 
                        */

                        (
                            <polyline
                                key={drawing.id}
                                points={drawing.points.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="none"
                                stroke={`rgba(${drawing.color.r}, ${drawing.color.g}, ${drawing.color.b}, ${drawing.color.a})`}
                                strokeWidth={thicknessAdjuster}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        )
                    ))}

                    {isDrawing && currentDrawing.length > 0 && (
                        <polyline
                            points={currentDrawing.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={`rgba(${drawing_color.r}, ${drawing_color.g}, ${drawing_color.b}, ${drawing_color.a})`}
                            strokeWidth={thicknessAdjuster}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                </svg>
            </div>
            
            <div className="target_drawing_buttons_container">
                <button className="target_drawing_button" onClick={handle_target_image_upload}>Upload Target</button>
                <button className="target_drawing_button" onClick={handle_remove_target}>Remove Target</button>
                <button className="target_drawing_button" onClick={handle_clear_drawings}>Clear Drawings</button>
            </div>
            <input type="file" accept="image/*" style={{display:"none"}} ref={TargetfileInputRef} onChange={handle_file_change}/>
        </>
    )
}

export default Target_picture