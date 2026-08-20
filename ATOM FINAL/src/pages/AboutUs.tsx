import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Factory, HeartHandshake, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const AboutUs: React.FC = () => {
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

        {/* Title Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">OUR IDENTITY</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">About ATOMAKK India</h1>
          <p className="text-slate-650 dark:text-slate-400 text-sm">
            Manufacturing metrology-grade calibration blocks, pressure comparators, data logging grids, and ultrasonic flow meters.
          </p>
        </div>

        {/* Corporate Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Precision Engineering Meets Local Ingenuity
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded with the vision to make India self-reliant in premium process instrumentation calibration, ATOMAKK India designs and manufactures metrology-grade equipment that rivals international standards. 
            </p>
            <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
              From our state-of-the-art facility at The Madras Science & Industrial Resources in Chennai, Tamil Nadu, our engineers utilize high-grade materials (like specialized anodized alloys and thermal ceramic wells) to construct dry-block wells, micro-verniers, and multi-channel logging chips. We serve lead pharmaceuticals, oil & gas refiners, steel manufacturing grids, and government laboratories.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                <CheckCircle2 className="w-4.5 h-4.5 text-orange-500" />
                <span>NABL Standard Calibration</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-500" />
                <span>ISO 9001:2015 Registered</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Visual Brand seal */}
            <div className="p-8 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full filter blur-[60px] opacity-20 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">Trust seal</span>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full">Quality Certified</span>
              </div>

              <h3 className="text-xl font-bold mb-4">Our Quality Management System</h3>
              <p className="text-xs text-slate-405 text-slate-400 leading-relaxed mb-6">
                We implement a strict multi-tier quality check system. Every product shipped is assigned a unique tracking serial number and is subjected to rigorous NABL reference testing. If calibration drift occurs during transit or usage, our local service technicians offer prompt field adjustments.
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 text-center">
                <div>
                  <div className="text-3xl font-extrabold text-white">100%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">Made In India</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">±0.01%</div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">Precision Limits</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white uppercase tracking-wider text-center">Our Core Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Local Manufacture</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                By manufacturing in Chennai, Tamil Nadu, we cut import duties, lower procurement costs for Indian labs, and shorten delivery lead times.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">High Accuracy</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We invest deeply in material research to ensure dry-blocks do not deform over cycles and pressure fittings prevent leaks up to 1000 bar.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Lifecycle Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We offer expert insert adjustments, quick-connect hoses replacement, battery cell replacements, and yearly NABL recalibration audits.
              </p>
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
};
