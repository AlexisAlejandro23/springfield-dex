"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DonutMinigame from "../components/DonutMinigame";

interface LocationItem {
    id: number | string;
    name: string;
    town?: string;
    image_path?: string;
    description?: string;
}

const LOADING_QUOTES = [
    "Reprogramando el reactor nuclear de Springfield...",
    "Moe está atendiendo llamadas de broma...",
    "Homero se comió la última rosquilla de la caja...",
    "Bart está escribiendo castigos en la pizarra...",
    "Esperando a que la computadora de la planta se duerma...",
    "Homero está perdiendo el control en la compuerta 7..."
];

function LocationsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageParam = searchParams.get("page");
    const urlSearchQuery = searchParams.get("search") || "";
    const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    const [pageLocations, setPageLocations] = useState<LocationItem[]>([]);
    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
    const [townFilter, setTownFilter] = useState("Todos");
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Estados para easter eggs y minijuego
    const [titleClicks, setTitleClicks] = useState(0);
    const [secretActive, setSecretActive] = useState(false);
    const [randomQuoteIndex, setRandomQuoteIndex] = useState(0);
    const [showMinigame, setShowMinigame] = useState(false);

    // Cambiar frase de carga aleatoriamente
    useEffect(() => {
        const interval = setInterval(() => {
            setRandomQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Sincronizar búsqueda externa con la URL
    useEffect(() => {
        if (urlSearchQuery !== searchQuery) {
            setSearchQuery(urlSearchQuery);
        }
    }, [urlSearchQuery]);

    // Sincronizar página actual con la URL
    useEffect(() => {
        if (pageParam) {
            const pageNumber = parseInt(pageParam, 10);
            if (!isNaN(pageNumber) && pageNumber !== currentPage) {
                setCurrentPage(pageNumber);
            }
        }
    }, [pageParam]);

    // CARGAR LOCALIZACIONES DE LA PÁGINA ACTUAL
    useEffect(() => {
        async function fetchPage() {
            setLoading(true);
            try {
                const response = await fetch(`https://thesimpsonsapi.com/api/locations?page=${currentPage}`);
                const data = await response.json();

                const items = Array.isArray(data) ? data : data.results || data.data || [];
                const pagesCount = data.pages || 10;

                setPageLocations(items);
                setTotalPages(pagesCount);
            } catch (error) {
                console.error("Error al cargar la página de localizaciones:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            setCurrentPage(newPage);
            router.push(`/locations?page=${newPage}`, { scroll: false });
        });
    };

    const handleSearchChange = (newQuery: string) => {
        setSearchQuery(newQuery);

        if (newQuery.toLowerCase().includes("duff")) {
            console.log("🍺 ¡Cerveza Duff detectada! El alcohol es la causa y la solución de todos los problemas.");
        }

        startTransition(() => {
            if (newQuery.trim()) {
                router.replace(`/locations?search=${encodeURIComponent(newQuery)}`, { scroll: false });
            } else {
                router.replace(`/locations?page=${currentPage}`, { scroll: false });
            }
        });
    };

    // Obtener ciudades únicas basadas en la página actual para el filtro
    const uniqueTowns = Array.from(
        new Set(pageLocations.map((loc) => loc.town).filter(Boolean))
    ) as string[];

    // Filtrado directo sobre los elementos de la página actual
    const locationsToDisplay = pageLocations.filter(loc => {
        const matchesName = (loc.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTown = townFilter === "Todos" || loc.town === townFilter;
        return matchesName && matchesTown;
    });

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleTitleClick = () => {
        const newCount = titleClicks + 1;
        setTitleClicks(newCount);
        if (newCount === 5) {
            setSecretActive(true);
            setTimeout(() => {
                setSecretActive(false);
                setTitleClicks(0);
            }, 6000);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#72bcd5] bg-radial from-[#72bcd5] to-[#3a9cb8] py-8 px-4 font-sans relative overflow-hidden">

            <style jsx global>{`
                @import url('https://fonts.cdnfonts.com/css/the-simpsons');
                
                .font-simpson-title {
                    font-family: 'The Simpsons', 'Comic Sans MS', cursive, sans-serif;
                    letter-spacing: 2px;
                }
            `}</style>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Banner Secreto */}
                {secretActive && (
                    <div className="mb-6 bg-[#fed90f] border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center animate-bounce">
                        <p className="font-simpson-title text-xl text-[#e53935]">🎉 ¡HAS ENCONTRADO EL SECRETO DE MONORAIL! 🎉</p>
                        <p className="font-extrabold text-black text-sm mt-1">"Mono... ¡D'oh!" - Has desbloqueado el modo fanático supremo.</p>
                    </div>
                )}

                {/* Botón Volver y Minijuego */}
                <div className="mb-6 flex justify-between items-center">
                    <Link
                        href="/"
                        className="inline-block bg-[#fed90f] text-black border-4 border-black px-5 py-2 rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                    >
                        ⬅️ Volver al Menú Principal
                    </Link>

                    <button
                        onClick={() => setShowMinigame(!showMinigame)}
                        className="bg-[#ff6b6b] text-white border-4 border-black px-4 py-2 rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] transition-all flex items-center gap-2 cursor-pointer"
                    >
                        🍩 {showMinigame ? "Ocultar Minijuego" : "¡Jugar con Donas!"}
                    </button>
                </div>

                {/* Contenedor del Minijuego */}
                {showMinigame && (
                    <div className="mb-10 transition-all duration-300 animate-fade-in">
                        <div className="relative">
                            <button
                                onClick={() => setShowMinigame(false)}
                                className="absolute top-4 right-4 z-20 bg-black text-white w-8 h-8 rounded-full font-black border-2 border-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Cerrar minijuego"
                            >
                                ✕
                            </button>
                            <DonutMinigame />
                        </div>
                    </div>
                )}

                {/* Cabecera */}
                <div
                    onClick={handleTitleClick}
                    className="text-center mb-10 bg-white/90 border-6 border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative cursor-pointer group"
                    title="¡Haz clic 5 veces para una sorpresa!"
                >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#fed90f] border-3 border-black px-6 py-1 rounded-full uppercase font-black text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Guía Turística Oficial
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-[#e53935] uppercase tracking-wider font-simpson-title drop-shadow-[4px_4px_0px_#fed90f] mt-2 group-hover:scale-105 transition-transform">
                        Lugares de Springfield
                    </h1>
                    <p className="text-black font-extrabold mt-2 text-base sm:text-lg max-w-2xl mx-auto">
                        Descubre cada rincón, taberna y central nuclear de la ciudad más famosa del mundo animado.
                    </p>
                    <span className="text-[10px] text-gray-500 font-bold block mt-1">
                        {titleClicks > 0 && titleClicks < 5 ? `(Clicks para secreto: ${titleClicks}/5)` : "💡 Tip: Explora buscando o cambia de página."}
                    </span>
                </div>

                {/* Panel de Búsqueda y Filtros */}
                <div className="bg-[#fff3b0] border-4 border-black p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-10 flex flex-col items-center gap-5">
                    <div className="w-full max-w-xl relative">
                        <input
                            type="text"
                            placeholder="Busca un lugar en esta página..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full px-5 py-3.5 pr-12 rounded-2xl border-4 border-black bg-white text-black font-extrabold text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50 transition-all placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearchChange("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black bg-[#fed90f] hover:bg-red-400 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-black transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                        <div className="flex items-center gap-3 bg-white border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <span className="font-black text-black text-sm uppercase">Ciudad:</span>
                            <select
                                value={townFilter}
                                onChange={(e) => setTownFilter(e.target.value)}
                                className="bg-[#fed90f]/40 border-2 border-black px-3 py-1 rounded-xl font-bold text-black focus:outline-none cursor-pointer text-sm"
                            >
                                <option value="Todos">Todas</option>
                                {uniqueTowns.map((town) => (
                                    <option key={town} value={town}>
                                        {town}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(searchQuery || townFilter !== "Todos") && (
                            <button
                                onClick={() => {
                                    handleSearchChange("");
                                    setTownFilter("Todos");
                                }}
                                className="bg-[#e53935] text-white border-3 border-black px-4 py-2 rounded-2xl font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all cursor-pointer"
                            >
                                Limpiar Filtros 🔄
                            </button>
                        )}
                    </div>
                </div>

                {/* Estados de Carga o Listado */}
                {loading || isPending ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="bg-[#fed90f] border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 text-center">
                            <p className="font-simpson-title text-black text-lg">⏳ {LOADING_QUOTES[randomQuoteIndex]}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full opacity-75">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl border-4 border-black p-4 h-80 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between">
                                    <div className="bg-gray-200 h-40 w-full rounded-2xl mb-4 border-2 border-black"></div>
                                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                                    <div className="bg-gray-200 h-10 w-full rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {locationsToDisplay.length > 0 ? (
                                locationsToDisplay.map((loc, index) => {
                                    const imageUrl = loc.image_path
                                        ? `https://cdn.thesimpsonsapi.com/500${loc.image_path}`
                                        : null;

                                    return (
                                        <div
                                            key={loc.id}
                                            className="bg-white rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 hover:bg-[#fffdf0] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group"
                                        >
                                            {imageUrl ? (
                                                <div className="w-full overflow-hidden rounded-2xl border-3 border-black mb-4 bg-sky-100">
                                                    <img
                                                        src={imageUrl}
                                                        alt={loc.name}
                                                        className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-44 flex flex-col items-center justify-center bg-yellow-50 w-full mb-4 rounded-2xl border-3 border-black border-dashed">
                                                    <span className="text-3xl mb-1">🏠</span>
                                                    <span className="text-gray-500 font-black text-xs uppercase">Sin Imagen</span>
                                                </div>
                                            )}

                                            <div className="text-center w-full mb-4">
                                                <h2 className="font-simpson-title text-xl text-black uppercase tracking-wide group-hover:text-blue-600 line-clamp-1">
                                                    {loc.name}
                                                </h2>
                                                <p className="text-black text-xs font-black mt-1 bg-[#fed90f] inline-block px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                    {loc.town || "Springfield"}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/locations/${loc.id}`}
                                                className="w-full text-center bg-[#3a9cb8] text-white border-3 border-black px-4 py-2.5 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2e7d94] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer"
                                            >
                                                Inspeccionar
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-20 bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    <p className="text-5xl mb-3">🍩</p>
                                    <p className="text-2xl font-black text-black font-simpson-title">¡D'oh! No hay resultados</p>
                                    <p className="text-gray-600 font-bold mt-1 text-sm">Intenta cambiar de página o restablece los filtros.</p>
                                </div>
                            )}
                        </div>

                        {/* Paginación */}
                        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 mb-8 px-4">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1 || isPending}
                                className="bg-[#fed90f] border-3 border-black px-5 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                ⬅️ Anterior
                            </button>

                            <span className="bg-white border-3 border-black px-5 py-3 rounded-2xl font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                Página {currentPage} de {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages || isPending}
                                className="bg-[#fed90f] border-3 border-black px-5 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Siguiente ➡️
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Botón flotante del minijuego */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => {
                        setShowMinigame(!showMinigame);
                        if (!showMinigame) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    className="bg-[#fed90f] text-black border-4 border-black p-4 rounded-full font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-2xl cursor-pointer group"
                    title="¡Minijuego de Donas!"
                >
                    🍩
                </button>
            </div>
        </div>
    );
}

export default function LocationsPage() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-[#72bcd5] flex items-center justify-center"><p className="font-simpson-title text-2xl text-black font-black">Cargando locaciones de Springfield... 🍩</p></div>}>
            <LocationsContent />
        </Suspense>
    );
}