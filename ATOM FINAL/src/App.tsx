import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppProvider } from './context/AppContext';
import { GlobalAtomFieldBackground } from './components/GlobalAtomFieldBackground';

// Import Pages
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContactUs } from './pages/ContactUs';
import { Industries } from './pages/Industries';
import { Services } from './pages/Services';
import { Downloads } from './pages/Downloads';
import { Blog } from './pages/Blog';
import { Gallery } from './pages/Gallery';
import { Careers } from './pages/Careers';
import { RequestQuote } from './pages/RequestQuote';
import { DealerNetwork } from './pages/DealerNetwork';
import { Support } from './pages/Support';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';

// Lucide Icons
import { Phone, ArrowUp, MessageSquare } from 'lucide-react';

// Scroll Restoration Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Track scroll position to show back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <GlobalAtomFieldBackground />
      
      {/* Sticky Header */}
      <Navbar />

      {/* Main Page Viewport */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Navigate to="/?scroll=about" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/services" element={<Navigate to="/?scroll=services" replace />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/dealer-network" element={<DealerNetwork />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Assist Widgets */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col space-y-3">
        {/* WhatsApp floating click-to-chat */}
        <a 
          href="https://wa.me/919789877567?text=Hi%20ATOM%20INDIA%20Support%2C%20I%20have%20an%2520instrumentation%2520inquiry." 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 duration-300 relative group"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-14 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            WhatsApp Live Support
          </span>
        </a>

        {/* Back-To-Top button */}
        {showBackToTop && (
          <button 
            onClick={handleScrollTop}
            className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-orange-500 border border-slate-800/80 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 animate-in fade-in duration-300"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5 animate-pulse" />
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
