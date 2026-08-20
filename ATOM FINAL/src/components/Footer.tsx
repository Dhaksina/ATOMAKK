import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Globe, Video,
  ArrowRight, CheckCircle, Scale, Shield, FileText, Send
} from 'lucide-react';
import { Logo3D } from './Logo3D';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-350 pt-16 pb-8 border-t border-slate-800 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Brief & Socials */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <Logo3D className="w-9 h-9" />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-[0.25em] text-white leading-none">
                  ATOMAKK
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-yellow-500 mt-1">INDIA</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Manufacturing high-performance calibration instruments and data acquisition systems for process industries and laboratories worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white transition-all duration-300" title="LinkedIn">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white transition-all duration-300" title="Twitter">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white transition-all duration-300" title="YouTube">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-l-2 border-orange-500 pl-3">Product Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/products?category=temperature" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Temperature Calibration</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=pressure" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Pressure Calibration</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=process" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Process Calibrators</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=logger" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Temperature Data Loggers</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=flow" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Flow Measurement</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Info & Resources */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-l-2 border-orange-500 pl-3">Resources & Support</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/support" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <Shield className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Certificate Verification</span>
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <FileText className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Download Catalogue</span>
                </Link>
              </li>
              <li>
                <Link to="/dealer-network" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Dealer Locator</span>
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Careers</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white hover:translate-x-1.5 transition-all inline-flex items-center space-x-1 group">
                  <Shield className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-500" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Map Info */}
          <div className="space-y-5">
            <h3 className="text-white font-bold text-base border-l-2 border-orange-500 pl-3">Newsletter</h3>
            <p className="text-sm text-slate-400">Subscribe for technical releases, new calibration models, and guides.</p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full bg-slate-800 text-white placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-750 focus:border-orange-500 outline-none pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {subscribed && (
              <div className="text-xs text-emerald-400 flex items-center space-x-1.5 animate-bounce">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you! Successfully subscribed.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Contact Details Row */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-850 rounded-lg text-orange-500">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sales & Support</p>
              <p className="text-white font-semibold">+91 97898 77567</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-850 rounded-lg text-blue-500">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email Inquiry</p>
              <p className="text-white font-semibold">sales@atomakk.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-850 rounded-lg text-emerald-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Corporate Office</p>
              <p className="text-white font-semibold leading-tight">Chromepet, Chennai, Tamil Nadu - 600044</p>
            </div>
          </div>
        </div>

        {/* Footer Base Rights */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ATOMAKK INDIA. All Rights Reserved. Made in India with Quality Assurance.</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-slate-350">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-350">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
