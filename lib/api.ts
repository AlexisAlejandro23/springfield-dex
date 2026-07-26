import { Character, Location } from "@/types";

const API_BASE = "https://thesimpsonsapi.com/api";

export async function getCharacters(): Promise<Character[]> {
    try {
        const res = await fetch(`${API_BASE}/characters`);
        if (!res.ok) throw new Error("Error al cargar personajes");
        const data = await res.json();

        // Extraemos el arreglo de la propiedad 'results' que nos dio la API
        if (data && Array.isArray(data.results)) return data.results;
        if (Array.isArray(data)) return data;

        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Obtener un personaje por su ID (para la ruta dinámica [id])
export async function getCharacterById(id: string): Promise<Character | null> {
    try {
        const res = await fetch(`${API_BASE}/characters/${id}`);
        if (!res.ok) throw new Error("Error al cargar el personaje");
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
// Obtener los lugares de Springfield
export async function getLocations(): Promise<Location[]> {
    try {
        const res = await fetch(`${API_BASE}/locations`);
        if (!res.ok) throw new Error("Error al cargar los lugares");
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}