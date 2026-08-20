import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, FileText, CheckCircle2, ChevronDown, 
  HelpCircle, ClipboardCheck, ArrowRight, ShieldAlert, Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

export const Support: React.FC = () => {
  const { verifyCertificate } = useApp();

  // Verification State
  const [certNo, setCertNo] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verified, setVerified] = useState(false);

  // Warranty State
  const [wName, setWName] = useState('');
  const [wSerial, setWSerial] = useState('');
  const [wModel, setWModel] = useState('');
  const [wDate, setWDate] = useState('');
  const [wRegistered, setWRegistered] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certNo && serialNo) {
      const result = verifyCertificate(certNo, serialNo);
      setVerificationResult(result || 'NOT_FOUND');
      setVerified(true);
    }
  };

  const handleWarrantyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (wName && wSerial && wModel && wDate) {
      setWRegistered(true);
      setTimeout(() => {
        setWRegistered(false);
        setWName('');
        setWSerial('');
        setWModel('');
        setWDate('');
      }, 5000);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How frequently should I recalibrate my ATOMAKK dry block calibrator?',
      a: 'We recommend standard recalibration every 12 months under normal operation. For high-temperature furnaces (like ATM-1000) operating continuously above 1000°C, a 6-month calibration interval is recommended to adjust for ceramic block drifting.'
    },
    {
      q: 'Can I order custom-diameter sensor inserts for the ATM-100?',
      a: 'Yes, we machine custom brass and aluminum sleeve inserts at our Chennai facility. Simply contact support with your sensor probe diameter (e.g. 4.5mm, 1/4" NPT) and sleeve depth specifications.'
    },
    {
      q: 'What fluid is recommended for the 1000-T Table Top Comparator?',
      a: 'Depending on the model configuration, you should use either distilled water or sebacate-based calibration oil. Avoid standard mineral oils or tap water, as they can corrode the internal vernier piston threads.'
    },
    {
      q: 'How do I download the Windows analysis software for the DL-20XX Loggers?',
      a: 'Head to our Downloads page to grab the latest release of the "ATOMAKK ThermLog Suite" setup installer. Connect the data logger to your PC using the included USB-A to USB-C cable to establish link.'
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">SUPPORT CENTRAL</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Support & Verification</h1>
          <p className="text-slate-655 dark:text-slate-400 text-sm">
            Verify the authenticity of ATOMAKK calibration certificates, register product warranties, or find answers to technical inquiries.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: Calibration Verification */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-md space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ClipboardCheck className="w-5 h-5 text-blue-500" />
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wide">Calibration Certificate Verification</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify NABL-traceable calibration documents issued by ATOMAKK INDIA. Enter the Certificate Number and the Instrument Serial Number listed on your paper record.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Certificate No. *</label>
                  <input 
                    type="text" 
                    required
                    value={certNo}
                    onChange={(e) => setCertNo(e.target.value)}
                    placeholder="e.g. AI-2026-9041"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Serial Number *</label>
                  <input 
                    type="text" 
                    required
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    placeholder="e.g. SN-1000-2490"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
              >
                Query Certificate Records
              </button>
            </form>

            {/* Verification Result Output */}
            {verified && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {verificationResult === 'NOT_FOUND' ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-250 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm mb-1">Authenticity Verification Failed</h4>
                      <p>No calibration records match Certificate No. "{certNo}" and Serial No. "{serialNo}" in our central database. Please verify the numbers or contact our support team.</p>
                    </div>
                  </div>
                ) : (
                  <div className={`p-5 border rounded-2xl flex items-start space-x-3 text-xs leading-relaxed ${
                    verificationResult.status === 'Valid' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-950/20 border-amber-250 dark:border-amber-900/30 text-amber-600 dark:text-amber-400'
                  }`}>
                    {verificationResult.status === 'Valid' 
                      ? <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-500" />
                      : <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-amber-500" />
                    }
                    <div className="space-y-2 flex-1">
                      <h4 className="font-extrabold text-sm border-b border-black/5 dark:border-white/5 pb-1">
                        Certificate Authenticated ({verificationResult.status})
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] tracking-wider">Calibration Model</span>
                          <span className="text-slate-800 dark:text-white">{verificationResult.modelNo}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] tracking-wider">Issued Customer</span>
                          <span className="text-slate-800 dark:text-white">{verificationResult.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] tracking-wider">Calibration Date</span>
                          <span>{verificationResult.calibrationDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase text-[9px] tracking-wider">Recalibration Due</span>
                          <span className={verificationResult.status === 'Expired' ? 'text-red-500' : ''}>{verificationResult.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Column Right: Warranty Registration */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-md space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ClipboardCheck className="w-5 h-5 text-orange-500" />
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wide">Product Warranty Registration</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Register your newly purchased ATOMAKK instrumentation to log your serial warranty and receive firmware update alerts.
            </p>

            {wRegistered ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-8 h-8 p-1.5 rounded-full bg-emerald-505 text-white bg-emerald-500" />
                <h4 className="font-bold">Warranty Registered!</h4>
                <p className="text-xs">Your instrument has been logged. A confirmation email has been dispatched.</p>
              </div>
            ) : (
              <form onSubmit={handleWarrantyRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Company / Organization *</label>
                    <input 
                      type="text" 
                      required
                      value={wName}
                      onChange={(e) => setWName(e.target.value)}
                      placeholder="Organization Ltd"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Model Name / Number *</label>
                    <input 
                      type="text" 
                      required
                      value={wModel}
                      onChange={(e) => setWModel(e.target.value)}
                      placeholder="e.g. CAL 4000"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Unit Serial Number *</label>
                    <input 
                      type="text" 
                      required
                      value={wSerial}
                      onChange={(e) => setWSerial(e.target.value)}
                      placeholder="e.g. SN-30G-7741"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Purchase Date *</label>
                    <input 
                      type="date" 
                      required
                      value={wDate}
                      onChange={(e) => setWDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
                >
                  Log Product Warranty
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <h2 className="font-extrabold text-2xl text-slate-900 dark:text-white uppercase tracking-wider">Calibration FAQ Help</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800/60 p-5 rounded-2xl cursor-pointer hover:border-orange-500/35 transition-all"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{faq.q}</h4>
                  <ChevronDown className={`w-4 h-4 text-slate-450 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-orange-500' : ''}`} />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-slate-550 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-2 animate-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
