// ---- TAW JSON structure types ----

export interface TawLatLng { //x y cordinates
    lat: number;
    lng: number;
}

export interface TawPoint {
    latLng: TawLatLng;
    name: string;
    type: string;    // "taw-af", "taw-city", "taw-def", "taw-depo", "taw-supply", "taw-train", "taw-tank", "stock-ship"
    color: string;   // "blue", "red", "black"
    notes: string;
}

export interface TawJSON {
    revision: number;
    mapHash: string;     // "" or "#kuban" etc.
    units: string;       // "imperial"
    routes: unknown[];
    points: TawPoint[];
    circles: unknown[];
    polygons: unknown[];
}

const mapHashMultipliers: Record<string, { lng: number; lat: number }> = {
    "#arras":          { lng: 11.459,   lat: -11.631 },
    "#kuban":          { lng: 79.340,   lat: -79.143},
    "#lapino":         { lng: 2.99240,  lat: -7.9139 },
    "#moscow":         { lng: 63.575,   lat: -63.637 },
    "#normandy":       { lng: 111.168,  lat: -111.370 },
    "#novosokolniki":  { lng: 7.831,    lat: -7.772 },
    "#prokhorovka":    { lng: 63.387,   lat: -63.212 },
    "#rheinland":      { lng: 107.100,  lat: -99.914 },
    "#stalingrad":     { lng: 54.435,   lat: -54.342 },
    "":                { lng: 54.435,   lat: -54.342 },  // empty mapHash defaults to Stalingrad
    "#luki":           { lng: 31.239,   lat: -31.889 },
    "#western_front":  { lng: 45.794,   lat: -45.763 },
};

export interface HenningImportData {
    points: {id: number, x: number, y: number, type: number}[];
    targets: {id: number, x: number, y: number, type: number, targetName: string, isBlue: boolean}[];
    drawings: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}, thickness: number}[];
    Targetdrawings: {id: string, points: {x: number, y: number}[], color: {r: number, g: number, b: number, a: number}, thickness: number}[];
    flightNotes: string;
    textCreations: {id: number, x: number, y: number, text: string}[];
}


const taw_type_to_henning: Record<string, number> = {
    "taw-af": 13,
    "taw-city": 3,
    "taw-def": 11,
    "taw-depo": 2,
    "taw-bridge": 9,
    "taw-arta": 12,
    "taw-supply": 10,
    "taw-train": 5,
    "taw-tank": 7,
    "stock-ship": 8,
};




export const taw_json_converter = (data: Record<string, unknown>): HenningImportData | null => {

    try {
        /*
        const tawData: TawJSON = {
            revision: (data.revision as number) ?? 0,
            mapHash: (data.mapHash as string) ?? "",
            units: (data.units as string) ?? "",
            routes: (data.routes as unknown[]) ?? [],
            points: ((data.points as TawPoint[]) ?? []).map((p: TawPoint) => ({
                latLng: {
                    lat: p.latLng?.lat ?? 0,
                    lng: p.latLng?.lng ?? 0,
                },
                name: p.name ?? "",
                type: p.type ?? "",
                color: p.color ?? "",
                notes: p.notes ?? "",
            })),
            circles: (data.circles as unknown[]) ?? [],
            polygons: (data.polygons as unknown[]) ?? [],
        };

        //console.log(tawData.points)

        tawData.points.forEach((point, index) => {
            console.log(`[${index}] name: ${point.name}, type: ${point.type}, color: ${point.color}, lat: ${point.latLng.lat}, lng: ${point.latLng.lng}`);
        })
        */
        const mapHash = (data.mapHash as string) ?? "";
        const multipliers = mapHashMultipliers[mapHash] ?? { lng: 54.535, lat: -54.442 };

        const tawPoints = ((data.points as TawPoint[]) ?? []).map((p: TawPoint) => ({
            latLng: {
                lat: p.latLng?.lat ?? 0,
                lng: p.latLng?.lng ?? 0,
            },
            name: p.name ?? "",
            type: p.type ?? "",
            color: p.color ?? "",
            notes: p.notes ?? "",
        }));

        const targets = tawPoints
        .filter((point) => point.color === "blue" || point.color === "red")
        .map((point, index) => ({
            id: index + 1,
            x: point.latLng.lng * multipliers.lng,
            y: point.latLng.lat * multipliers.lat,
            type: taw_type_to_henning[point.type] ?? 15,
            targetName: point.name,
            isBlue: point.color === "blue",
        }));

        const importData: HenningImportData = {
            points: [],
            targets: targets,
            drawings: [],
            Targetdrawings: [],
            flightNotes: "",
            textCreations: [],
        };

        return importData;
    } catch (error) {
        console.error("Failed to convert TAW JSON:", error);
        return null;
    }
};