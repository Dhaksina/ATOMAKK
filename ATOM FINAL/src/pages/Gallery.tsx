import React, { useState } from 'react';
import { LayoutGrid, Eye, X, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const photos = [
    {
      id: 'cal-bench',
      title: 'Precision Calibration Bench',
      desc: 'Our laboratory testing environment displaying NABL reference standard probes and calibrators.',
      image: 'from-blue-600 to-indigo-900'
    },
    {
      id: 'cnc-machine',
      title: 'CNC Machining Facility',
      desc: 'Specialized lathe drilling multi-hole inserts for dry blocks based on custom probe diameters.',
      image: 'from-orange-600 to-red-950'
    },
    {
      id: 'thermal-profiling',
      title: 'Autoclave Thermal Profiling',
      desc: 'Mapping heat uniformity loops using multi-channel DL-20XX data acquisition hardware.',
      image: 'from-violet-600 to-purple-950'
    },
    {
      id: 'gasket-assembly',
      title: 'High-Pressure Seal Assembly',
      desc: 'Assembly area where comparators and hydraulic pumps are fitted with tight seals.',
      image: 'from-teal-600 to-emerald-900'
    },
    {
      id: 'flow-loop',
      title: 'Flow Calibration Loop',
      desc: 'Standard water flow test loop verifying clamp-on ultrasonic transducer velocity signals.',
      image: 'from-cyan-600 to-blue-900'
    },
    {
      id: 'metrology-lab',
      title: 'Primary Metrology Lab',
      desc: 'Specialized chamber with controlled climate testing uncertainties down to international standards.',
      image: 'from-pink-600 to-fuchsia-950'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">FACILITY TOUR</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Facility Gallery</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            Get a virtual tour of our metrology testing chambers, assembly bays, and insert lathe workshops.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <GlassCard key={photo.id} className="p-4 space-y-4 group">
              <div 
                className={`w-full h-52 rounded-xl bg-gradient-to-br ${photo.image} p-6 flex items-center justify-center text-white relative shadow-inner overflow-hidden cursor-pointer`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors duration-300" />
                <Eye className="w-10 h-10 text-white/70 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 z-10" />
              </div>
              <div className="px-1">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{photo.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 leading-normal">{photo.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Zoom Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-950 flex justify-between items-center border-b border-slate-850">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">{selectedPhoto.title}</h3>
                <button 
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`w-full h-80 bg-gradient-to-br ${selectedPhoto.image} p-8 flex items-center justify-center text-white relative`}>
                <span className="font-black text-2xl tracking-widest text-white/50 uppercase border-2 border-white/20 px-6 py-2 rounded-xl">ATOMAKK INDIA</span>
              </div>
              
              <div className="p-6 space-y-2 bg-slate-950">
                <p className="text-xs text-slate-400 leading-relaxed">{selectedPhoto.desc}</p>
                <div className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">MIDC Industrial Complex, Mumbai</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
