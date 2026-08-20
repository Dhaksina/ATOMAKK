import React from 'react';

export const ShowcaseLogo3D: React.FC = () => {
  return (
    <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center perspective-[800px] group select-none">
      
      {/* Outer Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full filter blur-[60px] opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Main Container with 3D Mouse Tilt Effect */}
      <div className="relative w-full h-full transform transition-all duration-700 ease-out group-hover:rotate-x-12 group-hover:rotate-y-12 transform-style-preserve-3d flex items-center justify-center">
        
        {/* Outer Metrology Calibration Dial Ring (Slow Counter-Clockwise Spin) */}
        <svg 
          viewBox="0 0 200 200" 
          className="absolute w-[95%] h-[95%] text-slate-350 dark:text-zinc-800 opacity-60 dark:opacity-40 animate-[spin_40s_linear_infinite_reverse]"
        >
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4,8" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Dial Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            return (
              <line
                key={i}
                x1="100"
                y1="14"
                x2="100"
                y2="22"
                stroke="currentColor"
                strokeWidth="1.5"
                transform={`rotate(${angle}, 100, 100)`}
              />
            );
          })}
        </svg>

        {/* Inner Ticking Calibration Target Ring (Clockwise Spin) */}
        <svg 
          viewBox="0 0 200 200" 
          className="absolute w-[80%] h-[80%] text-yellow-500/40 dark:text-yellow-500/20 animate-[spin_25s_linear_infinite]"
        >
          <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="12,18" />
          <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,4" />
        </svg>

        {/* Core 3D Atom Model Animation */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute w-[68%] h-[68%] overflow-visible filter drop-shadow-[0_0_15px_rgba(250,204,21,0.25)]"
        >
          <defs>
            {/* Center Nucleus Glow Gradient */}
            <radialGradient id="showcaseNucleusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="35%" stopColor="#eab308" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#eab308" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
            
            {/* Particle Glow Filter */}
            <filter id="showcaseParticleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Orbit 1: Horizontal Track (0 degrees rotation) */}
          <g transform="rotate(0, 50, 50)">
            {/* Ambient track glow */}
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="#facc15" 
              strokeOpacity="0.08" 
              strokeWidth="4" 
            />
            {/* Crisp track ring */}
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              className="text-slate-400 dark:text-zinc-700 opacity-60 dark:opacity-40"
            />
            {/* Orbiting Electron */}
            <circle r="4.2" fill="#facc15" filter="url(#showcaseParticleGlow)">
              <animateMotion 
                path="M 50,50 m -42,0 a 42,13 0 1,0 84,0 a 42,13 0 1,0 -84,0" 
                dur="4s" 
                repeatCount="indefinite" 
              />
            </circle>
          </g>

          {/* Orbit 2: Diagonal Track (60 degrees rotation) */}
          <g transform="rotate(60, 50, 50)">
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="#facc15" 
              strokeOpacity="0.08" 
              strokeWidth="4" 
            />
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              className="text-slate-400 dark:text-zinc-700 opacity-60 dark:opacity-40"
            />
            <circle r="4.2" fill="#facc15" filter="url(#showcaseParticleGlow)">
              <animateMotion 
                path="M 50,50 m -42,0 a 42,13 0 1,0 84,0 a 42,13 0 1,0 -84,0" 
                dur="3.4s" 
                repeatCount="indefinite" 
              />
            </circle>
          </g>

          {/* Orbit 3: Diagonal Track (-60 degrees rotation) */}
          <g transform="rotate(-60, 50, 50)">
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="#facc15" 
              strokeOpacity="0.08" 
              strokeWidth="4" 
            />
            <ellipse 
              cx="50" 
              cy="50" 
              rx="42" 
              ry="13" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              className="text-slate-400 dark:text-zinc-700 opacity-60 dark:opacity-40"
            />
            <circle r="4.2" fill="#facc15" filter="url(#showcaseParticleGlow)">
              <animateMotion 
                path="M 50,50 m -42,0 a 42,13 0 1,0 84,0 a 42,13 0 1,0 -84,0" 
                dur="4.8s" 
                repeatCount="indefinite" 
              />
            </circle>
          </g>

          {/* Center Glowing Nucleus Reactor Core */}
          <circle 
            cx="50" 
            cy="50" 
            r="14" 
            fill="url(#showcaseNucleusGlow)" 
            className="animate-pulse" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="5.5" 
            fill="#facc15" 
            filter="url(#showcaseParticleGlow)" 
          />
        </svg>



      </div>
    </div>
  );
};
