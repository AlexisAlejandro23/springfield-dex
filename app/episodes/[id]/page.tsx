"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Episode {
    id: number | string;
    name: string;
    season: number;
    episode_number: number;
    airdate?: string;
    image_path?: string;
    synopsis?: string;
}

export default function EpisodeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const currentId = id ? parseInt(Array.isArray(id) ? id[0] : id, 10) : 1;

    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchEpisodeDetail() {
            setLoading(true);
            try {
                const response = await fetch(`https://thesimpsonsapi.com/api/episodes/${id}`);

                if (!response.ok) {
                    throw new Error("No se pudo obtener el episodio");
                }

                const data = await response.json();
                setEpisode(data.data || data);
            } catch (err) {
                console.error("Error al cargar el detalle del episodio:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchEpisodeDetail();
    }, [id]);

    const prevId = currentId > 1 ? currentId - 1 : null;
    const nextId = currentId < 768 ? currentId + 1 : null;

    return (
        <main className="min-h-screen bg-simpsonBlue p-4 sm:p-8 flex flex-col items-center font-sans relative overflow-hidden">
            {/* Tipografía de Los Simpson */}
            <style jsx global>{`
                @import url('https://fonts.cdnfonts.com/css/the-simpsons');
                
                .font-simpson-title {
                    font-family: 'The Simpsons', 'Comic Sans MS', cursive, sans-serif;
                    letter-spacing: 2px;
                }
            `}</style>

            <div className="w-full max-w-4xl relative z-10">
                {/* Barra superior: Volver y Navegación Rápida */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <Link
                        href="/episodes"
                        className="inline-flex items-center gap-2 bg-simpsonYellow border-3 border-black px-4 py-2 rounded-xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-black"
                    >
                        ⬅️ Volver al listado
                    </Link>

                    <div className="flex items-center gap-2">
                        {prevId ? (
                            <Link
                                href={`/episodes/${prevId}`}
                                className="bg-white border-3 border-black px-3 py-2 rounded-xl font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-black flex items-center gap-1"
                            >
                                ⬅️ Cap. Anterior
                            </Link>
                        ) : (
                            <span className="bg-gray-200 border-3 border-black px-3 py-2 rounded-xl font-bold text-xs opacity-50 cursor-not-allowed text-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                ⬅️ Cap. Anterior
                            </span>
                        )}

                        {nextId ? (
                            <Link
                                href={`/episodes/${nextId}`}
                                className="bg-white border-3 border-black px-3 py-2 rounded-xl font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-black flex items-center gap-1"
                            >
                                Cap. Siguiente ➡️
                            </Link>
                        ) : (
                            <span className="bg-gray-200 border-3 border-black px-3 py-2 rounded-xl font-bold text-xs opacity-50 cursor-not-allowed text-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                Cap. Siguiente ➡️
                            </span>
                        )}
                    </div>
                </div>

                {/* Pantalla de Carga (Skeleton) */}
                {loading && (
                    <div className="bg-white/90 rounded-3xl border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse w-full flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-5/12 h-64 bg-gray-200 rounded-2xl border-2 border-black"></div>
                        <div className="w-full md:w-7/12 flex flex-col justify-between">
                            <div>
                                <div className="h-6 bg-gray-200 w-1/2 rounded-lg mb-4 border-2 border-black"></div>
                                <div className="h-10 bg-gray-200 w-3/4 rounded-xl mb-4 border-2 border-black"></div>
                                <div className="h-24 bg-gray-200 w-full rounded-xl mb-4 border-2 border-black"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pantalla de Error */}
                {!loading && (error || !episode) && (
                    <div className="max-w-xl mx-auto text-center py-12">
                        <div className="bg-white border-6 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-5xl mb-4">📺</p>
                            <h2 className="text-3xl font-black text-black mb-2 font-simpson-title uppercase">¡D'oh! Episodio no encontrado</h2>
                            <p className="text-gray-700 font-extrabold mb-6 text-sm">Parece que esta transmisión se salió del aire o no existe.</p>
                            <button
                                onClick={() => router.back()}
                                className="bg-[#fed90f] text-black border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer transition-all"
                            >
                                ⬅️ Volver atrás
                            </button>
                        </div>
                    </div>
                )}

                {/* Tarjeta Principal del Episodio */}
                {!loading && episode && (() => {
                    const imageUrl = episode.image_path ? `https://cdn.thesimpsonsapi.com/500${episode.image_path}` : null;

                    return (
                        <div className="bg-white border-4 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-center mb-8 animate-fade-in">
                            {/* Imagen / Miniatura */}
                            <div className="w-full md:w-5/12 shrink-0">
                                {imageUrl ? (
                                    <div className="border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-50 transition-transform duration-300 hover:scale-[1.02]">
                                        <img
                                            src={imageUrl}
                                            alt={episode.name}
                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-100 border-4 border-black border-dashed rounded-2xl">
                                        <span className="text-4xl mb-2">📺</span>
                                        <span className="text-gray-500 font-bold text-sm">Sin imagen disponible</span>
                                    </div>
                                )}
                            </div>

                            {/* Información del Episodio */}
                            <div className="w-full md:w-7/12 flex flex-col justify-between">
                                <div>
                                    {/* Insignia de Temporada y Episodio */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="bg-simpsonBlue text-white font-black text-xs sm:text-sm px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Temporada {episode.season} • Episodio {episode.episode_number}
                                        </span>
                                        {episode.airdate && (
                                            <span className="bg-simpsonYellow text-black font-black text-xs sm:text-sm px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                📅 {episode.airdate}
                                            </span>
                                        )}
                                    </div>

                                    {/* Título */}
                                    <h1 className="text-2xl sm:text-4xl font-black text-black mb-4 leading-tight font-simpson-title">
                                        {episode.name}
                                    </h1>

                                    {/* Sinopsis */}
                                    <div className="bg-yellow-50/60 border-2 border-black rounded-xl p-4 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                        <h3 className="font-black text-xs uppercase text-gray-700 mb-1">Sinopsis:</h3>
                                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-medium">
                                            {episode.synopsis || "No hay sinopsis disponible para este episodio en este momento."}
                                        </p>
                                    </div>
                                </div>

                                {/* Pie de la tarjeta */}
                                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                                    <span className="text-xs font-bold text-gray-500">
                                        ID de Episodio: #{episode.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </main>
    );
}