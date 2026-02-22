import { button_viewWidth_size } from "../static/constants";

const button_size = window.innerWidth * button_viewWidth_size;


// Optional: ID to exclude from collision check (when moving a point)
// boolean => means it expects a return of boolean
export const checkCollision = (x: number, y: number, points: {id: number, x: number, y: number, type: number}[], collisionRadius: number,excludeId?: number): boolean => {
    
    for (const point of points) {
        // Skip checking collision with the point being moved
        if (excludeId !== undefined && point.id === excludeId) {
            continue;
        }
        
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        
        if (distance < collisionRadius) {
            return true; // Collision detected
        }
    }
    
    return false; // No collision
};






// Calculate collision radius based on button size
export const calculateCollisionRadius = (): number => {
    return button_size * 1.1; // 10% larger than button size
};

// Calculate centered coordinates
export const centerCoordinates = (rawX: number, rawY: number): {x: number, y: number} => {
    return {
        x: rawX - (button_size / 2),
        y: rawY - (button_size / 2)
    };
};