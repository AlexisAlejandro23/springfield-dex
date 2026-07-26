"use client";

import CharacterSearch from "@/app/components/CharacterSearch";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import GrandpaSimpsonEasterEgg from "../components/GrandpaSimpsonEasterEgg";

export default function CharactersPage() {
    const [prankCall, setPrankCall] = useState<string | null>(null);
    const [noticeIndex, setNoticeIndex] = useState(0);

    const springfieldNotices = [
        "📋 Archivos del Director Skinner: 'Prohibido alimentar a los amiguitos del bosque'",
        "🏪 Apu (Kwik-E-Mart): 'Si robas aquí, serás condenado a ver las caricaturas de Tomy y Daly por 24 horas'",
        "☢️ Homero Simpson (Planta Nuclear): 'Los botones que dicen peligro NO son para jugar'",
        "👴 Abuelo Simpson (Asilo): '¡El perro tiene la culpa de todo! (No hay perro)'",
        "👮 Jefe Gólgota: 'Se busca a un sujeto alto y sospechoso... No, mejor olvídalo, ya lo encontré'",
        "🍻 Moe Szyslak: 'Cerrado por... razones que el departamento de salud prefiere ignorar'"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setNoticeIndex((prev) => (prev + 1) % springfieldNotices.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [springfieldNotices.length]);

    const moePranks = [
        "📞 Bart: '¿Está el señor Partes?' / Moe: '¿Quién?' / Bart: 'De nombre Mis.' / Moe: '¡Señor Mis Partes! ¿No hay nadie que haya visto Mis Partes aquí?'",
        "📞 Bart: '¿Señor Reves?' / Moe: '¿Cómo?' / Bart: 'Reves, de nombre Stal.' / Moe: '¿Stal Reves? ¿Alguno de ustedes está al revés?'",
        "📞 Bart: 'Quiero hablar con Largo Secierra.' / Moe: '¡Largo Secierra! ¿Lo oyeron? ¡Largo se cierra!'",
        "📞 Bart: 'Busco al señor Ollas, de nombre Philip.' / Moe: '¡Philip Ollas! ¿Hay algún Philip Ollas por aquí?' -> Barney: '¡Que yo sepa uno!'",
        "📞 Bart: '¿Está Empel de apellido Otas?' / Moe: 'Empel Otas, que se ponga al teléfono Empel Otas.'",
        "📞 Bart: '¿Señor Topocho?, De nombre Donpi.' / Moe: 'Donpi Topocho. ¿No hay por aquí ningún Donpi Topocho?'",
        "📞 Bart: '¿Está Homer... Sexual?' / Moe: '¡Homer Sexual! Venga, vamos, ¿alguien de ahí tiene que ser Homersexual?'",
        "📞 Bart: '¿Está Al de apellido Cólico?' / Moe: 'Al Cólico, ¿alguno de ustedes es Al Cólico?'",
        "📞 Bart: '¿Está Untiobe de apellido Suconazo?' / Moe: 'Untiobe Suconazo, ¿alguno de ustedes es Untiobe Suconazo?'",
        "📞 Bart: '¿Está el Sr. Riau, de nombre Smith?' / Moe: '¿Hay aquí algún Smith Riau?'"
    ];

    const triggerPrank = () => {
        const randomPrank = moePranks[Math.floor(Math.random() * moePranks.length)];
        setPrankCall(randomPrank);
    };

    return (
        <main className="min-h-screen bg-simpsonBlue p-6 md:p-10 relative overflow-hidden">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                    href="/"
                    className="inline-block bg-simpsonYellow font-bold px-4 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition"
                >
                    ← Volver al Inicio
                </Link>

                <button
                    onClick={triggerPrank}
                    className="bg-black text-[#fed90f] border-2 border-black font-extrabold text-xs px-3 py-2 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-900 transition flex items-center gap-2 cursor-pointer"
                    title="Haz clic para hacer una broma a Moe Szyslak"
                >
                    <span>🍺 Taberna de Moe:</span>
                    <span className="underline decoration-wavy">Llamada de broma de Bart ☎️</span>
                </button>
            </div>

            {prankCall && (
                <div className="max-w-2xl mx-auto mb-6 bg-yellow-300 border-3 border-black p-3.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-extrabold text-xs sm:text-sm flex items-center justify-between gap-3 animate-bounce">
                    <span>{prankCall}</span>
                    <button
                        onClick={() => setPrankCall(null)}
                        className="bg-black text-white px-2.5 py-1 rounded text-xs hover:bg-red-600 shrink-0 cursor-pointer"
                    >
                        ✖
                    </button>
                </div>
            )}

            <h1 className="font-simpsons text-5xl md:text-6xl text-simpsonYellow text-center mb-2 drop-shadow-[3px_3px_0px_#000]">
                Habitantes de Springfield
            </h1>

            <div className="max-w-xl mx-auto mb-8 bg-black/40 border-2 border-black py-2 px-4 rounded-xl text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-white font-bold text-xs sm:text-sm drop-shadow-[1px_1px_0px_#000] transition-opacity duration-500">
                    {springfieldNotices[noticeIndex]}
                </p>
            </div>

            {/* Componente de carga temático con guiños visuales (Lazo de Maggie, Duff, Donas, etc.) */}
            <Suspense fallback={
                <div className="text-center text-white font-bold text-xl py-12 flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl animate-spin">🍩</div>
                    <p className="drop-shadow-[2px_2px_0px_#000]">
                        Cargando padrón de ciudadanos (revisando chupones de Maggie 🎀, latas de Duff 🍻 y buscando a ayudantes de Santa 🐕)...
                    </p>
                </div>
            }>
                <CharacterSearch />
            </Suspense>
            <GrandpaSimpsonEasterEgg />
        </main>
    );
}