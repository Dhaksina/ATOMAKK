import React from 'react';

export const CreativeAtomBackground: React.FC = () => {
  // Generate 12 unique orbital paths with varying radii, speeds, angles, and sizes
  const orbits = [
    { rotZ: 0,   dur: '5.5s', rx: 45, ry: 13, size: 4.2 },
    { rotZ: 30,  dur: '4.8s', rx: 41, ry: 10, size: 3.2 },
    { rotZ: 60,  dur: '6.2s', rx: 47, ry: 15, size: 3.8 },
    { rotZ: 90,  dur: '4.2s', rx: 39, ry: 9,  size: 3.0 },
    { rotZ: 120, dur: '5.8s', rx: 43, ry: 12, size: 3.5 },
    { rotZ: 150, dur: '5.0s', rx: 45, ry: 14, size: 3.6 },
    { rotZ: -30, dur: '4.5s', rx: 40, ry: 11, size: 3.1 },
    { rotZ: -60, dur: '6.5s', rx: 48, ry: 16, size: 4.0 },
    { rotZ: -90, dur: '5.2s', rx: 42, ry: 10, size: 3.3 },
    { rotZ: 10,  dur: '7.0s', rx: 49, ry: 17, size: 4.5 },
    { rotZ: 75,  dur: '5.4s', rx: 44, ry: 13, size: 3.4 },
    { rotZ: -45, dur: '6.0s', rx: 43, ry: 12, size: 3.2 }
  ];

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black z-0">
      
      {/* Background Matte Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/20 to-black pointer-events-none" />
      
      {/* Soft Radial Ambient Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-yellow-500/5 rounded-full filter blur-[130px] pointer-events-none" />

      {/* Main 3D System Container */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
        <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[700px] md:h-[700px] flex items-center justify-center transform-style-preserve-3d animate-[spin_80s_linear_infinite]">
          
          <svg 
            viewBox="0 0 100 100" 
            className="absolute w-[85%] h-[85%] overflow-visible filter drop-shadow-[0_0_30px_rgba(250,204,21,0.25)]"
          >
            <defs>
              {/* Nucleus Glow Gradient */}
              <radialGradient id="creativeNucleusGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
                <stop offset="35%" stopColor="#eab308" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#eab308" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </radialGradient>
              
              {/* Glow Filter for Electron Spheres */}
              <filter id="creativeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbiting Spheres (Only Yellow Balls with Motion, No Lines) */}
            {orbits.map((orb, index) => (
              <g 
                key={index} 
                transform={`rotate(${orb.rotZ}, 50, 50)`}
                style={{ transformOrigin: '50px 50px' }}
              >
                <circle r={orb.size} fill="#facc15" filter="url(#creativeGlowFilter)">
                  <animateMotion 
                    path={`M 50,50 m -${orb.rx},0 a ${orb.rx},${orb.ry} 0 1,0 ${orb.rx * 2},0 a ${orb.rx},${orb.ry} 0 1,0 -${orb.rx * 2},0`} 
                    dur={orb.dur} 
                    repeatCount="indefinite" 
                  />
                </circle>
              </g>
            ))}

            {/* Center Pulsating Core Nucleus */}
            <circle 
              cx="50" 
              cy="50" 
              r="13" 
              fill="url(#creativeNucleusGlow)" 
              className="animate-pulse" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="5.5" 
              fill="#facc15" 
              filter="url(#creativeGlowFilter)" 
            />
          </svg>

        </div>
      </div>
    </div>
  );
};
