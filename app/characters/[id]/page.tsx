"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface CharacterDetail {
    id: number | string;
    name: string;
    portrait_path?: string;
    status?: string;
    gender?: string;
    age?: number | null;
    occupation?: string;
    description?: string;
    phrases?: string[];
}

export default function CharacterDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const currentId = id ? parseInt(Array.isArray(id) ? id[0] : id, 10) : 1;

    const [character, setCharacter] = useState<CharacterDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchCharacterDetail() {
            setLoading(true);
            try {
                const response = await fetch(`https://thesimpsonsapi.com/api/characters/${id}`);

                if (!response.ok) {
                    throw new Error("No se pudo obtener el personaje");
                }

                const data = await response.json();
                setCharacter(data.data || data);
            } catch (err) {
                console.error("Error al cargar el detalle del personaje:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchCharacterDetail();
    }, [id]);

    return (
        <main className="min-h-screen bg-simpsonBlue p-6 md:p-10 flex flex-col items-center font-sans relative overflow-hidden">
            {/* Importación de tipografía de Los Simpson por si acaso */}
            <style jsx global>{`
                @import url('https://fonts.cdnfonts.com/css/the-simpsons');
                
                .font-simpson-title {
                    font-family: 'The Simpsons', 'Comic Sans MS', cursive, sans-serif;
                    letter-spacing: 2px;
                }
            `}</style>

            <div className="w-full max-w-4xl mx-auto relative z-10">
                {/* Barra de navegación superior: Volver + Botones Anterior / Siguiente */}
                <div className="w-full mb-6 flex flex-wrap justify-between items-center gap-4">
                    <Link
                        href="/characters"
                        className="bg-simpsonYellow font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        ← Volver a los Habitantes
                    </Link>

                    {/* Botones de Navegación Rápida */}
                    <div className="flex gap-3">
                        {currentId > 1 ? (
                            <Link
                                href={`/characters/${currentId - 1}`}
                                className="bg-white font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm flex items-center gap-1 hover:bg-gray-50"
                            >
                                ⬅️ Anterior
                            </Link>
                        ) : (
                            <span className="bg-gray-200 text-gray-400 font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm cursor-not-allowed opacity-60">
                                ⬅️ Anterior
                            </span>
                        )}

                        <Link
                            href={`/characters/${currentId + 1}`}
                            className="bg-simpsonYellow font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-sm flex items-center gap-1 hover:bg-yellow-400"
                        >
                            Siguiente ➡️
                        </Link>
                    </div>
                </div>

                {/* Pantalla de Carga (Skeleton exacto al de location) */}
                {loading && (
                    <div className="bg-white/90 rounded-3xl border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse w-full">
                        <div className="h-8 bg-gray-200 w-1/4 rounded-xl mb-6 border-2 border-black"></div>
                        <div className="h-72 bg-gray-200 w-full rounded-2xl mb-6 border-2 border-black"></div>
                        <div className="h-10 bg-gray-200 w-3/4 rounded-xl mb-4 border-2 border-black"></div>
                        <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                    </div>
                )}

                {/* Pantalla de Error */}
                {!loading && (error || !character) && (
                    <div className="max-w-xl mx-auto text-center py-12">
                        <div className="bg-white border-6 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-5xl mb-4">🍩</p>
                            <h2 className="text-3xl font-black text-black mb-2 font-simpson-title uppercase">¡D'oh! No encontramos este personaje</h2>
                            <p className="text-gray-700 font-extrabold mb-6 text-sm">El habitante que buscas no existe o fue borrado del mapa.</p>
                            <button
                                onClick={() => router.back()}
                                className="bg-[#fed90f] text-black border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer transition-all"
                            >
                                ⬅️ Volver atrás
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenido Principal */}
                {!loading && character && (() => {
                    const imageUrl = character.portrait_path
                        ? `https://cdn.thesimpsonsapi.com/500${character.portrait_path}`
                        : null;

                    return (
                        <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start animate-fade-in">
                            {/* Contenedor de la imagen con zoom sutil */}
                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-simpsonYellow/20 p-4 rounded-xl border-2 border-black min-h-[320px] transition-transform duration-300 hover:scale-[1.02]">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={character.name}
                                        className="w-full h-80 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center text-gray-400 font-bold h-full">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            {/* Información detallada */}
                            <div className="w-full md:w-2/3 flex flex-col">
                                <h1 className="font-simpson-title text-4xl md:text-5xl text-black mb-2">
                                    {character.name}
                                </h1>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="bg-simpsonYellow border-2 border-black px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Estado: {character.status || "Desconocido"}
                                    </span>
                                    {character.gender && (
                                        <span className="bg-pink-300 border-2 border-black px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Género: {character.gender}
                                        </span>
                                    )}
                                    {character.age !== undefined && character.age !== null && (
                                        <span className="bg-green-300 border-2 border-black px-3 py-1 rounded-full text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Edad: {character.age}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-800 font-medium mb-4">
                                    <strong className="text-black">Ocupación:</strong> {character.occupation || "No especificada"}
                                </p>

                                {/* Biografía */}
                                {character.description && (
                                    <div className="mb-6">
                                        <h3 className="font-bold text-black text-lg mb-1">Biografía:</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {character.description}
                                        </p>
                                    </div>
                                )}

                                {/* Frases célebres */}
                                {character.phrases && character.phrases.length > 0 && (
                                    <div className="mt-auto bg-gray-50 border-2 border-black p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                        <h3 className="font-bold text-black mb-2">💬 Frases célebres:</h3>
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                            {character.phrases.slice(0, 4).map((phrase, idx) => (
                                                <li key={idx} className="italic">"{phrase}"</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </main>
    );
}