import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, X, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const posts = [
    {
      id: 'ceramic-drift',
      title: 'Addressing Thermal Drift in Dry Blocks above 1000°C',
      excerpt: 'At extreme high temperatures, ceramic blocks display minute thermal drift. Learn how dual-zone heating controls minimize calibration uncertainty.',
      content: 'Calibration of high-temperature thermocouples (such as Type R, S, and B) requires dry block systems operating from 300°C up to 1200°C. In this range, conventional metal blocks degrade rapidly due to oxidation. ATOMAKK India employs advanced high-purity ceramic wells. However, ceramic blocks exhibit higher thermal resistance. To counteract temperature gradients, our ATM-1000 utilizes a dual-zone PID feedback loop. An independent heater at the bottom of the well matches the temperature at the top zone, reducing measurement uncertainty to ±0.2°C at extreme heats.',
      date: 'June 18, 2026',
      readTime: '6 min read',
      author: 'Dr. Ramesh Mehta (NABL Metrology Head)'
    },
    {
      id: 'hydraulic-vs-pneumatic',
      title: 'Pneumatic vs Hydraulic Hand Pumps: Choosing the Right Standard',
      excerpt: 'Pneumatic hand pumps generate up to 40 bar with ease, but hydraulic scissor pumps scale to 1000 bar. We analyze key field use cases.',
      content: 'Field calibration of pressure transmitters requires generating stable test pressures. Pneumatic pumps (such as the ATM-30 H) compress ambient air. They are lightweight, clean, and ideal for ranges from -0.95 bar vacuum to 40 bar pressure. For safety valves and heavy hydraulic transmitters, positive pressures exceeding 700 bar are common. Here, hydraulic hand pumps (like the ATM-30 H) are required, using liquid media (Sebacate oil or distilled water). Since liquids are incompressible, scissor-action pumps can generate up to 1000 bar with minimal leverage force.',
      date: 'May 10, 2026',
      readTime: '4 min read',
      author: 'Vikram Singh (Lead Field Engineer)'
    },
    {
      id: 'transit-time-ultrasound',
      title: 'Non-Invasive Flow Audits using Transit-Time Technology',
      excerpt: 'Audit water loops without cutting pipe walls. We outline clamp-on transducer physics and signal filtering techniques.',
      content: 'Clamp-on flow measurement relies on transit-time ultrasonic physics. Two transducers act as both emitters and receivers, sending high-frequency pulses diagonally through the pipe walls. The travel time of the wave moving with the liquid is slightly shorter than the wave moving against it. By calculating this delta-t, the flow meter computes the average velocity. ATOMAKK India\'s Handheld Ultrasonic Flow Meter utilizes advanced digital signal filtering (DSP) to process these acoustic waves in steel, PVC, and concrete pipes without disrupting plant operations.',
      date: 'April 22, 2026',
      readTime: '5 min read',
      author: 'Siddharth Roy (Operations Director)'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">KNOWLEDGE CENTER</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Metrology Blog & News</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            Read calibration articles, guidebooks, and engineering updates compiled by the ATOMAKK India Metrology group.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <GlassCard key={post.id} className="p-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span>{post.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button 
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-extrabold uppercase tracking-widest text-blue-500 hover:text-orange-500 flex items-center space-x-1 transition-colors"
                >
                  <span>Read Full Article</span>
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Detailed Article Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-xs font-bold text-slate-500 hover:text-orange-500 uppercase tracking-widest inline-flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </button>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>{selectedPost.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{selectedPost.readTime}</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedPost.title}
                  </h2>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center space-x-2 text-xs text-slate-500">
                  <User className="w-4 h-4 text-orange-500" />
                  <span>Author: <strong>{selectedPost.author}</strong></span>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
