import React from 'react';
import { Lock } from 'lucide-react';

const PlaceholderLevel = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
      <div className="w-24 h-24 mb-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <Lock size={40} className="text-slate-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-300 mb-2 tracking-wider">COMING SOON</h2>
      <p className="text-slate-500 text-sm">
        Questo livello è in fase di sviluppo. Torna più tardi per affrontare nuove sfide spaziali!
      </p>
    </div>
  );
};

export default PlaceholderLevel;
