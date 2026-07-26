// app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import SpringfieldLocationWidget from "@/app/components/SpringfieldLocationWidget";

const homercuotes = [
  "“Marge, creo que odio a Ned Flanders.”",
  "“¡A la grande le puse Cuca!”",
  "“El alcohol: la causa y la solución de todos los problemas de la vida.”",
  "“¡Operación Niño Dios! ¡Salven a los niños de los juguetes!”",
  "“Marge, ¿cuándo dan los Simpson?”",
  "“¡Homero, no, tu alma no!”",
  "“¡D'oh!”"
];

const springfieldNicknames = [
  "Max Power",
  "Sr. Bolainas",
  "Guy Incognito",
  "El Hombre Hormiga (¡Cuidado con la picadura!)",
  "Hombre Topo",
  "Capitán Melgar",
  "Bumblebee Man (¡Ay, ay, ay, no me gusta!)",
  "El Joven Homero",
  "Paco el Guapo",
  "El Guasón de los Pasteles",
  "El Coleccionista",
  "Llewellyn Sinclair",
  "Homerpalooza",
  "El Borbotones",
  "El Justiciero Enmascarado",
  "Homero Simpson, el hombre que salvó a la Tierra",
  "Don Barredora",
  "El Padrino (Don Homero)",
];

const channel6News = [
  "⚠️ URGENTE: Homero Simpson provoca una mini fusión en la planta nuclear por comer donas.",
  "📺 El alcalde Diamante inaugura un nuevo bache municipal con corte de listón.",
  "👽 Se reportan avistamientos de extraterrestres en el sector oeste (Kang y Kodos saludan cordialmente).",
  "🍺 Moe Szyslak niega rotundamente que su nueva cerveza sea agua de la llave con tinte verde.",
  "🛹 Bart Simpson asegura que 'yo no fui' mientras el suelo tiembla a sus espaldas.",
  "🍩 Kwik-E-Mart reporta desabastecimiento total de donas tras la visita nocturna de un sujeto desconocido.",
  "🐶 El Pequeño Ayudante de Santa gana concurso al perro más confundido del condado.",
  "🐈 Bola de Nieve II demanda a la familia Simpson por falta de atención emocional felina.",
  "⚙️ Homero descubre que los botones de la planta nuclear sirven para hacer llamadas a la pizzería."
];

const springfieldLocations = [
  {
    id: "nuclear",
    name: "Planta Nuclear - Sector 7G",
    icon: "☢️",
    color: "bg-[#1e293b]",
    text: "text-yellow-400",
    bgTheme: "bg-[#334155]",
    cardBg: "bg-[#1e293b]/95"
  },
  {
    id: "casa",
    name: "Casa de los Simpson (Siempre Viva 742)",
    icon: "🏡",
    color: "bg-[#f59e0b]",
    text: "text-black",
    bgTheme: "bg-[#fcd34d]",
    cardBg: "bg-[#fffbeb]/95"
  },
  {
    id: "moe",
    name: "Taberna de Moe",
    icon: "🍺",
    color: "bg-[#7c2d12]",
    text: "text-amber-200",
    bgTheme: "bg-[#581c87]",
    cardBg: "bg-[#291711]/95"
  },
  {
    id: "kwik",
    name: "Kwik-E-Mart (Apu)",
    icon: "🏪",
    color: "bg-[#047857]",
    text: "text-emerald-200",
    bgTheme: "bg-[#065f46]",
    cardBg: "bg-[#022c22]/95"
  },
  {
    id: "escuela",
    name: "Escuela Primaria de Springfield",
    icon: "🏫",
    color: "bg-[#b91c1c]",
    text: "text-white",
    bgTheme: "bg-[#991b1b]",
    cardBg: "bg-[#450a0a]/95"
  },
  {
    id: "duff",
    name: "Cervecería Duff",
    icon: "🍻",
    color: "bg-[#1d4ed8]",
    text: "text-cyan-200",
    bgTheme: "bg-[#1e40af]",
    cardBg: "bg-[#0f172a]/95"
  },
  {
    id: "comic",
    name: "Tienda de Historietas (Android's Dungeon)",
    icon: "📚",
    color: "bg-[#7f1d1d]",
    text: "text-red-200",
    bgTheme: "bg-[#991b1b]",
    cardBg: "bg-[#450a0a]/95"
  },
  {
    id: "asilo",
    name: "Asilo de Springfield",
    icon: "👴",
    color: "bg-[#475569]",
    text: "text-slate-200",
    bgTheme: "bg-[#334155]",
    cardBg: "bg-[#1e293b]/95"
  }
];

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [donutCount, setDonutCount] = useState(0);
  const [nickname, setNickname] = useState("Haz clic para descubrir tu alter ego");
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [locationIndex, setLocationIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % homercuotes.length);
  };

  const generateNickname = () => {
    const randomIdx = Math.floor(Math.random() * springfieldNicknames.length);
    setNickname(springfieldNicknames[randomIdx]);
  };

  const cycleLocation = () => {
    setLocationIndex((prev) => (prev + 1) % springfieldLocations.length);
    setIsAlertActive(false);
  };

  const currentLocation = springfieldLocations[locationIndex];
  const newsString = channel6News.join(" • ");

  const activeBgClass = isAlertActive ? "bg-[#991b1b]" : currentLocation.bgTheme;
  const cardThemeClass = isAlertActive ? "bg-[#450a0a]/95 text-white" : `${currentLocation.cardBg} text-white`;
  const headerTextColor = currentLocation.text;

  return (
    <main className={`min-h-screen transition-colors duration-700 flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-x-hidden ${activeBgClass}`}>

      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/the-simpsons');
        
        .font-simpson-title {
          font-family: 'The Simpsons', 'Comic Sans MS', cursive, sans-serif;
          letter-spacing: 2px;
        }

        @keyframes moveClouds {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 0; }
        }

        .animated-clouds {
          background-image: radial-gradient(white 15%, transparent 16%), radial-gradient(white 15%, transparent 16%);
          background-size: 60px 60px;
          background-position: 0 0, 30px 30px;
          animation: moveClouds 25s linear infinite;
        }

        .cloud-shadow {
          filter: blur(12px);
          opacity: 0.8;
        }

        @keyframes marquee {
          0% { transform: translateX(15%); }
          100% { transform: translateX(-100%); }
        }

        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          /* Se mantiene el tiempo lento de 80s tal como lo querías */
          animation: marquee 80s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Capa de fondo animada */}
      <div className="absolute inset-0 opacity-25 pointer-events-none animated-clouds" />

      {/* Contenedor principal */}
      <div className="w-full max-w-3xl relative z-10 my-4 flex flex-col items-center">

        {/* Barra superior interactiva rotando por Lugares de Springfield */}
        <div className={`w-full flex justify-between items-center ${currentLocation.color} border-4 border-black px-4 py-2.5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 gap-2 transition-colors duration-300`}>
          <button
            onClick={cycleLocation}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span className={`text-xs sm:text-sm font-black tracking-wider ${headerTextColor} uppercase font-simpson-title group-hover:underline`}>
              {currentLocation.icon} {currentLocation.name} (Clic para cambiar)
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDonutCount(c => c + 1)}
              className="bg-[#fed90f] text-black border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
              title="¡Come una dona!"
            >
              <span>🍩</span>
              <span>{donutCount}</span>
            </button>
          </div>
        </div>

        {/* Tarjeta Principal */}
        <div className={`backdrop-blur-sm border-4 sm:border-6 border-black p-5 sm:p-12 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full relative pt-8 sm:pt-12 transition-colors duration-500 ${cardThemeClass}`}>

          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fed90f] text-black border-2 sm:border-3 border-black px-4 sm:px-6 py-1 rounded-full uppercase font-black text-[10px] sm:text-xs tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 whitespace-nowrap">
            {isAlertActive ? "⚠️ ¡PELIGRO EN EL SECTOR 7G! ⚠️" : `¡Visitando: ${currentLocation.name}! 🍩`}
          </div>

          <div className="bg-black text-[#fed90f] border-2 border-black rounded-xl py-1.5 px-3 mb-5 overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center cursor-default">
            <span className="bg-[#e53935] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase mr-2 z-10 shrink-0">
              Canal 6
            </span>
            <div className="overflow-hidden w-full text-xs font-extrabold tracking-wider">
              <div className="animate-marquee">
                {newsString}
              </div>
            </div>
          </div>

          <div className="relative mb-4 mt-2 group cursor-pointer">
            <h1 className="absolute inset-0 font-simpson-title text-4xl sm:text-7xl lg:text-8xl text-black tracking-wide cloud-shadow select-none transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
              Springfield Dex
            </h1>
            <h1 className="relative font-simpson-title text-4xl sm:text-7xl lg:text-8xl text-[#fed90f] tracking-wide drop-shadow-[4px_4px_0px_#d92727] z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
              Springfield Dex
            </h1>
          </div>

          <p className={`font-extrabold text-base sm:text-xl mt-3 transition-colors duration-300 ${currentLocation.id === 'casa' ? 'text-slate-900' : 'text-white'}`}>
            Tu enciclopedia interactiva definitiva del universo de Los Simpson.
          </p>

          <p className={`opacity-90 font-bold mt-2 mb-6 text-xs sm:text-base max-w-xl mx-auto transition-colors duration-300 ${currentLocation.id === 'casa' ? 'text-slate-800' : 'text-slate-200'}`}>
            Explora todos los habitantes, lugares emblemáticos y secretos de la ciudad más famosa del mundo animado.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 justify-center mb-6">
            <Link
              href="/characters"
              className="bg-[#3a9cb8] text-white font-black text-sm sm:text-base px-4 py-3.5 rounded-2xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2e7d94] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>👥</span> Personajes
            </Link>

            <Link
              href="/episodes"
              className="bg-[#e53935] text-white font-black text-sm sm:text-base px-4 py-3.5 rounded-2xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#c62828] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>📺</span> Episodios
            </Link>

            <Link
              href="/locations"
              className="bg-[#fed90f] text-black font-black text-sm sm:text-base px-4 py-3.5 rounded-2xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>🗺️</span> Lugares
            </Link>
          </div>

          <SpringfieldLocationWidget
            currentLocationId={currentLocation.id}
            onAlertChange={(active) => setIsAlertActive(active)}
          />

          <div className="bg-[#bae6fd] text-black border-3 sm:border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 text-center">
            <h3 className="font-black text-black text-xs uppercase tracking-wider mb-2">
              🏷️ ¿Cuál sería tu nombre secreto en Springfield?
            </h3>
            <div className="bg-white border-2 border-black py-2 px-3 rounded-xl font-simpson-title text-lg sm:text-xl text-[#e53935] tracking-wide mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] break-words">
              {nickname}
            </div>
            <button
              onClick={generateNickname}
              className="bg-[#fed90f] text-black border-2 border-black px-4 py-1.5 rounded-xl font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-y-0.5 transition cursor-pointer"
            >
              Generar Apodo 🎲
            </button>
          </div>

          <div className="bg-[#ffedd5] text-black border-3 sm:border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 text-center relative">
            <div className="flex items-center justify-between mb-2 gap-2">
              <span className="font-black text-[10px] sm:text-xs uppercase bg-[#fed90f] text-black px-2.5 py-1 rounded-full border-2 border-black">
                📢 Sabiduría de Homero
              </span>
              <button
                onClick={nextQuote}
                className="text-[10px] sm:text-xs font-black bg-black text-white px-3 py-1 rounded-xl hover:bg-gray-800 transition cursor-pointer whitespace-nowrap"
              >
                Otra frase 🔄
              </button>
            </div>
            <p className="font-extrabold text-black text-sm sm:text-base italic mt-2">
              {homercuotes[quoteIndex]}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}