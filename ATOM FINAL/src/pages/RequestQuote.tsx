import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Send, CheckCircle2, ShoppingCart, HelpCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RequestQuote: React.FC = () => {
  const { products, addQuoteRequest } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse product name from URL param
  const queryParams = new URLSearchParams(location.search);
  const prefilledProduct = queryParams.get('product') || '';

  // Form State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledProduct) {
      setSelectedProduct(prefilledProduct);
    } else if (products.length > 0) {
      setSelectedProduct(products[0].name);
    }
  }, [prefilledProduct, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone && selectedProduct) {
      addQuoteRequest({
        productName: selectedProduct,
        customerName: name,
        company,
        email,
        phone,
        quantity,
        message
      });
      setSubmitted(true);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setQuantity(1);
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs font-bold text-slate-500 hover:text-orange-500 uppercase tracking-widest inline-flex items-center space-x-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Request a Quote</h1>
            <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed">
              Submit your RFQ details. Our regional Sales representative will prepare a commercial proposal within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10 p-2 rounded-full bg-emerald-500 text-white" />
              <h4 className="font-extrabold text-lg">Quote Request Submitted</h4>
              <p className="text-xs max-w-sm">We have saved your request for quotation. Our commercial team will email your sales proposal shortly.</p>
              <Link to="/products" className="text-xs font-bold text-blue-500 hover:text-orange-500 mt-2">
                Browse More Products
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Select Instrument *</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-850 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-bold"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anil Deshmukh"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Company / Institution</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Apex Research Labs Ltd"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Quantity Required *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99000 12345"
                  className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Special Requirements (Optional)</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention custom block insert bore dimensions, required temperature points, or quick delivery request..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-850 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit RFQ Request</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
