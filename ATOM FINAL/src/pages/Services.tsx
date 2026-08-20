import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, Hammer, Layers, Settings, ShieldCheck, 
  ArrowLeft, ChevronRight, ClipboardCheck 
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Services: React.FC = () => {
  return (
    <div className="min-h-screen pt-36 md:pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Prominent Navigation Back Button */}
        <div className="flex justify-start select-none">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white hover:bg-orange-500 dark:bg-slate-900 dark:hover:bg-orange-500 text-slate-700 hover:text-white dark:text-slate-300 dark:hover:text-white text-xs font-bold transition-all shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">TECHNICAL SERVICES</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Calibration & Customization</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            ATOMAKK India provides NABL-accredited support, custom block sleeves, and field-calibration engineering solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Annual Metrology Recalibration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We offer yearly recalibration services for all dry blocks, process signals, and flow indicators. Calibrations are run in our controlled laboratory against NABL traceable standards. We provide certificate records documenting uncertainty calculations.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Custom Block Inserts Machining</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Have unique sensor diameters? We use high-precision lathe machines to drill customized aluminum, brass, or copper block sleeves to accept multi-probe configurations. Standard turnaround is 3-5 working days.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Comparator Gasket & Vernier Service</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              High pressures demand absolute seals. We replace worn-out neoprene gaskets, rebuild micro-vernier pistons, and change hydraulic transmission media (oil/water) for comparators up to 1000 bar.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">On-Site Heat profiling Audits</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We deploy our multi-channel DL-40XX rackmount logger units at your facility to perform thermal mapping of autoclaves, deep-freezers, and baking tunnels. This helps pharmaceutical and food processors meet HACCP/FDA audits.
            </p>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};
