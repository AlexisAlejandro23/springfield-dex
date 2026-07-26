"use client";

import { useState } from "react";

export default function GrandpaSimpsonEasterEgg() {
    const [isOpen, setIsOpen] = useState(false);
    const [quoteIndex, setQuoteIndex] = useState(0);

    const grandpaQuotes = [
        "Usaba un cebollino en el cinturón, que era la moda en esos tiempos. No había cebollas blancas, porque con la guerra solo se conseguían las amarillas...",
        "¡¡¡¡¡Matlock!!!!!",
        "¿A caso mi agrietado rostro les recuerda el lugubre aspecto de la muerte?",
        "...El Señor nos dejó ser viejos por una razón: ¡Para ver los defectos en todo lo que Él hace!",
        "¿Cómo puedes tener una casa sin armas? ¿Qué tal si entra un oso o algo así?",
        "Querido Sr. Presidente: Hay demasiados estados hoy en día, por favor elimíne tres. No soy un viejo maniático.",
        "¿Mi primer nombre?… ¿mi primer nombre?… Bueno, cuando estoy confundido siempre veo mi ropa interior. Aquí está la respuesta a todas las preguntas importantes...",
        "Homero, Homeroooo, tienen mis pastillas.. ¡Homero... Homero, tengo frío!",
        "Dicen que la mayor tragedia para un padre es que su hijo muera. Yo nunca he entendido por qué, francamente yo le vería el lado positivo.",
        "!Yo te ayuda, hijo... aún estoy lleno de bríos y pujanza... últimamente más pujanza que nada!",
        "¡Tengo ganas de vengarme y de hacer pis! Antes sólo era de vengarme.",
        "Homero, hijo, eres tan tonto como un burro sólo que más feo.",
        "El césped de hoy pica más que el césped de mi época.",
        "Hijo, si alguna vez viajas atrás en el tiempo, procura no tocar nada",
        "¡Bueno! Yo nunca pensé que podría destruir un avión alemán, pero el año pasado vi que me equivocaba.",
        "¿Sabes que yo inventé los besos?",
        "Homero, no me arrepiento de haberte tenido, y siempre estuve orgulloso… de que no fueras un enano.",
        "Lo he oído todo, lo he visto todo, lo he hecho todo. Sólo que no recuerdo nada.",
        "Sabes, tu me recuerdas un poema del que ya no me acuerdo, una canción que nunca existió, y un lugar al que no creo que haya ido nunca.",
        "Yo soy un viejo, odio todo menos mi programa de entrevistas.... Y YA VA A EMPEZAR",
        "¡Ya no recuerdo la ultima vez que me sentí así de joven!... ¡No!... ¡Ya no me acuerdo!",
        "¡Homero eres torpe como una piedra y feo como una blasfemia! Si un extraño ofrece llevarte ¡Te subes!",
        "¿Hay escaleras? (Roger Meyers Jr.: Solo una) ¡Paso!",
        "(Bart: Abuelo, ¿yo hubiera podido ser Pez del Infierno) Tu eres un mozalbete engreido, sin experiencia en la vida, con educación de 4o grado.... ¡Hijo, pudiste llegar a Teniente!",
        "¿Porqué rayos me despertaron? Soñaba que era 'La Reina del oeste' y tenía un revolver de plata.",
        "Bueno, lo cierto es que si usé vestido buena parte de los 40's..... ¡OH, QUE DISEÑADORES HABÍA!",
        "¡Ya cómete la maldita naranja!",
        "No me llevaras Parca.",
        "¡Creo que el sistema métrico es el arma del diablo! ¡Mi auto corre en centímetros la hora y así es que me gusta que corra!",
        "¡Se han robado mi alma!",
        "¿Yo estoy igual, estoy igual?",
        "¿Quién es usted? ¿Qué hace en mi baño? ¡Marge, dile a este muchacho que se largue!"
    ];

    const nextQuote = () => {
        // Genera un índice aleatorio en lugar de secuencial para mayor sorpresa
        const randomIndex = Math.floor(Math.random() * grandpaQuotes.length);
        setQuoteIndex(randomIndex);
    };

    return (
        <>
            {/* Botón flotante con margen superior para dejar espacio al abuelo desbordado */}
            <button
                onClick={() => {
                    nextQuote(); // Cambiar frase al abrir
                    setIsOpen(true);
                }}
                className="fixed bottom-6 left-6 z-40 bg-simpsonYellow border-3 border-black px-4 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all cursor-pointer group flex items-center mt-6"
                title="¡Escuchar al Abuelo Simpson!"
            >
                {/* Imagen posicionada absolutamente: sobresale por arriba (-top-7) y queda al lado izquierdo del texto (left-3) */}
                <div className="absolute -top-4 left-2 w-14 h-14 pointer-events-none filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-transform">
                    <img
                        src="/images/abuelo-simpson.png"
                        alt="Abuelo Simpson"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* El texto tiene un padding izquierdo (pl-10) para dejarle su espacio exacto al abuelo al lado */}
                <span className="text-xs sm:text-sm font-black text-black group-hover:underline pl-9">
                    ¿Qué dice el abuelo?
                </span>
            </button>

            {/* Modal de las Divagaciones del Abuelo */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-simpsonYellow border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center text-black max-w-md w-full animate-pop-in relative mt-6">

                        {/* Botón de cerrar */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 bg-red-500 text-white font-black w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition cursor-pointer"
                        >
                            ✕
                        </button>

                        {/* Imagen sin fondo flotando arriba del modal */}
                        <div className="w-24 h-24 mx-auto -mt-16 mb-2 flex items-center justify-center filter drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] pointer-events-none">
                            <img
                                src="/images/abuelo-simpson.png"
                                alt="Abuelo Simpson"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h3 className="font-extrabold text-lg mb-3 underline decoration-black">
                            El Abuelo Abe Recuerda...
                        </h3>

                        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] mb-5">
                            <p className="font-bold text-sm sm:text-base text-gray-900 italic leading-relaxed">
                                &quot;{grandpaQuotes[quoteIndex]}&quot;
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                                onClick={nextQuote}
                                className="bg-sky-300 border-2 border-black px-4 py-2 rounded-xl font-black text-xs hover:bg-sky-400 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 cursor-pointer text-black"
                            >
                                Contar otra historia 🔄
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-black text-simpsonYellow border-2 border-black px-4 py-2 rounded-xl font-black text-xs hover:bg-gray-900 transition shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 cursor-pointer"
                            >
                                ¡Ya cállate, abuelo! 🚪
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}