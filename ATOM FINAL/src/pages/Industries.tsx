import React from 'react';
import { 
  Flame, Zap, Pill, Factory, Car, FlaskConical, Apple, Beaker, Wind, Droplet, 
  ChevronRight, ArrowRight, ShieldCheck
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { industries } from '../db/mockData';

export const Industries: React.FC = () => {
  const getIndustryIcon = (iconName: string, sizeClass = "w-6 h-6") => {
    switch (iconName) {
      case 'Pill': return <Pill className={`${sizeClass} text-emerald-500`} />;
      case 'Flame': return <Flame className={`${sizeClass} text-orange-500`} />;
      case 'Zap': return <Zap className={`${sizeClass} text-yellow-500`} />;
      case 'Building': return <Factory className={`${sizeClass} text-blue-500`} />;
      case 'Car': return <Car className={`${sizeClass} text-purple-500`} />;
      case 'FlaskConical': return <FlaskConical className={`${sizeClass} text-red-500`} />;
      case 'Apple': return <Apple className={`${sizeClass} text-pink-500`} />;
      case 'Beaker': return <Beaker className={`${sizeClass} text-cyan-500`} />;
      case 'Wind': return <Wind className={`${sizeClass} text-teal-500`} />;
      default: return <Droplet className={`${sizeClass} text-blue-400`} />;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">SECTORS</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Industries We Serve</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            ATOMAKK India supplies calibration and logging standards to critical manufacturing, testing, and engineering domains.
          </p>
        </div>

        {/* Grid of 10 Industries */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map(ind => (
            <GlassCard key={ind.id} className="p-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  {getIndustryIcon(ind.iconName)}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    {ind.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-xs font-bold text-slate-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Regulatory Approved</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
};
