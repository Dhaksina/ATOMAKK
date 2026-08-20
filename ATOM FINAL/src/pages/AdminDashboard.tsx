import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, LayoutDashboard, Plus, Trash2, Eye, EyeOff, Mail, FileText, 
  Check, LogOut, Package, RefreshCw, Layers, ShieldCheck, Thermometer,
  Gauge, Cpu, Database, Activity, Star, Pencil, X, Upload, Image as ImageIcon, Paperclip, AlertTriangle,
  HardDriveDownload, BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, CatalogItem } from '../db/mockData';
import { GlassCard } from '../components/GlassCard';
import { uploadFileToSupabase, isSupabaseConfigured } from '../config/supabase';
import { uploadFileToFirebase } from '../config/firebase';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminLoggedIn, loginAdmin, logoutAdmin, products, categories, 
    quoteRequests, updateQuoteStatus, deleteQuoteRequest,
    contactInquiries, updateInquiryStatus, deleteContactInquiry,
    addProduct, deleteProduct, editProduct, isFirebaseConnected, syncAllToCloud,
    catalogItems, addCatalogItem, editCatalogItem, deleteCatalogItem
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [syncErrorMsg, setSyncErrorMsg] = useState('');
  const [syncProgressMsg, setSyncProgressMsg] = useState('');

  const handleSyncToCloud = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSyncing(true);
    setSyncStatusMsg('');
    setSyncErrorMsg('');
    setSyncProgressMsg('Starting cloud sync process...');

    try {
      const res = await syncAllToCloud((msg) => {
        setSyncProgressMsg(msg);
      });

      if (res && res.success) {
        setSyncStatusMsg(`Successfully saved and synced ${res.count} products to Firebase Firestore & Storage!`);
        setTimeout(() => setSyncStatusMsg(''), 7000);
      } else {
        setSyncErrorMsg(res?.error || 'Cloud sync encountered an error.');
      }
    } catch (err: any) {
      setSyncErrorMsg(err?.message || 'An unexpected error occurred during cloud sync.');
    } finally {
      setIsSyncing(false);
      setSyncProgressMsg('');
    }
  };

  // Login form state
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'quotes' | 'inquiries' | 'catalogs'>('products');
  
  // Add Product Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('temperature');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newLongDesc, setNewLongDesc] = useState('');
  const [newFeatures, setNewFeatures] = useState(''); // Comma separated
  const [newAccuracy, setNewAccuracy] = useState('High Accuracy');
  const [newWarranty, setNewWarranty] = useState('2 Years');
  const [newStock, setNewStock] = useState(true);
  const [newImage, setNewImage] = useState('from-blue-600 to-indigo-900'); // Gradient default
  const [newPhoto, setNewPhoto] = useState('');
  const [newDatasheetUrl, setNewDatasheetUrl] = useState('');
  const [newManualUrl, setNewManualUrl] = useState('');

  // Edit Product Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editLongDesc, setEditLongDesc] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editAccuracy, setEditAccuracy] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editStock, setEditStock] = useState(true);
  const [editImage, setEditImage] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editDatasheetUrl, setEditDatasheetUrl] = useState('');
  const [editManualUrl, setEditManualUrl] = useState('');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDatasheet, setUploadingDatasheet] = useState(false);
  const [uploadingManual, setUploadingManual] = useState(false);

  // Catalog / Downloads Form states
  const [showAddCatalogForm, setShowAddCatalogForm] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');
  const [newCatalogCategory, setNewCatalogCategory] = useState('corporate');
  const [newCatalogDesc, setNewCatalogDesc] = useState('');
  const [newCatalogType, setNewCatalogType] = useState('PDF Document (5.0 MB)');
  const [newCatalogUrl, setNewCatalogUrl] = useState('');

  const [editingCatalogItem, setEditingCatalogItem] = useState<CatalogItem | null>(null);
  const [editCatalogName, setEditCatalogName] = useState('');
  const [editCatalogCategory, setEditCatalogCategory] = useState('');
  const [editCatalogDesc, setEditCatalogDesc] = useState('');
  const [editCatalogType, setEditCatalogType] = useState('');
  const [editCatalogUrl, setEditCatalogUrl] = useState('');

  const [uploadingCatalogPdf, setUploadingCatalogPdf] = useState(false);

  const handleCatalogPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingCatalogPdf(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
          const typeStr = `PDF Document (${fileSizeMB} MB)`;

          if (isEdit) {
            setEditCatalogUrl(dataUrl);
            if (!editCatalogType) setEditCatalogType(typeStr);
          } else {
            setNewCatalogUrl(dataUrl);
            if (!newCatalogType || newCatalogType === 'PDF Document (5.0 MB)') setNewCatalogType(typeStr);
          }

          if (isSupabaseConfigured()) {
            try {
              const publicUrl = await uploadFileToSupabase(file, 'documents');
              if (publicUrl && publicUrl.startsWith('http')) {
                if (isEdit) setEditCatalogUrl(publicUrl);
                else setNewCatalogUrl(publicUrl);
              }
            } catch (err) {
              console.warn('Supabase catalog upload warning:', err);
            }
          }

          if (isFirebaseConnected) {
            try {
              const fbUrl = await uploadFileToFirebase(file, `catalogs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
              if (fbUrl && fbUrl.startsWith('http')) {
                if (isEdit) setEditCatalogUrl(fbUrl);
                else setNewCatalogUrl(fbUrl);
              }
            } catch (err) {
              console.warn('Firebase storage catalog upload warning:', err);
            }
          }
        }
        setUploadingCatalogPdf(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatalogName && newCatalogDesc) {
      addCatalogItem({
        name: newCatalogName,
        desc: newCatalogDesc,
        category: newCatalogCategory,
        type: newCatalogType || 'PDF Document',
        url: newCatalogUrl || '/brochures/CAL-4000_datasheet.pdf'
      });

      setNewCatalogName('');
      setNewCatalogDesc('');
      setNewCatalogCategory('corporate');
      setNewCatalogType('PDF Document (5.0 MB)');
      setNewCatalogUrl('');
      setShowAddCatalogForm(false);
    }
  };

  const openEditCatalogModal = (item: CatalogItem) => {
    setEditingCatalogItem(item);
    setEditCatalogName(item.name);
    setEditCatalogCategory(item.category);
    setEditCatalogDesc(item.desc);
    setEditCatalogType(item.type);
    setEditCatalogUrl(item.url);
  };

  const handleEditCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalogItem) return;

    editCatalogItem(editingCatalogItem.id, {
      name: editCatalogName,
      category: editCatalogCategory,
      desc: editCatalogDesc,
      type: editCatalogType,
      url: editCatalogUrl
    });

    setEditingCatalogItem(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          if (isEdit) setEditPhoto(dataUrl);
          else setNewPhoto(dataUrl);

          let uploadedUrl = '';
          if (isSupabaseConfigured()) {
            try {
              uploadedUrl = await uploadFileToSupabase(file, 'images');
            } catch (err) {
              console.warn('Supabase photo upload warning:', err);
            }
          }
          if (!uploadedUrl || !uploadedUrl.startsWith('http')) {
            try {
              uploadedUrl = await uploadFileToFirebase(file, `products/${Date.now()}_photo.png`);
            } catch (err) {
              console.warn('Firebase photo upload warning:', err);
            }
          }
          if (uploadedUrl && uploadedUrl.startsWith('http')) {
            if (isEdit) setEditPhoto(uploadedUrl);
            else setNewPhoto(uploadedUrl);
          }
        }
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDatasheetUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingDatasheet(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          if (isEdit) setEditDatasheetUrl(dataUrl);
          else setNewDatasheetUrl(dataUrl);

          let uploadedUrl = '';
          if (isSupabaseConfigured()) {
            try {
              uploadedUrl = await uploadFileToSupabase(file, 'documents');
            } catch (err) {
              console.warn('Supabase datasheet upload warning:', err);
            }
          }
          if (!uploadedUrl || !uploadedUrl.startsWith('http')) {
            try {
              uploadedUrl = await uploadFileToFirebase(file, `products/${Date.now()}_datasheet.pdf`);
            } catch (err) {
              console.warn('Firebase datasheet upload warning:', err);
            }
          }
          if (uploadedUrl && uploadedUrl.startsWith('http')) {
            if (isEdit) setEditDatasheetUrl(uploadedUrl);
            else setNewDatasheetUrl(uploadedUrl);
          }
        }
        setUploadingDatasheet(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingManual(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          if (isEdit) setEditManualUrl(dataUrl);
          else setNewManualUrl(dataUrl);

          let uploadedUrl = '';
          if (isSupabaseConfigured()) {
            try {
              uploadedUrl = await uploadFileToSupabase(file, 'documents');
            } catch (err) {
              console.warn('Supabase manual upload warning:', err);
            }
          }
          if (!uploadedUrl || !uploadedUrl.startsWith('http')) {
            try {
              uploadedUrl = await uploadFileToFirebase(file, `products/${Date.now()}_manual.pdf`);
            } catch (err) {
              console.warn('Firebase manual upload warning:', err);
            }
          }
          if (uploadedUrl && uploadedUrl.startsWith('http')) {
            if (isEdit) setEditManualUrl(uploadedUrl);
            else setNewManualUrl(uploadedUrl);
          }
        }
        setUploadingManual(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditShortDesc(product.shortDescription);
    setEditLongDesc(product.longDescription);
    setEditFeatures(product.features ? product.features.join(', ') : '');
    setEditAccuracy(product.accuracy || product.specs?.['Accuracy'] || 'High Accuracy');
    setEditWarranty(product.warranty || '2 Years');
    setEditStock(product.inStock);
    setEditImage(product.image || 'from-blue-600 to-indigo-900');
    setEditPhoto(product.photo || '');
    setEditDatasheetUrl(product.datasheetUrl || '');
    setEditManualUrl(product.manualUrl || '');
  };

  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const featuresArray = editFeatures
      .split(/[,\n;•]+/)
      .map(f => f.trim())
      .filter(f => f !== '');

    editProduct(editingProduct.id, {
      name: editName,
      category: editCategory,
      shortDescription: editShortDesc,
      longDescription: editLongDesc,
      features: featuresArray.length > 0 ? featuresArray : editingProduct.features,
      accuracy: editAccuracy,
      warranty: editWarranty,
      inStock: editStock,
      image: editImage,
      photo: editPhoto,
      datasheetUrl: editDatasheetUrl,
      manualUrl: editManualUrl || undefined,
      specs: {
        ...(editingProduct.specs || {}),
        'Accuracy': editAccuracy
      }
    });

    setEditingProduct(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(password);
    if (success) {
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newShortDesc && newLongDesc) {
      const featuresArray = newFeatures
        .split(/[,\n;•]+/)
        .map(f => f.trim())
        .filter(f => f !== '');
      
      addProduct({
        name: newName,
        category: newCategory,
        shortDescription: newShortDesc,
        longDescription: newLongDesc,
        features: featuresArray.length > 0 ? featuresArray : ['High reliability', 'Rugged industrial construction'],
        specs: {
          'Accuracy': newAccuracy,
          'Range': 'Standard industrial range',
          'Stability': 'Standard'
        },
        image: newImage,
        photo: newPhoto || undefined,
        datasheetUrl: newDatasheetUrl || `/brochures/${newName.replace(/\s+/g, '-')}_datasheet.pdf`,
        manualUrl: newManualUrl || undefined,
        warranty: newWarranty,
        inStock: newStock,
        accuracy: newAccuracy
      });

      // Clear Form
      setNewName('');
      setNewShortDesc('');
      setNewLongDesc('');
      setNewFeatures('');
      setNewAccuracy('High Accuracy');
      setNewWarranty('2 Years');
      setNewStock(true);
      setNewPhoto('');
      setNewDatasheetUrl('');
      setNewManualUrl('');
      setShowAddForm(false);
    }
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

  // 1. LOGIN SCREEN GATEWAY
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-slate-50 dark:bg-dark-bg px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/25">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Admin Gate</h1>
            <p className="text-xs text-slate-500">Secure entry to manage ATOMAKK India database catalog.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Enter Master Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-850 px-4 py-3 pr-11 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-sm outline-none focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-semibold text-center">Invalid password. Please enter the correct admin password.</p>
            )}

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors uppercase tracking-wider"
            >
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ADMIN PANEL CONSOLE
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Console Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
                {isFirebaseConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center space-x-1">
                    <span>🔥 Firebase Synced</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center space-x-1" title="To connect live Firebase database, add VITE_FIREBASE_PROJECT_ID in .env">
                    <span>⚡ Firebase Ready (Local Mode)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Live calibration catalog management database portal.</p>
            </div>
          </div>
          <button 
            onClick={logoutAdmin}
            className="px-4 py-2 bg-slate-200 hover:bg-red-500 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all self-start sm:self-auto flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Console</span>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 max-w-2xl gap-1">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('catalogs')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'catalogs' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>Catalogues & Files ({catalogItems.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('quotes')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'quotes' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>RFQ Quotes ({quoteRequests.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'inquiries' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries ({contactInquiries.length})</span>
          </button>
        </div>

        {/* TABS VIEWPORT COMPONENTS */}
        <div className="space-y-6">
          
          {/* TAB 1: PRODUCTS LIST & ADD CRUD FORM */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">Calibration Catalog</h3>
                <div className="flex items-center space-x-3">
                  <button 
                    type="button"
                    onClick={handleSyncToCloud}
                    disabled={isSyncing}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all border border-slate-700 disabled:opacity-50"
                    title="Upload & Sync all products and images to Firebase Firestore & Supabase Storage Bucket"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Saving to Cloud Bucket...' : 'Sync Catalog to Cloud Bucket'}</span>
                  </button>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Instrument</span>
                  </button>
                </div>
              </div>

              {syncProgressMsg && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-blue-500" />
                  <span>{syncProgressMsg}</span>
                </div>
              )}

              {syncStatusMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{syncStatusMsg}</span>
                </div>
              )}

              {syncErrorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{syncErrorMsg}</span>
                </div>
              )}

              {/* Add New Product Drawer Form */}
              {showAddForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-xl animate-in slide-in-from-top duration-300">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-850 pb-2">Add New Product to Live Catalog</h4>
                  
                  <form onSubmit={handleAddProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Instrument Name *</label>
                        <input 
                          type="text" 
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. DPI-1400 Advanced Temperature Block"
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category *</label>
                        <select 
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Accuracy Grade *</label>
                        <input 
                          type="text" 
                          required
                          value={newAccuracy}
                          onChange={(e) => setNewAccuracy(e.target.value)}
                          placeholder="e.g. High Accuracy (±0.05°C)"
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Warranty Period *</label>
                        <input 
                          type="text" 
                          required
                          value={newWarranty}
                          onChange={(e) => setNewWarranty(e.target.value)}
                          placeholder="e.g. 2 Years"
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Gradient Image Style *</label>
                        <select 
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        >
                          <option value="from-blue-600 to-indigo-900">Blue-Indigo (Standard Temp)</option>
                          <option value="from-orange-600 to-red-950">Orange-Red (High Temp)</option>
                          <option value="from-cyan-600 to-blue-900">Cyan-Blue (Pressure)</option>
                          <option value="from-teal-600 to-emerald-900">Teal-Emerald (Pneumatic)</option>
                          <option value="from-violet-600 to-purple-950">Violet-Purple (Data Logger)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Availability Status</label>
                        <div className="flex items-center space-x-4 mt-2">
                          <label className="inline-flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-750 dark:text-slate-350">
                            <input 
                              type="radio" 
                              name="newStock" 
                              checked={newStock} 
                              onChange={() => setNewStock(true)}
                              className="text-orange-500 focus:ring-0 w-4 h-4"
                            />
                            <span>In Stock (Immediate Ship)</span>
                          </label>
                          <label className="inline-flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-750 dark:text-slate-350">
                            <input 
                              type="radio" 
                              name="newStock" 
                              checked={!newStock} 
                              onChange={() => setNewStock(false)}
                              className="text-orange-500 focus:ring-0 w-4 h-4"
                            />
                            <span>Lead Time Required (2-3 wks)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* PRODUCT PHOTO / IMAGE INPUT */}
                    <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Product Photo / Image Cutout</span>
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={newPhoto}
                            onChange={(e) => setNewPhoto(e.target.value)}
                            placeholder="Image URL or Path (e.g. /images/products/dpi-1000-m.png)"
                            className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                          />
                          {newPhoto && (
                            <button 
                              type="button" 
                              onClick={() => setNewPhoto('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                              title="Clear Image"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <label className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-orange-500/20">
                          <Upload className="w-4 h-4" />
                          <span>Choose Image File</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handlePhotoUpload(e, false)}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      {newPhoto && (
                        <div className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                          <img src={newPhoto} alt="Preview" className="w-12 h-12 object-contain rounded-lg bg-slate-100 dark:bg-slate-850 p-1 border border-slate-200 dark:border-slate-700" />
                          <div className="overflow-hidden">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                              {newPhoto.startsWith('data:') ? 'Uploaded Image File (Base64 Data)' : newPhoto}
                            </span>
                            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Image Loaded</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TECHNICAL DATASHEET PDF INPUT */}
                    <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Technical Datasheet PDF</span>
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={newDatasheetUrl}
                            onChange={(e) => setNewDatasheetUrl(e.target.value)}
                            placeholder="Datasheet PDF URL or Path (e.g. /brochures/DPI-1000-M_datasheet.pdf)"
                            className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                          />
                          {newDatasheetUrl && (
                            <button 
                              type="button" 
                              onClick={() => setNewDatasheetUrl('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                              title="Clear Datasheet"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <label className="px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-blue-500/20">
                          <Upload className="w-4 h-4" />
                          <span>Choose Datasheet PDF</span>
                          <input 
                            type="file" 
                            accept=".pdf,application/pdf" 
                            onChange={(e) => handleDatasheetUpload(e, false)}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      {newDatasheetUrl && (
                        <div className="flex items-center space-x-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                          <FileText className="w-6 h-6 text-red-500 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                              {newDatasheetUrl.startsWith('data:') ? 'Uploaded Datasheet File (Base64 Data)' : newDatasheetUrl}
                            </span>
                            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Datasheet PDF Attached</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* USER MANUAL PDF INPUT */}
                    <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center space-x-1.5">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>User Manual PDF</span>
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            value={newManualUrl}
                            onChange={(e) => setNewManualUrl(e.target.value)}
                            placeholder="Manual PDF URL or Path (e.g. /brochures/DPI-1000-M_manual.pdf)"
                            className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                          />
                          {newManualUrl && (
                            <button 
                              type="button" 
                              onClick={() => setNewManualUrl('')}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                              title="Clear Manual"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <label className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-orange-500/20">
                          <Paperclip className="w-4 h-4" />
                          <span>Choose Manual PDF File</span>
                          <input 
                            type="file" 
                            accept=".pdf,application/pdf" 
                            onChange={(e) => handleManualUpload(e, false)}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      {newManualUrl && (
                        <div className="flex items-center space-x-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                          <FileText className="w-6 h-6 text-red-500 shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                              {newManualUrl.startsWith('data:') ? 'Uploaded Manual File (Base64 Data)' : newManualUrl}
                            </span>
                            <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider">User Manual PDF Attached</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Short Description *</label>
                      <input 
                        type="text" 
                        required
                        value={newShortDesc}
                        onChange={(e) => setNewShortDesc(e.target.value)}
                        placeholder="e.g. Dedicated high-stability block calibrator up to 600°C."
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Long Description *</label>
                      <textarea 
                        required
                        value={newLongDesc}
                        onChange={(e) => setNewLongDesc(e.target.value)}
                        placeholder="Detailed technical layout and engineering design features of the instrument..."
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Key Features List (Separate with commas)</label>
                      <input 
                        type="text" 
                        value={newFeatures}
                        onChange={(e) => setNewFeatures(e.target.value)}
                        placeholder="e.g. Fast cooling cycles, Dual-zone block design, RS-485 interface"
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Publish Product
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products Table grid view */}
              <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-md">
                <table className="w-full text-left border-collapse text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4">Instrument</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Accuracy Grade</th>
                      <th className="p-4">Warranty</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.image} p-1.5 flex items-center justify-center text-white font-extrabold text-[8px]`}>
                              {p.id.split('-').slice(0, 2).join(' ').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-slate-400 capitalize">ID: {p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">
                          <div className="flex items-center space-x-1.5 font-semibold text-slate-700 dark:text-slate-300">
                            {getCategoryIcon(p.category)}
                            <span>{p.category}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-600 dark:text-slate-400">{p.accuracy}</td>
                        <td className="p-4 text-slate-500 font-semibold">{p.warranty}</td>
                        <td className="p-4">
                          {p.inStock ? (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-bold text-xs rounded border border-emerald-500/10">In Stock</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 font-bold text-xs rounded border border-orange-500/10">Lead Time</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Link 
                              to={`/products/${p.id}`}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-500 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-500 text-slate-500 dark:text-slate-400 transition-colors"
                              title="Preview Live Page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button 
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-800 dark:hover:bg-amber-500 text-slate-500 dark:text-slate-400 transition-colors"
                              title="Edit Instrument"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete the product: ${p.name}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-500 hover:text-white dark:bg-slate-800 dark:hover:bg-red-500 text-slate-500 dark:text-slate-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTE REQUESTS MANAGEMENT */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">Product Quote Inquiries</h3>

              <div className="grid grid-cols-1 gap-4">
                {quoteRequests.length === 0 ? (
                  <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No quote requests submitted yet.</p>
                  </div>
                ) : (
                  quoteRequests.map(quote => (
                    <GlassCard key={quote.id} className="p-6 relative space-y-4" hoverEffect={false}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quote.id}</span>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">RFQ for {quote.productName}</h4>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select 
                            value={quote.status} 
                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value as any)}
                            className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold border-0 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Approved">Approved</option>
                          </select>
                          <button 
                            onClick={() => deleteQuoteRequest(quote.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete RFQ"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-450 uppercase font-bold text-[9px] tracking-wider block mb-0.5">Customer Name</span>
                          <span className="font-bold text-slate-800 dark:text-white">{quote.customerName}</span>
                          {quote.company && <span className="text-slate-400 block">{quote.company}</span>}
                        </div>
                        <div>
                          <span className="text-slate-450 uppercase font-bold text-[9px] tracking-wider block mb-0.5">Contact Detail</span>
                          <span className="font-bold text-slate-800 dark:text-white block">{quote.email}</span>
                          <span className="text-slate-400 block">{quote.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-450 uppercase font-bold text-[9px] tracking-wider block mb-0.5">RFQ Volume</span>
                          <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">Qty: {quote.quantity} Units</span>
                          <span className="text-slate-400 block mt-1">Submitted: {new Date(quote.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {quote.message && (
                        <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-150 dark:border-slate-800 text-xs text-slate-650 dark:text-slate-450 leading-relaxed">
                          <strong className="block text-slate-700 dark:text-slate-350 mb-1">Customer Note:</strong>
                          "{quote.message}"
                        </div>
                      )}
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT INQUIRIES MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">Contact Us Inquiries</h3>

              <div className="grid grid-cols-1 gap-4">
                {contactInquiries.length === 0 ? (
                  <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                    <Mail className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No contact messages received.</p>
                  </div>
                ) : (
                  contactInquiries.map(inq => (
                    <GlassCard key={inq.id} className="p-6 relative space-y-4" hoverEffect={false}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inq.id}</span>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{inq.subject}</h4>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select 
                            value={inq.status} 
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                            className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold border-0 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Unread">Unread</option>
                            <option value="Read">Read</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <button 
                            onClick={() => deleteContactInquiry(inq.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-450 uppercase font-bold text-[9px] tracking-wider block mb-0.5">Sender Info</span>
                          <span className="font-bold text-slate-800 dark:text-white">{inq.name}</span>
                          <span className="text-slate-400 block">{inq.email}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-slate-450 uppercase font-bold text-[9px] tracking-wider block mb-0.5">Received Date</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-400">{new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-150 dark:border-slate-800 text-xs text-slate-750 dark:text-slate-400 leading-relaxed italic">
                        "{inq.message}"
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CATALOGUES & DOWNLOADABLE FILES MANAGEMENT */}
          {activeTab === 'catalogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">Catalogues & Download Files</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage downloadable PDF brochures, technical manuals, and product catalogs displayed on the live website.</p>
                </div>
                <button 
                  onClick={() => setShowAddCatalogForm(!showAddCatalogForm)}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Catalogue File</span>
                </button>
              </div>

              {/* Add New Catalogue Form Drawer */}
              {showAddCatalogForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-xl animate-in slide-in-from-top duration-300">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4 border-b border-slate-150 dark:border-slate-850 pb-2">Add New Catalogue / Downloadable PDF File</h4>
                  
                  <form onSubmit={handleAddCatalogSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Catalogue / Document Title *</label>
                        <input 
                          type="text" 
                          required
                          value={newCatalogName}
                          onChange={(e) => setNewCatalogName(e.target.value)}
                          placeholder="e.g. ATOMAKK 2026 Product Catalogue"
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category *</label>
                        <select 
                          value={newCatalogCategory}
                          onChange={(e) => setNewCatalogCategory(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        >
                          <option value="corporate">Corporate / Catalog</option>
                          <option value="manual">Technical Manual</option>
                          <option value="software">Software & Drivers</option>
                          <option value="technical">Datasheet / Specs</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Document Format / Size Label *</label>
                        <input 
                          type="text" 
                          required
                          value={newCatalogType}
                          onChange={(e) => setNewCatalogType(e.target.value)}
                          placeholder="e.g. PDF Document (8.6 MB)"
                          className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">PDF File Upload or URL *</label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <input 
                              type="text" 
                              value={newCatalogUrl}
                              onChange={(e) => setNewCatalogUrl(e.target.value)}
                              placeholder="PDF File URL or Upload below"
                              className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                            />
                            {newCatalogUrl && (
                              <button 
                                type="button" 
                                onClick={() => setNewCatalogUrl('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <label className="px-3.5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl cursor-pointer flex items-center space-x-1.5 transition-colors shrink-0 border border-blue-500/20">
                            <Upload className="w-4 h-4" />
                            <span>{uploadingCatalogPdf ? 'Uploading...' : 'Upload PDF'}</span>
                            <input 
                              type="file" 
                              accept=".pdf,application/pdf" 
                              onChange={(e) => handleCatalogPdfUpload(e, false)}
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description *</label>
                      <textarea 
                        required
                        value={newCatalogDesc}
                        onChange={(e) => setNewCatalogDesc(e.target.value)}
                        placeholder="Brief overview of catalogue content, specifications, or user instructions..."
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowAddCatalogForm(false)}
                        className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        Publish Catalogue to Web
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Catalogues List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {catalogItems.length === 0 ? (
                  <div className="col-span-full p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
                    <HardDriveDownload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No catalogues or download files added yet.</p>
                  </div>
                ) : (
                  catalogItems.map(item => (
                    <GlassCard key={item.id} className="p-6 flex flex-col justify-between group" hoverEffect={false}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            item.category === 'manual'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : item.category === 'software' 
                              ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                              : item.category === 'technical'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.type}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-orange-500 inline shrink-0" />
                            <span>{item.name}</span>
                          </h3>
                          <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-3">
                        <a 
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-slate-900 hover:bg-orange-500 dark:bg-slate-850 hover:text-white text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md"
                        >
                          <FileText className="w-4 h-4 text-red-400" />
                          <span>View / Open PDF</span>
                        </a>
                        <button 
                          onClick={() => openEditCatalogModal(item)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white transition-colors"
                          title="Edit Catalogue"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCatalogItem(item.id)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete Catalogue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* EDIT PRODUCT MODAL OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">
                  Edit Instrument
                </h3>
                <p className="text-xs text-slate-400">ID: {editingProduct.id}</p>
              </div>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Instrument Name *</label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category *</label>
                  <select 
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Accuracy Grade *</label>
                  <input 
                    type="text" 
                    required
                    value={editAccuracy}
                    onChange={(e) => setEditAccuracy(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Warranty Period *</label>
                  <input 
                    type="text" 
                    required
                    value={editWarranty}
                    onChange={(e) => setEditWarranty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Gradient Image Style *</label>
                  <select 
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="from-blue-600 to-indigo-900">Blue-Indigo (Standard Temp)</option>
                    <option value="from-orange-600 to-red-950">Orange-Red (High Temp)</option>
                    <option value="from-cyan-600 to-blue-900">Cyan-Blue (Pressure)</option>
                    <option value="from-teal-600 to-emerald-900">Teal-Emerald (Pneumatic)</option>
                    <option value="from-violet-600 to-purple-950">Violet-Purple (Data Logger)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Availability Status</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="inline-flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-750 dark:text-slate-350">
                      <input 
                        type="radio" 
                        name="editStock" 
                        checked={editStock} 
                        onChange={() => setEditStock(true)}
                        className="text-orange-500 focus:ring-0 w-4 h-4"
                      />
                      <span>In Stock (Immediate Ship)</span>
                    </label>
                    <label className="inline-flex items-center space-x-2 text-xs font-semibold cursor-pointer text-slate-750 dark:text-slate-350">
                      <input 
                        type="radio" 
                        name="editStock" 
                        checked={!editStock} 
                        onChange={() => setEditStock(false)}
                        className="text-orange-500 focus:ring-0 w-4 h-4"
                      />
                      <span>Lead Time Required</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* IMAGE EDIT SECTION */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Product Photo / Image (Image Edit)</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={editPhoto}
                      onChange={(e) => setEditPhoto(e.target.value)}
                      placeholder="Image URL or Path (e.g. /images/products/dpi-1000-m.png)"
                      className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                    />
                    {editPhoto && (
                      <button 
                        type="button" 
                        onClick={() => setEditPhoto('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                        title="Clear Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <label className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-orange-500/20">
                    <Upload className="w-4 h-4" />
                    <span>Choose Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="hidden" 
                    />
                  </label>
                </div>
                {editPhoto && (
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                    <img src={editPhoto} alt="Preview" className="w-12 h-12 object-contain rounded-lg bg-slate-100 dark:bg-slate-850 p-1 border border-slate-200 dark:border-slate-700" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {editPhoto.startsWith('data:') ? 'Uploaded Image File (Base64 Data)' : editPhoto}
                      </span>
                      <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Image Loaded</span>
                    </div>
                  </div>
                )}
              </div>

              {/* TECHNICAL DATASHEET PDF EDIT SECTION */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Technical Datasheet PDF</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={editDatasheetUrl}
                      onChange={(e) => setEditDatasheetUrl(e.target.value)}
                      placeholder="Datasheet PDF URL or Path (e.g. /brochures/DPI-1000-M_datasheet.pdf)"
                      className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                    />
                    {editDatasheetUrl && (
                      <button 
                        type="button" 
                        onClick={() => setEditDatasheetUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                        title="Clear Datasheet"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <label className="px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-blue-500/20">
                    <Upload className="w-4 h-4" />
                    <span>Choose Datasheet PDF</span>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      onChange={(e) => handleDatasheetUpload(e, true)}
                      className="hidden" 
                    />
                  </label>
                </div>
                {editDatasheetUrl && (
                  <div className="flex items-center space-x-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                    <FileText className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {editDatasheetUrl.startsWith('data:') ? 'Uploaded Datasheet File (Base64 Data)' : editDatasheetUrl}
                      </span>
                      <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Datasheet PDF Attached</span>
                    </div>
                  </div>
                )}
              </div>

              {/* USER MANUAL PDF EDIT SECTION */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/70 dark:bg-slate-850/50 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center space-x-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>User Manual PDF</span>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={editManualUrl}
                      onChange={(e) => setEditManualUrl(e.target.value)}
                      placeholder="Manual PDF URL or Path (e.g. /brochures/DPI-1000-M_manual.pdf)"
                      className="w-full bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all pr-8"
                    />
                    {editManualUrl && (
                      <button 
                        type="button" 
                        onClick={() => setEditManualUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 text-xs"
                        title="Clear Manual"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <label className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-colors shrink-0 border border-orange-500/20">
                    <Paperclip className="w-4 h-4" />
                    <span>Choose Manual PDF File</span>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      onChange={(e) => handleManualUpload(e, true)}
                      className="hidden" 
                    />
                  </label>
                </div>
                {editManualUrl && (
                  <div className="flex items-center space-x-2.5 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                    <FileText className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="overflow-hidden">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {editManualUrl.startsWith('data:') ? 'Uploaded Manual File (Base64 Data)' : editManualUrl}
                      </span>
                      <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider">User Manual PDF Attached</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Short Description *</label>
                <input 
                  type="text" 
                  required
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Long Description *</label>
                <textarea 
                  required
                  value={editLongDesc}
                  onChange={(e) => setEditLongDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Key Features List (Separate with commas)</label>
                <input 
                  type="text" 
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors uppercase tracking-wider"
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingProduct(null)}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATALOGUE MODAL OVERLAY */}
      {editingCatalogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider">
                  Edit Catalogue / Document
                </h3>
                <p className="text-xs text-slate-400">ID: {editingCatalogItem.id}</p>
              </div>
              <button 
                onClick={() => setEditingCatalogItem(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCatalogSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Title *</label>
                <input 
                  type="text" 
                  required
                  value={editCatalogName}
                  onChange={(e) => setEditCatalogName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Category *</label>
                  <select 
                    value={editCatalogCategory}
                    onChange={(e) => setEditCatalogCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  >
                    <option value="corporate">Corporate / Catalog</option>
                    <option value="manual">Technical Manual</option>
                    <option value="software">Software & Drivers</option>
                    <option value="technical">Datasheet / Specs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Format / Size *</label>
                  <input 
                    type="text" 
                    required
                    value={editCatalogType}
                    onChange={(e) => setEditCatalogType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">PDF File Upload or URL *</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={editCatalogUrl}
                    onChange={(e) => setEditCatalogUrl(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                  />
                  <label className="px-3.5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl cursor-pointer flex items-center space-x-1.5 transition-colors shrink-0 border border-blue-500/20">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      onChange={(e) => handleCatalogPdfUpload(e, true)}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description *</label>
                <textarea 
                  required
                  value={editCatalogDesc}
                  onChange={(e) => setEditCatalogDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-850 px-3.5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs outline-none focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors uppercase tracking-wider"
                >
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingCatalogItem(null)}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
