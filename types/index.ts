// Estructura para un personaje de Los Simpson
export interface Character {
    id: number;
    name: string;
    occupation?: string;
    age?: number | null;
    gender?: string;
    status?: string;
    portrait_path?: string; // Propiedad correcta de la API
    phrases?: string[];
}

// Estructura para un lugar icónico de Springfield
export interface Location {
    id: number;
    name: string;
    description?: string;
    image?: string;
    town?: string;
}

// Estructura para un episodio de Los Simpson

export interface Episode {
    id: number;
    airdate: string;
    episode_number: number;
    image_path: string | null;
    name: string;
    season: number;
    synopsis: string;
}

// Estructura genérica para las respuestas de paginación o listados si la API los maneja
export interface ApiResponse<T> {
    data: T[];
    total?: number;
}

