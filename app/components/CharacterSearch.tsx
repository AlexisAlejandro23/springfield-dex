"use client";

import { useState, useEffect, useTransition } from "react";
import { Character } from "@/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Opciones de Estado y Género
const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "Alive", label: "Vivo 🟢" },
    { value: "Deceased", label: "Fallecido ⚰️" },
];

const genderOptions = [
    { value: "all", label: "Todos" },
    { value: "Male", label: "Masculino 👨" },
    { value: "Female", label: "Femenino 👩" },
];

// Listado completo de Familias de Springfield
const familyOptions = [
    { value: "all", label: "👥 Todas las familias" },
    { value: "familia", label: "👨‍👩‍👧‍👦 Familia Simpson" },
    { value: "flanders", label: "😇 Familia Flanders" },
    { value: "vanhouten", label: "👓 Familia Van Houten" },
    { value: "wiggum", label: "🍩 Familia Wiggum (Gorgori)" },
    { value: "bouvier", label: "👵 Hermanas Bouvier" },
    { value: "terwilliger", label: "🎭 Los Terwilliger (Secuaz Bob)" },
    { value: "cletus", label: "🌾 Familia Spuckler (Cletus)" },
    { value: "hibbert", label: "🩺 Familia Hibbert" },
    { value: "nahasapeemapetilon", label: "🏪 Familia Nahasapeemapetilon (Apu)" },
    { value: "muntz", label: "👊 Familia Muntz (Nelson)" },
    { value: "lovejoy", label: "⛪ Familia Lovejoy (Reverendo)" },
    { value: "skinner", label: "🏫 Familia Skinner (Agnes y Principal)" },
    { value: "burns", label: "☢️ Familia Burns" },
    { value: "powell", label: "💼 Familia Powell (Herb)" },
    { value: "krustofsky", label: "🤡 Familia Krustofsky (Krusty)" },
    { value: "quimby", label: "🏛️ Familia Quimby (Alcalde)" },
    { value: "szyslak", label: "🍺 Familia Szyslak (Moe)" },
    { value: "albertson", label: "🧪 Familia Albertson (Hombre de los Cómics)" },
    { value: "jailbird", label: "🦹 Serpiente y Familia Jailbird" },
];

// Listado completo de Lugares y Establecimientos de Springfield
const locationOptions = [
    { value: "all", label: "🏡 Todos los lugares" },
    { value: "moe", label: "🍺 Taberna de Moe" },
    { value: "escuela", label: "🏫 Escuela Primaria de Springfield" },
    { value: "planta", label: "☢️ Planta Nuclear" },
    { value: "kwik", label: "🏪 Badulaque (Kwik-E-Mart)" },
    { value: "android", label: "🧪 Tienda de Cómics (Android's Dungeon)" },
    { value: "asilo", label: "🧓 Asilo de Springfield" },
    { value: "burns", label: "🏰 Mansión Burns" },
    { value: "hospital", label: "🏥 Hospital General de Springfield" },
    { value: "iglesia", label: "⛪ Iglesia de Springfield" },
    { value: "canival", label: "🐕 Canódromo / Springfield Downs" },
    { value: "ayuntamiento", label: "🏛️ Ayuntamiento de Springfield" },
    { value: "patrulla", label: "🚓 Departamento de Policía" },
    { value: "azteca", label: "🌮 Teatro / Canal 6 / Estudios Krusty" },
    { value: "bolera", label: "🎳 Bolera de Barney" },
    { value: "fijacion", label: "🛒 Minisuper / Centro Comercial" },
];

// Componente auxiliar para Estado y Género
const FilterGroup = ({ options, selectedValue, onChange, label }: any) => (
    <div className="w-full bg-white p-3 rounded-xl border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-xs font-black text-black uppercase tracking-wider mb-2.5 border-b border-black pb-1.5">
            {label}
        </div>
        <div className="flex flex-wrap gap-2">
            {options.map((option: any) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border-2 border-black transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${selectedValue === option.value
                        ? "bg-simpsonYellow text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

export default function CharacterSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageParam = searchParams.get("page");
    const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

    const [allCharacters, setAllCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(60);
    const [loading, setLoading] = useState(false);
    const [loadingAll, setLoadingAll] = useState(true);
    const [isPending, startTransition] = useTransition();

    // Estados de filtros
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedGender, setSelectedGender] = useState<string>("all");
    const [selectedFamily, setSelectedFamily] = useState<string>("all");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");

    // Control de pestaña desplegable activa
    const [activeTab, setActiveTab] = useState<"families" | "locations" | "more" | null>(null);

    // Sincronizar página con URL
    useEffect(() => {
        if (pageParam) {
            const pageNumber = parseInt(pageParam, 10);
            if (!isNaN(pageNumber) && pageNumber !== currentPage) {
                setCurrentPage(pageNumber);
            }
        } else {
            setCurrentPage(1);
        }
    }, [pageParam]);

    // 1. CARGAR TODOS LOS PERSONAJES
    useEffect(() => {
        async function fetchAllCharacters() {
            setLoadingAll(true);
            try {
                const res1 = await fetch(`https://thesimpsonsapi.com/api/characters?page=1`);
                const data1 = await res1.json();

                const firstPageItems = Array.isArray(data1) ? data1 : data1.results || data1.data || [];
                const pagesCount = data1.pages || 60;
                setTotalPages(pagesCount);

                let accumulatedCharacters = [...firstPageItems];

                const promises = [];
                for (let p = 2; p <= pagesCount; p++) {
                    promises.push(
                        fetch(`https://thesimpsonsapi.com/api/characters?page=${p}`)
                            .then((res) => res.json())
                            .then((data) => Array.isArray(data) ? data : data.results || data.data || [])
                            .catch(() => [])
                    );
                }

                const remainingPagesResults = await Promise.all(promises);
                remainingPagesResults.forEach((pageItems) => {
                    accumulatedCharacters = [...accumulatedCharacters, ...pageItems];
                });

                setAllCharacters(accumulatedCharacters);
            } catch (error) {
                console.error("Error al cargar todos los personajes:", error);
            } finally {
                setLoadingAll(false);
            }
        }

        fetchAllCharacters();
    }, []);

    // 2. OBTENER PÁGINA ACTUAL
    const [pageCharacters, setPageCharacters] = useState<Character[]>([]);
    useEffect(() => {
        async function fetchPage() {
            setLoading(true);
            try {
                const response = await fetch(`https://thesimpsonsapi.com/api/characters?page=${currentPage}`);
                const data = await response.json();
                const items = Array.isArray(data) ? data : data.results || data.data || [];
                setPageCharacters(items);
            } catch (error) {
                console.error("Error al cargar la página:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            setCurrentPage(newPage);
            router.push(`/characters?page=${newPage}`, { scroll: false });
        });
    };

    // LÓGICA DE FILTRADO
    const isFilteringActive = searchQuery.trim() !== "" || selectedStatus !== "all" || selectedGender !== "all" || selectedFamily !== "all" || selectedLocation !== "all";

    const sourceList = isFilteringActive ? allCharacters : pageCharacters;

    const charactersToDisplay = sourceList.filter(char => {
        const matchesQuery = searchQuery.trim() === "" || (char.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === "all" || (char.status || "").toLowerCase() === selectedStatus.toLowerCase();
        const matchesGender = selectedGender === "all" || (char.gender || "").toLowerCase() === selectedGender.toLowerCase();

        // Texto seguro para buscar en las propiedades del personaje
        const textToCheck = `${char.name || ""} ${char.occupation || ""} ${(char as any).about || ""} ${(char as any).description || ""}`.toLowerCase();

        // Filtro ampliado por Familias
        let matchesFamily = true;
        if (selectedFamily !== "all") {
            if (selectedFamily === "familia") {
                const simpsonNames = ["homer", "homero", "marge", "bart", "lisa", "maggie", "abraham", "grampa", "mona", "patty", "selma", "snow ball", "ayudante de santa"];
                matchesFamily = simpsonNames.some(name => textToCheck.includes(name));
            } else if (selectedFamily === "flanders") {
                matchesFamily = textToCheck.includes("flanders") || textToCheck.includes("ned") || textToCheck.includes("maude") || textToCheck.includes("rod") || textToCheck.includes("todd");
            } else if (selectedFamily === "vanhouten") {
                matchesFamily = textToCheck.includes("van houten") || textToCheck.includes("milhouse") || textToCheck.includes("kirk") || textToCheck.includes("luann");
            } else if (selectedFamily === "wiggum") {
                matchesFamily = textToCheck.includes("wiggum") || textToCheck.includes("gorgori") || textToCheck.includes("clancy") || textToCheck.includes("ralph");
            } else if (selectedFamily === "bouvier") {
                matchesFamily = textToCheck.includes("bouvier") || textToCheck.includes("patty") || textToCheck.includes("selma") || textToCheck.includes("jacqueline");
            } else if (selectedFamily === "terwilliger") {
                matchesFamily = textToCheck.includes("terwilliger") || textToCheck.includes("sideshow bob") || textToCheck.includes("secuaz bob") || textToCheck.includes("cecil");
            } else if (selectedFamily === "cletus") {
                matchesFamily = textToCheck.includes("cletus") || textToCheck.includes("spuckler") || textToCheck.includes("brandine");
            } else if (selectedFamily === "hibbert") {
                matchesFamily = textToCheck.includes("hibbert") || textToCheck.includes("bernice");
            } else if (selectedFamily === "nahasapeemapetilon") {
                matchesFamily = textToCheck.includes("nahasapeemapetilon") || textToCheck.includes("apu") || textToCheck.includes("sanjay") || textToCheck.includes("manjula");
            } else if (selectedFamily === "muntz") {
                matchesFamily = textToCheck.includes("muntz") || textToCheck.includes("nelson");
            } else if (selectedFamily === "lovejoy") {
                matchesFamily = textToCheck.includes("lovejoy") || textToCheck.includes("reverendo") || textToCheck.includes("helen") || textToCheck.includes("jessica");
            } else if (selectedFamily === "skinner") {
                matchesFamily = textToCheck.includes("skinner") || textToCheck.includes("agnes");
            } else if (selectedFamily === "burns") {
                matchesFamily = textToCheck.includes("montgomery burns") || textToCheck.includes("larry burns");
            } else if (selectedFamily === "powell") {
                matchesFamily = textToCheck.includes("powell") || textToCheck.includes("herb powell");
            } else if (selectedFamily === "krustofsky") {
                matchesFamily = textToCheck.includes("krustofsky") || textToCheck.includes("krusty");
            } else if (selectedFamily === "quimby") {
                matchesFamily = textToCheck.includes("quimby") || textToCheck.includes("alcalde");
            } else if (selectedFamily === "szyslak") {
                matchesFamily = textToCheck.includes("szyslak") || textToCheck.includes("moe");
            } else if (selectedFamily === "albertson") {
                matchesFamily = textToCheck.includes("albertson") || textToCheck.includes("comic book guy");
            } else if (selectedFamily === "jailbird") {
                matchesFamily = textToCheck.includes("jailbird") || textToCheck.includes("serpiente") || textToCheck.includes("snake");
            }
        }

        // Filtro ampliado por Lugares
        let matchesLocation = true;
        if (selectedLocation !== "all") {
            if (selectedLocation === "moe") {
                matchesLocation = textToCheck.includes("moe") || textToCheck.includes("bar de moe") || textToCheck.includes("moe's") || textToCheck.includes("barman");
            } else if (selectedLocation === "escuela") {
                matchesLocation = textToCheck.includes("escuela") || textToCheck.includes("school") || textToCheck.includes("springfield elementary") || textToCheck.includes("director") || textToCheck.includes("profesor") || textToCheck.includes("teacher");
            } else if (selectedLocation === "planta") {
                matchesLocation = textToCheck.includes("planta") || textToCheck.includes("nuclear") || textToCheck.includes("burns") || textToCheck.includes("smithers") || textToCheck.includes("sector 7g");
            } else if (selectedLocation === "kwik") {
                matchesLocation = textToCheck.includes("kwik") || textToCheck.includes("apu") || textToCheck.includes("minisuper") || textToCheck.includes("badulaque") || textToCheck.includes("squishee");
            } else if (selectedLocation === "android") {
                matchesLocation = textToCheck.includes("android") || textToCheck.includes("comic book guy") || textToCheck.includes("jeff albertson") || textToCheck.includes("comics");
            } else if (selectedLocation === "asilo") {
                matchesLocation = textToCheck.includes("asilo") || textToCheck.includes("retirement castle") || textToCheck.includes("abuelo") || textToCheck.includes("jasper");
            } else if (selectedLocation === "burns") {
                matchesLocation = textToCheck.includes("mansión") || textToCheck.includes("mansion") || textToCheck.includes("montgomery burns");
            } else if (selectedLocation === "hospital") {
                matchesLocation = textToCheck.includes("hospital") || textToCheck.includes("hibbert") || textToCheck.includes("doctor") || textToCheck.includes("dr. nick");
            } else if (selectedLocation === "iglesia") {
                matchesLocation = textToCheck.includes("iglesia") || textToCheck.includes("church") || textToCheck.includes("reverend") || textToCheck.includes("alegría") || textToCheck.includes("lovejoy");
            } else if (selectedLocation === "canival") {
                matchesLocation = textToCheck.includes("track") || textToCheck.includes("canódromo") || textToCheck.includes("apuestas");
            } else if (selectedLocation === "ayuntamiento") {
                matchesLocation = textToCheck.includes("ayuntamiento") || textToCheck.includes("quimby") || textToCheck.includes("alcalde") || textToCheck.includes("city hall");
            } else if (selectedLocation === "patrulla") {
                matchesLocation = textToCheck.includes("policía") || textToCheck.includes("police") || textToCheck.includes("wiggum") || textToCheck.includes("gorgori") || textToCheck.includes("gorgo");
            } else if (selectedLocation === "azteca") {
                matchesLocation = textToCheck.includes("studio") || textToCheck.includes("estudios") || textToCheck.includes("channel 6") || textToCheck.includes("canal 6") || textToCheck.includes("krusty");
            } else if (selectedLocation === "bolera") {
                matchesLocation = textToCheck.includes("bolera") || textToCheck.includes("bowling") || textToCheck.includes("barney");
            } else if (selectedLocation === "fijacion") {
                matchesLocation = textToCheck.includes("mall") || textToCheck.includes("centro comercial") || textToCheck.includes("comercial");
            }
        }

        return matchesQuery && matchesStatus && matchesGender && matchesFamily && matchesLocation;
    });

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="w-full">
            {/* Barra de búsqueda y Controles Compactos */}
            <div className="flex flex-col items-center mb-10 gap-5">

                {/* Buscador */}
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Busca a Homero, Bart, Moe..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-5 py-4 pr-12 rounded-2xl border-4 border-black bg-white text-black font-extrabold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-simpsonBlue transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black font-black text-2xl cursor-pointer bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            title="Limpiar búsqueda"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* BOTONES DE PESTAÑAS / DESPLEGABLES */}
                <div className="w-full max-w-3xl flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setActiveTab(activeTab === "families" ? null : "families")}
                        className={`px-5 py-3 rounded-xl border-3 border-black font-extrabold text-sm transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-2 ${activeTab === "families" || selectedFamily !== "all"
                            ? "bg-simpsonYellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:bg-gray-100"
                            }`}
                    >
                        <span>👨‍👩‍👧‍👦</span> Familias {selectedFamily !== "all" && " (Activo)"} <span>{activeTab === "families" ? "▲" : "▼"}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab(activeTab === "locations" ? null : "locations")}
                        className={`px-5 py-3 rounded-xl border-3 border-black font-extrabold text-sm transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-2 ${activeTab === "locations" || selectedLocation !== "all"
                            ? "bg-simpsonYellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:bg-gray-100"
                            }`}
                    >
                        <span>📍</span> Lugares {selectedLocation !== "all" && " (Activo)"} <span>{activeTab === "locations" ? "▲" : "▼"}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab(activeTab === "more" ? null : "more")}
                        className={`px-5 py-3 rounded-xl border-3 border-black font-extrabold text-sm transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-2 ${activeTab === "more" || selectedStatus !== "all" || selectedGender !== "all"
                            ? "bg-simpsonYellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:bg-gray-100"
                            }`}
                    >
                        <span>🎛️</span> Estado y Género {(selectedStatus !== "all" || selectedGender !== "all") && " (Activo)"} <span>{activeTab === "more" ? "▲" : "▼"}</span>
                    </button>

                    {isFilteringActive && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedStatus("all");
                                setSelectedGender("all");
                                setSelectedFamily("all");
                                setSelectedLocation("all");
                                setActiveTab(null);
                            }}
                            className="bg-red-400 border-3 border-black px-4 py-3 rounded-xl font-black text-xs text-black hover:bg-red-500 transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-1"
                            title="Limpiar todos los filtros"
                        >
                            🗑️ Limpiar
                        </button>
                    )}
                </div>

                {/* BLOQUE DESPLEGABLE: FAMILIAS */}
                {activeTab === "families" && (
                    <div className="w-full max-w-4xl bg-white p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">👨‍👩‍👧‍👦</span>
                                <h3 className="font-black text-black text-sm uppercase tracking-wider">Selecciona una Familia</h3>
                            </div>
                            <button onClick={() => setActiveTab(null)} className="text-black font-bold hover:bg-gray-200 px-2 py-0.5 rounded cursor-pointer">✕ Cerrar</button>
                        </div>
                        <div className="flex flex-wrap gap-2.5 pt-1 max-h-64 overflow-y-auto pr-2">
                            {familyOptions.map((fam) => (
                                <button
                                    key={fam.value}
                                    onClick={() => setSelectedFamily(fam.value)}
                                    className={`px-4 py-2.5 rounded-xl border-3 border-black font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${selectedFamily === fam.value
                                        ? "bg-simpsonYellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {fam.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* BLOQUE DESPLEGABLE: LUGARES */}
                {activeTab === "locations" && (
                    <div className="w-full max-w-4xl bg-white p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 animate-fade-in">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📍</span>
                                <h3 className="font-black text-black text-sm uppercase tracking-wider">Selecciona un Lugar o Establecimiento</h3>
                            </div>
                            <button onClick={() => setActiveTab(null)} className="text-black font-bold hover:bg-gray-200 px-2 py-0.5 rounded cursor-pointer">✕ Cerrar</button>
                        </div>
                        <div className="flex flex-wrap gap-2.5 pt-1 max-h-64 overflow-y-auto pr-2">
                            {locationOptions.map((loc) => (
                                <button
                                    key={loc.value}
                                    onClick={() => setSelectedLocation(loc.value)}
                                    className={`px-4 py-2.5 rounded-xl border-3 border-black font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${selectedLocation === loc.value
                                        ? "bg-simpsonYellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {loc.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* BLOQUE DESPLEGABLE: ESTADO Y GÉNERO */}
                {activeTab === "more" && (
                    <div className="w-full max-w-4xl bg-white p-5 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 animate-fade-in">
                        <div className="flex justify-between items-center border-b-2 border-black pb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🎛️</span>
                                <h3 className="font-black text-black text-sm uppercase tracking-wider">Filtros de Estado y Género</h3>
                            </div>
                            <button onClick={() => setActiveTab(null)} className="text-black font-bold hover:bg-gray-200 px-2 py-0.5 rounded cursor-pointer">✕ Cerrar</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FilterGroup options={statusOptions} selectedValue={selectedStatus} onChange={setSelectedStatus} label="Estado" />
                            <FilterGroup options={genderOptions} selectedValue={selectedGender} onChange={setSelectedGender} label="Género" />
                        </div>
                    </div>
                )}

                {/* Contador de resultados */}
                {isFilteringActive && !loadingAll && (
                    <div className="bg-simpsonYellow border-3 border-black px-6 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-sm font-black text-black">
                            🍩 Se encontraron {charactersToDisplay.length} habitantes coincidentes
                        </p>
                    </div>
                )}
            </div>

            {/* Skeletons de carga */}
            {loadingAll && isFilteringActive ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border-4 border-black p-4 h-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between">
                            <div className="bg-gray-200 h-44 w-full rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (loading && !isFilteringActive) || isPending ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-70">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border-4 border-black p-4 h-80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse flex flex-col justify-between">
                            <div className="bg-gray-200 h-44 w-full rounded-lg mb-4"></div>
                            <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Cuadrícula de personajes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {charactersToDisplay.length > 0 ? (
                            charactersToDisplay.map((char, index) => {
                                const imageUrl = char.portrait_path
                                    ? `https://cdn.thesimpsonsapi.com/500${char.portrait_path}`
                                    : null;

                                const animationDelay = `${(index % 12) * 0.05}s`;

                                return (
                                    <div
                                        key={char.id}
                                        style={{ animationDelay }}
                                        className="bg-white rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 border-4 border-black flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-[#fff9db] hover:border-yellow-400 hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1),8px_8px_0px_0px_rgba(0,0,0,1)] group animate-fade-in opacity-0 [animation-fill-mode:forwards]"
                                    >
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={char.name}
                                                className="h-48 w-full object-contain mb-4 drop-shadow-md transition-transform group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-48 flex items-center justify-center bg-gray-100 w-full mb-4 rounded border border-dashed border-gray-400">
                                                <span className="text-gray-400 text-sm">Sin imagen</span>
                                            </div>
                                        )}

                                        <div className="text-center w-full">
                                            <h2 className="font-bold text-xl text-black transition-colors group-hover:text-[#804000]">
                                                {char.name}
                                            </h2>
                                            <p className="text-gray-600 text-sm mb-4 transition-colors group-hover:text-[#a15200] line-clamp-1">
                                                {char.occupation || "Habitante de Springfield"}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/characters/${char.id}`}
                                            className="w-full text-center bg-simpsonYellow border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all cursor-pointer"
                                        >
                                            Ver Detalle
                                        </Link>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <p className="text-2xl mb-2">🍩</p>
                                <p className="text-xl font-bold text-black">No se encontró ningún habitante con esos filtros</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedStatus("all");
                                        setSelectedGender("all");
                                        setSelectedFamily("all");
                                        setSelectedLocation("all");
                                        setActiveTab(null);
                                    }}
                                    className="mt-4 bg-simpsonYellow border-2 border-black px-4 py-2 rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer"
                                >
                                    Restablecer filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Controles de Paginación */}
                    {!isFilteringActive && (
                        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 mb-8 px-4">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1 || isPending}
                                className="bg-simpsonYellow border-3 border-black px-5 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all cursor-pointer"
                            >
                                ⬅️ Anterior
                            </button>

                            <span className="bg-white border-3 border-black px-4 py-2 rounded-lg font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                Página {currentPage} de {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages || isPending}
                                className="bg-simpsonYellow border-3 border-black px-5 py-2 rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all cursor-pointer"
                            >
                                Siguiente ➡️
                            </button>

                            <div className="flex items-center gap-2 bg-white border-3 border-black p-1.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                <label htmlFor="pageSelect" className="text-sm font-bold text-black pl-1">
                                    Ir a pág.:
                                </label>
                                <select
                                    id="pageSelect"
                                    value={currentPage}
                                    onChange={(e) => handlePageChange(Number(e.target.value))}
                                    disabled={isPending}
                                    className="bg-simpsonYellow/20 border-2 border-black px-3 py-1 rounded-md font-bold text-black focus:outline-none focus:ring-2 focus:ring-simpsonBlue text-center cursor-pointer"
                                >
                                    {pageNumbers.map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}