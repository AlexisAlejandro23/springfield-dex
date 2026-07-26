"use client";

import { useState, useEffect } from "react";

interface NuclearButtonProps {
    onStateChange?: (isAlertActive: boolean) => void;
}

export default function NuclearButton({ onStateChange }: NuclearButtonProps) {
    const [nuclearAlert, setNuclearAlert] = useState(false);
    const [selfDestructActive, setSelfDestructActive] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // Manejo de la cuenta regresiva de autodestrucción
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (selfDestructActive && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && selfDestructActive) {
            setSelfDestructActive(false);
            setCountdown(10);
            setNuclearAlert(false);
            if (onStateChange) onStateChange(false);
        }
        return () => clearTimeout(timer);
    }, [selfDestructActive, countdown, onStateChange]);

    const handlePlantButton = () => {
        if (!selfDestructActive) {
            setSelfDestructActive(true);
            setCountdown(10);
            setNuclearAlert(true);
            if (onStateChange) onStateChange(true);
        } else {
            setSelfDestructActive(false);
            setNuclearAlert(false);
            setCountdown(10);
            if (onStateChange) onStateChange(false);
        }
    };

    return (
        <>
            {/* Pantalla especial de Autodestrucción Estilo Consola */}
            {selfDestructActive && (
                <div className="fixed inset-0 z-50 bg-red-950/90 flex flex-col items-center justify-center p-4 sm:p-6 text-center backdrop-blur-md overflow-y-auto">
                    {/* Cambiado a max-w-xl para dar más espacio horizontal */}
                    <div className="bg-[#b91c1c] border-4 sm:border-6 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full animate-bounce my-auto">
                        <span className="text-4xl sm:text-5xl">🚨☢️🚨</span>

                        {/* Ajuste de tamaño y saltos de línea para que quepa perfecto */}
                        <h2 className="font-simpson-title text-2xl sm:text-4xl text-yellow-300 mt-4 tracking-wider leading-snug">
                            ¡AUTODESTRUCCIÓN DE LA PLANTA!
                        </h2>

                        <p className="text-white font-black text-sm sm:text-lg mt-2">
                            SECTOR 7G EN SECUENCIA CRÍTICA
                        </p>

                        <div className="my-6 bg-black border-4 border-yellow-400 py-3 sm:py-4 rounded-2xl">
                            <span className="text-white text-xs uppercase tracking-widest block font-bold">Tiempo restante:</span>
                            <span className="font-simpson-title text-5xl sm:text-6xl text-red-500 tracking-widest">00:{countdown < 10 ? `0${countdown}` : countdown}</span>
                        </div>

                        <p className="text-yellow-200 text-xs font-bold mb-6 italic px-2">
                            "¡Te dije que no presionaras el maldito botón, Homero!"
                        </p>

                        <button
                            onClick={handlePlantButton}
                            className="bg-yellow-400 text-black border-3 border-black px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-y-1 transition cursor-pointer w-full"
                        >
                            🛑 CANCELAR EMERGENCIA (OPRESOR COMPRENSIVO)
                        </button>
                    </div>
                </div>
            )}

            {/* Botón Icónico "PLANT DESTRUCT / PLEASE DO NOT PUSH" */}
            <button
                onClick={handlePlantButton}
                className="relative bg-[#e53935] hover:bg-red-700 border-3 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-center cursor-pointer group"
                title="PLEASE DO NOT PUSH"
            >
                <span className="text-[9px] font-black tracking-tighter text-black bg-white/80 px-1 rounded border border-black mb-0.5 group-hover:bg-yellow-300">
                    PLANT DESTRUCT
                </span>
                <div className="w-7 h-7 rounded-full bg-red-600 border-2 border-black shadow-inner flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 opacity-70"></div>
                </div>
                <span className="text-[8px] font-bold text-white uppercase tracking-tight mt-0.5">
                    NO PRESS
                </span>
            </button>
        </>
    );
}