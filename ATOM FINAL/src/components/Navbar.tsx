import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Sun, Moon, Scale, Search, 
  ShoppingCart, Shield, Trash2, ArrowRight, Activity,
  Thermometer, Gauge, Cpu, Database, Layers, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo3D } from './Logo3D';

export const Navbar: React.FC = () => {
  const { 
    darkMode, toggleDarkMode, comparisonList, removeFromComparison, clearComparison, products, categories 
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showComparisonDrawer, setShowComparisonDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawers/menus on route change
  useEffect(() => {
    setIsOpen(false);
    setShowMegaMenu(false);
    setShowSearch(false);
    setShowComparisonDrawer(false);
  }, [location]);

  // Real-time search suggestions
  const searchSuggestions = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Thermometer': return <Thermometer className="w-5 h-5 text-blue-500" />;
      case 'Gauge': return <Gauge className="w-5 h-5 text-orange-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-red-500" />;
      case 'Database': return <Database className="w-5 h-5 text-purple-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Activity className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <>
      {/* Primary Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-800/50' 
          : 'py-5 bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <Logo3D className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-[0.25em] text-slate-900 dark:text-white leading-none">
                  ATOMAKK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-yellow-500 dark:text-yellow-400 mt-1">INDIA</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={`font-medium transition-colors hover:text-orange-500 ${location.pathname === '/' ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                Home
              </Link>
              <Link to="/?scroll=about" className={`font-medium transition-colors hover:text-orange-500 ${(location.pathname === '/' && location.search === '?scroll=about') ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                About
              </Link>
              
              {/* Products Dropdown Trigger */}
              <div 
                className="relative"
                onMouseEnter={() => setShowMegaMenu(true)}
                onMouseLeave={() => setShowMegaMenu(false)}
              >
                <button className="flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors py-2">
                  <span>Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMegaMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Mega Menu Dropdown */}
                {showMegaMenu && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-[650px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="col-span-2 pb-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Calibration Instruments</span>
                      <Link to="/products" className="text-xs font-semibold text-blue-500 hover:text-orange-500 flex items-center space-x-1">
                        <span>View All Products</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {categories.slice(0, Math.ceil(categories.length / 2)).map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/products?category=${cat.id}`}
                          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-750 transition-colors">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{cat.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{cat.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {categories.slice(Math.ceil(categories.length / 2)).map(cat => (
                        <Link 
                          key={cat.id} 
                          to={`/products?category=${cat.id}`}
                          className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-750 transition-colors">
                            {getCategoryIcon(cat.iconName)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{cat.name}</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">{cat.description}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-800/80 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">Verify Certificates</h5>
                          <p className="text-[10px] text-slate-500">Check calibration reports</p>
                        </div>
                        <Link to="/support" className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-orange-500 transition-colors text-xs font-bold">
                          Verify
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/industries" className={`font-medium transition-colors hover:text-orange-500 ${location.pathname === '/industries' ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                Industries
              </Link>
              <Link to="/?scroll=services" className={`font-medium transition-colors hover:text-orange-500 ${(location.pathname === '/' && location.search === '?scroll=services') ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                Services
              </Link>
              <Link to="/downloads" className={`font-medium transition-colors hover:text-orange-500 ${location.pathname === '/downloads' ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                Downloads
              </Link>
              <Link to="/contact" className={`font-medium transition-colors hover:text-orange-500 ${location.pathname === '/contact' ? 'text-orange-500' : 'text-slate-700 dark:text-slate-300'}`}>
                Contact Us
              </Link>
            </nav>

            {/* Header Right Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <button 
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Product Comparison Tray Trigger */}
              <button 
                onClick={() => setShowComparisonDrawer(true)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-orange-500 dark:hover:text-orange-400 transition-all relative"
                title="Product Comparison"
              >
                <Scale className="w-5 h-5" />
                {comparisonList.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {comparisonList.length}
                  </span>
                )}
              </button>

              {/* Dark/Light Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Security Shield Icon to quickly open Admin login portal */}
              <Link 
                to="/admin" 
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-blue-500 transition-all"
                title="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </Link>

              {/* Mobile Burger Menu Icon */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-300">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">Home</Link>
            <Link to="/?scroll=about" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">About Us</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">Products Catalogue</Link>
            <Link to="/industries" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">Industries Serve</Link>
            <Link to="/?scroll=services" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">Calibration Services</Link>
            <Link to="/downloads" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850">Downloads (Catalogues)</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-slate-900 dark:text-white">Contact Us</Link>
          </div>
        )}
      </header>

      {/* Global Full-Screen Search Modal (Command Palette Upgrade) */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 relative">
            
            {/* Spinning Brand Logo Watermark behind empty search space */}
            <div className="absolute right-4 bottom-4 opacity-[0.03] dark:opacity-[0.015] pointer-events-none z-0">
              <Logo3D className="w-32 h-32" />
            </div>

            {/* Header Search Field Input */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative z-10">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center space-x-3">
                <Search className="w-5 h-5 text-yellow-500 animate-pulse" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by model (e.g., ATM-100, CAL 4000)..."
                  className="w-full bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder-slate-400 text-lg"
                  autoFocus
                />
              </form>
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-block font-mono text-[9px] text-zinc-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                  ESC to exit
                </span>
                <button 
                  onClick={() => setShowSearch(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Empty Query: Render Quick Categories & Popular Searches */}
            {!searchQuery && (
              <div className="p-6 space-y-6 relative z-10 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">⚡ Quick Categories</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      onClick={() => setSearchQuery('temperature')}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-slate-850 hover:bg-yellow-500/10 border border-slate-200/60 dark:border-slate-800 hover:border-yellow-500/40 text-left transition-all group"
                    >
                      <Thermometer className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Temperature Calibrators</span>
                    </button>
                    <button 
                      onClick={() => setSearchQuery('pressure')}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-slate-850 hover:bg-yellow-500/10 border border-slate-200/60 dark:border-slate-800 hover:border-yellow-500/40 text-left transition-all group"
                    >
                      <Gauge className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Pressure Comparators</span>
                    </button>
                    <button 
                      onClick={() => setSearchQuery('multifunction')}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-slate-850 hover:bg-yellow-500/10 border border-slate-200/60 dark:border-slate-800 hover:border-yellow-500/40 text-left transition-all group"
                    >
                      <Cpu className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Multifunction Calibrators</span>
                    </button>
                    <button 
                      onClick={() => setSearchQuery('flow')}
                      className="flex items-center space-x-2.5 p-3 rounded-xl bg-white dark:bg-slate-850 hover:bg-yellow-500/10 border border-slate-200/60 dark:border-slate-800 hover:border-yellow-500/40 text-left transition-all group"
                    >
                      <Activity className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Ultrasonic Flow Meters</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">🔥 Popular Instruments</h4>
                  <div className="flex flex-wrap gap-2">
                    {['ATM-100', 'CAL 4000', 'ATM-1000', 'ATOM 14+', 'DL-20XX', '1000-T'].map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 dark:hover:text-black text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions list with live parameters */}
            {searchQuery && (
              <div className="p-4 max-h-[380px] overflow-y-auto space-y-2.5 bg-slate-50 dark:bg-slate-900/50 relative z-10">
                <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider pl-1">Product Suggestions</h4>
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map(p => {
                    const rangeKey = p.specs ? Object.keys(p.specs).find(k => k.toLowerCase().includes('range')) : undefined;
                    const rangeVal = (rangeKey && p.specs) ? p.specs[rangeKey] : undefined;
                    return (
                      <div 
                        key={p.id} 
                        onClick={() => {
                          navigate(`/products/${p.id}`);
                          setShowSearch(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-yellow-500/60 dark:hover:border-yellow-500/60 hover:shadow-md cursor-pointer group transition-all"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-semibold text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors text-sm">{p.name}</h5>
                            <span className="text-[9px] uppercase font-extrabold tracking-wider bg-slate-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-700/40">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{p.shortDescription}</p>
                          
                          {/* Technical Spec Badge row inside Search suggestions */}
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 font-mono text-[9px] text-zinc-400">
                            {p.accuracy && (
                              <span>Accuracy: <strong className="text-yellow-500/90 dark:text-yellow-400 font-bold">{p.accuracy}</strong></span>
                            )}
                            {rangeVal && (
                              <span>Range: <strong className="text-yellow-500/90 dark:text-yellow-400 font-bold">{rangeVal}</strong></span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4.5 h-4.5 text-slate-350 dark:text-zinc-550 group-hover:text-yellow-500 group-hover:translate-x-1.5 transition-all shrink-0" />
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No products matching <strong className="text-yellow-500">"{searchQuery}"</strong> found.</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Try searching for calibrator classes like Dry Block, Comparators, or Flow Meters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out Product Comparison Drawer */}
      {showComparisonDrawer && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-350">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Compare Products</h3>
                <span className="bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-400">
                  {comparisonList.length}/4
                </span>
              </div>
              <button 
                onClick={() => setShowComparisonDrawer(false)}
                className="p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {comparisonList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                  <Scale className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  <h4 className="font-semibold text-slate-700 dark:text-slate-400">Your Comparison Tray is empty</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">Add up to 4 instruments from their product pages to compare technical specifications side-by-side.</p>
                  <button 
                    onClick={() => {
                      setShowComparisonDrawer(false);
                      navigate('/products');
                    }}
                    className="mt-2 text-sm font-bold text-blue-500 hover:text-orange-500"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                comparisonList.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-850 relative group">
                    <div className="flex items-center space-x-3">
                      {/* Simulating product thumbnail */}
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${p.image.startsWith('/') ? 'from-blue-950 to-slate-900' : p.image} flex items-center justify-center p-0.5 text-white font-extrabold text-[9px] text-center relative overflow-hidden`}>
                        {p.image.startsWith('/') ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain pointer-events-none z-0 select-none" />
                        ) : (
                          p.id.split('-').slice(0, 2).join(' ').toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-slate-500 capitalize">{p.category} Calibrator</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromComparison(p.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {comparisonList.length > 0 && (
              <div className="p-5 border-t border-slate-150 dark:border-slate-850 space-y-3 bg-slate-50 dark:bg-slate-900">
                <button 
                  onClick={() => {
                    setShowComparisonDrawer(false);
                    navigate('/products?compare=true');
                  }}
                  disabled={comparisonList.length < 2}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 text-white shadow-lg transition-all ${
                    comparisonList.length < 2 
                      ? 'bg-slate-300 dark:bg-slate-850 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-95'
                  }`}
                >
                  <span>Compare Instruments</span>
                  <Scale className="w-4 h-4" />
                </button>
                {comparisonList.length < 2 && (
                  <p className="text-[11px] text-center text-slate-500">Please select at least 2 instruments to compare.</p>
                )}
                <button 
                  onClick={clearComparison}
                  className="w-full py-2 bg-transparent text-center text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Clear All Selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
