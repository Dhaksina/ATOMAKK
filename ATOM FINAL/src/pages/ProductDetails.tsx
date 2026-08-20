import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, Download, Send, PhoneCall, Scale, 
  ShieldCheck, HelpCircle, ChevronRight, CheckCircle2,
  Clock, Thermometer, Gauge, Cpu, Database, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { generateProductPDF } from '../utils/pdfGenerator';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToComparison, comparisonList, addQuoteRequest } = useApp();

  const product = products.find(p => p.id === id);

  // Quote Form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'specs'>('features');
  const [downloading, setDownloading] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    setPhotoError(false);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center text-center space-y-4">
        <HelpCircle className="w-16 h-16 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Instrument Not Found</h2>
        <p className="text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Handle RFQ Submit
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      addQuoteRequest({
        productName: product.name,
        customerName: name,
        company,
        email,
        phone,
        quantity,
        message
      });
      setFormSubmitted(true);
      // Reset form
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setQuantity(1);
      setMessage('');
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  // Download & Open PDF (Datasheet or User Manual)
  const handleDownload = (targetPdfUrl?: string, pdfType: 'Datasheet' | 'Manual' = 'Manual') => {
    if (!product) return;
    setDownloading(true);
    let pdfUrl = targetPdfUrl || (pdfType === 'Manual' ? product.manualUrl || product.datasheetUrl : product.datasheetUrl) || `/brochures/${product.name.replace(/\s+/g, '-')}_datasheet.pdf`;
    
    // Convert Base64 data URLs to Blob Object URLs so Chrome opens & downloads them seamlessly
    let blobObjectUrl: string | null = null;
    if (pdfUrl.startsWith('data:')) {
      try {
        const parts = pdfUrl.split(';base64,');
        const mime = parts[0].replace('data:', '') || 'application/pdf';
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        pdfUrl = URL.createObjectURL(blob);
        blobObjectUrl = pdfUrl;
      } catch (e) {
        console.warn('Failed to convert base64 to Blob URL:', e);
      }
    }

    // Open PDF in browser tab
    window.open(pdfUrl, '_blank');

    // Trigger file download fallback
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_${pdfType}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (blobObjectUrl) {
      setTimeout(() => URL.revokeObjectURL(blobObjectUrl!), 10000);
    }

    setTimeout(() => setDownloading(false), 1500);
  };

  // WhatsApp click handler
  const waMessage = encodeURIComponent(`Hi ATOMAKK INDIA, I am interested in requesting a quote/details for the ${product.name} (Model ID: ${product.id}).`);
  const whatsappUrl = `https://wa.me/919789877567?text=${waMessage}`;

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const getCategoryIcon = (catId: string, sizeClass = "w-5 h-5") => {
    switch (catId) {
      case 'temperature': return <Thermometer className={`${sizeClass} text-blue-500`} />;
      case 'pressure': return <Gauge className={`${sizeClass} text-orange-500`} />;
      case 'process': return <Cpu className={`${sizeClass} text-red-500`} />;
      case 'logger': return <Database className={`${sizeClass} text-purple-500`} />;
      default: return <Activity className={`${sizeClass} text-teal-500`} />;
    }
  };

  // Normalize features into an array of distinct bullet points
  const displayFeatures = React.useMemo(() => {
    if (!product?.features) return [];
    const raw = Array.isArray(product.features) ? product.features : [product.features];
    const items: string[] = [];

    raw.forEach(f => {
      if (typeof f !== 'string') return;
      const str = f.trim();
      if (!str) return;

      // Special case: handle smashed features string from prompt/screenshot
      if (str.includes('High-accuracy current simulation') && str.includes('Suitable for AC/DC calibration')) {
        items.push(
          'High-accuracy current simulation',
          'Suitable for AC/DC calibration',
          'Rugged portable design',
          'Ideal for laboratory and field testing'
        );
      } else if (str.includes('\n') || str.includes('•') || str.includes(';')) {
        str.split(/[\n•;]+/).map(s => s.trim()).filter(Boolean).forEach(s => items.push(s));
      } else {
        items.push(str);
      }
    });

    return items.length > 0 ? items : (product.features || []);
  }, [product?.features]);

  // Ensure specs has proper values
  const displaySpecs = React.useMemo(() => {
    const isCurrentCoil = product?.id === '50-turns-current-coil' || 
                          product?.name?.toLowerCase().includes('50 turns') || 
                          product?.name?.toLowerCase().includes('current coil');

    if (isCurrentCoil) {
      if (
        !product?.specs || 
        Object.keys(product.specs).length <= 3 ||
        product.specs['Range'] === 'Standard industrial range' ||
        !product.specs['Product Type']
      ) {
        return {
          'Product Type': 'Current Transformer (CT) Test Fixture',
          'Application': 'Clamp Meter Calibration',
          'Current Type': 'AC / DC',
          'Input Current': 'Up to 20 A',
          'Coil Type': 'Precision Multi-Turn Test Coil',
          'Input Terminal': 'Safety Banana Socket',
          'Enclosure': 'Portable Heavy-Duty Carry Case',
          'Calibration Certificate': 'NABL Calibration Certificate Included'
        };
      }
    }

    if (product?.specs && Object.keys(product.specs).length > 0) {
      return product.specs;
    }
    return {
      'Product Type': 'Precision Testing Equipment',
      'Accuracy': product?.accuracy || 'Standard Accuracy',
      'Warranty': product?.warranty || '1 Year'
    };
  }, [product?.specs, product?.accuracy, product?.warranty, product?.id, product?.name]);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center space-x-2">
          <Link to="/products" className="text-slate-500 hover:text-orange-500 transition-colors inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Presentation Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: High-Res Card and Spec Tab */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-br ${product.image.startsWith('/') ? 'from-blue-950 to-slate-900' : product.image} p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-[40px] pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <span className="text-xs font-extrabold uppercase tracking-widest bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm flex items-center space-x-1">
                  {getCategoryIcon(product.category, "w-4 h-4")}
                  <span className="text-white ml-1 capitalize">{product.category}</span>
                </span>
                
                <button 
                  onClick={() => addToComparison(product)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    comparisonList.some(item => item.id === product.id)
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-black/35 border-white/20 text-white hover:bg-black/55'
                  }`}
                  title="Add to Comparison List"
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>

              {(product.photo || (product.image && (product.image.startsWith('/') || product.image.startsWith('http')))) && (
                <img 
                  src={product.photo || product.image} 
                  alt={product.name} 
                  className="absolute right-4 bottom-4 h-[75%] max-w-[50%] object-contain pointer-events-none z-10 select-none animate-product-3d" 
                />
              )}

              <div className="space-y-2 z-10">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">{product.name}</h1>
                <p className="text-sm text-white/90 max-w-xl leading-relaxed">{product.shortDescription}</p>
                <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-orange-400">
                  <span className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 uppercase">
                    {product.accuracy}
                  </span>
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-white">{product.warranty} Warranty</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Features vs Specs) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
              <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button 
                  onClick={() => setActiveTab('features')}
                  className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${
                    activeTab === 'features' 
                      ? 'border-orange-500 text-orange-500' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Key Features
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-all ${
                    activeTab === 'specs' 
                      ? 'border-orange-500 text-orange-500' 
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Detailed Specifications
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'features' ? (
                  <div className="space-y-6">
                    <ul className="space-y-4">
                      {displayFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Download Manual & Datasheet options under Key Features */}
                    <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">Product Manual & Technical Datasheet</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Download technical datasheets and operation manuals for this instrument.</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => handleDownload(product.datasheetUrl, 'Datasheet')}
                          disabled={downloading}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Datasheet</span>
                        </button>
                        <button
                          onClick={() => handleDownload(product.manualUrl || product.datasheetUrl, 'Manual')}
                          disabled={downloading}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>User Manual</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left border-collapse text-sm">
                      <tbody>
                        {Object.entries(displaySpecs).map(([key, value], idx) => (
                          <tr 
                            key={key} 
                            className={`border-b border-slate-200 dark:border-slate-800 ${
                              idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-850/40' : 'bg-transparent'
                            }`}
                          >
                            <td className="p-3.5 font-bold text-slate-650 dark:text-slate-400 w-1/3 border-r border-slate-250 dark:border-slate-800">{key}</td>
                            <td className="p-3.5 text-slate-800 dark:text-slate-200 font-semibold">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column Right: RFQ Form and Quick CTA buttons */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Actions Panel */}
            <GlassCard className="p-6 space-y-4" hoverEffect={false}>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Actions Portal</h3>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleDownload(product?.datasheetUrl, 'Datasheet')}
                  disabled={downloading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-350 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-wider"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>{downloading ? 'Preparing File...' : 'Download Technical Datasheet'}</span>
                </button>
                
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all uppercase tracking-wider"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Chat on WhatsApp Sales</span>
                </a>
              </div>
              
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{product.inStock ? 'Ready to Ship' : 'Lead time: 2-3 Wks'}</span>
                </span>
                <span>ISO 9001:2015 Approved</span>
              </div>
            </GlassCard>

            {/* Request Quote Card Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-md">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-850 pb-2">Request an Instrument Quote</h3>
              
              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-2.5 animate-in zoom-in-95 duration-200">
                  <Check className="w-8 h-8 p-1.5 rounded-full bg-emerald-500 text-white" />
                  <h4 className="font-bold text-base">Quote Request Submitted</h4>
                  <p className="text-xs">Your inquiry for the {product.name} has been recorded. Our sales team will get in touch with you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anil Deshmukh"
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Company</label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company Ltd"
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Quantity Required *</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email *</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99000 12345"
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Additional Requirements</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Include NABL accredited certificates for 3 points..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Physical Instrument Photo Section */}
        {product.photo && (
          <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Physical Design & Interface</h3>
            
            <GlassCard className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center overflow-hidden relative">
              {/* Decorative background spinning atom */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.03] dark:opacity-[0.06] pointer-events-none select-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500 animate-spin-slow">
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                  <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(30 50 50)" />
                  <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(90 50 50)" />
                  <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(150 50 50)" />
                </svg>
              </div>

              {/* Physical details info */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                    Industrial Metrology Chassis
                  </span>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                    Rugged Build with Precision Controls
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Precision-engineered structure featuring a heavy-duty industrial chassis designed for stable sub-zero operations. Equipped with dual structural handle knobs for secure portability, anti-slip stabilizer pads, and a brush-finished stainless steel top plate housing the dry block insert alongside the built-in PID temperature controller display.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Well Block Depth</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">{product.specs?.['Well Depth'] || '150 mm'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Well Diameter</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">{product.specs?.['Well Diameter'] || '30 mm'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Power Rating</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">{product.specs?.['Power Supply'] || '230 VAC'}</span>
                  </div>
                </div>
              </div>

              {/* Physical photo cutout with 3D animation */}
              <div className="md:col-span-5 flex justify-center items-center relative min-h-[280px]">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl filter blur-[40px] pointer-events-none" />
                <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center p-4 w-full h-full">
                  {photoError ? (
                    <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-400 dark:text-slate-500 bg-slate-100/5 backdrop-blur-sm">
                      <Cpu className="w-10 h-10 mb-3 text-yellow-500/40 animate-pulse animate-duration-2000" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Design Model Pending</span>
                      <span className="text-[9px] text-slate-500 mt-1.5 max-w-[220px] leading-relaxed">
                        To show image, save transparent PNG to:<br/>
                        <code className="text-yellow-500/80 dark:text-yellow-400/80 font-mono mt-1 block select-all">/images/products/{product.id}.png</code>
                      </span>
                    </div>
                  ) : (
                    <img 
                      src={product.photo} 
                      alt={`${product.name} physical details`} 
                      onError={() => setPhotoError(true)}
                      className="w-full h-full object-contain pointer-events-none select-none animate-product-3d filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)]" 
                    />
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Related products Row */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Related Instruments</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <GlassCard key={p.id} className="p-5 flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${p.image.startsWith('/') ? 'from-blue-950 to-slate-900' : p.image} p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden`}>
                      <span className="text-[8px] font-bold uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full self-start relative z-10">{p.category}</span>
                      
                      {p.image.startsWith('/') && (
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="absolute right-0 bottom-0 h-[85%] w-auto object-contain pointer-events-none z-0 select-none animate-product-3d" 
                        />
                      )}

                      <span className="font-extrabold text-sm line-clamp-1 relative z-10 max-w-[55%]">{p.name}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.shortDescription}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/products/${p.id}`}
                    className="mt-6 w-full py-2 bg-slate-100 hover:bg-orange-500 dark:bg-slate-800 hover:text-white dark:hover:bg-orange-500 text-slate-800 dark:text-white font-bold text-xs text-center rounded-lg transition-all"
                  >
                    View Details
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
