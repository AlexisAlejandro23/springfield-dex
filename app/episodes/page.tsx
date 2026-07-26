"use client";

import EpisodeSearch from "@/app/components/EpisodeSearch";
import EpisodeTriviaGame from "@/app/components/EpisodeTriviaGame";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function EpisodesPage() {
    const [showTrivia, setShowTrivia] = useState(false);

    return (
        <main className="min-h-screen bg-simpsonBlue p-6 md:p-10 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto relative z-10">

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="inline-block bg-simpsonYellow font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition"
                    >
                        ← Volver al Inicio
                    </Link>

                    <button
                        onClick={() => setShowTrivia(!showTrivia)}
                        className="bg-[#ff6b6b] text-white border-4 border-black px-4 py-2 rounded-2xl font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] transition-all flex items-center gap-2 cursor-pointer"
                    >
                        📺 {showTrivia ? "Ocultar Trivia" : "¡Jugar Trivia de Episodios!"}
                    </button>
                </div>

                <h1 className="font-simpsons text-5xl md:text-6xl text-simpsonYellow text-center mb-8 drop-shadow-[3px_3px_0px_#000]">
                    Episodios de Springfield
                </h1>

                {showTrivia && (
                    <div className="transition-all duration-300 animate-fade-in">
                        <EpisodeTriviaGame />
                    </div>
                )}

                <Suspense fallback={
                    <div className="text-center text-white font-bold text-xl py-12 flex flex-col items-center justify-center gap-3">
                        <div className="text-4xl animate-spin">📺</div>
                        <p className="drop-shadow-[2px_2px_0px_#000]">Cargando episodios en la television...</p>
                    </div>
                }>
                    <EpisodeSearch />
                </Suspense>
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => {
                        setShowTrivia(!showTrivia);
                        if (!showTrivia) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    className="bg-simpsonYellow text-black border-4 border-black p-4 rounded-full font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-2xl cursor-pointer group"
                    title="¡Trivia de Episodios!"
                >
                    📺
                    <span className="absolute right-full mr-3 bg-white border-2 border-black px-3 py-1 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {showTrivia ? "Cerrar Trivia" : "¡Trivia de Episodios! 🎮"}
                    </span>
                </button>
            </div>
        </main>
    );
}