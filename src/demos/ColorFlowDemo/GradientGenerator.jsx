import { useState } from 'react';

export default function GradientGenerator() {
  const [gradient, setGradient] = useState({
    start: '#FF6B6B',
    end: '#4ECDC4',
    angle: 45
  });

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Gradient Generator</h3>
      
      <div 
        className="w-full h-48 rounded-lg mb-6 border border-slate-700"
        style={{
          background: `linear-gradient(${gradient.angle}deg, ${gradient.start}, ${gradient.end})`
        }}
      />
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Color</label>
          <input
            type="color"
            value={gradient.start}
            onChange={e => setGradient({...gradient, start: e.target.value})}
            className="w-full h-10 cursor-pointer rounded"
          />
          <p className="text-xs text-slate-400 mt-1 text-center">{gradient.start}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">End Color</label>
          <input
            type="color"
            value={gradient.end}
            onChange={e => setGradient({...gradient, end: e.target.value})}
            className="w-full h-10 cursor-pointer rounded"
          />
          <p className="text-xs text-slate-400 mt-1 text-center">{gradient.end}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Angle: {gradient.angle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={gradient.angle}
          onChange={e => setGradient({...gradient, angle: e.target.value})}
          className="w-full"
        />
      </div>
      
      <div className="p-3 bg-slate-700/50 rounded-lg">
        <p className="text-sm text-slate-400 mb-2">CSS Code:</p>
        <code className="text-sm font-mono bg-slate-900 p-2 rounded block">
          background: linear-gradient({gradient.angle}deg, {gradient.start}, {gradient.end});
        </code>
      </div>
    </div>
  );
}