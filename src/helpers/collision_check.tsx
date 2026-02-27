import { button_viewWidth_size } from "../static/constants";



// Optional: ID to exclude from collision check (when moving a point)
// boolean => means it expects a return of boolean
const getButtonSize = (): number => window.innerWidth * button_viewWidth_size;

export const checkCollision = (x: number, y: number, points: {id: number, x: number, y: number, type: number}[], collisionRadius: number, excludeId?: number): boolean => {
    for (const point of points) {
        if (excludeId !== undefined && point.id === excludeId) continue;
        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
        if (distance < collisionRadius) return true;
    }
    return false;
};





export const calculateCollisionRadius = (): number => {
    return getButtonSize() * 1.1;
};

// Calculate centered coordinates
export const centerCoordinates = (rawX: number, rawY: number): {x: number, y: number} => {
    const button_size = getButtonSize();
    return {
        x: rawX - (button_size / 2),
        y: rawY - (button_size / 2)
    };
};