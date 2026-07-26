"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface LocationDetail {
    id: number | string;
    name: string;
    town?: string;
    image_path?: string;
    description?: string;
    use?: string;
}

export default function LocationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const [location, setLocation] = useState<LocationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;

        async function fetchLocationDetail() {
            setLoading(true);
            try {
                const response = await fetch(`https://thesimpsonsapi.com/api/locations/${id}`);

                if (!response.ok) {
                    throw new Error("No se pudo obtener la localización");
                }

                const data = await response.json();
                setLocation(data.data || data);
            } catch (err) {
                console.error("Error al cargar el detalle de la localización:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchLocationDetail();
    }, [id]);

    return (
        <div className="w-full min-h-screen bg-[#72bcd5] bg-radial from-[#72bcd5] to-[#3a9cb8] py-8 px-4 font-sans relative overflow-hidden">

            {/* Importación de tipografía de Los Simpson */}
            <style jsx global>{`
                @import url('https://fonts.cdnfonts.com/css/the-simpsons');
                
                .font-simpson-title {
                    font-family: 'The Simpsons', 'Comic Sans MS', cursive, sans-serif;
                    letter-spacing: 2px;
                }
            `}</style>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Pantalla de Carga */}
                {loading && (
                    <div className="bg-white/90 rounded-3xl border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                        <div className="h-8 bg-gray-200 w-1/4 rounded-xl mb-6 border-2 border-black"></div>
                        <div className="h-72 bg-gray-200 w-full rounded-2xl mb-6 border-2 border-black"></div>
                        <div className="h-10 bg-gray-200 w-3/4 rounded-xl mb-4 border-2 border-black"></div>
                        <div className="h-4 bg-gray-200 w-full rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                    </div>
                )}

                {/* Pantalla de Error */}
                {!loading && (error || !location) && (
                    <div className="max-w-xl mx-auto text-center py-12">
                        <div className="bg-white border-6 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-5xl mb-4">🍩</p>
                            <h2 className="text-3xl font-black text-black mb-2 font-simpson-title uppercase">¡D'oh! No encontramos este lugar</h2>
                            <p className="text-gray-700 font-extrabold mb-6 text-sm">La localización que buscas no existe o fue borrada del mapa de Springfield.</p>
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
                {!loading && location && (() => {
                    const imageUrl = location.image_path
                        ? `https://cdn.thesimpsonsapi.com/500${location.image_path}`
                        : null;

                    return (
                        <div className="animate-fade-in">
                            {/* Botón Volver */}
                            <button
                                onClick={() => router.back()}
                                className="mb-6 flex items-center gap-2 bg-[#fed90f] text-black border-4 border-black px-5 py-2.5 rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                            >
                                ⬅️ Volver a localizaciones
                            </button>

                            {/* Tarjeta de Detalle Estilo TV */}
                            <div className="bg-white/95 rounded-3xl border-6 border-black p-6 sm:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                                {/* Imagen */}
                                <div className="w-full">
                                    {imageUrl ? (
                                        <div className="overflow-hidden rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-sky-100">
                                            <img
                                                src={imageUrl}
                                                alt={location.name}
                                                className="w-full h-72 sm:h-96 object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-72 sm:h-96 flex flex-col items-center justify-center bg-yellow-50 rounded-2xl border-4 border-black border-dashed">
                                            <span className="text-4xl mb-2">🏠</span>
                                            <span className="text-gray-500 font-black uppercase text-xs">Sin imagen disponible</span>
                                        </div>
                                    )}
                                </div>

                                {/* Información */}
                                <div className="flex flex-col justify-between h-full">
                                    <div>
                                        <div className="inline-block bg-[#fed90f] border-3 border-black px-3.5 py-1 rounded-full font-black text-xs uppercase tracking-wider mb-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            {location.town || "Springfield"}
                                        </div>

                                        <h1 className="text-3xl sm:text-5xl font-black text-[#e53935] uppercase tracking-wide mb-4 font-simpson-title drop-shadow-[2px_2px_0px_#fed90f]">
                                            {location.name}
                                        </h1>

                                        <div className="space-y-4 mb-6">
                                            <div>
                                                <h3 className="text-xs font-black text-black uppercase tracking-wider mb-2 bg-[#fff3b0] inline-block px-2 py-0.5 rounded border border-black">
                                                    Descripción / Uso:
                                                </h3>
                                                <p className="text-black font-extrabold text-base sm:text-lg leading-relaxed bg-[#fff9db] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                                    {location.description || location.use || "Un punto de interés clásico dentro de la ciudad de Springfield donde ocurren grandes historias."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pie de tarjeta / Acciones */}
                                    <div className="pt-4 border-t-3 border-dashed border-black flex items-center justify-between">
                                        <span className="text-xs font-black text-black bg-gray-200 px-2 py-1 rounded border border-black">
                                            ID: #{location.id}
                                        </span>
                                        <Link
                                            href="/locations"
                                            className="bg-[#3a9cb8] text-white border-3 border-black px-4 py-2 rounded-xl font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2e7d94] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition cursor-pointer"
                                        >
                                            Ver más lugares
                                        </Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                })()}

            </div>
        </div>
    );
}