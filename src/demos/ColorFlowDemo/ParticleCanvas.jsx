import { useRef, useEffect, useState, useCallback } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [particleCount, setParticleCount] = useState(80);

  // Optimized particle creation
  const createParticles = useCallback((canvas) => {
    return Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      originalSpeedX: 0,
      originalSpeedY: 0,
      color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)` // Cool colors only
    }));
  }, [particleCount]);

  // Optimized drawing function
  const drawParticles = useCallback((ctx, canvas, particles, mouseX, mouseY) => {
    // Clear with slight fade effect for trails
    ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach(particle => {
      // Mouse interaction
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100 && mouseX > 0 && mouseY > 0) {
        // Push away from mouse with smooth easing
        const force = 0.3 * (1 - distance / 100);
        particle.speedX = particle.originalSpeedX - dx * force;
        particle.speedY = particle.originalSpeedY - dy * force;
      } else {
        // Gradually return to original speed
        particle.speedX += (particle.originalSpeedX - particle.speedX) * 0.05;
        particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.05;
      }

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off walls with damping
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -0.9;
        particle.x = particle.x < 0 ? 0 : canvas.width;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -0.9;
        particle.y = particle.y < 0 ? 0 : canvas.height;
      }

      // Keep within bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Draw particle with glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Add glow effect
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace('60%)', '30%)');
      ctx.fill();
    });

    // Draw connections (optimized - only check nearby particles)
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.1)';
    ctx.lineWidth = 0.3;
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = dx * dx + dy * dy; // Skip sqrt for performance
        
        if (distance < 4000) { // 4000 = 63.2px squared
          // Calculate alpha based on distance
          const alpha = 0.3 * (1 - Math.sqrt(distance) / 63.2);
          ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;
    
    drawParticles(ctx, canvas, particles, mousePosRef.current.x, mousePosRef.current.y);
    animationRef.current = requestAnimationFrame(animate);
  }, [drawParticles]);

  // Initialize and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create particles with original speeds stored
    particlesRef.current = createParticles(canvas);
    particlesRef.current.forEach(p => {
      p.originalSpeedX = p.speedX;
      p.originalSpeedY = p.speedY;
    });

    // Start animation
    animate();

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
      mousePosRef.current = { x: -100, y: -100 }; // Move mouse far away
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = createParticles(canvas);
      particlesRef.current.forEach(p => {
        p.originalSpeedX = p.speedX;
        p.originalSpeedY = p.speedY;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, createParticles]);

  // Update particles when count changes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    particlesRef.current = createParticles(canvas);
    particlesRef.current.forEach(p => {
      p.originalSpeedX = p.speedX;
      p.originalSpeedY = p.speedY;
    });
  }, [particleCount, createParticles]);

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-2">Interactive Particles</h3>
      <p className="text-slate-400 mb-6">Move your mouse over the canvas to interact with particles</p>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">
            Particle Density
          </label>
          <span className="text-cyan-400 font-bold">{particleCount}</span>
        </div>
        <input
          type="range"
          min="30"
          max="150"
          value={particleCount}
          onChange={(e) => setParticleCount(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Light</span>
          <span>Medium</span>
          <span>Dense</span>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 rounded-2xl border-2 border-slate-700/50 cursor-pointer bg-gradient-to-br from-slate-900 to-slate-950"
        />
        <div className="absolute bottom-4 left-4 text-sm text-slate-400 bg-slate-900/70 px-3 py-1 rounded-lg">
          ✨ Interactive - Move mouse to repel particles
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <h4 className="font-medium mb-2">Performance Tips:</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• Lower particle count for better performance on mobile</li>
          <li>• Uses optimized rendering with requestAnimationFrame</li>
          <li>• Connection lines only drawn between nearby particles</li>
          <li>• Smooth mouse interaction with easing</li>
        </ul>
      </div>
    </div>
  );
}