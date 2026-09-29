import React, { useState } from 'react';
import LevelManager from './components/LevelManager';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30">
      <LevelManager />
    </div>
  );
}

export default App;
