import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Level1 from './Level1/Level1';
import PlaceholderLevel from './PlaceholderLevel';

const LEVELS = [
  { id: 1, title: 'Basi: Variabili e Condizioni', component: Level1 },
  { id: 2, title: 'Array a 3 corsie', component: PlaceholderLevel },
  { id: 3, title: 'Ricerca Min/Max', component: PlaceholderLevel },
];

const LevelManager = () => {
  const [currentLevel, setCurrentLevel] = useState(1);

  const CurrentLevelComponent = LEVELS.find(l => l.id === currentLevel)?.component;
  const currentTitle = LEVELS.find(l => l.id === currentLevel)?.title;

  return (
    <div className="flex flex-col flex-1 h-screen max-w-5xl mx-auto w-full border-x border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden">
      {/* Top UI: Breadcrumb */}
      <header className="flex items-center p-4 bg-slate-800/80 backdrop-blur-sm border-b border-cyan-900/50 z-20">
        <nav className="flex items-center text-xs font-bold text-cyan-500 overflow-x-auto whitespace-nowrap hide-scrollbar w-full">
          {LEVELS.map((level, index) => (
            <React.Fragment key={level.id}>
              <button 
                onClick={() => setCurrentLevel(level.id)}
                className={`transition-colors px-2 py-1 rounded ${
                  currentLevel === level.id 
                    ? 'bg-cyan-500/20 text-cyan-300' 
                    : 'text-slate-400 hover:text-cyan-400'
                }`}
              >
                L{level.id}: {level.title.split(':')[0]}
              </button>
              {index < LEVELS.length - 1 && (
                <ChevronRight size={14} className="mx-1 text-slate-600 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </nav>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative">
        {CurrentLevelComponent ? <CurrentLevelComponent /> : <div className="p-4">Livello non trovato</div>}
      </main>
    </div>
  );
};

export default LevelManager;
