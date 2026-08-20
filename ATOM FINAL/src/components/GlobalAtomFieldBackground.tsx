import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface FloatingAtomProps {
  top: string;
  left?: string;
  right?: string;
  scale: number;
  speed: number;
  factor: number;
  scrollY: number;
  isHome: boolean;
}

const FloatingAtom: React.FC<FloatingAtomProps> = ({ 
  top, left, right, scale, speed, factor, scrollY, isHome 
}) => {
  // Apply scroll translation for parallax movement
  const translateY = scrollY * factor;
  const rotateX = 72;
  const rotateY = 15 * speed;
  const rotateZ = scrollY * 0.015 * speed;

  return (
    <div 
      className="absolute transform-style-preserve-3d transition-transform duration-300 ease-out pointer-events-none"
      style={{
        top,
        left,
        right,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex items-center justify-center perspective-[500px]">
        <style>{`
          @keyframes spinZ-${speed} {
            0% { transform: rotateZ(0deg); }
            100% { transform: rotateZ(360deg); }
          }
          .spin-1-${speed} { animation: spinZ-${speed} ${4.8 / speed}s linear infinite; transform-origin: 50px 50px; }
          .spin-2-${speed} { animation: spinZ-${speed} ${3.8 / speed}s linear infinite; transform-origin: 50px 50px; }
          .spin-3-${speed} { animation: spinZ-${speed} ${5.8 / speed}s linear infinite; transform-origin: 50px 50px; }
        `}</style>

        <svg 
          viewBox="0 0 100 100" 
          className="absolute w-full h-full overflow-visible"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <defs>
            <radialGradient id={`coreGlow-${speed}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="35%" stopColor="#eab308" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`bgTrailGrad-${speed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
              <stop offset="60%" stopColor="#eab308" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </linearGradient>
            <filter id={`coreBlur-${speed}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Orbit 1: Comet Trail + Particle */}
          <g style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformOrigin: '50px 50px', transformStyle: 'preserve-3d' }}>
            <g className={`spin-1-${speed}`} style={{ transformStyle: 'preserve-3d' }}>
              <path d="M 50,50 m -35,0 a 35,35 0 0,1 35,-35" fill="none" stroke={`url(#bgTrailGrad-${speed})`} strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="50" cy="15" r="3.2" fill="#facc15" filter={`url(#coreBlur-${speed})`} />
            </g>
          </g>

          {/* Orbit 2 */}
          <g style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY + 50}deg)`, transformOrigin: '50px 50px', transformStyle: 'preserve-3d' }}>
            <g className={`spin-2-${speed}`} style={{ transformStyle: 'preserve-3d' }}>
              <path d="M 50,50 m -35,0 a 35,35 0 0,1 35,-35" fill="none" stroke={`url(#bgTrailGrad-${speed})`} strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="50" cy="15" r="3.2" fill="#facc15" filter={`url(#coreBlur-${speed})`} />
            </g>
          </g>

          {/* Orbit 3 */}
          <g style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY - 50}deg)`, transformOrigin: '50px 50px', transformStyle: 'preserve-3d' }}>
            <g className={`spin-3-${speed}`} style={{ transformStyle: 'preserve-3d' }}>
              <path d="M 50,50 m -35,0 a 35,35 0 0,1 35,-35" fill="none" stroke={`url(#bgTrailGrad-${speed})`} strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="50" cy="15" r="3.2" fill="#facc15" filter={`url(#coreBlur-${speed})`} />
            </g>
          </g>

          {/* Core Nucleus */}
          <circle cx="50" cy="50" r="10.5" fill={`url(#coreGlow-${speed})`} className="animate-pulse" />
          <circle cx="50" cy="50" r="4.2" fill="#facc15" filter={`url(#coreBlur-${speed})`} />
        </svg>
      </div>
    </div>
  );
};

export const GlobalAtomFieldBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  // Config for 5 distinct floating cores
  const configs = [
    { id: 1, top: '8%',  left: '5%',   scale: 1.1,  speed: 1.0,  factor: -0.06 },
    { id: 2, top: '22%', right: '6%',  scale: 0.9,  speed: 0.75, factor: 0.08  },
    { id: 3, top: '50%', left: '8%',   scale: 0.8,  speed: 1.15, factor: -0.07 },
    { id: 4, top: '75%', right: '12%', scale: 0.85, speed: 0.9,  factor: 0.05  },
    { id: 5, top: '38%', right: '40%', scale: 0.55, speed: 1.3,  factor: -0.04 }
  ];

  // Make background dimmer on sub-pages to maximize readability of dense layouts
  const baseOpacity = isHome ? 0.05 : 0.02;
  const opacity = Math.max(0.012, baseOpacity - scrollY / 3000);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-2] overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300">

      {/* Floating Parallax Atom field */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-700" style={{ opacity }}>
        {configs.map((atom) => (
          <FloatingAtom
            key={atom.id}
            top={atom.top}
            left={atom.left}
            right={atom.right}
            scale={atom.scale}
            speed={atom.speed}
            factor={atom.factor}
            scrollY={scrollY}
            isHome={isHome}
          />
        ))}
      </div>
    </div>
  );
};
