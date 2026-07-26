// components/SpringfieldLocationWidget.tsx
"use client";

import { useState } from "react";
import NuclearButton from "@/app/components/NuclearButton";

interface SpringfieldLocationWidgetProps {
    currentLocationId: string;
    onAlertChange: (active: boolean) => void;
}

export default function SpringfieldLocationWidget({
    currentLocationId,
    onAlertChange,
}: SpringfieldLocationWidgetProps) {
    // Lista de canales configurando el Canal 6 correctamente como Canal 6 Noticias
    const simpsonChannels = [
        { title: "CH 6 - Canal 6 Noticias con Kent Brockman", id: "JkMJACXV4_E" },
        { title: "CH 9 - 30 Minutos de Tomy y Daly", id: "A5u5XlRQwWI" },
        { title: "CH 12 - T.V. Laughs At Homer", id: "n4isBMEnAK4" },
        { title: "CH 15 - ¡La TV!, ¡La TV!!", id: "57EvSk4lI70" }
    ];

    const [currentChannelIndex, setCurrentChannelIndex] = useState(-1);

    // Estados para la Taberna de Moe
    const [moeStatus, setMoeStatus] = useState("Ring! Ring! (Esperando llamada bromista...)");
    const [moeCall, setMoeCall] = useState("📞 Bart: '¿Se encuentra alguien con el apellido Caca, de nombre K-K?'");
    const [isCalling, setIsCalling] = useState(false);

    // Estados para el Dispensador de Squishee
    const squisheeFlavors = [
        { name: "Almíbar Puro al 100%", color: "bg-blue-500", effect: "¡Sientes que el tiempo se detiene y escuchas los colores! 🧊🌀" },
        { name: "Jugo de Batería Radiactiva", color: "bg-emerald-400", effect: "¡Tus dientes brillan en la oscuridad y levitas 2 centímetros! ☢️⚡" },
        { name: "Miel de Abeja Silvestre", color: "bg-amber-400", effect: "¡Un millón de abejas te persiguen en tu mente! 🐝🍯" },
        { name: "Sabor Misterio (Indefinido)", color: "bg-fuchsia-500", effect: "¡Sabe a... sabe a quemado! Te da hipo cósmico. 👅🌀" }
    ];

    const [selectedFlavorIndex, setSelectedFlavorIndex] = useState(0);
    const [isPouring, setIsPouring] = useState(false);
    const [pourProgress, setPourProgress] = useState(0);
    const [squisheeMessage, setSquisheeMessage] = useState("Selecciona un sabor y presiona 'Servir Vaso' en la palanca.");

    // Estados del Pizarrón de Bart
    const [bartLines, setBartLines] = useState([
        "No cambiaré el color del fondo sin avisar.",
        "El perro no se comió mi tarea esta vez.",
        "La enciclopedia de Springfield es sagrada."
    ]);
    const [customLine, setCustomLine] = useState("");

    // Estados para Duffman
    const duffmanQuotes = [
        { action: "💥 ¡Duffman rompe la pared de ladrillos!", quote: "¡Duffman nunca muere! ¡Solo los actores que lo interpretan!" },
        { action: "🎉 ¡Duffman aparece haciendo surf sobre una barra de cerveza!", quote: "¡Oh, yeah! ¡La cerveza Duff es la gasolina de tu vida activa!" },
        { action: "🎸 ¡Duffman desciende en paracaídas con capa brillante!", quote: "¡Duffman se levanta de los muertos! ¡A festejar se ha dicho!" },
        { action: "⚡ ¡Duffman posa con los puños en alto frente a un reflector!", quote: "¡El suministro de cerveza Duff está garantizado por la ley de la diversión!" }
    ];

    const [duffState, setDuffState] = useState(duffmanQuotes[0]);
    const [isInvokingDuff, setIsInvokingDuff] = useState(false);
    const [cansThrown, setCansThrown] = useState(6);

    // Estados para la Tienda de Historietas (Comic Book Guy)
    const [comicQuote, setComicQuote] = useState("«Worst. Widget. Ever.» (Peor widget de la historia).");
    const [isCriticizing, setIsCriticizing] = useState(false);

    // Estados para el Asilo de Springfield (Abuelo Simpson)
    const [grandpaStory, setGrandpaStory] = useState("👴 Abuelo: 'Usábamos cebollas en el cinturón, que era la moda en esos días...'");
    const [isRambling, setIsRambling] = useState(false);

    const handleKnobTurn = () => {
        setCurrentChannelIndex((prev) => {
            if (prev === -1) return 0;
            return (prev + 1) % simpsonChannels.length;
        });
    };

    const triggerPrankCall = () => {
        setIsCalling(true);
        setMoeStatus("⚠️ ¡RING! ¡RING! ¡Moe contesta enojado!");

        const prankCalls = [
            {
                call: "📞 Bart: '¿Se encuentra alguien con el apellido Caca, de nombre K-K?'",
                response: "Moe: '¡Escúchame bien, malnacido! ¡Si te atrevo a atrapar te voy a arrancar el corazón con una cuchara!'"
            },
            {
                call: "📞 Bart: '¿Busco a un tal Al Cojol? ¿Hay un Al Cojol aquí?'",
                response: "Moe: '¿Al Cojol? ¡Busco a un tal Al Cojol! ¡Espérense, hay un Al Cojol aquí? ¡Que se calle este infeliz o juro que...'"
            },
            {
                call: "📞 Bart: 'Hola, ¿está Lola Mento por ahí?'",
                response: "Moe: '¿Lola Mento? ¡A ver, que alguien grite si hay una Lola Mento! ¡Te voy a encontrar y te voy a...'"
            }
        ];

        setTimeout(() => {
            const randomJoke = prankCalls[Math.floor(Math.random() * prankCalls.length)];
            setMoeCall(`${randomJoke.call}\n\n💢 ${randomJoke.response}`);
            setIsCalling(false);
            setMoeStatus("☎️ Llamada colgada de un golpe.");
        }, 600);
    };

    const handlePourSquishee = () => {
        if (isPouring) return;
        setIsPouring(true);
        setPourProgress(0);
        setSquisheeMessage(`🚰 Sirviendo Squishee de ${squisheeFlavors[selectedFlavorIndex].name}...`);

        let currentProg = 0;
        const interval = setInterval(() => {
            currentProg += 25;
            setPourProgress(currentProg);
            if (currentProg >= 100) {
                clearInterval(interval);
                setIsPouring(false);
                setSquisheeMessage(`✅ ¡Vaso lleno! ${squisheeFlavors[selectedFlavorIndex].effect}`);
            }
        }, 250);
    };

    const invokeDuffman = () => {
        if (isInvokingDuff) return;
        setIsInvokingDuff(true);

        let counter = 0;
        const interval = setInterval(() => {
            counter++;
            const randomQuote = duffmanQuotes[Math.floor(Math.random() * duffmanQuotes.length)];
            setDuffState(randomQuote);
            setCansThrown(Math.floor(Math.random() * 15) + 5);

            if (counter >= 3) {
                clearInterval(interval);
                setIsInvokingDuff(false);
            }
        }, 200);
    };

    const triggerComicReview = () => {
        if (isCriticizing) return;
        setIsCriticizing(true);
        const reviews = [
            "«Worst. Widget. Ever. Lo estoy viendo en un monitor inferior a 4K.»",
            "«¿De verdad desperdicias tus ciclos de CPU en esto? Patético.»",
            "«¡Sartén con tocino! ¡Esto viola las leyes de la física de DC y Marvel!»",
            "«El código contiene exactamente mil errores tipográficos. Me da vergüenza ajena.»"
        ];
        setTimeout(() => {
            setComicQuote(reviews[Math.floor(Math.random() * reviews.length)]);
            setIsCriticizing(false);
        }, 400);
    };

    const triggerGrandpaStory = () => {
        if (isRambling) return;
        setIsRambling(true);
        const stories = [
            "👴 Abuelo: 'Usábamos cebollas en el cinturón, que era la moda en esos días... No había cebollas blancas, solo amarillas por la guerra.'",
            "👴 Abuelo: 'Le di un amigable saludo a la abeja reina, lo cual era un término común para los zánganos en 1909...'",
            "👴 Abuelo: '¡El presidente era un tal Taft! ¿O era un nabo con sombrero? ¡Ya no recuerdo, pero me gustaba su estilo!'",
            "👴 Abuelo: '¡Desperté y le gritaba a una nube! Estaba robándose mi señal de radio... ¡Maldita nube moderna!'"
        ];
        setTimeout(() => {
            setGrandpaStory(stories[Math.floor(Math.random() * stories.length)]);
            setIsRambling(false);
        }, 400);
    };

    return (
        <div className="w-full my-4">
            {/* 1. PLANTA NUCLEAR */}
            {currentLocationId === "nuclear" && (
                <div className="bg-[#1e293b] border-4 border-black p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white text-center relative overflow-hidden">
                    <span className="font-simpson-title text-yellow-400 text-xs sm:text-sm tracking-wider block mb-3 uppercase">
                        ☢️ Panel de Control - Sector 7G ☢️
                    </span>
                    <div className="bg-[#0f172a] border-2 border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center">
                        <NuclearButton onStateChange={onAlertChange} />
                    </div>
                </div>
            )}

            {/* 2. CASA DE LOS SIMPSON */}
            {currentLocationId === "casa" && (
                <div className="bg-[#b45309] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#78350f] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-black shadow flex items-center justify-center font-bold text-[10px]"></div>
                            <span className="font-simpson-title text-yellow-300 text-xs tracking-wider uppercase">
                                Springfield TV - {currentChannelIndex === -1 ? "Apagada / Sin Señal" : simpsonChannels[currentChannelIndex].title.split(" - ")[0]}
                            </span>
                        </div>
                        <button
                            onClick={handleKnobTurn}
                            className="bg-[#fed90f] text-black border-2 border-black px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition cursor-pointer active:translate-y-0.5"
                        >
                            {currentChannelIndex === -1 ? "Encender TV 🔌" : "Girar Perilla (Cambiar Canal) 🔄"}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute -top-6 left-8 w-1 h-8 bg-black rotate-[-25deg] origin-bottom"></div>
                        <div className="absolute -top-6 right-8 w-1 h-8 bg-black rotate-[25deg] origin-bottom"></div>

                        <div className="bg-black border-[8px] border-[#581c87] p-2 rounded-[3rem] shadow-[inset_0px_0px_20px_rgba(0,0,0,0.9)] text-center relative overflow-hidden">
                            <div className="absolute top-4 left-5 z-10 bg-amber-500/90 border border-black px-2 py-0.5 rounded shadow">
                                <span className="text-[10px] text-black font-mono font-black tracking-widest">
                                    {currentChannelIndex === -1 ? "OFF" : simpsonChannels[currentChannelIndex].title.split(" - ")[0]}
                                </span>
                            </div>

                            {currentChannelIndex !== -1 && (
                                <div className="absolute top-4 right-5 z-10 flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded border border-red-500/50">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[9px] text-red-400 font-mono font-black">EN VIVO</span>
                                </div>
                            )}

                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-4 border-black bg-slate-900 mt-2 flex items-center justify-center">
                                {currentChannelIndex === -1 ? (
                                    <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center overflow-hidden select-none">
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] animate-pulse"></div>
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-[bounce_2s_infinite]"></div>
                                        <div className="text-center z-10 p-4">
                                            <p className="font-mono text-neutral-500 text-xs sm:text-sm tracking-widest uppercase font-black">
                                                ~ Sin Señal ~
                                            </p>
                                            <p className="font-mono text-neutral-600 text-[10px] mt-1">
                                                [ Presiona "Encender TV" ]
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={`https://www.youtube-nocookie.com/embed/${simpsonChannels[currentChannelIndex].id}?autoplay=0&controls=1&modestbranding=1`}
                                        title={simpsonChannels[currentChannelIndex].title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>

                            <div className="bg-[#1e1b4b] border-2 border-black py-2 px-3 rounded-xl mt-3 mx-2">
                                <p className="font-simpson-title text-yellow-300 text-xs sm:text-sm tracking-wide">
                                    {currentChannelIndex === -1 ? "Televisor Apagado" : simpsonChannels[currentChannelIndex].title}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. TABERNA DE MOE */}
            {currentLocationId === "moe" && (
                <div className="bg-[#581c87] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#3b0764] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">☎️</span>
                            <div>
                                <span className="font-simpson-title text-yellow-300 text-xs uppercase tracking-wider block">
                                    Teléfono Público - Taberna de Moe
                                </span>
                                <span className="text-[10px] font-mono text-purple-300 block">
                                    {moeStatus}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={triggerPrankCall}
                            disabled={isCalling}
                            className="bg-[#fed90f] text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition cursor-pointer active:translate-y-0.5 disabled:opacity-50"
                        >
                            {isCalling ? "Marcando... 🔄" : "📞 Hacer Broma Telefónica"}
                        </button>
                    </div>

                    <div className="bg-black border-4 border-[#3b0764] p-4 rounded-2xl shadow-inner text-center relative overflow-hidden">
                        <div className="absolute top-2 right-3 text-red-500 font-mono text-[9px] font-bold tracking-widest uppercase">
                            🔴 Línea Caliente
                        </div>
                        <div className="bg-[#1e1b4b] border-2 border-purple-900/80 p-4 rounded-xl mt-2 text-left">
                            <p className="font-mono text-yellow-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-bold">
                                {moeCall}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. KWIK-E-MART */}
            {currentLocationId === "kwik" && (
                <div className="bg-[#064e3b] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#022c22] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🥤</span>
                            <span className="font-simpson-title text-emerald-300 text-xs uppercase tracking-wider">
                                Kwik-E-Mart: Fuente de Squishee
                            </span>
                        </div>
                        <button
                            onClick={handlePourSquishee}
                            disabled={isPouring}
                            className="bg-[#34d399] text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-300 transition cursor-pointer active:translate-y-0.5 disabled:opacity-50"
                        >
                            {isPouring ? "Llenando Vaso... ⏳" : "🚰 Servir Vaso de Squishee"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {squisheeFlavors.map((flavor, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedFlavorIndex(index)}
                                className={`p-3 rounded-xl border-2 border-black text-left transition cursor-pointer flex items-center justify-between ${selectedFlavorIndex === index
                                    ? "bg-emerald-400 text-black shadow-[inset_2px_2px_0px_rgba(0,0,0,0.5)] font-bold scale-[1.02]"
                                    : "bg-[#022c22] text-emerald-200 hover:bg-[#064e3b]"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full border border-black ${flavor.color}`}></div>
                                    <span className="text-xs font-mono">{flavor.name}</span>
                                </div>
                                {selectedFlavorIndex === index && <span className="text-xs">✔️</span>}
                            </button>
                        ))}
                    </div>

                    <div className="bg-black border-4 border-[#022c22] p-4 rounded-2xl shadow-inner text-center relative overflow-hidden">
                        <div className="absolute top-2 right-3 text-emerald-400 font-mono text-[9px] font-bold tracking-widest uppercase">
                            {isPouring ? "🟢 FLUJO ACTIVO" : "⚪ LISTO PARA SERVIR"}
                        </div>

                        <div className="my-3 flex flex-col items-center justify-center">
                            <div className="w-24 h-28 border-4 border-dashed border-emerald-600 rounded-b-2xl rounded-t-sm relative overflow-hidden bg-slate-900 flex items-end">
                                <div
                                    className={`w-full transition-all duration-300 ${squisheeFlavors[selectedFlavorIndex].color} opacity-85`}
                                    style={{ height: `${pourProgress}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black text-white drop-shadow">
                                    {pourProgress}%
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#022c22] border-2 border-emerald-800/80 p-3 rounded-xl mt-2 text-center">
                            <p className="font-mono text-emerald-200 text-xs sm:text-sm font-bold">
                                {squisheeMessage}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. ESCUELA PRIMARIA */}
            {currentLocationId === "escuela" && (
                <div className="bg-[#14532d] border-4 border-black p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-simpson-title text-yellow-300 text-xs uppercase tracking-wider">
                            ✏️ Pizarrón de Castigo de Bart
                        </span>
                        <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded font-black border border-black">Escuela Primaria de Springfield</span>
                    </div>
                    <div className="bg-[#0f381e] border-6 border-[#78350f] p-4 rounded-2xl mb-3 shadow-inner">
                        <ul className="font-simpson-title text-yellow-200 text-xs sm:text-sm leading-relaxed tracking-wider select-none space-y-1">
                            {bartLines.map((line, idx) => (
                                <li key={idx} className="drop-shadow-[1px_1px_rgba(0,0,0,1)]">
                                    • {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Escribe tu propio castigo..."
                            value={customLine}
                            onChange={(e) => setCustomLine(e.target.value)}
                            className="bg-white text-black text-xs px-3 py-2 rounded-xl border-2 border-black flex-1 font-bold outline-none"
                        />
                        <button
                            onClick={() => {
                                if (customLine.trim() !== "") {
                                    setBartLines(prev => [customLine, prev[0], prev[1]]);
                                    setCustomLine("");
                                }
                            }}
                            className="bg-yellow-400 text-black border-2 border-black px-3 py-2 rounded-xl text-xs font-black hover:bg-yellow-300 cursor-pointer shadow"
                        >
                            Escribir
                        </button>
                    </div>
                </div>
            )}

            {/* 6. CERVECERÍA DUFF */}
            {currentLocationId === "duff" && (
                <div className="bg-[#172554] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#0b1329] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🍻</span>
                            <span className="font-simpson-title text-cyan-300 text-xs uppercase tracking-wider">
                                Cervecería Duff - Llamado a Duffman
                            </span>
                        </div>
                        <button
                            onClick={invokeDuffman}
                            disabled={isInvokingDuff}
                            className="bg-cyan-400 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 transition cursor-pointer active:translate-y-0.5 disabled:opacity-50"
                        >
                            {isInvokingDuff ? "¡Oh, yeah! ⚡" : "🦸‍♂️ Invocar a Duffman"}
                        </button>
                    </div>

                    <div className="bg-black border-4 border-[#0b1329] p-4 rounded-2xl shadow-inner text-center relative overflow-hidden">
                        <div className="absolute top-2 right-3 flex items-center gap-1 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500">
                            <span className="text-[9px] text-cyan-300 font-mono font-bold">LATAS LANZADAS: {cansThrown} 🍺</span>
                        </div>

                        <div className="my-4 py-3 px-4 bg-[#1e1b4b] border-2 border-cyan-500/50 rounded-2xl shadow-lg">
                            <p className="font-simpson-title text-cyan-300 text-sm tracking-wider mb-2 animate-bounce">
                                {duffState.action}
                            </p>
                            <p className="font-mono text-yellow-300 text-xs sm:text-sm font-bold italic">
                                "{duffState.quote}"
                            </p>
                        </div>

                        <div className="bg-[#0b1329] border-2 border-cyan-900/80 p-2 rounded-xl text-center">
                            <p className="font-mono text-cyan-400 text-[10px] tracking-widest uppercase">
                                {isInvokingDuff ? "⚡ ¡La música de Duffman está sonando a todo volumen! 🎶" : "💡 Presiona el botón superior para cambiar de entrada épica."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 7. TIENDA DE HISTORIETAS (COMIC BOOK GUY) */}
            {currentLocationId === "comic" && (
                <div className="bg-[#7f1d1d] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#450a0a] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📚</span>
                            <span className="font-simpson-title text-red-200 text-xs uppercase tracking-wider">
                                Android's Dungeon (Comic Book Guy)
                            </span>
                        </div>
                        <button
                            onClick={triggerComicReview}
                            disabled={isCriticizing}
                            className="bg-amber-400 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition cursor-pointer active:translate-y-0.5 disabled:opacity-50"
                        >
                            {isCriticizing ? "Analizando... 🤓" : "Pedir Reseña 💬"}
                        </button>
                    </div>

                    <div className="bg-black border-4 border-[#450a0a] p-4 rounded-2xl shadow-inner text-center relative overflow-hidden">
                        <div className="absolute top-2 right-3 text-amber-500 font-mono text-[9px] font-bold tracking-widest uppercase">
                            🔴 Crítico Oficial
                        </div>
                        <div className="my-3 py-3 px-4 bg-[#262626] border-2 border-red-900/50 rounded-2xl shadow-lg mt-2">
                            <p className="font-mono text-amber-300 text-xs sm:text-sm font-bold italic">
                                {comicQuote}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 8. ASILO DE SPRINGFIELD (ABUELO SIMPSON) */}
            {currentLocationId === "asilo" && (
                <div className="bg-[#334155] border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-left relative max-w-xl mx-auto">
                    <div className="flex justify-between items-center mb-4 bg-[#1e293b] p-3 rounded-2xl border-2 border-black">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">👴</span>
                            <span className="font-simpson-title text-slate-200 text-xs uppercase tracking-wider">
                                Asilo de Ancianos de Springfield
                            </span>
                        </div>
                        <button
                            onClick={triggerGrandpaStory}
                            disabled={isRambling}
                            className="bg-slate-300 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition cursor-pointer active:translate-y-0.5 disabled:opacity-50"
                        >
                            {isRambling ? "Recordando... 💭" : "Escuchar al Abuelo 🗣️"}
                        </button>
                    </div>

                    <div className="bg-black border-4 border-[#1e293b] p-4 rounded-2xl shadow-inner text-center relative overflow-hidden">
                        <div className="absolute top-2 right-3 text-slate-400 font-mono text-[9px] font-bold tracking-widest uppercase">
                            🧓 Hora de Historias
                        </div>
                        <div className="my-3 py-3 px-4 bg-[#0f172a] border-2 border-slate-700 rounded-2xl shadow-lg mt-2">
                            <p className="font-mono text-yellow-200 text-xs sm:text-sm font-bold italic">
                                {grandpaStory}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}