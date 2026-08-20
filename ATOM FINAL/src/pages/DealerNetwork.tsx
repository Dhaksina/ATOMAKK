import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Navigation, Award } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const DealerNetwork: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<'all' | 'west' | 'north' | 'south' | 'east'>('all');

  const dealers = [
    {
      id: 'd-west',
      name: 'Gujarat Calibration Agency',
      zone: 'west',
      location: 'Vadodara, Gujarat',
      phone: '+91 265 2441 9091',
      email: 'gujarat@atomdealers.com',
      address: 'Alkapuri Sector 3, Vadodara - 390007'
    },
    {
      id: 'd-north',
      name: 'Indo-Metrology Sales Corporation',
      zone: 'north',
      location: 'New Delhi',
      phone: '+91 11 4451 8890',
      email: 'delhi@atomdealers.com',
      address: 'Okhla Industrial Area Phase III, New Delhi - 110020'
    },
    {
      id: 'd-south',
      name: 'Southern Instrumentation Agencies',
      zone: 'south',
      location: 'Chennai, Tamil Nadu',
      phone: '+91 44 2490 1102',
      email: 'chennai@atomdealers.com',
      address: 'Guindy Industrial Estate, Chennai - 600032'
    },
    {
      id: 'd-east',
      name: 'East Calibration & Control systems',
      zone: 'east',
      location: 'Kolkata, West Bengal',
      phone: '+91 33 2281 7741',
      email: 'kolkata@atomdealers.com',
      address: 'Salt Lake Sector V, Kolkata - 700091'
    }
  ];

  const filteredDealers = selectedZone === 'all' 
    ? dealers 
    : dealers.filter(d => d.zone === selectedZone);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">PARTNERSHIP</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authorized Dealer Network</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            Locate official ATOMAKK India dealers and distributors in your region for localized purchasing and recalibration services.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-md mx-auto">
          {['all', 'west', 'north', 'south', 'east'].map(zone => (
            <button 
              key={zone}
              onClick={() => setSelectedZone(zone as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                selectedZone === zone 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Dealers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDealers.map(dealer => (
            <GlassCard key={dealer.id} className="p-6 space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-full filter blur-[20px] pointer-events-none" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full capitalize">{dealer.zone} Zone</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-2 group-hover:text-orange-500 transition-colors">{dealer.name}</h3>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-450 uppercase font-bold tracking-wider mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{dealer.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-400">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{dealer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{dealer.email}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-2 italic bg-slate-50 dark:bg-slate-850/40 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800">
                  {dealer.address}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
};
