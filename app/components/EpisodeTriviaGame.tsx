"use client";

import { useState, useEffect } from "react";

const ALL_QUESTIONS = [
    {
        question: "En que episodio Homero se vuelve critico de comida y entra en la revista Gourmet?",
        options: ["La Venganza del Chef", "El Gordo y el Pelon", "Homer to the Max", "Miedo a volar"],
        answer: 1,
        hint: "Usa un baston y escribe reseas muy duras."
    },
    {
        question: "Como se llama el famoso episodio donde Homero come el Super Pimiento de la Insensibilidad de Quetzacatenango?",
        options: ["El misterioso viaje de Homer", "La Casa del Horror XI", "C. Montgomery Burns", "Homero el hereje"],
        answer: 0,
        hint: "Aparece una tortuga guia espacial y canta Johnny Cash."
    },
    {
        question: "Cual es el nombre del monorrail que casi destruye Springfield en el clasico episodio con Lyle Lanley?",
        options: ["Brockway", "Ogdenville", "North Haverbrook", "Todos los anteriores"],
        answer: 3,
        hint: "El tren bala que propuso un estafador!"
    },
    {
        question: "Cual es el verdadero nombre del director de la escuela primaria de Springfield, Seymour Skinner?",
        options: ["Armin Tamzarian", "Gary Chalmers", "Jasper Beardly", "Hans Topo"],
        answer: 0,
        hint: "Se descubre que es un impostor en el infame episodio de la temporada 9."
    },
    {
        question: "Como se llama el elefante que Bart gana en un concurso de la radio?",
        options: ["Copito de Nieve", "Estampida (Stampy)", "Goliath", "El Gran Tom"],
        answer: 1,
        hint: "Termina comiendose todos los cacahuates y destruyendo la casa."
    },
    {
        question: "Que cancion canta la cuadrilla de la Agencia de Monorrieles para convencer a los ciudadanos?",
        options: ["Monorrail!", "Springfield Rock", "El baile del abuelo", "Cerveza Duff por siempre"],
        answer: 0,
        hint: "Mono... D'oh!"
    },
    {
        question: "En que lugar trabaja Homero antes de la Central Nuclear en algunos flashbacks?",
        options: ["El Crustaceo Cascarudo", "Bolera de Barnacle", "Burger King", "Un autocine local"],
        answer: 1,
        hint: "El lugar donde conoce a Marge por primera vez en su juventud."
    },
    {
        question: "Cual es el segundo nombre de Milhouse Van Houten?",
        options: ["Mussolini", "Napoleon", "Humberto", "Kirk"],
        answer: 1,
        hint: "Tiene el nombre de un celebre emperador y general frances."
    },
    {
        question: "Que sabor de helado le gusta pedir siempre al Jefe Gorgory (Chief Wiggum)?",
        options: ["Chocolate con chispas", "Con todo y grasa de tocino", "Chicle con plastilina", "Ninguno, prefiere donas"],
        answer: 3,
        hint: "Los policias aman las rosquillas."
    },
    {
        question: "Como se llama el pez de tres ojos que causa problemas a la planta nuclear?",
        options: ["Blinky", "Goldie", "Nemo", "Trident"],
        answer: 0,
        hint: "Es el iconico simbolo mutante de la serie."
    },
    {
        question: "Quien le dispara al Senor Burns en el legendario misterio de dos partes?",
        options: ["Homero Simpson", "Waylon Smithers", "Maggie Simpson", "Barney Gumble"],
        answer: 2,
        hint: "Fue alguien que sostenia un chupete y tenia un babero."
    },
    {
        question: "Cual es el nombre del club secreto al que pertenece Homero y del que se convierte en lider supremo?",
        options: ["Los Canteros (Stonecutters)", "Los Bufones", "La Logia del Aguila", "Los Atomicos"],
        answer: 0,
        hint: "Tienen una cancion sobre quien gobierna el mundo."
    }
];

type ThemeType = "chalkboard" | "nuclear" | "comic" | "tavern";

export default function EpisodeTriviaGame() {
    const [questions, setQuestions] = useState<typeof ALL_QUESTIONS>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);

    // Estados para el cronómetro y transición cinemática
    const [timeLeft, setTimeLeft] = useState(15);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const themes: ThemeType[] = ["chalkboard", "nuclear", "comic", "tavern"];
    const currentTheme = themes[currentQ % themes.length];

    const shuffleQuestions = () => {
        const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentQ(0);
        setScore(0);
        setSelectedOption(null);
        setGameOver(false);
        setTimeLeft(15);
    };

    useEffect(() => {
        const saved = localStorage.getItem("simpsons_episode_trivia_highscore");
        if (saved) setHighScore(parseInt(saved, 10));
        shuffleQuestions();
    }, []);

    // Temporizador de cuenta regresiva por pregunta
    useEffect(() => {
        if (gameOver || selectedOption !== null || isTransitioning || questions.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeOut();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQ, selectedOption, gameOver, isTransitioning, questions]);

    const handleTimeOut = () => {
        setSelectedOption(-1); // -1 indica tiempo agotado / error automático
        triggerNextQuestion(false);
    };

    const handleAnswer = (index: number) => {
        if (selectedOption !== null || questions.length === 0) return;
        setSelectedOption(index);
        const correct = index === questions[currentQ].answer;

        let newScore = score;
        if (correct) {
            newScore = score + 100 + (timeLeft * 2); // Bonus extra por velocidad
            setScore(newScore);
        }

        triggerNextQuestion(correct, newScore);
    };

    const triggerNextQuestion = (wasCorrect: boolean, currentScoreVal = score) => {
        setTimeout(() => {
            setIsTransitioning(true); // Activa la animación de cambio de canal/escenario

            setTimeout(() => {
                if (currentQ + 1 < questions.length) {
                    setCurrentQ((prev) => prev + 1);
                    setSelectedOption(null);
                    setTimeLeft(15);
                } else {
                    setGameOver(true);
                    if (currentScoreVal > highScore) {
                        setHighScore(currentScoreVal);
                        localStorage.setItem("simpsons_episode_trivia_highscore", currentScoreVal.toString());
                    }
                }
                setIsTransitioning(false);
            }, 400); // Duración de la transición visual
        }, 1200);
    };

    const restartGame = () => {
        shuffleQuestions();
    };

    if (questions.length === 0) return null;

    const q = questions[currentQ];

    // Clases de animación cinemática según el tema al cambiar de pregunta
    const getTransitionAnimation = (theme: ThemeType) => {
        if (!isTransitioning) return "opacity-100 scale-100 rotate-0";
        switch (theme) {
            case "chalkboard":
                return "opacity-0 scale-90 -rotate-2 blur-xs"; // Efecto de borrado de pizarra
            case "nuclear":
                return "opacity-0 translate-x-12 filter grayscale contrast-200"; // Fallo eléctrico/industrial
            case "comic":
                return "opacity-0 scale-110 rotate-3"; // Explosión de cómic POP
            case "tavern":
                return "opacity-0 translate-y-8 blur-sm"; // Mareo de cantina
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-8 font-sans">
            {/* ENVOLTORIO EXTERNO SEGÚN EL TEMA ACTUAL */}
            {currentTheme === "chalkboard" && (
                <div className="bg-[#654321] border-6 border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fed90f] border-3 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-30 whitespace-nowrap">
                        🏫 Pizarra de Bart | Récord: {highScore} pts
                    </div>
                    <div className={`bg-[#2b583f] border-4 border-black rounded-3xl p-6 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] relative text-white transition-all duration-400 ${getTransitionAnimation("chalkboard")}`}>
                        <TriviaContent q={q} currentQ={currentQ} total={questions.length} score={score} selectedOption={selectedOption} handleAnswer={handleAnswer} gameOver={gameOver} restartGame={restartGame} themeTextColor="text-white" optionStyle="bg-[#356d4f] hover:bg-[#407d5c] text-white" timeLeft={timeLeft} />
                    </div>
                </div>
            )}

            {currentTheme === "nuclear" && (
                <div className="bg-[#374151] border-6 border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-400 border-3 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-30 whitespace-nowrap">
                        ☢️ Sector 7G Nuclear | Récord: {highScore} pts
                    </div>
                    <div className={`bg-[#1f2937] border-4 border-black rounded-3xl p-6 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative text-emerald-400 transition-all duration-400 ${getTransitionAnimation("nuclear")}`}>
                        <div className="w-full h-3 bg-[repeating-linear-gradient(-45deg,#facc15,#facc15_15px,#000_15px,#000_30px)] border-2 border-black mb-4 rounded-full"></div>
                        <TriviaContent q={q} currentQ={currentQ} total={questions.length} score={score} selectedOption={selectedOption} handleAnswer={handleAnswer} gameOver={gameOver} restartGame={restartGame} themeTextColor="text-white" optionStyle="bg-[#374151] hover:bg-[#4b5563] text-emerald-300 border-emerald-500/50" timeLeft={timeLeft} />
                    </div>
                </div>
            )}

            {currentTheme === "comic" && (
                <div className="bg-red-600 border-6 border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fed90f] border-3 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-30 whitespace-nowrap">
                        💥 Android's Dungeon Comic | Récord: {highScore} pts
                    </div>
                    <div className={`bg-[#fef08a] border-4 border-black rounded-3xl p-6 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] relative text-black transition-all duration-400 ${getTransitionAnimation("comic")}`}>
                        <TriviaContent q={q} currentQ={currentQ} total={questions.length} score={score} selectedOption={selectedOption} handleAnswer={handleAnswer} gameOver={gameOver} restartGame={restartGame} themeTextColor="text-black" optionStyle="bg-white hover:bg-yellow-100 text-black" timeLeft={timeLeft} />
                    </div>
                </div>
            )}

            {currentTheme === "tavern" && (
                <div className="bg-[#2c1810] border-6 border-black rounded-[40px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 border-3 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-30 whitespace-nowrap">
                        🍺 Taberna de Moe | Récord: {highScore} pts
                    </div>
                    <div className={`bg-[#3e2723] border-4 border-black rounded-3xl p-6 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] relative text-amber-100 transition-all duration-400 ${getTransitionAnimation("tavern")}`}>
                        <TriviaContent q={q} currentQ={currentQ} total={questions.length} score={score} selectedOption={selectedOption} handleAnswer={handleAnswer} gameOver={gameOver} restartGame={restartGame} themeTextColor="text-amber-100" optionStyle="bg-[#4e342e] hover:bg-[#5d4037] text-amber-200" timeLeft={timeLeft} />
                    </div>
                </div>
            )}
        </div>
    );
}

// Subcomponente interno de las preguntas con barra de tiempo radioactiva integrada
function TriviaContent({ q, currentQ, total, score, selectedOption, handleAnswer, gameOver, restartGame, themeTextColor, optionStyle, timeLeft }: any) {
    const timePercentage = (timeLeft / 15) * 100;

    // Color dinámico de la barra de tiempo según el nivel de urgencia
    let barColor = "bg-green-500";
    if (timeLeft <= 10) barColor = "bg-yellow-400";
    if (timeLeft <= 5) barColor = "bg-red-500 animate-pulse";

    return (
        <div>
            {!gameOver ? (
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-extrabold text-xs uppercase px-3 py-1 rounded-xl border-2 border-black text-black bg-[#fed90f]">
                            Pregunta {currentQ + 1} de {total}
                        </span>
                        <span className="font-black text-sm text-[#fed90f] drop-shadow-[1px_1px_0px_#000]">Puntuacion: {score}</span>
                    </div>

                    {/* BARRA DE TIEMPO RADIOACTIVA */}
                    <div className="mb-4">
                        <div className="flex justify-between text-[11px] font-extrabold mb-1">
                            <span className="flex items-center gap-1">⏱️ Tiempo reactivo:</span>
                            <span className={`${timeLeft <= 5 ? "text-red-400 font-black animate-bounce" : ""}`}>{timeLeft}s</span>
                        </div>
                        <div className="w-full h-3 bg-black/40 border-2 border-black rounded-full overflow-hidden p-0.5">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                                style={{ width: `${timePercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <h3 className={`font-extrabold text-xl md:text-2xl mb-5 text-center leading-snug ${themeTextColor}`}>
                        {q.question}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {q.options.map((opt: string, idx: number) => {
                            let btnStyle = optionStyle;
                            if (selectedOption !== null) {
                                if (idx === q.answer) btnStyle = "bg-green-400 text-black font-black";
                                else if (idx === selectedOption) btnStyle = "bg-red-500 text-white font-black";
                                else btnStyle = "bg-gray-500 opacity-40 text-gray-200";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selectedOption !== null}
                                    className={`border-3 border-black p-3 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${btnStyle}`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    <p className={`text-center text-xs font-bold italic opacity-90 ${themeTextColor}`}>
                        💡 Pista: {q.hint}
                    </p>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-4xl mb-2">🎉</p>
                    <h3 className="font-simpsons text-3xl text-[#fed90f] mb-2 drop-shadow-[2px_2px_0px_#000]">¡Recorrido por Springfield Terminado!</h3>
                    <p className={`font-black text-lg mb-4 ${themeTextColor}`}>Obtuviste {score} puntos en total.</p>
                    <button
                        onClick={restartGame}
                        className="bg-[#fed90f] text-black border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 active:translate-y-0.5 cursor-pointer"
                    >
                        Volver a Recorrer Springfield 🔀
                    </button>
                </div>
            )}
        </div>
    );
}