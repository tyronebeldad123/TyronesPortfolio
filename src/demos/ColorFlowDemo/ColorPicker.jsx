import { useState } from 'react';

export default function ColorPicker() {
  const [colors, setColors] = useState(['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']);
  const [activeColor, setActiveColor] = useState(0);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Color Palette</h3>
        <div className="flex gap-4 mb-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-lg cursor-pointer transition-all ${
                activeColor === index ? 'ring-4 ring-cyan-400 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(index)}
            />
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Selected Color</label>
          <input
            type="color"
            value={colors[activeColor]}
            onChange={(e) => {
              const newColors = [...colors];
              newColors[activeColor] = e.target.value;
              setColors(newColors);
            }}
            className="w-full h-10 cursor-pointer rounded"
          />
        </div>
        
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-400 mb-2">Current Palette:</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-sm font-mono">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => {
          const randomColors = Array.from({ length: 5 }, () => 
            `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
          );
          setColors(randomColors);
        }}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium"
      >
        Generate Random Palette
      </button>
    </div>
  );
}