import React from 'react';
import { Rocket, Skull, Zap, Shield } from 'lucide-react';

const GameBoard = ({ currentObject, stepState, actionPlayedInfo }) => {
  const getObjectIcon = () => {
    switch(currentObject) {
      case 'nemico': return <Skull size={48} className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" />;
      case 'powerup': return <Zap size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />;
      case 'proiettile': return <Zap size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ transform: 'rotate(180deg)' }}/>;
      case 'vuoto': return <div className="w-12 h-12 border-2 border-dashed border-slate-600/50 rounded-lg"></div>;
      case '...': return null;
      default: return null;
    }
  };

  const getObjectColor = () => {
    switch(currentObject) {
      case 'nemico': return 'text-fuchsia-500';
      case 'powerup': return 'text-yellow-400';
      case 'proiettile': return 'text-cyan-400';
      case 'vuoto': return 'text-slate-500';
      case '...': return 'text-transparent';
      default: return 'text-slate-400';
    }
  };

  // Determine animations based on stepState
  let objectAnimClass = 'opacity-0 -translate-y-8'; // hidden above

  if (stepState === 'entering' || stepState === 'action') {
    objectAnimClass = 'opacity-100 translate-y-24 transition-all duration-700 ease-out';
  } else if (stepState === 'resolving' && actionPlayedInfo) {
    const anim = actionPlayedInfo.anim;
    if (anim === 'shoot') objectAnimClass = 'translate-y-24 animate-explode';
    else if (anim === 'collect') objectAnimClass = 'translate-y-24 animate-collect';
    else if (anim === 'bypass') objectAnimClass = 'translate-y-[400px] opacity-0 transition-all duration-700 ease-in';
    else if (anim === 'shield') objectAnimClass = 'opacity-0 -translate-y-0 scale-50 transition-all duration-500';
    else if (anim === 'hit') objectAnimClass = 'translate-y-64 opacity-0 scale-50 transition-all duration-500';
  }

  let shipAnimClass = '';
  if (stepState === 'resolving' && actionPlayedInfo?.anim === 'hit') {
    shipAnimClass = 'animate-shake';
  }

  const showLaser = stepState === 'action' && actionPlayedInfo?.anim === 'shoot';
  const showShield = (stepState === 'action' || stepState === 'resolving') && actionPlayedInfo?.anim === 'shield';

  return (
    <div className="flex-1 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzMzQxNTUiLz48L3N2Zz4=')] overflow-hidden flex flex-col items-center justify-between py-12">
      
      {/* Background Starfield Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none"></div>

      {/* Track / Lane */}
      <div className="absolute inset-y-0 w-32 border-x border-slate-700/30 bg-slate-800/20 backdrop-blur-sm pointer-events-none"></div>

      {/* Incoming Object */}
      <div className={`z-10 flex flex-col items-center mt-4 ${objectAnimClass}`}>
        {getObjectIcon()}
        <span className={`mt-2 font-mono text-xs uppercase tracking-widest ${getObjectColor()}`}>
          {currentObject}
        </span>
      </div>

      {/* Player Ship */}
      <div className={`z-10 mt-auto relative ${shipAnimClass}`}>
        <Rocket size={56} className="text-cyan-500 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
        {/* Thrust flame */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-md animate-pulse"></div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-4 bg-yellow-300 rounded-full blur-sm"></div>
        
        {/* Laser Effect */}
        {showLaser && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-10 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-laser"></div>
        )}
        
        {/* Shield Effect */}
        {showShield && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-cyan-400/80 bg-cyan-500/20 animate-shield"></div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
