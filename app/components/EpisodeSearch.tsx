"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { Episode } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type SortOption = "episode-asc" | "episode-desc" | "date-new" | "date-old" | "title-asc";

export default function EpisodeSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search") || "";
    const seasonParam = searchParams.get("season") || "";
    const viewParam = (searchParams.get("view") as "grid" | "list") || "grid";
    const sortParam = (searchParams.get("sort") as SortOption) || "episode-asc";

    const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(39);
    const [searchTerm, setSearchTerm] = useState(searchParam);
    const [selectedSeason, setSelectedSeason] = useState(seasonParam);
    const [viewMode, setViewMode] = useState<"grid" | "list">(viewParam);
    const [sortBy, setSortBy] = useState<SortOption>(sortParam);
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Sincronizar parámetros con la URL
    useEffect(() => {
        const currentParam = searchParams.get("page");
        const pageNumber = currentParam ? parseInt(currentParam, 10) : 1;
        if (!isNaN(pageNumber) && pageNumber !== currentPage) setCurrentPage(pageNumber);

        const currentSearch = searchParams.get("search") || "";
        if (currentSearch !== searchTerm) setSearchTerm(currentSearch);

        const currentSeason = searchParams.get("season") || "";
        if (currentSeason !== selectedSeason) setSelectedSeason(currentSeason);

        const currentView = (searchParams.get("view") as "grid" | "list") || "grid";
        if (currentView !== viewMode) setViewMode(currentView);

        const currentSort = (searchParams.get("sort") as SortOption) || "episode-asc";
        if (currentSort !== sortBy) setSortBy(currentSort);
    }, [searchParams]);

    // Obtención de datos (Mantiene la carga inteligente para temporadas)
    useEffect(() => {
        async function fetchEpisodes() {
            setLoading(true);
            try {
                if (selectedSeason) {
                    const firstRes = await fetch(`https://thesimpsonsapi.com/api/episodes?page=1`);
                    const firstData = await firstRes.json();
                    const maxPages = firstData.pages || 39;

                    const fetchPromises = [];
                    for (let i = 1; i <= maxPages; i++) {
                        fetchPromises.push(
                            fetch(`https://thesimpsonsapi.com/api/episodes?page=${i}`)
                                .then(res => res.json())
                                .catch(() => ({}))
                        );
                    }

                    const allPagesData = await Promise.all(fetchPromises);
                    let allEpisodes: Episode[] = [];

                    allPagesData.forEach(page => {
                        const items = Array.isArray(page) ? page : page.results || page.data || [];
                        allEpisodes = [...allEpisodes, ...items];
                    });

                    const filteredSeason = allEpisodes.filter(ep => ep.season.toString() === selectedSeason);
                    setEpisodes(filteredSeason);
                    setTotalPages(1);
                } else {
                    let endpoint = `https://thesimpsonsapi.com/api/episodes?page=${currentPage}`;
                    if (searchTerm) {
                        endpoint = `https://thesimpsonsapi.com/api/episodes?search=${encodeURIComponent(searchTerm)}&page=${currentPage}`;
                    }

                    const response = await fetch(endpoint);
                    const data = await response.json();

                    const items = Array.isArray(data) ? data : data.results || data.data || [];
                    setEpisodes(items);
                    if (data.pages) setTotalPages(data.pages);
                }
            } catch (error) {
                console.error("Error al cargar los episodios:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEpisodes();
    }, [currentPage, searchTerm, selectedSeason]);

    // Lógica de Ordenamiento Dinámico de los episodios mostrados
    const sortedEpisodes = useMemo(() => {
        return [...episodes].sort((a, b) => {
            if (sortBy === "episode-asc") {
                return (a.season * 100 + a.episode_number) - (b.season * 100 + b.episode_number);
            }
            if (sortBy === "episode-desc") {
                return (b.season * 100 + b.episode_number) - (a.season * 100 + a.episode_number);
            }
            if (sortBy === "date-new") {
                return new Date(b.airdate).getTime() - new Date(a.airdate).getTime();
            }
            if (sortBy === "date-old") {
                return new Date(a.airdate).getTime() - new Date(b.airdate).getTime();
            }
            if (sortBy === "title-asc") {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
    }, [episodes, sortBy]);

    // Estadísticas automáticas para la temporada seleccionada
    const seasonStats = useMemo(() => {
        if (!selectedSeason || episodes.length === 0) return null;
        const total = episodes.length;
        const dates = episodes.map(ep => new Date(ep.airdate).getFullYear()).filter(y => !isNaN(y));
        const firstYear = dates.length > 0 ? Math.min(...dates) : "N/A";
        const lastYear = dates.length > 0 ? Math.max(...dates) : "N/A";
        return { total, firstYear, lastYear };
    }, [selectedSeason, episodes]);

    const updateUrlParams = (updates: { page?: number; search?: string; season?: string; view?: "grid" | "list"; sort?: SortOption }) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());

            const newPage = updates.page !== undefined ? updates.page : currentPage;
            const newSearch = updates.search !== undefined ? updates.search : searchTerm;
            const newSeason = updates.season !== undefined ? updates.season : selectedSeason;
            const newView = updates.view !== undefined ? updates.view : viewMode;
            const newSort = updates.sort !== undefined ? updates.sort : sortBy;

            if (newPage <= 1 || newSeason) params.delete("page");
            else params.set("page", newPage.toString());

            if (newSearch) params.set("search", newSearch);
            else params.delete("search");

            if (newSeason) params.set("season", newSeason);
            else params.delete("season");

            if (newView === "grid") params.delete("view");
            else params.set("view", newView);

            if (newSort === "episode-asc") params.delete("sort");
            else params.set("sort", newSort);

            router.push(`/episodes?${params.toString()}`, { scroll: false });
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        updateUrlParams({ page: newPage });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedSeason("");
        setCurrentPage(1);
        updateUrlParams({ search: value, season: "", page: 1 });
    };

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedSeason(value);
        setSearchTerm("");
        setCurrentPage(1);
        updateUrlParams({ season: value, search: "", page: 1 });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortOption;
        setSortBy(value);
        updateUrlParams({ sort: value });
    };

    const handleViewChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        updateUrlParams({ view: mode });
    };

    const handleRandomEpisode = () => {
        const randomId = Math.floor(Math.random() * 768) + 1;
        router.push(`/episodes/${randomId}`);
    };

    const seasons = Array.from({ length: 39 }, (_, i) => i + 1);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="w-full">
            {/* Barra de Filtros y Ordenamiento */}
            <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">

                {/* Buscador */}
                <div className="w-full lg:w-3/12 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-lg">🔍</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar por título..."
                        className="w-full pl-11 pr-4 py-2.5 bg-yellow-50/50 border-3 border-black rounded-xl font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-simpsonBlue text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                </div>

                {/* Filtro por Temporada */}
                <div className="w-full lg:w-2/12 flex items-center gap-2">
                    <label htmlFor="seasonSelect" className="font-black text-xs uppercase text-black whitespace-nowrap">Temp:</label>
                    <select
                        id="seasonSelect"
                        value={selectedSeason}
                        onChange={handleSeasonChange}
                        className="w-full bg-yellow-50/50 border-3 border-black px-3 py-2.5 rounded-xl font-bold text-black text-sm focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                        <option value="">Todas</option>
                        {seasons.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Ordenamiento Dinámico */}
                <div className="w-full lg:w-3/12 flex items-center gap-2">
                    <label htmlFor="sortSelect" className="font-black text-xs uppercase text-black whitespace-nowrap">Ordenar:</label>
                    <select
                        id="sortSelect"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="w-full bg-yellow-50/50 border-3 border-black px-3 py-2.5 rounded-xl font-bold text-black text-sm focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                        <option value="episode-asc">Nº Episodio (Asc)</option>
                        <option value="episode-desc">Nº Episodio (Desc)</option>
                        <option value="date-new">Estreno: Más reciente</option>
                        <option value="date-old">Estreno: Más antiguo</option>
                        <option value="title-asc">Título (A-Z)</option>
                    </select>
                </div>

                {/* Acciones (Aleatorio y Vistas) */}
                <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-2">
                    <button
                        onClick={handleRandomEpisode}
                        className="bg-simpsonYellow border-3 border-black px-4 py-2.5 rounded-xl font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        title="Ir a un episodio aleatorio"
                    >
                        <span>🎲</span>
                        <span>Aleatorio</span>
                    </button>

                    <div className="flex bg-gray-100 border-3 border-black rounded-xl p-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <button
                            onClick={() => handleViewChange("grid")}
                            className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${viewMode === "grid" ? "bg-simpsonBlue text-white border-2 border-black" : "text-black hover:bg-gray-200"
                                }`}
                        >
                            🖼️
                        </button>
                        <button
                            onClick={() => handleViewChange("list")}
                            className={`px-3 py-1.5 rounded-lg font-black text-xs transition-all cursor-pointer ${viewMode === "list" ? "bg-simpsonBlue text-white border-2 border-black" : "text-black hover:bg-gray-200"
                                }`}
                        >
                            📄
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel de Estadísticas de la Temporada (Aparece solo si hay una temporada activa) */}
            {seasonStats && (
                <div className="bg-simpsonYellow border-4 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 flex flex-wrap items-center justify-between gap-4 text-black font-bold">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📊</span>
                        <span>Estadísticas Temporada {selectedSeason}:</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                        <span className="bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            🎬 Total Capítulos: <strong>{seasonStats.total}</strong>
                        </span>
                        <span className="bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            📅 Periodo: <strong>{seasonStats.firstYear} - {seasonStats.lastYear}</strong>
                        </span>
                    </div>
                </div>
            )}

            {/* Contador y Limpiador */}
            <div className="flex flex-wrap items-center justify-between mb-6 px-2">
                <span className="font-black text-white text-sm drop-shadow-[2px_2px_0px_#000]">
                    📺 Mostrando {sortedEpisodes.length} episodios {selectedSeason ? `de la Temporada ${selectedSeason}` : ""}
                </span>
                {(searchTerm || selectedSeason) && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedSeason("");
                            router.push("/episodes", { scroll: false });
                        }}
                        className="bg-[#e53935] text-white font-black text-xs px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#c62828] transition-all cursor-pointer"
                    >
                        Limpiar Filtros ❌
                    </button>
                )}
            </div>

            {loading || isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-75">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border-4 border-black p-4 h-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between">
                            <div className="bg-gray-200 h-36 w-full rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sortedEpisodes.length > 0 ? (
                                sortedEpisodes.map((ep) => {
                                    const imageUrl = ep.image_path ? `https://cdn.thesimpsonsapi.com/500${ep.image_path}` : null;
                                    return (
                                        <div key={ep.id} className="bg-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff9db] hover:border-yellow-400 group">
                                            <div>
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={ep.name} className="h-36 w-full object-cover rounded-lg border-2 border-black mb-3 transition-transform group-hover:scale-105" loading="lazy" />
                                                ) : (
                                                    <div className="h-36 flex items-center justify-center bg-gray-100 w-full mb-3 rounded-lg border-2 border-black border-dashed">
                                                        <span className="text-gray-400 text-sm">Sin imagen</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="bg-simpsonBlue text-white font-black text-xs px-2 py-0.5 rounded border border-black">
                                                        T{ep.season} • E{ep.episode_number}
                                                    </span>
                                                    <span className="text-xs font-bold text-gray-500">{ep.airdate}</span>
                                                </div>
                                                <h2 className="font-bold text-lg text-black line-clamp-1 transition-colors group-hover:text-[#804000] mb-1">{ep.name}</h2>
                                                <p className="text-gray-600 text-xs line-clamp-2 mb-4">{ep.synopsis}</p>
                                            </div>
                                            <Link href={`/episodes/${ep.id}`} className="w-full text-center bg-simpsonYellow border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all text-xs">
                                                Ver Episodio
                                            </Link>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-16 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <p className="text-2xl mb-2">📺</p>
                                    <p className="text-xl font-bold text-black">No se encontraron episodios</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {sortedEpisodes.length > 0 ? (
                                sortedEpisodes.map((ep) => (
                                    <div key={ep.id} className="bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-[#fff9db] transition-all">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <span className="bg-simpsonBlue text-white font-black text-xs px-2.5 py-1 rounded border border-black shrink-0">
                                                T{ep.season} • E{ep.episode_number}
                                            </span>
                                            <div>
                                                <h2 className="font-bold text-base text-black">{ep.name}</h2>
                                                <p className="text-gray-500 text-xs font-bold">{ep.airdate}</p>
                                            </div>
                                        </div>
                                        <Link href={`/episodes/${ep.id}`} className="w-full sm:w-auto text-center bg-simpsonYellow border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all text-xs shrink-0">
                                            Ver Episodio
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <p className="text-xl font-bold text-black">No se encontraron episodios</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paginación */}
                    {!selectedSeason && totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 mb-8 px-4">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1 || isPending}
                                className="bg-simpsonYellow border-3 border-black px-5 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all disabled:opacity-50"
                            >
                                ⬅️ Anterior
                            </button>
                            <span className="bg-white border-3 border-black px-4 py-2 rounded-lg font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages || isPending}
                                className="bg-simpsonYellow border-3 border-black px-5 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all disabled:opacity-50"
                            >
                                Siguiente ➡️
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}