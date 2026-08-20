import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Scale, X, ArrowLeftRight, Check,
  Thermometer, Gauge, Cpu, Database, Activity, CheckCircle, 
  Trash2, ShieldCheck, ArrowRight, HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../db/mockData';
import { GlassCard } from '../components/GlassCard';

export const Products: React.FC = () => {
  const { 
    products, categories, comparisonList, addToComparison, removeFromComparison, clearComparison 
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL Params
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';
  const isCompareMode = queryParams.get('compare') === 'true';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [comparedAddedFeedback, setComparedAddedFeedback] = useState<string | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    setSelectedCategory(queryParams.get('category') || 'all');
    setSearchQuery(queryParams.get('search') || '');
  }, [location.search]);

  // Filter products logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.specs && p.specs['Temperature Range'] && p.specs['Temperature Range'].toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.specs && p.specs['Pressure Range'] && p.specs['Pressure Range'].toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStock = !inStockOnly || p.inStock;
    return matchesCategory && matchesSearch && matchesStock;
  });

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    queryParams.set('category', catId);
    navigate({ search: queryParams.toString() });
  };

  const getCategoryIcon = (catId: string, sizeClass = "w-4 h-4") => {
    switch (catId) {
      case 'temperature': return <Thermometer className={`${sizeClass} text-blue-500`} />;
      case 'pressure': return <Gauge className={`${sizeClass} text-orange-500`} />;
      case 'process': return <Cpu className={`${sizeClass} text-red-500`} />;
      case 'logger': return <Database className={`${sizeClass} text-purple-500`} />;
      default: return <Activity className={`${sizeClass} text-teal-500`} />;
    }
  };

  const handleAddToCompare = (product: Product) => {
    const added = addToComparison(product);
    if (added) {
      setComparedAddedFeedback(product.id);
      setTimeout(() => setComparedAddedFeedback(null), 2500);
    }
  };

  // Render Comparison Matrix Page if ?compare=true
  if (isCompareMode) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <button 
                onClick={() => navigate('/products')} 
                className="text-xs font-bold text-slate-500 hover:text-orange-500 uppercase tracking-widest inline-flex items-center space-x-1.5 transition-colors mb-2"
              >
                <ArrowLeftRight className="w-4 h-4 rotate-185" />
                <span>Back to Catalogue</span>
              </button>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Instrument Specifications Comparison
              </h1>
            </div>
            {comparisonList.length > 0 && (
              <button 
                onClick={() => {
                  clearComparison();
                  navigate('/products');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl shadow transition-colors self-start sm:self-auto flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Selection</span>
              </button>
            )}
          </div>

          {comparisonList.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto space-y-4">
              <Scale className="w-16 h-16 text-slate-350 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Instruments Selected</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Add products from the catalog directory, then return here to view their structural and performance specifications side-by-side.
              </p>
              <button 
                onClick={() => navigate('/products')} 
                className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-orange-500 transition-colors uppercase tracking-widest"
              >
                Go to Catalogue
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-[200px]">Specification</th>
                    {comparisonList.map(p => (
                      <th key={p.id} className="p-4 border-l border-slate-200 dark:border-slate-800 w-[250px]">
                        <div className="space-y-3">
                          <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${p.image} p-3 flex flex-col justify-between text-white shadow-inner relative`}>
                            <button 
                              onClick={() => removeFromComparison(p.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-black/40 text-white hover:bg-red-500 transition-colors"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[8px] font-bold uppercase tracking-widest bg-black/30 px-1.5 py-0.5 rounded self-start">{p.category}</span>
                            <span className="font-extrabold text-sm line-clamp-1">{p.name.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                            <span className="text-[10px] text-slate-500 font-medium">Warranty: {p.warranty}</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-sm">
                  
                  {/* Category Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Category</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850 capitalize text-slate-800 dark:text-slate-200 font-semibold">{p.category} Calibrator</td>
                    ))}
                  </tr>

                  {/* Accuracy Class Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Accuracy Class</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-500/10">
                          {p.accuracy}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Range Spec Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Range</td>
                    {comparisonList.map(p => {
                      const range = (p.specs && (p.specs['Temperature Range'] || p.specs['Pressure Range'] || p.specs['Source/Measure Range'] || p.specs['Flow Velocity Range'])) || 'N/A';
                      return <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850 font-medium">{range}</td>;
                    })}
                  </tr>

                  {/* Stability Spec Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Stability / Deviation</td>
                    {comparisonList.map(p => {
                      const stability = (p.specs && (p.specs['Stability'] || p.specs['Fine Adjustment'] || p.specs['Accuracy'])) || 'N/A';
                      return <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">{stability}</td>;
                    })}
                  </tr>

                  {/* Operating Media Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Medium / Inputs</td>
                    {comparisonList.map(p => {
                      const media = (p.specs && (p.specs['Media'] || p.specs['TC Types Supported'] || p.specs['Sensor Types'] || p.specs['Fluid Types'])) || 'N/A';
                      return <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">{media}</td>;
                    })}
                  </tr>

                  {/* Weight Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Unit Weight</td>
                    {comparisonList.map(p => {
                      const wt = (p.specs && (p.specs['Weight'] || p.specs['Weight (Net)'])) || 'N/A';
                      return <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">{wt}</td>;
                    })}
                  </tr>

                  {/* Stock Availability Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-500 bg-slate-50/50 dark:bg-slate-850/20 text-xs uppercase tracking-wider">Availability</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">
                        {p.inStock ? (
                          <span className="text-emerald-500 font-bold text-xs inline-flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>In Stock</span>
                          </span>
                        ) : (
                          <span className="text-orange-500 font-bold text-xs inline-flex items-center space-x-1">
                            <HelpCircle className="w-4 h-4" />
                            <span>Lead Time 2-3 Wks</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Actions Row */}
                  <tr className="bg-slate-50 dark:bg-slate-900/60">
                    <td className="p-4"></td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="p-4 border-l border-slate-150 dark:border-slate-850">
                        <div className="flex flex-col gap-2">
                          <Link 
                            to={`/products/${p.id}`}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center rounded-lg transition-colors"
                          >
                            Product Details
                          </Link>
                          <Link 
                            to={`/request-quote?product=${encodeURIComponent(p.name)}`}
                            className="w-full py-2 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 text-slate-600 dark:text-slate-400 font-bold text-xs text-center rounded-lg transition-all"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STANDARD CATALOG MODE
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-slate-950 shadow-xl border border-slate-800 text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full filter blur-[80px] opacity-25 pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Instrumentation Directory</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore 14 industrial temperature block calibrators, pneumatic/hydraulic hand pumps, electrical multi-testers, heat loggers, and clamp flow loops.
            </p>
          </div>
        </div>

        {/* Global Directory Search & Filters Toggles */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="w-full md:max-w-md relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by instrument name, range, type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-850 pl-11 pr-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white outline-none focus:border-orange-500 text-sm transition-all"
            />
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <button 
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-750 dark:text-slate-350 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-200/40"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
            {comparisonList.length > 0 && (
              <Link 
                to="/products?compare=true"
                className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow shadow-orange-500/20"
              >
                <Scale className="w-4 h-4" />
                <span>View Comparison ({comparisonList.length})</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* FILTER SIDEBAR (Desktop) */}
          <aside className={`lg:block space-y-6 ${showFiltersMobile ? 'block' : 'hidden md:hidden lg:block'}`}>
            <GlassCard className="p-6 space-y-6" hoverEffect={false}>
              
              {/* Category Filter */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-2">Category</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === 'all' 
                        ? 'bg-blue-600 text-white shadow shadow-blue-500/10' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>All Products</span>
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat.id 
                          ? 'bg-blue-600 text-white shadow shadow-blue-500/10' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {getCategoryIcon(cat.id)}
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="space-y-3.5 border-t border-slate-150 dark:border-slate-800 pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 pb-1">Availability</h3>
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-0"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>

              {/* Fast Reset */}
              {(selectedCategory !== 'all' || searchQuery !== '' || inStockOnly) && (
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    navigate('/products');
                  }}
                  className="w-full py-2 bg-transparent text-center text-xs font-bold text-red-500 hover:text-red-600 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all"
                >
                  Reset All Filters
                </button>
              )}
            </GlassCard>
          </aside>

          {/* PRODUCTS CATALOG GRID */}
          <main className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 max-w-lg mx-auto p-6 space-y-4">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-lg text-slate-950 dark:text-white">No Instruments Found</h3>
                <p className="text-xs text-slate-500">We couldn't find any instruments matching your active combination of query and filters.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    navigate('/products');
                  }}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                >
                  Reset Filter Settings
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map(p => (
                  <GlassCard key={p.id} className="p-5 flex flex-col justify-between group">
                    <div>
                      {/* Product Visual Box */}
                      <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${p.image.startsWith('/') ? 'from-blue-950 to-slate-900' : p.image} p-4 flex flex-col justify-between text-white relative shadow-inner overflow-hidden`}>
                        <div className="flex justify-between items-start relative z-10">
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-black/45 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {p.category}
                          </span>
                          
                          {/* Checked Comparison indicator */}
                          <button 
                            onClick={() => handleAddToCompare(p)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              comparisonList.some(item => item.id === p.id)
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'bg-black/35 border-white/20 text-white/80 hover:bg-black/55'
                            }`}
                            title="Add to Compare"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {(p.photo || (p.image && (p.image.startsWith('/') || p.image.startsWith('http')))) && (
                          <img 
                            src={p.photo || p.image} 
                            alt={p.name} 
                            className="absolute right-0 bottom-0 h-[85%] max-w-[50%] object-contain pointer-events-none z-10 select-none animate-product-3d" 
                          />
                        )}

                        {/* Floating toaster for added comparison */}
                        {comparedAddedFeedback === p.id && (
                          <div className="absolute inset-0 bg-orange-600/90 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold transition-all animate-in fade-in duration-200">
                            <div className="flex items-center space-x-1.5">
                              <Check className="w-4 h-4" />
                              <span>Added to comparison tray</span>
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.15em]">{p.warranty} Warranty</span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight group-hover:text-orange-500 transition-colors">
                            {p.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {p.shortDescription}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-semibold">
                          <div className="truncate">Range: {(p.specs && (p.specs['Temperature Range'] || p.specs['Pressure Range'] || p.specs['Source/Measure Range'] || p.specs['Flow Velocity Range'])) || 'N/A'}</div>
                          <div className="truncate text-right">Accuracy: {(p.specs && p.specs['Accuracy']) || 'High'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-150 dark:border-slate-800/80 flex gap-2">
                      <Link 
                        to={`/products/${p.id}`}
                        className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors"
                      >
                        Details
                      </Link>
                      <Link 
                        to={`/request-quote?product=${encodeURIComponent(p.name)}`}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 text-slate-500 dark:text-slate-400 font-bold text-xs text-center transition-all"
                      >
                        RFQ
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
