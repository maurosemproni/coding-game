import React, { useState } from 'react';
import { Play, Code2, Terminal } from 'lucide-react';

const VALUE_OPTIONS = ['nemico', 'powerup', 'proiettile'];
const ACTION_OPTIONS = ['spara()', 'raccogli()', 'scudo()'];

const CodeBuilderPanel = ({ currentWave, waveDescription, userCode, setUserCode, onStartWave, disabled }) => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'c1' | 'a1' | 'c2' | 'a2' | 'aElse'

  const setCode = (key, val) => {
    setUserCode(prev => ({ ...prev, [key]: val }));
    setActiveDropdown(null);
  };

  const isReady = () => {
    if (currentWave === 1) return userCode.c1 && userCode.a1;
    if (currentWave === 2) return userCode.c1 && userCode.a1 && userCode.aElse;
    if (currentWave === 3) return userCode.c1 && userCode.a1 && userCode.c2 && userCode.a2 && userCode.aElse;
    return false;
  };

  const renderSlot = (type, key, val) => {
    const isValue = type === 'value';
    const options = isValue ? VALUE_OPTIONS : ACTION_OPTIONS;
    
    return (
      <div className="relative inline-block my-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
          className={`px-3 py-1 rounded-md min-w-[100px] text-center border-2 transition-all font-mono font-bold text-xs ${
            val 
              ? (isValue ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]' : 'bg-amber-950/60 border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.25)]')
              : 'bg-slate-800 border-dashed border-slate-500 text-slate-400 hover:border-cyan-400/70 hover:bg-slate-700/60'
          }`}
        >
          {val ? (isValue ? `"${val}"` : val) : (isValue ? 'SELEZIONA VALORE' : 'SELEZIONA AZIONE')}
        </button>
        
        {activeDropdown === key && !disabled && (
          <div className="absolute top-full left-0 mt-2 bg-slate-900 border border-slate-700 rounded-md shadow-2xl z-50 w-48 overflow-hidden backdrop-blur-md">
            <div className="p-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              {isValue ? 'Scegli Valore' : 'Scegli Funzione'}
            </div>
            {options.map(opt => (
              <button
                type="button"
                key={opt}
                onClick={() => setCode(key, opt)}
                className={`w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors font-mono text-xs ${isValue ? 'text-cyan-300 hover:text-cyan-200' : 'text-yellow-300 hover:text-yellow-200'}`}
              >
                {isValue ? `"${opt}"` : opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 md:p-6 bg-slate-900/90 backdrop-blur-sm border-t md:border-t-0 md:border-l border-cyan-500/20 shadow-2xl overflow-y-auto">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <Terminal size={16} className="text-cyan-400" />
            <span className="font-mono text-xs font-bold text-slate-300 tracking-wider">controller.go</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
            Wave {currentWave}/3
          </span>
        </div>

        {/* Mission Briefing */}
        {waveDescription && (
          <div className="mb-4 p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] block mb-1">Obiettivo Wave:</span>
            <p className="text-slate-200 font-sans leading-relaxed">{waveDescription}</p>
          </div>
        )}

        {/* Code Area */}
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs sm:text-sm leading-8 shadow-inner border border-slate-800">
          <div className="text-slate-500 text-[11px] mb-2 font-mono">// Algoritmo automatico di difesa</div>

          {/* IF Block (Always visible) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-pink-400 font-bold">if</span>
            <span className="text-cyan-300">oggetto</span>
            <span className="text-pink-400 font-bold">==</span>
            {renderSlot('value', 'c1', userCode.c1)}
            <span className="text-slate-400">{'{'}</span>
          </div>
          <div className="pl-6 my-1 flex items-center">
            {renderSlot('action', 'a1', userCode.a1)}
          </div>
          <div className="text-slate-400">{'}'}</div>

          {/* ELSE IF Block (Wave 3) */}
          {currentWave >= 3 && (
            <div className="mt-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-pink-400 font-bold">else if</span>
                <span className="text-cyan-300">oggetto</span>
                <span className="text-pink-400 font-bold">==</span>
                {renderSlot('value', 'c2', userCode.c2)}
                <span className="text-slate-400">{'{'}</span>
              </div>
              <div className="pl-6 my-1 flex items-center">
                {renderSlot('action', 'a2', userCode.a2)}
              </div>
              <div className="text-slate-400">{'}'}</div>
            </div>
          )}

          {/* ELSE Block (Wave 2 & 3) */}
          {currentWave >= 2 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-pink-400 font-bold">else</span>
                <span className="text-slate-400">{'{'}</span>
              </div>
              <div className="pl-6 my-1 flex items-center">
                {renderSlot('action', 'aElse', userCode.aElse)}
              </div>
              <div className="text-slate-400">{'}'}</div>
            </div>
          )}
        </div>
      </div>

      {/* Execute Button */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <button
          type="button"
          disabled={!isReady() || disabled}
          onClick={onStartWave}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all text-sm tracking-wide ${
            isReady() && !disabled
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.5)] cursor-pointer active:scale-[0.98]'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          }`}
        >
          <Play size={18} className={isReady() && !disabled ? 'fill-current' : ''} />
          {currentWave < 3 ? 'AVVIA PROSSIMA ONDATA' : 'AVVIA ONDATA FINALE'}
        </button>
        {!isReady() && !disabled && (
          <p className="text-[11px] text-center text-slate-500 mt-2 font-sans">
            Completa tutti i blocchi evidenziati per attivare il controller
          </p>
        )}
      </div>
    </div>
  );
};

export default CodeBuilderPanel;
