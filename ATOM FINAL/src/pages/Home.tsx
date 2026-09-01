import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Award, Zap, Users, Factory, Headset, 
  MapPin, CheckCircle2, ChevronRight, Download, Thermometer,
  Gauge, Cpu, Database, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { Logo3D } from '../components/Logo3D';
import { CreativeLogoShowcase } from '../components/CreativeLogoShowcase';

// Incremental Counter Hook
const AnimatedCounter: React.FC<{ target: number; suffix?: string; label: string }> = ({ 
  target, suffix = '', label 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // ms
    const increment = Math.ceil(target / (duration / 16)); // ~60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center p-6 bg-slate-900/40 dark:bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-sm">
      <div className="text-4xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-orange-500 bg-clip-text text-transparent mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
};

export const Home: React.FC = () => {
  const { products, categories } = useApp();
  const location = useLocation();

  // Scroll to section based on query parameter (?scroll=about or ?scroll=services)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToSection = params.get('scroll');
    if (scrollToSection) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollToSection);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  // Showcase 3 products (Left: CAL 4000, Center: ATOM 14+, Right: Ultrasonic Flow Meter)
  const featuredIds = ['cal-4000', 'atom-14-plus', 'ultrasonic-flow-meter'];
  const featuredProducts = featuredIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => p !== undefined);

  const getCategoryIcon = (iconName: string, sizeClass = "w-8 h-8") => {
    switch (iconName) {
      case 'Thermometer':
      case 'temperature': return <Thermometer className={`${sizeClass} text-blue-500`} />;
      case 'Gauge':
      case 'pressure': return <Gauge className={`${sizeClass} text-orange-500`} />;
      case 'Cpu':
      case 'process': return <Cpu className={`${sizeClass} text-red-500`} />;
      case 'Database':
      case 'logger': return <Database className={`${sizeClass} text-purple-500`} />;
      default: return <Activity className={`${sizeClass} text-teal-500`} />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 bg-black overflow-hidden">
        


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          {/* Hero Details */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest animate-pulse-slow">
              <Award className="w-4 h-4" />
              <span>NABL Standard Metrology Group</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Precision Calibration <br />
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Solutions
              </span> for Modern Industries
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Manufacturing high-performance calibration instruments, pressure comparators, data acquisition systems, and ultrasonic flow meters for laboratory and process automation applications.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link 
                to="/products" 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-orange-500/25 transition-all text-center flex items-center justify-center space-x-2 group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/downloads" 
                className="px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 dark:hover:border-slate-700 transition-all text-center flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5 text-orange-500" />
                <span>Download Catalogue</span>
              </Link>
            </div>
          </div>

          {/* Creative Logo Blueprint Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[400px]">
            <CreativeLogoShowcase />
          </div>
        </div>
      </section>

      {/* 2. ABOUT ATOM INDIA */}
      <section id="about" className="py-24 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Trust Badges */}
            <div className="space-y-6">
              <div className="p-10 bg-slate-900 dark:bg-slate-950 rounded-3xl relative overflow-hidden shadow-2xl border border-slate-800">
                <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full filter blur-[60px] opacity-20 pointer-events-none" />
                
                <h3 className="text-2xl font-extrabold text-white mb-6">Made in India. Engineered for World.</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  ATOMAKK India is an ISO 9001:2015 certified company spearheading instrumentation breakthroughs. By designing and building state-of-the-art metrology gear, we enable laboratories and automation plants to verify their calibration standards with absolute accuracy.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">ISO 9001 Quality</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">NABL Traceable</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">Fast Field Support</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider">Custom Inserts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Counters */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">ABOUT ATOMAKK INDIA</h2>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  High-Precision Calibration Standards Built Locally
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Our catalog offers temperature dry blocks down to -35°C and high-temp chambers up to 1200°C, high-pressure pneumatic/hydraulic pumps up to 1000 bar, multifunction electrical calibrators, temperature logging matrices, and clamp-on ultrasonic meters.
                </p>
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-2 gap-4">
                <AnimatedCounter target={100} suffix="+" label="Premium Products" />
                <AnimatedCounter target={500} suffix="+" label="Satisfied Clients" />
                <AnimatedCounter target={15} suffix="+" label="Industries Served" />
                <AnimatedCounter target={24} suffix="/7" label="Technical Support" />
              </div>
            </div>

          </div>

          {/* Expanded Brand Values & QMS inside About section */}
          <div className="mt-16 pt-16 border-t border-slate-100 dark:border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Local Manufacture</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                By manufacturing in Chennai, Tamil Nadu, India, we cut import duties, lower procurement costs for Indian labs, and shorten delivery lead times.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">High Accuracy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We invest deeply in material research to ensure dry-blocks do not deform over cycles and pressure fittings prevent leaks up to 1000 bar.
              </p>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Lifecycle Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We offer expert insert adjustments, quick-connect hoses replacement, battery cell replacements, and yearly NABL recalibration audits.
              </p>
            </GlassCard>
          </div>

        </div>
      </section>

      {/* 2.5 TECHNICAL SERVICES */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
          
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">TECHNICAL SERVICES</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Calibration & Customization</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              ATOMAKK India provides NABL-accredited support, custom block sleeves, and field-calibration engineering solutions.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8 space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Annual Metrology Recalibration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We offer yearly recalibration services for all dry blocks, process signals, and flow indicators. Calibrations are run in our controlled laboratory against NABL traceable standards. We provide certificate records documenting uncertainty calculations.
              </p>
            </GlassCard>

            <GlassCard className="p-8 space-y-4">
              <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Custom Block Inserts Machining</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Have unique sensor diameters? We use high-precision lathe machines to drill customized aluminum, brass, or copper block sleeves to accept multi-probe configurations. Standard turnaround is 3-5 working days.
              </p>
            </GlassCard>

            <GlassCard className="p-8 space-y-4">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Comparator Gasket & Vernier Service</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                High pressures demand absolute seals. We replace worn-out neoprene gaskets, rebuild micro-vernier pistons, and change hydraulic transmission media (oil/water) for comparators up to 1000 bar.
              </p>
            </GlassCard>

            <GlassCard className="p-8 space-y-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
                </svg>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">On-Site Heat profiling Audits</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We deploy our multi-channel DL-40XX rackmount logger units at your facility to perform thermal mapping of autoclaves, deep-freezers, and baking tunnels. This helps pharmaceutical and food processors meet HACCP/FDA audits.
              </p>
            </GlassCard>
          </div>

        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">PRODUCT CATEGORIES</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered Calibration Ranges
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Discover calibration setups designed to provide the highest uncertainties and temperature block stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(cat => (
              <GlassCard key={cat.id} className="p-8 flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-350">
                    {getCategoryIcon(cat.iconName, "w-6 h-6")}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center">
                  <Link 
                    to={`/products?category=${cat.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-blue-500 group-hover:text-orange-500 transition-colors flex items-center space-x-1"
                  >
                    <span>Explore Category</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SHOWCASE */}
      <section className="py-24 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">SHOWCASE</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Featured Instrumentation
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Get a look at some of our industry-best calibration controllers, block setups, and portable ultrasonic meters.
              </p>
            </div>
            <Link 
              to="/products"
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-white text-sm font-bold flex items-center space-x-1.5 transition-all self-start md:self-auto"
            >
              <span>View All 14 Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(p => (
              <GlassCard key={p.id} className="flex flex-col justify-between p-6">
                <div>
                  <div className={`w-full h-44 rounded-xl bg-gradient-to-br ${p.image.startsWith('/') ? 'from-blue-950 to-slate-900' : p.image} p-6 flex flex-col justify-between text-white shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black/35 px-2.5 py-1 rounded-full self-start backdrop-blur-sm relative z-10">
                      {p.category}
                    </span>
                    
                    {p.image.startsWith('/') && (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="absolute right-0 bottom-0 h-[85%] w-auto object-contain pointer-events-none z-0 select-none animate-product-3d" 
                      />
                    )}

                    <div className="relative z-10">
                      <h4 className="font-extrabold text-xl">
                        {p.name.startsWith('ATOMAKK 14+') || p.name.startsWith('ATOM 14+') ? 'ATOMAKK 14+' : p.name.startsWith('CAL 4000') ? 'CAL 4000' : p.name.split(' ')[0]}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-1 max-w-[55%]">{p.shortDescription}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{p.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/10">
                        {p.accuracy}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800/80 flex gap-3">
                  <Link 
                    to={`/products/${p.id}`} 
                    className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-all"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/request-quote?product=${encodeURIComponent(p.name)}`}
                    className="px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 text-slate-600 dark:text-slate-400 text-xs font-bold text-center transition-all"
                  >
                    Quote
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE ATOMAKK INDIA */}
      <section className="py-24 bg-slate-900 text-white dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">ATOMAKK ADVANTAGE</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Engineers Choose ATOMAKK INDIA
            </h3>
            <p className="text-slate-400 text-sm">
              We design and produce standards that stand up to the most demanding verification audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-850 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Factory className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Made in India</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Local manufacturing allows us to control production quality and provide rapid support.</p>
            </div>
            
            <div className="p-6 bg-slate-850 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">ISO 9001 Quality</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Our process guarantees strict compliance with international manufacturing procedures.</p>
            </div>

            <div className="p-6 bg-slate-850 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">High Accuracy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">We focus on high thermal stability (up to ±0.03°C) and electrical accuracies classing 0.01%.</p>
            </div>

            <div className="p-6 bg-slate-850 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Headset className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-white">Expert Support</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Direct support from instrumentation engineers for insert customization and recalibration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BROCHURE DOWNLOAD CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white relative">
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to Upgrade Your Calibration Labs?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            Download our complete corporate brochure and product catalogues to review full technical configurations and measurement uncertainties.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/downloads" 
              className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5 text-orange-500" />
              <span>Go to Downloads</span>
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold rounded-xl transition-all flex items-center justify-center"
            >
              <span>Contact Sales Team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
