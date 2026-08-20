import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 9000);
      const limit = Math.min(density, 60); // Cap particles to maintain performance

      for (let i = 0; i < limit; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const dotColor = darkMode ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, '; // primary colors
      const lineAlpha = darkMode ? 0.05 : 0.03;

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${dotColor}${p.opacity})`;
        ctx.fill();

        // Connect nearby particles with lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = darkMode 
              ? `rgba(255, 255, 255, ${lineAlpha * (1 - dist / 120)})`
              : `rgba(0, 0, 0, ${lineAlpha * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    // Initialize resize observer to support container resizing
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    handleResize();
    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [darkMode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 opacity-60"
    />
  );
};
