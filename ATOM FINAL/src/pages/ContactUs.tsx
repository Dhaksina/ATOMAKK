import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, CheckCircle2, Globe, Clock,
  ArrowRight, PhoneCall, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export const ContactUs: React.FC = () => {
  const { addContactInquiry } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Catalog Query');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      addContactInquiry({
        name,
        email,
        subject,
        message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">GET IN TOUCH</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Contact ATOMAKK INDIA</h1>
          <p className="text-slate-650 dark:text-slate-400 text-sm">
            Contact our Sales or technical engineering support desk for calibrations, custom blocks, or dealership opportunities.
          </p>
        </div>

        {/* Contact Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Contact Info cards */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 space-y-6" hoverEffect={false}>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">Sales & Support Desk</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Phone Support</h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">+91 97898 77567</p>
                    <p className="text-slate-500 text-xs">Mon-Sat: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl border border-orange-500/20 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Email Correspondence</h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">atomakkindia@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Headquarters & Facility</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                      The Madras Science & Industrial Resources <br />
                      #40, 2nd Floor, 2nd St, Padmavathy Nagar, Chromepet, Chennai, 600044, Tamil Nadu, India.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full filter blur-[40px] pointer-events-none" />
              <h3 className="font-bold text-base mb-2">Need a fast quote?</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                We have a dedicated online RFQ system that will forward details directly to our regional technicians.
              </p>
              <a 
                href="https://wa.me/919789877567" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Quick WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Column Right: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-md">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-6 border-b border-slate-150 dark:border-slate-850 pb-2 uppercase tracking-wide">Send an Enquiry Message</h3>
            
            {submitted ? (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
                <CheckCircle className="w-10 h-10 p-2 rounded-full bg-emerald-500 text-white" />
                <h4 className="font-bold text-lg">Enquiry Recorded Successfully</h4>
                <p className="text-xs max-w-sm">We have saved your submission. One of our instrumentation experts will contact you via email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Singh"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Inquiry Subject *</label>
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  >
                    <option value="Product Catalog Query">Product Catalog Query</option>
                    <option value="Calibration Calibration Service">Calibration Calibration Service</option>
                    <option value="Authorized Dealership Proposal">Authorized Dealership Proposal</option>
                    <option value="Custom Dry Block Inserts">Custom Dry Block Inserts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Message Description *</label>
                  <textarea 
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your calibration requirements, temperature ranges, or pipe parameters..."
                    rows={5}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors uppercase tracking-wider flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Location Map Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-6 rounded-3xl overflow-hidden shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span>Metrology Facility Location Map</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The Madras Science & Industrial Resources — #40, 2nd Floor, 2nd St, Padmavathy Nagar, Chromepet, Chennai, 600044
              </p>
            </div>
            <a 
              href="https://maps.google.com/?q=Padmavathy+Nagar,+Chromepet,+Chennai,+600044" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-orange-500 hover:text-white hover:bg-orange-500 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shrink-0"
            >
              <Globe className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          
          {/* Interactive Google Map Embed */}
          <div className="w-full h-96 sm:h-[450px] rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
            <iframe
              title="The Madras Science & Industrial Resources Google Map Location"
              src="https://maps.google.com/maps?q=Padmavathy%20Nagar%2C%20Chromepet%2C%20Chennai%2C%20600044&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
