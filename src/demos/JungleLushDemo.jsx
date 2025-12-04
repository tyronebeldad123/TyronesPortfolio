import { useState, useEffect, useRef } from 'react';

const JungleLushDemo = ({ onClose }) => {
  // Game states
  const [phase, setPhase] = useState('dialogue');
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [monsterHP, setMonsterHP] = useState(100);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [victory, setVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showClickPrompt, setShowClickPrompt] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  // Audio context for sound effects only
  const audioContextRef = useRef(null);
  
  // Create jungle background with CSS gradients
  const jungleBackground = `
    radial-gradient(circle at 20% 50%, rgba(0, 100, 0, 0.3), transparent 25%),
    radial-gradient(circle at 80% 20%, rgba(34, 139, 34, 0.2), transparent 20%),
    radial-gradient(circle at 40% 80%, rgba(0, 128, 0, 0.25), transparent 30%),
    linear-gradient(to bottom, #1a472a, #0d2818, #020c06)
  `;

  const dialogueSequence = [
    { 
      speaker: "Grammar Wizard", 
      text: "Welcome to VocabVenture! Your mission is to defeat the Commawidow using your grammar skills!",
      emoji: "🧙",
      color: "from-purple-500 to-blue-500"
    },
    { 
      speaker: "Word Warrior", 
      text: "I'm ready! My punctuation sword is sharp and my vocabulary shield is strong!",
      emoji: "⚔️",
      color: "from-amber-500 to-yellow-500"
    },
    { 
      speaker: "Commawidow", 
      text: "Mwahaha! I'll spin a web of confusing sentences! Let's see if you can punctuate properly!",
      emoji: "🕷️",
      color: "from-red-600 to-pink-600"
    }
  ];

  const questions = [
    {
      question: "Which sentence uses commas correctly?",
      options: [
        "I need eggs milk bread and cheese.",
        "I need eggs, milk, bread, and cheese.",
        "I need eggs milk, bread and, cheese."
      ],
      correctAnswer: 1,
      explanation: "Commas should separate items in a list, with an optional comma before 'and' (Oxford comma)."
    },
    {
      question: "Choose the correctly punctuated sentence:",
      options: [
        "Wow what an amazing game.",
        "Wow, what an amazing game!",
        "Wow what, an amazing game?"
      ],
      correctAnswer: 1,
      explanation: "Use a comma after interjections and an exclamation mark for excitement."
    },
    {
      question: "Which sentence needs a question mark?",
      options: [
        "Grammar is so much fun.",
        "Do you love grammar games.",
        "What a challenging puzzle."
      ],
      correctAnswer: 1,
      explanation: "Sentences that ask direct questions should end with a question mark."
    },
    {
      question: "Identify the sentence with correct apostrophe use:",
      options: [
        "The students books are on the table.",
        "The student's books are on the table.",
        "The students' book's are on the table."
      ],
      correctAnswer: 1,
      explanation: "Use 's to show possession for singular nouns."
    }
  ];

  // Initialize audio context for sound effects
  useEffect(() => {
    if (audioEnabled) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      } catch (err) {
        console.log("Audio not supported:", err);
        setAudioEnabled(false);
      }
    }
  }, [audioEnabled]);

  // Sound effects using Web Audio API
  const playSound = (type) => {
    if (!audioEnabled || !audioContextRef.current) return;
    
    try {
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      const now = context.currentTime;
      
      switch (type) {
        case 'correct':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, now); // C5
          oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          break;
        case 'wrong':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(220, now); // A3
          oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.2); // A2
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          break;
        case 'click':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(880, now); // A5
          oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.1);
          gainNode.gain.setValueAtTime(0.05, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          break;
        case 'attack':
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(587.33, now); // D5
          oscillator.frequency.setValueAtTime(783.99, now + 0.1); // G5
          oscillator.frequency.setValueAtTime(523.25, now + 0.2); // C5
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          break;
        case 'victory':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, now); // C5
          oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
          oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          break;
        case 'gameOver':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(261.63, now); // C4
          oscillator.frequency.exponentialRampToValueAtTime(130.81, now + 0.5); // C3
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          break;
      }
      
      oscillator.start();
      oscillator.stop(now + 0.5);
    } catch (err) {
      console.log("Sound error:", err);
    }
  };

  // Particle system for background
  const Particle = ({ x, y, size, speed, delay }) => (
    <div
      className="absolute rounded-full bg-gradient-to-r from-green-400/30 to-emerald-300/20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `float ${3 + Math.random() * 4}s ease-in-out ${delay}s infinite`,
        filter: 'blur(1px)',
      }}
    />
  );

  // Game timer
  useEffect(() => {
    if (phase === 'battle' && timeLeft > 0 && !victory && !gameOver) {
      const timer = setTimeout(() => {
        setTimeLeft(t => t - 1);
        
        // Pulse animation when time is low
        if (timeLeft <= 5) {
          setPulse(true);
          setTimeout(() => setPulse(false), 500);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'battle' && timeLeft === 0 && !gameOver) {
      playSound('wrong');
      if (hearts > 1) {
        setHearts(h => h - 1);
        setTimeLeft(20);
        setCombo(0);
      } else {
        playSound('gameOver');
        setGameOver(true);
      }
    }
  }, [phase, timeLeft, victory, gameOver, hearts]);

  // Dialogue click handler
  const handleDialogueClick = () => {
    playSound('click');
    if (dialogueIdx < dialogueSequence.length - 1) {
      setDialogueIdx(dialogueIdx + 1);
    } else {
      setPhase('battle');
    }
  };

  // Answer handler
  const handleAnswer = (idx) => {
    playSound('click');
    setSelectedAnswer(idx);
    setShowResult(true);

    if (idx === questions[currentQuestion].correctAnswer) {
      playSound('correct');
      playSound('attack');
      
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(prev => prev + (100 * newCombo));
      
      setMonsterHP(hp => {
        const damage = 25 + (newCombo * 5);
        const newHP = Math.max(0, hp - damage);
        
        if (newHP === 0) {
          setTimeout(() => {
            playSound('victory');
            setVictory(true);
          }, 500);
        }
        return newHP;
      });

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setTimeLeft(20);
        }, 1500);
      }
    } else {
      playSound('wrong');
      setCombo(0);
      setTimeLeft(t => Math.max(0, t - 5));
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowResult(false);
      }, 1500);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setVictory(false);
    setHearts(3);
    setTimeLeft(20);
    setMonsterHP(100);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setPhase('battle');
    setScore(0);
    setCombo(0);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Animated Background */}
      <div 
        className="absolute inset-0"
        style={{ background: jungleBackground }}
      >
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle
            key={i}
            x={Math.random() * 100}
            y={Math.random() * 100}
            size={Math.random() * 4 + 1}
            speed={Math.random() * 2 + 1}
            delay={Math.random() * 2}
          />
        ))}
        
        {/* Animated vines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute left-10 top-1/4 w-2 h-64 bg-gradient-to-b from-green-400/20 to-emerald-600/20 animate-pulse" 
               style={{ transform: 'rotate(15deg)' }} />
          <div className="absolute right-10 top-1/3 w-2 h-48 bg-gradient-to-b from-emerald-400/20 to-green-600/20 animate-pulse" 
               style={{ transform: 'rotate(-10deg)', animationDelay: '1s' }} />
        </div>
      </div>
      
      {/* Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
          >
            {audioEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
          
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-yellow-300 font-bold">Score:</span>
            <span className="text-2xl font-black text-white animate-pulse">{score}</span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:scale-105"
        >
          ✕ Close Demo
        </button>
      </div>

      {/* Stats Bar */}
      {phase === 'battle' && !victory && !gameOver && (
        <div className="absolute top-20 left-4 right-4 z-40 flex items-center justify-between bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-green-800/50">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="flex gap-1">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="relative">
                    <div className={`text-3xl transition-all duration-300 ${idx < hearts ? 'animate-pulse' : 'opacity-30'}`}>
                      ❤️
                    </div>
                    {idx < hearts && (
                      <div className="absolute inset-0 animate-ping text-3xl opacity-30">❤️</div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-300 mt-1">Lives</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-400 animate-bounce' : 'text-yellow-300'} ${pulse ? 'scale-125' : ''}`}>
                {timeLeft}s
              </div>
              <span className="text-xs text-gray-300">Time</span>
            </div>
            
            {combo > 0 && (
              <div className="flex flex-col items-center animate-bounce">
                <div className="text-2xl font-black text-cyan-400">
                  {combo}x Combo!
                </div>
                <span className="text-xs text-cyan-300">+{combo * 50} bonus</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 transition-all duration-500 relative overflow-hidden"
                style={{ width: `${monsterHP}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between w-full mt-1">
              <span className="text-xs text-gray-300">Commawidow HP</span>
              <span className="text-xs font-bold text-white">{monsterHP}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Dialogue Phase */}
      {phase === 'dialogue' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          {/* Character Display */}
          <div className="flex justify-center items-end space-x-16 mb-12">
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-9xl mb-4 animate-bounce">🧙</div>
              <div className="px-4 py-2 bg-purple-600/80 rounded-lg text-white font-bold">
                Wizard
              </div>
            </div>
            
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-9xl mb-4 animate-pulse">⚔️</div>
              <div className="px-4 py-2 bg-amber-600/80 rounded-lg text-white font-bold">
                Warrior
              </div>
            </div>
            
            {dialogueIdx >= 2 && (
              <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-9xl mb-4 animate-bounce">🕷️</div>
                <div className="px-4 py-2 bg-red-600/80 rounded-lg text-white font-bold">
                  Commawidow
                </div>
              </div>
            )}
          </div>
          
          {/* Dialogue Box */}
          <div 
            onClick={handleDialogueClick}
            className="relative w-full max-w-4xl bg-gradient-to-br from-amber-900/90 to-yellow-900/90 border-4 border-amber-700 rounded-3xl p-8 cursor-pointer shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-300"
          >
            <div className={`absolute -top-4 left-8 px-6 py-2 rounded-full font-bold shadow-lg border-2 border-amber-800 bg-gradient-to-r ${dialogueSequence[dialogueIdx].color} text-white animate-pulse`}>
              {dialogueSequence[dialogueIdx].speaker}
            </div>
            
            <div className="flex items-center gap-4 mt-6">
              <div className="text-4xl">{dialogueSequence[dialogueIdx].emoji}</div>
              <p className="text-2xl font-semibold text-amber-100 leading-relaxed">
                {dialogueSequence[dialogueIdx].text}
              </p>
            </div>
            
            {showClickPrompt && (
              <div className="absolute bottom-6 right-8 flex items-center gap-2 text-green-300 font-bold animate-pulse">
                <span className="text-xl">👇</span>
                <span>Click to continue</span>
              </div>
            )}
          </div>
          
          {/* Progress Dots */}
          <div className="flex gap-2 mt-8">
            {dialogueSequence.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx <= dialogueIdx 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400 scale-125' 
                    : 'bg-gray-600'
                } ${idx === dialogueIdx ? 'animate-ping' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Battle Phase */}
      {phase === 'battle' && !victory && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          {/* Battle Arena */}
          <div className="flex items-center justify-center space-x-24 mb-16">
            {/* Player Side */}
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-9xl mb-4 animate-pulse">⚔️</div>
              <div className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-bold text-lg">
                Grammar Hero
              </div>
            </div>
            
            {/* VS Separator */}
            <div className="relative">
              <div className="text-6xl font-black text-white drop-shadow-lg animate-pulse">
                🆚
              </div>
              <div className="absolute inset-0 text-6xl font-black text-red-500/30 animate-ping">
                🆚
              </div>
            </div>
            
            {/* Monster Side */}
            <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-9xl mb-4 animate-bounce">🕷️</div>
              <div className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl text-white font-bold text-lg">
                Commawidow
              </div>
            </div>
          </div>
          
          {/* Question Area */}
          <div className="w-full max-w-5xl bg-gradient-to-b from-amber-950/90 to-yellow-950/90 border-t-4 border-amber-700 rounded-t-3xl p-8 shadow-2xl backdrop-blur-sm">
            {/* Question Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-amber-700 to-amber-800 rounded-full mb-4">
                <span className="text-xl">❓</span>
                <span className="text-sm font-bold text-amber-100">Question {currentQuestion + 1} of {questions.length}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {questions[currentQuestion].question}
              </h3>
              <p className="text-amber-300/70 text-sm">
                {questions[currentQuestion].explanation}
              </p>
            </div>
            
            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {questions[currentQuestion].options.map((option, idx) => {
                const isCorrect = idx === questions[currentQuestion].correctAnswer;
                const isSelected = selectedAnswer === idx;
                
                return (
                  <button
                    key={idx}
                    onClick={() => !showResult && handleAnswer(idx)}
                    disabled={showResult}
                    className={`relative p-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      isSelected
                        ? isCorrect
                          ? 'bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-xl scale-105 border-4 border-green-300'
                          : 'bg-gradient-to-br from-red-500 to-pink-400 text-white shadow-xl scale-105 border-4 border-red-300'
                        : 'bg-gradient-to-br from-white/10 to-gray-900/10 text-gray-200 border-2 border-amber-800/50 hover:border-amber-400 hover:shadow-lg hover:scale-[1.02]'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-white/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected
                          ? isCorrect
                            ? 'bg-green-600'
                            : 'bg-red-600'
                          : 'bg-amber-900/50'
                      }`}>
                        <span className="font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </div>
                      <span className="text-left">{option}</span>
                    </div>
                    
                    {isSelected && isCorrect && (
                      <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
                        ✅
                      </div>
                    )}
                    
                    {isSelected && !isCorrect && (
                      <div className="absolute -top-3 -right-3 text-3xl animate-bounce">
                        ❌
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>Progress</span>
                <span>{currentQuestion + 1} / {questions.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {victory && (
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 to-emerald-950/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 p-10 rounded-3xl border-4 border-yellow-500 shadow-2xl text-center max-w-lg transform animate-scale-in">
            {/* Confetti Effect */}
            <div className="absolute -top-10 left-1/4 text-4xl animate-bounce">🎊</div>
            <div className="absolute -top-8 right-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
            
            <div className="text-8xl mb-6 animate-bounce">🏆</div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent mb-4">
              Victory!
            </h2>
            <p className="text-2xl font-bold text-amber-900 mb-2">
              You defeated Commawidow!
            </p>
            <p className="text-lg text-amber-800 mb-6">
              Your grammar skills saved the jungle!
            </p>
            
            <div className="bg-gradient-to-r from-amber-200 to-yellow-200 rounded-xl p-6 mb-8 border-2 border-amber-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-700">{score}</div>
                  <div className="text-sm text-amber-900">Final Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-700">{hearts} ❤️</div>
                  <div className="text-sm text-amber-900">Lives Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-700">{combo}x</div>
                  <div className="text-sm text-amber-900">Max Combo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-red-700">{questions.length}</div>
                  <div className="text-sm text-amber-900">Questions</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                🔄 Play Again
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                🏠 Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/60 to-rose-950/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-red-100 via-orange-100 to-amber-100 p-10 rounded-3xl border-4 border-red-500 shadow-2xl text-center max-w-md transform animate-scale-in">
            <div className="text-8xl mb-6 animate-pulse">💀</div>
            <h2 className="text-5xl font-black bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent mb-4">
              Game Over!
            </h2>
            <p className="text-2xl font-bold text-rose-900 mb-2">
              The Commawidow has defeated you!
            </p>
            <p className="text-lg text-rose-800 mb-8">
              Practice your grammar and try again!
            </p>
            
            <div className="bg-gradient-to-r from-rose-200 to-pink-200 rounded-xl p-6 mb-8 border-2 border-rose-300">
              <div className="text-center">
                <div className="text-4xl font-black text-red-700 mb-2">{score}</div>
                <div className="text-lg text-rose-900">Final Score</div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={restartGame}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                🔄 Try Again
              </button>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-lg rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                🚪 Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default JungleLushDemo;