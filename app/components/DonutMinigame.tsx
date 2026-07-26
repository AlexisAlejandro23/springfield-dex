"use client";

import { useState, useEffect } from "react";

interface DonutItem {
    id: number;
    x: number;
    y: number;
    type: "donut" | "nuclear" | "beer";
    speed: number;
}

export default function DonutMinigame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(25);
    const [items, setItems] = useState<DonutItem[]>([]);
    const [message, setMessage] = useState("¡Atrapa todas las donas antes de que Homero se enoje!");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Cargar el récord guardado al iniciar
    useEffect(() => {
        const savedHighScore = localStorage.getItem("springfield_donut_highscore");
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore, 10));
        }
    }, []);

    // Lógica del temporizador y aparición de objetos
    useEffect(() => {
        if (!isPlaying) return;

        // Temporizador principal del juego
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsPlaying(false);
                    checkHighScore();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Generador aleatorio de elementos cayendo por la pantalla
        const spawner = setInterval(() => {
            setItems((prevItems) => {
                if (prevItems.length > 10) return prevItems;

                const rand = Math.random();
                let type: "donut" | "nuclear" | "beer" = "donut";
                if (rand > 0.75) type = "nuclear"; // 25% de probabilidad de trampa
                else if (rand > 0.6) type = "beer";  // 15% cerveza (puntos extra)

                const newItem: DonutItem = {
                    id: Date.now() + Math.random(),
                    x: Math.floor(Math.random() * 80) + 10, // posición horizontal segura dentro de la TV
                    y: -10, // empieza arriba
                    type,
                    speed: Math.random() * 1.5 + 1.2,
                };

                return [...prevItems, newItem];
            });
        }, 600);

        // Bucle de movimiento de los objetos hacia abajo
        const mover = setInterval(() => {
            setItems((prevItems) =>
                prevItems
                    .map((item) => ({ ...item, y: item.y + item.speed }))
                    .filter((item) => item.y < 95)
            );
        }, 50);

        return () => {
            clearInterval(timer);
            clearInterval(spawner);
            clearInterval(mover);
        };
    }, [isPlaying]);

    const startGame = () => {
        // Animación cinemática al iniciar/reiniciar (Efecto sintonización de TV antigua)
        setIsTransitioning(true);
        setTimeout(() => {
            setScore(0);
            setTimeLeft(25);
            setItems([]);
            setIsPlaying(true);
            setMessage("¡Corre, Homero tiene hambre!");
            setIsTransitioning(false);
        }, 400);
    };

    const handleItemClick = (item: DonutItem) => {
        if (!isPlaying) return;

        if (item.type === "donut") {
            setScore((s) => s + 10);
            setMessage("¡Mmmm... rosquillas! (+10)");
        } else if (item.type === "beer") {
            setScore((s) => s + 25);
            setMessage("¡Cerveza Duff! ¡Gloria bendita! (+25)");
        } else if (item.type === "nuclear") {
            setScore((s) => Math.max(0, s - 20));
            setMessage("¡D'oh! ¡Tocaste residuo radioactivo! (-20)");
        }

        setItems((prev) => prev.filter((i) => i.id !== item.id));
    };

    const checkHighScore = () => {
        setScore((currentScore) => {
            if (currentScore > highScore) {
                setHighScore(currentScore);
                localStorage.setItem("springfield_donut_highscore", currentScore.toString());
                setMessage("🏆 ¡Nuevo Récord Absoluto de Springfield!");
            } else {
                setMessage(`⏰ ¡Tiempo agotado! Puntuación final: ${currentScore}`);
            }
            return currentScore;
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-8 font-sans">

            {/* ENVOLTORIO EXTERNO DE LA TV CLÁSICA */}
            <div className="bg-[#b5651d] border-6 border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

                {/* Antena decorativa superior */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-12 bg-black"></div>
                    <div className="absolute top-2 left-6 w-3 h-3 bg-black rounded-full"></div>
                    <div className="absolute top-2 right-6 w-3 h-3 bg-black rounded-full"></div>
                    <div className="absolute top-3 left-8 w-16 h-1.5 bg-black rotate-[-35deg] origin-left"></div>
                    <div className="absolute top-3 right-8 w-16 h-1.5 bg-black rotate-[35deg] origin-right"></div>
                </div>

                {/* Panel de Control Principal de la TV */}
                <div className="bg-[#d4a373] border-4 border-black rounded-3xl p-4 shadow-[inset_0_4px_0_0_rgba(255,255,255,0.3)] relative flex flex-col md:flex-row gap-6 items-center">

                    {/* PANTALLA DE LA TELEVISIÓN */}
                    <div className="w-full flex-1">

                        {/* Cabecera integrada en la carcasa */}
                        <div className="flex items-center justify-between gap-2 mb-3 bg-[#fff3b0] border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <div>
                                <span className="bg-[#fed90f] border-2 border-black text-black px-2 py-0.5 rounded-full text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    Arcade 🎮
                                </span>
                                <h2 className="font-simpson-title text-xl text-[#e53935] uppercase tracking-wide mt-1">
                                    Lluvia de Donas
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-white border-2 border-black px-2 py-1 rounded-xl text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-[9px] font-black block text-gray-500 uppercase">Récord</span>
                                    <span className="font-black text-xs text-black">{highScore}</span>
                                </div>
                                <div className="bg-white border-2 border-black px-2 py-1 rounded-xl text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-[9px] font-black block text-gray-500 uppercase">Puntos</span>
                                    <span className="font-black text-xs text-[#e53935]">{score}</span>
                                </div>
                                <div className="bg-[#e53935] text-white border-2 border-black px-2 py-1 rounded-xl text-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="text-[9px] font-black block uppercase">Tiempo</span>
                                    <span className="font-black text-xs">{timeLeft}s</span>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de estado */}
                        <div className="bg-white border-2 border-black px-3 py-1.5 rounded-xl text-center mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <p className="font-extrabold text-black text-xs">{message}</p>
                        </div>

                        {/* Lienzo del juego con efecto CRT de TV antigua y transición cinemática */}
                        <div className={`w-full h-72 sm:h-80 bg-sky-300 border-4 border-black rounded-2xl relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] cursor-crosshair transition-all duration-400 ${isTransitioning ? "scale-95 blur-xs filter brightness-150 contrast-200" : "scale-100 blur-none"}`}>

                            {/* Líneas de escaneo CRT decorativas */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] z-10 opacity-60" />

                            {/* Fondo de nubes estilo clásico */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(white_15%,transparent_16%)] bg-[size:30px_30px]" />

                            {!isPlaying && timeLeft === 25 && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                                    <p className="font-simpson-title text-2xl text-[#fed90f] mb-2 drop-shadow-[2px_2px_0px_#000]">
                                        ¿LISTO PARA ATRASAR EL HAMBRE?
                                    </p>
                                    <p className="text-white font-bold text-xs max-w-xs mb-4">
                                        Haz clic en 🍩 <span className="text-yellow-300">Donas</span> y 🍺 <span className="text-yellow-300">Duff</span>. ¡Cuidado con los ☢️ <span className="text-red-400">residuos</span>!
                                    </p>
                                    <button
                                        onClick={startGame}
                                        className="bg-[#fed90f] text-black border-4 border-black px-5 py-2.5 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        ¡Comenzar a Jugar! 🚀
                                    </button>
                                </div>
                            )}

                            {!isPlaying && timeLeft === 0 && (
                                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                                    <p className="font-simpson-title text-2xl text-[#fed90f] mb-1">
                                        ¡FIN DEL JUEGO!
                                    </p>
                                    <p className="text-white font-black text-base mb-1">
                                        Conseguiste {score} puntos
                                    </p>
                                    <p className="text-yellow-300 font-extrabold text-[11px] mb-4">
                                        {score >= highScore && score > 0 ? "🌟 ¡Nuevo récord histórico!" : "¡Sigue practicando!"}
                                    </p>
                                    <button
                                        onClick={startGame}
                                        className="bg-[#fed90f] text-black border-4 border-black px-5 py-2.5 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:scale-105 active:translate-y-0.5 transition-all cursor-pointer"
                                    >
                                        Jugar de Nuevo 🔄
                                    </button>
                                </div>
                            )}

                            {/* Objetos cayendo dentro de la pantalla */}
                            {isPlaying &&
                                items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleItemClick(item)}
                                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                                        className="absolute text-3xl transition-transform hover:scale-125 active:scale-95 cursor-pointer select-none drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] focus:outline-none z-0"
                                    >
                                        {item.type === "donut" && "🍩"}
                                        {item.type === "beer" && "🍺"}
                                        {item.type === "nuclear" && "☢️"}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* PANEL LATERAL DE LA TV (Botones de canal / Perillas icónicas) */}
                    <div className="w-full md:w-24 flex md:flex-col justify-around items-center bg-[#bc6c25] border-3 border-black p-4 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] gap-4">

                        {/* Perilla superior grande (Canales) */}
                        <div className="w-12 h-12 bg-black rounded-full border-4 border-[#82572e] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] relative rotate-45">
                            <div className="w-1.5 h-6 bg-white absolute top-0.5 rounded-full"></div>
                        </div>

                        {/* Altavoz de la TV (Líneas decorativas) */}
                        <div className="flex flex-col gap-1.5 w-full px-2">
                            <div className="h-1 bg-black rounded-full w-full"></div>
                            <div className="h-1 bg-black rounded-full w-full"></div>
                            <div className="h-1 bg-black rounded-full w-full"></div>
                            <div className="h-1 bg-black rounded-full w-full"></div>
                        </div>

                        {/* Perilla inferior (Volumen) */}
                        <div className="w-10 h-10 bg-black rounded-full border-4 border-[#82572e] flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] relative">
                            <div className="w-1.5 h-4 bg-white absolute top-1 rounded-full"></div>
                        </div>

                    </div>

                </div>

                {/* Patas de la TV abajo */}
                <div className="absolute -bottom-5 left-8 w-6 h-6 bg-black rounded-b-full border-2 border-[#5c3a21]"></div>
                <div className="absolute -bottom-5 right-8 w-6 h-6 bg-black rounded-b-full border-2 border-[#5c3a21]"></div>

            </div>
        </div>
    );
}