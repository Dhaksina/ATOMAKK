import React from 'react';

interface Logo3DProps {
  className?: string;
}

export const Logo3D: React.FC<Logo3DProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} perspective-[400px] group cursor-pointer`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible transform transition-all duration-500 ease-out group-hover:rotate-x-12 group-hover:rotate-y-12"
      >
        <defs>
          {/* Inner Glowing Nucleus Radial Gradient */}
          <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
            <stop offset="40%" stopColor="#eab308" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#eab308" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
          
          {/* Glowing Drop-shadow Filter for Electrons */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Orbit 1: Horizontal Track (0 degrees rotation) */}
        <g transform="rotate(0, 50, 50)">
          {/* Track Orbit Ring */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="40" 
            ry="12" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            className="text-slate-350 dark:text-zinc-800 opacity-60 dark:opacity-40"
          />
          {/* Electron Particle */}
          <circle r="3.5" fill="#facc15" filter="url(#glow)">
            <animateMotion 
              path="M 50,50 m -40,0 a 40,12 0 1,0 80,0 a 40,12 0 1,0 -80,0" 
              dur="4.5s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>

        {/* Orbit 2: Diagonal Track (60 degrees rotation) */}
        <g transform="rotate(60, 50, 50)">
          {/* Track Orbit Ring */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="40" 
            ry="12" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            className="text-slate-350 dark:text-zinc-800 opacity-60 dark:opacity-40"
          />
          {/* Electron Particle */}
          <circle r="3.5" fill="#facc15" filter="url(#glow)">
            <animateMotion 
              path="M 50,50 m -40,0 a 40,12 0 1,0 80,0 a 40,12 0 1,0 -80,0" 
              dur="3.8s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>

        {/* Orbit 3: Diagonal Track (-60 degrees rotation) */}
        <g transform="rotate(-60, 50, 50)">
          {/* Track Orbit Ring */}
          <ellipse 
            cx="50" 
            cy="50" 
            rx="40" 
            ry="12" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            className="text-slate-350 dark:text-zinc-800 opacity-60 dark:opacity-40"
          />
          {/* Electron Particle */}
          <circle r="3.5" fill="#facc15" filter="url(#glow)">
            <animateMotion 
              path="M 50,50 m -40,0 a 40,12 0 1,0 80,0 a 40,12 0 1,0 -80,0" 
              dur="5.2s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>

        {/* Core Glowing Nucleus */}
        <circle 
          cx="50" 
          cy="50" 
          r="12" 
          fill="url(#nucleusGlow)" 
          className="animate-pulse" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="4.5" 
          fill="#facc15" 
          filter="url(#glow)" 
        />
      </svg>
    </div>
  );
};
