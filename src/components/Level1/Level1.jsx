import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import CodeBuilderPanel from './CodeBuilderPanel';
import { Play, Info } from 'lucide-react';

const waveConfigs = {
  1: { length: 3, types: ['nemico', 'vuoto'] },
  2: { length: 5, types: ['nemico', 'powerup'] },
  3: { length: 10, types: ['nemico', 'powerup', 'proiettile'] }
};

const waveDescriptions = {
  1: { title: "Wave 1: La Minaccia Base", desc: "Usa il blocco IF per sparare() quando incontri un 'nemico'. Se c'è il 'vuoto', non fare nulla." },
  2: { title: "Wave 2: Risorse Preziose", desc: "Oltre ai nemici dovrai gestire anche i power-up." },
  3: { title: "Wave 3: Assalto Totale", desc: "Vediamo come te la cavi se aggiungiamo dei proiettili." }
};

const generateWaveSequence = (waveIndex) => {
  const config = waveConfigs[waveIndex];
  return Array.from({length: config.length}, () => config.types[Math.floor(Math.random() * config.types.length)]);
};

const evaluateLogic = (obj, code, wave) => {
  let triggeredAction = 'none';

  if (obj === code.c1) {
    triggeredAction = code.a1;
  } else if (wave === 3 && obj === code.c2) {
    triggeredAction = code.a2;
  } else if (wave >= 2) {
    triggeredAction = code.aElse;
  }

  let isCorrect = false;
  if (obj === 'nemico' && triggeredAction === 'spara()') isCorrect = true;
  if (obj === 'powerup' && triggeredAction === 'raccogli()') isCorrect = true;
  if (obj === 'proiettile' && triggeredAction === 'scudo()') isCorrect = true;
  if (obj === 'vuoto' && triggeredAction === 'none') isCorrect = true;

  return { isCorrect, action: triggeredAction };
};

const Level1 = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); 

  // Wave state
  const [currentWave, setCurrentWave] = useState(1);
  const [waveObjects, setWaveObjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Game Loop State
  const [isWaveRunning, setIsWaveRunning] = useState(false);
  const [stepState, setStepState] = useState('idle'); // 'idle' | 'entering' | 'action' | 'resolving'
  const [actionPlayedInfo, setActionPlayedInfo] = useState(null); 

  const [userCode, setUserCode] = useState({
    c1: '', a1: '',
    c2: '', a2: '',
    aElse: ''
  });

  const startGame = () => setHasStarted(true);

  const startWave = () => {
    setWaveObjects(generateWaveSequence(currentWave));
    setCurrentIndex(0);
    setFeedback(null);
    setIsWaveRunning(true);
    setStepState('entering');
  };

  useEffect(() => {
    if (!isWaveRunning) return;

    if (currentIndex >= waveObjects.length) {
      if (currentWave < 3) {
        setFeedback({ message: `Wave ${currentWave} completata! Ottimo lavoro.`, type: 'success' });
        setCurrentWave(w => w + 1);
        setUserCode({ c1: '', a1: '', c2: '', a2: '', aElse: '' });
      } else {
        setFeedback({ message: 'VITTORIA! Hai completato il Livello 1.', type: 'success' });
      }
      setIsWaveRunning(false);
      setStepState('idle');
      return;
    }

    const currentObj = waveObjects[currentIndex];

    if (stepState === 'entering') {
      // Allow 800ms for object to enter screen and slide down
      const timer = setTimeout(() => {
        // Evaluate logic before transitioning to action state
        const { isCorrect, action } = evaluateLogic(currentObj, userCode, currentWave);
        
        let anim = null;
        if (action === 'spara()') anim = 'shoot';
        if (action === 'raccogli()') anim = 'collect';
        if (action === 'scudo()') anim = 'shield';
        if (currentObj === 'vuoto') anim = 'bypass';

        if (!isCorrect) anim = 'hit';

        setActionPlayedInfo({ anim, isCorrect });
        setStepState('action');
      }, 800);
      return () => clearTimeout(timer);
    }
    
    if (stepState === 'action') {
      // Action takes 400ms (e.g. laser shooting up, shield appearing)
      const timer = setTimeout(() => setStepState('resolving'), 400); 
      return () => clearTimeout(timer);
    }

    if (stepState === 'resolving') {
      if (actionPlayedInfo && actionPlayedInfo.isCorrect) {
        // Resolution (explosion, collection) takes 800ms
        const timer = setTimeout(() => {
          setScore(s => s + (currentObj === 'vuoto' ? 10 : 100));
          setActionPlayedInfo(null);
          setCurrentIndex(i => i + 1);
          setStepState('entering');
        }, 800);
        return () => clearTimeout(timer);
      } else {
        // Failed -> stop wave
        setFeedback({ message: 'La nave è stata colpita! Algoritmo incompleto o errato.', type: 'error' });
        const timer = setTimeout(() => {
          setIsWaveRunning(false);
          setActionPlayedInfo(null);
          setStepState('idle');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isWaveRunning, stepState, currentIndex, waveObjects, currentWave, userCode, actionPlayedInfo]);

  const currentDisplayObject = isWaveRunning && currentIndex < waveObjects.length ? waveObjects[currentIndex] : '...';

  if (!hasStarted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900/95 relative z-30">
        <div className="bg-slate-800 border-2 border-cyan-500/50 p-6 sm:p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-md w-full text-center">
          <div className="mb-4 flex justify-center">
            <Info size={44} className="text-cyan-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 tracking-wide">
            Variabili e Condizioni: Le Regole di Ingaggio
          </h2>
          <p className="text-sm text-slate-300 mb-4 text-left leading-relaxed">
            In questo livello imparerai a dare ordini alla tua navicella usando due concetti fondamentali:
          </p>
          <div className="space-y-3 mb-6 text-left text-xs sm:text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            <p className="text-slate-300">
              <strong className="text-cyan-400 block mb-0.5">La Variabile:</strong>
              Immaginala come una scatola misteriosa davanti alla tua nave che può contenere un Nemico, un Proiettile o un Power-Up.
            </p>
            <p className="text-slate-300">
              <strong className="text-pink-400 block mb-0.5">Le Condizioni (IF/ELSE):</strong>
              Sono le regole per reagire a ciò che c'è nella scatola.
            </p>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-cyan-300 mb-6 text-center">
            Costruisci le tue regole e guarda la nave affrontare l'ondata in autonomia!
          </p>
          <button 
            onClick={startGame}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(8,145,178,0.5)] cursor-pointer active:scale-[0.98]"
          >
            <Play size={20} className="fill-current" />
            ACCETTA SFIDA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Score Header */}
      <div className="flex justify-between items-center p-3 px-6 bg-slate-800/50 border-b border-slate-800 text-sm z-20">
        <div className="flex gap-4">
          <span className="text-slate-400">SCORE <span className="text-cyan-400 font-black font-mono ml-2">{score.toString().padStart(4, '0')}</span></span>
          <span className="text-slate-400">WAVE <span className="text-pink-400 font-black font-mono ml-2">{currentWave}/3</span></span>
        </div>
        {isWaveRunning && (
          <span className="text-slate-400 text-xs animate-pulse">Scan... {currentIndex + 1}/{waveObjects.length}</span>
        )}
      </div>

      {/* Main Playfield: Left is Arcade GameBoard, Right is CodeBuilderPanel */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Side: Game Board */}
        <div className="flex-1 relative flex flex-col min-h-[360px] md:min-h-0 overflow-hidden">
          {/* Wave Description Overlay (when idle) */}
          {!isWaveRunning && !feedback && currentWave <= 3 && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 p-4 rounded-xl text-center z-40 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <h3 className="font-bold text-cyan-400 mb-1">{waveDescriptions[currentWave].title}</h3>
              <p className="text-xs text-slate-300">{waveDescriptions[currentWave].desc}</p>
            </div>
          )}

          {/* Feedback Overlay */}
          {feedback && !isWaveRunning && (
            <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] px-4 py-3 rounded-lg text-center font-bold text-sm z-50 animate-bounce ${
              feedback.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
              : 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            }`}>
              {feedback.message}
            </div>
          )}

          <GameBoard currentObject={currentDisplayObject} stepState={stepState} actionPlayedInfo={actionPlayedInfo} />
        </div>

        {/* Right Side: Code Builder Panel */}
        <div className="w-full md:w-[420px] lg:w-[460px] shrink-0 flex flex-col">
          <CodeBuilderPanel 
            currentWave={currentWave} 
            waveDescription={waveDescriptions[currentWave]?.desc}
            userCode={userCode} 
            setUserCode={setUserCode} 
            onStartWave={startWave} 
            disabled={isWaveRunning || (feedback?.type === 'success' && currentWave > 3)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Level1;
