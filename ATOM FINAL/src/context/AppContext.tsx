import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  QuoteRequest, 
  ContactInquiry, 
  Certificate,
  CatalogItem,
  products as initialProducts,
  categories as initialCategories,
  initialQuoteRequests,
  initialContactInquiries,
  mockCertificates,
  initialCatalogItems
} from '../db/mockData';
import { db, isFirebaseConfigured, uploadFileToFirebase, storage } from '../config/firebase';
import { uploadFileToSupabase, isSupabaseConfigured } from '../config/supabase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  getDoc
} from 'firebase/firestore';

interface AppContextType {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Firebase connection status
  isFirebaseConnected: boolean;

  // Data lists
  products: Product[];
  categories: Category[];
  quoteRequests: QuoteRequest[];
  contactInquiries: ContactInquiry[];
  certificates: Certificate[];
  catalogItems: CatalogItem[];
  
  // Comparison
  comparisonList: Product[];
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  
  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Catalog / Downloads CRUD
  addCatalogItem: (item: Omit<CatalogItem, 'id'>) => void;
  editCatalogItem: (id: string, item: Partial<CatalogItem>) => void;
  deleteCatalogItem: (id: string) => void;
  
  // Cloud Sync
  syncAllToCloud: (
    onProgress?: (msg: string, current: number, total: number) => void
  ) => Promise<{ success: boolean; count: number; error?: string }>;

  // Enquiries & Quotes
  addQuoteRequest: (request: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status']) => void;
  deleteQuoteRequest: (id: string) => void;
  
  addContactInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => void;
  deleteContactInquiry: (id: string) => void;
  
  // Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => Promise<boolean> | boolean;
  logoutAdmin: () => void;
  
  // Verification
  verifyCertificate: (certNo: string, serialNo: string) => Certificate | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFirebaseConnected = isFirebaseConfigured();

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // DB States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    if (!saved) return initialProducts;
    try {
      const parsed: Product[] = JSON.parse(saved).map((p: Product) => {
        const cleaned = { ...p };
        const isCurrentCoil = p.id === '50-turns-current-coil' || 
                              p.name?.toLowerCase().includes('50 turns') || 
                              p.name?.toLowerCase().includes('current coil');

        if (isCurrentCoil) {
          cleaned.features = [
            'High-accuracy current simulation',
            'Suitable for AC/DC calibration',
            'Rugged portable design',
            'Ideal for laboratory and field testing'
          ];
          cleaned.specs = {
            'Product Type': 'Current Transformer (CT) Test Fixture',
            'Application': 'Clamp Meter Calibration',
            'Current Type': 'AC / DC',
            'Input Current': 'Up to 20 A',
            'Coil Type': 'Precision Multi-Turn Test Coil',
            'Input Terminal': 'Safety Banana Socket',
            'Enclosure': 'Portable Heavy-Duty Carry Case',
            'Calibration Certificate': 'NABL Calibration Certificate Included'
          };
        } else {
          const initial = initialProducts.find(ip => ip.id === p.id);
          if (initial) {
            // If features are missing or smashed together, restore clean initial features
            if (
              !cleaned.features || 
              cleaned.features.length === 0 || 
              (cleaned.features.length === 1 && cleaned.features[0].length > 60 && !cleaned.features[0].includes(','))
            ) {
              cleaned.features = initial.features;
            }
            // If specs are missing or generic placeholder, restore full initial specs
            if (!cleaned.specs || Object.keys(cleaned.specs).length <= 1 || cleaned.specs['Range'] === 'Standard industrial range') {
              cleaned.specs = initial.specs;
            }
          }
        }
        if (cleaned.manualUrl && !cleaned.manualUrl.startsWith('http') && cleaned.manualUrl.length > 400000) {
          delete cleaned.manualUrl;
        }
        if (cleaned.datasheetUrl && !cleaned.datasheetUrl.startsWith('http') && cleaned.datasheetUrl.length > 400000) {
          cleaned.datasheetUrl = `/brochures/${p.name.replace(/\s+/g, '-')}_datasheet.pdf`;
        }
        if (cleaned.photo && !cleaned.photo.startsWith('http') && cleaned.photo.length > 400000) {
          delete cleaned.photo;
        }
        return cleaned;
      });
      const savedIds = new Set(parsed.map(p => p.id));
      const missingInitial = initialProducts.filter(p => !savedIds.has(p.id));
      return missingInitial.length > 0 ? [...parsed, ...missingInitial] : parsed;
    } catch (e) {
      return initialProducts;
    }
  });

  const [categories] = useState<Category[]>(initialCategories);

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('quoteRequests');
    return saved ? JSON.parse(saved) : initialQuoteRequests;
  });

  const [contactInquiries, setContactInquiries] = useState<ContactInquiry[]>(() => {
    const saved = localStorage.getItem('contactInquiries');
    return saved ? JSON.parse(saved) : initialContactInquiries;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('certificates');
    return saved ? JSON.parse(saved) : mockCertificates;
  });

  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => {
    const saved = localStorage.getItem('catalogItems');
    if (!saved) return initialCatalogItems;
    try {
      const parsed: CatalogItem[] = JSON.parse(saved);
      const initialIds = new Set(initialCatalogItems.map(c => c.id));
      const userCustomItems = parsed.filter(c => c.id.startsWith('catalog-') && !c.id.includes('50-turns') && !c.id.includes('range-catalogue'));
      const existingInitials = parsed.filter(c => initialIds.has(c.id));
      const missingInitials = initialCatalogItems.filter(c => !existingInitials.some(p => p.id === c.id));
      const cleaned = [...missingInitials, ...existingInitials, ...userCustomItems];
      try {
        localStorage.setItem('catalogItems', JSON.stringify(cleaned));
      } catch (e) {}
      return cleaned;
    } catch (e) {
      return initialCatalogItems;
    }
  });

  // Comparison State
  const [comparisonList, setComparisonList] = useState<Product[]>([]);

  // Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  // FIREBASE FIRESTORE REALTIME LISTENERS
  useEffect(() => {
    if (!isFirebaseConnected) return;

    // 1. Sync Products Collection
    const unsubProducts = onSnapshot(collection(db!, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(firestoreProducts);
      }
    }, (err) => console.warn('Firestore Products sync error:', err));

    // 2. Sync Quotes Collection
    const unsubQuotes = onSnapshot(collection(db!, 'quotes'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreQuotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
        setQuoteRequests(firestoreQuotes);
      }
    }, (err) => console.warn('Firestore Quotes sync error:', err));

    // 3. Sync Inquiries Collection
    const unsubInquiries = onSnapshot(collection(db!, 'inquiries'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreInquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactInquiry));
        setContactInquiries(firestoreInquiries);
      }
    }, (err) => console.warn('Firestore Inquiries sync error:', err));

    // 4. Sync Catalog Items Collection
    const unsubCatalogs = onSnapshot(collection(db!, 'catalogItems'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreCatalogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CatalogItem));
        setCatalogItems(firestoreCatalogs);
      }
    }, (err) => console.warn('Firestore CatalogItems sync error:', err));

    return () => {
      unsubProducts();
      unsubQuotes();
      unsubInquiries();
      unsubCatalogs();
    };
  }, [isFirebaseConnected]);

  // Sync state to local storage safely
  useEffect(() => {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (e) {
      console.warn('localStorage setItem products failed:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('quoteRequests', JSON.stringify(quoteRequests));
    } catch (e) {
      console.warn('localStorage setItem quoteRequests failed:', e);
    }
  }, [quoteRequests]);

  useEffect(() => {
    try {
      localStorage.setItem('contactInquiries', JSON.stringify(contactInquiries));
    } catch (e) {
      console.warn('localStorage setItem contactInquiries failed:', e);
    }
  }, [contactInquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('certificates', JSON.stringify(certificates));
    } catch (e) {
      console.warn('localStorage setItem certificates failed:', e);
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem('catalogItems', JSON.stringify(catalogItems));
    } catch (e) {
      console.warn('localStorage setItem catalogItems failed:', e);
    }
  }, [catalogItems]);

  // Sync theme to document body
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Comparison Handlers
  const addToComparison = (product: Product) => {
    if (comparisonList.some(p => p.id === product.id)) {
      return false;
    }
    if (comparisonList.length >= 4) {
      return false;
    }
    setComparisonList([...comparisonList, product]);
    return true;
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(comparisonList.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  // Helper: Ensure document payloads do not contain undefined fields or non-HTTP strings exceeding Firestore's 1,048,487 byte limit
  const sanitizeForFirestore = async <T extends Record<string, any>>(data: T, docId: string): Promise<T> => {
    const result: any = {};
    for (const key of Object.keys(data)) {
      const val = data[key];

      // Skip undefined or null values completely because Firestore throws errors
      if (val === undefined || val === null) {
        continue;
      }

      if (typeof val === 'string' && val.length > 400000) {
        if (val.startsWith('http://') || val.startsWith('https://')) {
          result[key] = val;
          continue;
        }

        let uploadedUrl = '';
        if (isFirebaseConfigured()) {
          try {
            const isPdf = val.includes('pdf') || val.startsWith('JVBER');
            const ext = isPdf ? 'pdf' : 'png';
            uploadedUrl = await uploadFileToFirebase(val, `uploads/${docId}_${key}.${ext}`);
          } catch (err) {
            console.warn(`Firestore asset upload fallback failed for ${key}:`, err);
          }
        }

        if (uploadedUrl && (uploadedUrl.startsWith('http://') || uploadedUrl.startsWith('https://'))) {
          result[key] = uploadedUrl;
        } else {
          console.warn(`Omitted oversized non-HTTP payload for field "${key}" (${val.length} bytes) to prevent Firestore document limit crash.`);
        }
        continue;
      }

      result[key] = val;
    }
    return result;
  };

  // Product CRUD Handlers
  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    const id = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let finalPhoto = newProduct.photo;
    let finalDatasheet = newProduct.datasheetUrl;
    let finalManual = newProduct.manualUrl;
    let finalVideo = newProduct.videoUrl;

    // Upload files to Supabase storage if base64 data URL
    if (isSupabaseConfigured()) {
      if (finalPhoto && finalPhoto.startsWith('data:')) {
        const uploaded = await uploadFileToSupabase(finalPhoto, 'images');
        if (uploaded && uploaded.startsWith('http')) finalPhoto = uploaded;
      }
      if (finalDatasheet && finalDatasheet.startsWith('data:')) {
        const uploadedDoc = await uploadFileToSupabase(finalDatasheet, 'documents');
        if (uploadedDoc && uploadedDoc.startsWith('http')) finalDatasheet = uploadedDoc;
      }
      if (finalManual && finalManual.startsWith('data:')) {
        const uploadedManual = await uploadFileToSupabase(finalManual, 'documents');
        if (uploadedManual && uploadedManual.startsWith('http')) finalManual = uploadedManual;
      }
    }

    // Upload files to Firebase Storage if still base64 data URL or relative path
    if (isFirebaseConnected) {
      if (finalPhoto && (finalPhoto.startsWith('data:') || finalPhoto.startsWith('/'))) {
        const fbUrl = await uploadFileToFirebase(finalPhoto, `products/${id}_photo.png`);
        if (fbUrl && fbUrl.startsWith('http')) finalPhoto = fbUrl;
      }
      if (finalDatasheet && finalDatasheet.startsWith('data:')) {
        const fbUrl = await uploadFileToFirebase(finalDatasheet, `products/${id}_datasheet.pdf`);
        if (fbUrl && fbUrl.startsWith('http')) finalDatasheet = fbUrl;
      }
      if (finalManual && finalManual.startsWith('data:')) {
        const fbUrl = await uploadFileToFirebase(finalManual, `products/${id}_manual.pdf`);
        if (fbUrl && fbUrl.startsWith('http')) finalManual = fbUrl;
      }
    }

    const productWithId: Product = { 
      ...newProduct, 
      id, 
      photo: finalPhoto, 
      datasheetUrl: finalDatasheet || `/brochures/${newProduct.name.replace(/\s+/g, '-')}_datasheet.pdf`,
      manualUrl: finalManual,
      videoUrl: finalVideo
    };
    setProducts(prev => [productWithId, ...prev]);

    if (isFirebaseConnected) {
      try {
        const sanitized = await sanitizeForFirestore(productWithId, id);
        await setDoc(doc(db!, 'products', id), sanitized, { merge: true });
      } catch (err) {
        console.error('Firebase setDoc error:', err);
      }
    }
  };

  const editProduct = async (id: string, updatedFields: Partial<Product>) => {
    let finalPhoto = updatedFields.photo;
    let finalDatasheet = updatedFields.datasheetUrl;
    let finalManual = updatedFields.manualUrl;
    let finalVideo = updatedFields.videoUrl;

    if (isSupabaseConfigured()) {
      if (finalPhoto && finalPhoto.startsWith('data:')) {
        const uploaded = await uploadFileToSupabase(finalPhoto, 'images');
        if (uploaded && uploaded.startsWith('http')) finalPhoto = uploaded;
      }
      if (finalDatasheet && finalDatasheet.startsWith('data:')) {
        const uploadedDoc = await uploadFileToSupabase(finalDatasheet, 'documents');
        if (uploadedDoc && uploadedDoc.startsWith('http')) finalDatasheet = uploadedDoc;
      }
      if (finalManual && finalManual.startsWith('data:')) {
        const uploadedManual = await uploadFileToSupabase(finalManual, 'documents');
        if (uploadedManual && uploadedManual.startsWith('http')) finalManual = uploadedManual;
      }
    }

    if (isFirebaseConnected) {
      if (finalPhoto && finalPhoto.startsWith('data:')) {
        const fbUrl = await uploadFileToFirebase(finalPhoto, `products/${id}_photo.png`);
        if (fbUrl && fbUrl.startsWith('http')) finalPhoto = fbUrl;
      }
      if (finalDatasheet && finalDatasheet.startsWith('data:')) {
        const fbUrl = await uploadFileToFirebase(finalDatasheet, `products/${id}_datasheet.pdf`);
        if (fbUrl && fbUrl.startsWith('http')) finalDatasheet = fbUrl;
      }
      if (finalManual && finalManual.startsWith('data:')) {
        const fbUrl = await uploadFileToFirebase(finalManual, `products/${id}_manual.pdf`);
        if (fbUrl && fbUrl.startsWith('http')) finalManual = fbUrl;
      }
    }

    const mergedFields = {
      ...updatedFields,
      photo: finalPhoto,
      datasheetUrl: finalDatasheet,
      manualUrl: finalManual,
      videoUrl: finalVideo
    };

    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...mergedFields } as Product : p));

    if (isFirebaseConnected) {
      try {
        const sanitized = await sanitizeForFirestore(mergedFields, id);
        await setDoc(doc(db!, 'products', id), sanitized, { merge: true });
      } catch (err) {
        console.error('Firebase setDoc error:', err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    if (isFirebaseConnected) {
      try {
        await deleteDoc(doc(db!, 'products', id));
      } catch (err) {
        console.error('Firebase deleteDoc error:', err);
      }
    }
  };

  // Sync All Catalog Items to Cloud Firestore & Storage Buckets
  const syncAllToCloud = async (
    onProgress?: (msg: string, current: number, total: number) => void
  ): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      let count = 0;
      const total = products.length;
      const updatedProducts: Product[] = [];

      const supabaseActive = isSupabaseConfigured();
      if (onProgress) {
        onProgress(
          `Initializing Cloud Sync (Firebase: Active, Supabase Storage: ${supabaseActive ? 'Active' : 'Offline/Fallback'})...`,
          0,
          total
        );
      }

      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        if (onProgress) {
          onProgress(`[${i + 1}/${total}] Uploading assets & updating Firestore for ${p.name}...`, i + 1, total);
        }

        let photoUrl = p.photo;
        let datasheetUrl = p.datasheetUrl;
        let manualUrl = p.manualUrl;
        let videoUrl = p.videoUrl;

        // 1. Upload to Supabase Storage Bucket if configured
        if (supabaseActive) {
          if (photoUrl && photoUrl.startsWith('data:')) {
            try {
              const uploaded = await uploadFileToSupabase(photoUrl, 'images');
              if (uploaded && uploaded.startsWith('http')) photoUrl = uploaded;
            } catch (e) {
              console.warn(`Supabase image upload warning for ${p.name}:`, e);
            }
          }

          if (datasheetUrl && datasheetUrl.startsWith('data:')) {
            try {
              const uploadedDoc = await uploadFileToSupabase(datasheetUrl, 'documents');
              if (uploadedDoc && uploadedDoc.startsWith('http')) datasheetUrl = uploadedDoc;
            } catch (e) {
              console.warn(`Supabase document upload warning for ${p.name}:`, e);
            }
          }

          if (manualUrl && manualUrl.startsWith('data:')) {
            try {
              const uploadedManual = await uploadFileToSupabase(manualUrl, 'documents');
              if (uploadedManual && uploadedManual.startsWith('http')) manualUrl = uploadedManual;
            } catch (e) {
              console.warn(`Supabase manual upload warning for ${p.name}:`, e);
            }
          }
        }

        // 2. Fallback upload to Firebase Storage Bucket if photo/datasheet/manual is still base64/relative
        if (isFirebaseConnected) {
          if (photoUrl && (photoUrl.startsWith('/') || photoUrl.startsWith('data:'))) {
            try {
              const fbUploaded = await uploadFileToFirebase(photoUrl, `products/${p.id}_photo.png`);
              if (fbUploaded && fbUploaded.startsWith('http')) photoUrl = fbUploaded;
            } catch (e) {
              console.warn(`Firebase Storage upload warning for ${p.name}:`, e);
            }
          }

          if (datasheetUrl && datasheetUrl.startsWith('data:')) {
            try {
              const fbUploaded = await uploadFileToFirebase(datasheetUrl, `products/${p.id}_datasheet.pdf`);
              if (fbUploaded && fbUploaded.startsWith('http')) datasheetUrl = fbUploaded;
            } catch (e) {
              console.warn(`Firebase Storage datasheet upload warning for ${p.name}:`, e);
            }
          }

          if (manualUrl && manualUrl.startsWith('data:')) {
            try {
              const fbUploaded = await uploadFileToFirebase(manualUrl, `products/${p.id}_manual.pdf`);
              if (fbUploaded && fbUploaded.startsWith('http')) manualUrl = fbUploaded;
            } catch (e) {
              console.warn(`Firebase Storage manual upload warning for ${p.name}:`, e);
            }
          }
        }

        const item: Product = {
          ...p,
          photo: photoUrl,
          datasheetUrl,
          manualUrl,
          videoUrl
        };

        updatedProducts.push(item);

        // 3. Sync updated product record to Firebase Firestore Database safely
        if (isFirebaseConnected) {
          try {
            const sanitizedItem = await sanitizeForFirestore(item, item.id);
            await setDoc(doc(db!, 'products', item.id), sanitizedItem, { merge: true });
          } catch (err: any) {
            console.error(`Firestore save error for ${item.id}:`, err);
            const isPermissionErr = err?.code === 'permission-denied' || String(err).includes('permissions');
            return {
              success: false,
              count,
              error: isPermissionErr 
                ? `Firestore Rules Blocked: Please enable read/write in Firebase Console (atom-ce46c) > Firestore > Rules.`
                : `Firestore Error saving product ${p.name}: ${err?.message || err}`
            };
          }
        }

        count++;
      }

      setProducts(updatedProducts);

      // 4. Sync Catalog Items (PDF documents & catalogues) to Cloud Storage Buckets & Firestore
      const updatedCatalogItems: CatalogItem[] = [];
      const catTotal = catalogItems.length;

      for (let j = 0; j < catalogItems.length; j++) {
        const cat = catalogItems[j];
        if (onProgress) {
          onProgress(`[${total + j + 1}/${total + catTotal}] Uploading PDF catalogue to Cloud Bucket for ${cat.name}...`, total + j + 1, total + catTotal);
        }

        let catUrl = cat.url;
        if (supabaseActive && catUrl) {
          try {
            const uploadedDoc = await uploadFileToSupabase(catUrl, 'documents');
            if (uploadedDoc && uploadedDoc.startsWith('http')) {
              catUrl = uploadedDoc;
            }
          } catch (e) {
            console.warn(`Supabase catalog document upload warning for ${cat.name}:`, e);
          }
        }

        if (isFirebaseConnected && storage && catUrl && (catUrl.startsWith('/') || catUrl.startsWith('data:'))) {
          try {
            const fbUploaded = await uploadFileToFirebase(catUrl, `catalogs/${cat.id}.pdf`);
            if (fbUploaded && fbUploaded.startsWith('http')) {
              catUrl = fbUploaded;
            }
          } catch (e) {
            console.warn(`Firebase Storage upload warning for catalog ${cat.name}:`, e);
          }
        }

        const syncedCat: CatalogItem = {
          ...cat,
          url: catUrl
        };
        updatedCatalogItems.push(syncedCat);

        if (isFirebaseConnected && db) {
          try {
            const sanitizedCat = await sanitizeForFirestore(syncedCat, syncedCat.id);
            await setDoc(doc(db!, 'catalogItems', syncedCat.id), sanitizedCat, { merge: true });
          } catch (err: any) {
            console.error(`Firestore save error for catalog ${syncedCat.id}:`, err);
          }
        }
        count++;
      }

      setCatalogItems(updatedCatalogItems);
      return { success: true, count };
    } catch (err: any) {
      console.error('syncAllToCloud failure:', err);
      return {
        success: false,
        count: 0,
        error: `Cloud Sync Error: ${err?.message || err}`
      };
    }
  };

  // Quotes Handlers
  const addQuoteRequest = async (request: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: QuoteRequest = {
      ...request,
      id: `q-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setQuoteRequests(prev => [newRequest, ...prev]);

    if (isFirebaseConnected) {
      try {
        await setDoc(doc(db!, 'quotes', newRequest.id), newRequest);
      } catch (err) {
        console.error('Firebase setDoc quote error:', err);
      }
    }
  };

  const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    setQuoteRequests(prev => prev.map(q => q.id === id ? { ...q, status } : q));

    if (isFirebaseConnected) {
      try {
        await updateDoc(doc(db!, 'quotes', id), { status });
      } catch (err) {
        console.error('Firebase updateDoc quote status error:', err);
      }
    }
  };

  const deleteQuoteRequest = async (id: string) => {
    setQuoteRequests(prev => prev.filter(q => q.id !== id));

    if (isFirebaseConnected) {
      try {
        await deleteDoc(doc(db!, 'quotes', id));
      } catch (err) {
        console.error('Firebase deleteDoc quote error:', err);
      }
    }
  };

  // Contact Inquiry Handlers
  const addContactInquiry = async (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `c-${Date.now()}`,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    setContactInquiries(prev => [newInquiry, ...prev]);

    if (isFirebaseConnected && db) {
      try {
        await setDoc(doc(db!, 'inquiries', newInquiry.id), newInquiry);
      } catch (err) {
        console.error('Firebase setDoc inquiry error:', err);
      }
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    setContactInquiries(prev => prev.map(c => c.id === id ? { ...c, status } : c));

    if (isFirebaseConnected && db) {
      try {
        await updateDoc(doc(db!, 'inquiries', id), { status });
      } catch (err) {
        console.error('Firebase updateDoc inquiry status error:', err);
      }
    }
  };

  const deleteContactInquiry = async (id: string) => {
    setContactInquiries(prev => prev.filter(c => c.id !== id));

    if (isFirebaseConnected && db) {
      try {
        await deleteDoc(doc(db!, 'inquiries', id));
      } catch (err) {
        console.error('Firebase deleteDoc inquiry error:', err);
      }
    }
  };

  // Admin Auth Handlers
  const loginAdmin = async (password: string): Promise<boolean> => {
    const trimmed = password.trim();
    if (trimmed === 'atom@123' || trimmed === '40qA5pCV03EMFPlD2JSK' || trimmed === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }

    if (isFirebaseConnected && db) {
      try {
        const adminDocRef = doc(db!, 'admin', trimmed);
        const adminSnap = await getDoc(adminDocRef);
        if (adminSnap.exists()) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('isAdminLoggedIn', 'true');
          return true;
        }
      } catch (err) {
        console.warn('Firestore admin verification error:', err);
      }
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  // Calibration Certificate Verification Handler
  const verifyCertificate = (certNo: string, serialNo: string) => {
    return certificates.find(
      c => c.certificateNo.trim().toUpperCase() === certNo.trim().toUpperCase() && 
           c.serialNo.trim().toUpperCase() === serialNo.trim().toUpperCase()
    );
  };

  // Catalog / Downloads CRUD handlers
  const addCatalogItem = async (item: Omit<CatalogItem, 'id'>) => {
    const id = `catalog-${Date.now()}`;
    let finalUrl = item.url;

    if (isSupabaseConfigured() && finalUrl && (finalUrl.startsWith('data:') || finalUrl.startsWith('/'))) {
      try {
        const uploaded = await uploadFileToSupabase(finalUrl, 'documents');
        if (uploaded && uploaded.startsWith('http')) {
          finalUrl = uploaded;
        }
      } catch (e) {
        console.warn('Supabase catalog add warning:', e);
      }
    }

    if (isFirebaseConnected && storage && finalUrl && (finalUrl.startsWith('data:') || finalUrl.startsWith('/'))) {
      try {
        const fbUrl = await uploadFileToFirebase(finalUrl, `catalogs/${id}.pdf`);
        if (fbUrl && fbUrl.startsWith('http')) {
          finalUrl = fbUrl;
        }
      } catch (e) {
        console.warn('Firebase catalog add warning:', e);
      }
    }

    const newItem: CatalogItem = {
      ...item,
      id,
      url: finalUrl,
      createdAt: new Date().toISOString()
    };

    setCatalogItems(prev => [newItem, ...prev]);

    if (isFirebaseConnected && db) {
      sanitizeForFirestore(newItem, newItem.id).then(sanitizedItem => {
        setDoc(doc(db!, 'catalogItems', newItem.id), sanitizedItem, { merge: true }).catch(err => {
          console.warn('Error adding catalog item to Firestore:', err);
        });
      });
    }
  };

  const editCatalogItem = async (id: string, updatedFields: Partial<CatalogItem>) => {
    let finalUrl = updatedFields.url;

    if (finalUrl) {
      if (isSupabaseConfigured() && (finalUrl.startsWith('data:') || finalUrl.startsWith('/'))) {
        try {
          const uploaded = await uploadFileToSupabase(finalUrl, 'documents');
          if (uploaded && uploaded.startsWith('http')) {
            finalUrl = uploaded;
          }
        } catch (e) {
          console.warn('Supabase catalog edit warning:', e);
        }
      }

      if (isFirebaseConnected && storage && (finalUrl.startsWith('data:') || finalUrl.startsWith('/'))) {
        try {
          const fbUrl = await uploadFileToFirebase(finalUrl, `catalogs/${id}.pdf`);
          if (fbUrl && fbUrl.startsWith('http')) {
            finalUrl = fbUrl;
          }
        } catch (e) {
          console.warn('Firebase catalog edit warning:', e);
        }
      }
    }

    const mergedFields = {
      ...updatedFields,
      ...(finalUrl ? { url: finalUrl } : {})
    };

    setCatalogItems(prev => prev.map(item => item.id === id ? { ...item, ...mergedFields } : item));

    if (isFirebaseConnected && db) {
      sanitizeForFirestore(mergedFields, id).then(sanitizedFields => {
        setDoc(doc(db!, 'catalogItems', id), sanitizedFields, { merge: true }).catch(err => {
          console.warn('Error updating catalog item in Firestore:', err);
        });
      });
    }
  };

  const deleteCatalogItem = (id: string) => {
    setCatalogItems(prev => prev.filter(item => item.id !== id));

    if (isFirebaseConnected && db) {
      deleteDoc(doc(db!, 'catalogItems', id)).catch(err => {
        console.warn('Error deleting catalog item from Firestore:', err);
      });
    }
  };

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      isFirebaseConnected,
      products,
      categories,
      quoteRequests,
      contactInquiries,
      certificates,
      catalogItems,
      comparisonList,
      addToComparison,
      removeFromComparison,
      clearComparison,
      addProduct,
      editProduct,
      deleteProduct,
      addCatalogItem,
      editCatalogItem,
      deleteCatalogItem,
      syncAllToCloud,
      addQuoteRequest,
      updateQuoteStatus,
      deleteQuoteRequest,
      addContactInquiry,
      updateInquiryStatus,
      deleteContactInquiry,
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      verifyCertificate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
