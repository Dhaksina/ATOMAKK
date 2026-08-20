import React, { useState } from 'react';
import { Briefcase, MapPin, Send, CheckCircle2, User, Mail, Clipboard } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const Careers: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Calibration Specialist');
  const [intro, setIntro] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setIntro('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const jobs = [
    {
      id: 'cal-spec',
      title: 'Senior Calibration Technician',
      location: 'Andheri East, Mumbai',
      dept: 'Metrology Lab',
      desc: 'Perform NABL calibration testing on pressure comparators, data loggers, and dry-block calibrators. Maintain test records and uncertainty reports.'
    },
    {
      id: 'embed-dev',
      title: 'Embedded Hardware Developer',
      location: 'Andheri East, Mumbai',
      dept: 'R&D Engineering',
      desc: 'Design PID feedback circuits, touch screen controls, and data logger telemetry modules. Program firmware using C++ and RTOS.'
    },
    {
      id: 'sales-eng',
      title: 'Regional Sales Executive',
      location: 'Pune / Chennai',
      dept: 'Sales & Marketing',
      desc: 'Manage dealer relationships, follow up on RFQ quotes, and conduct on-site product demonstrations for pharmaceuticals and power plants.'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">JOIN THE TEAM</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Careers at ATOMAKK INDIA</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            Work with metrology experts to build next-generation calibration instruments.
          </p>
        </div>

        {/* Core careers body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Job openings */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">Open Opportunities</h3>
            
            {jobs.map(job => (
              <GlassCard key={job.id} className="p-6 space-y-4" hoverEffect={false}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{job.title}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-455 text-slate-400 font-bold uppercase tracking-wider mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                        <span>{job.location}</span>
                      </span>
                      <span>•</span>
                      <span>{job.dept}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setRole(job.title);
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    <span>Apply Now</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{job.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Column Right: Application Form */}
          <div id="application-form" className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-md">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-850 pb-2 uppercase tracking-wide">Submit Application</h3>
            
            {submitted ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 p-1.5 rounded-full bg-emerald-500 text-white" />
                <h4 className="font-bold">Application Filed!</h4>
                <p className="text-xs">We have received your application. Our recruiting manager will get back to you by email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Singh"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Applying Role *</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-bold"
                  >
                    <option value="Calibration Specialist">Senior Calibration Technician</option>
                    <option value="Embedded Hardware Developer">Embedded Hardware Developer</option>
                    <option value="Regional Sales Executive">Regional Sales Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Cover Note / Profile intro</label>
                  <textarea 
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Briefly tell us about your experience in laboratory metrology or electronics development..."
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-blue-650 bg-blue-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Profile</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
