import { createClient } from '@supabase/supabase-js';

// Supabase environment variables or fallback values
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const defaultBucketName = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'atom-catalog';

// Initialize Supabase Client safely
let supabaseClient: any = null;
try {
  if (rawSupabaseUrl && rawSupabaseUrl.startsWith('http')) {
    supabaseClient = createClient(rawSupabaseUrl, rawSupabaseAnonKey || 'dummy');
  }
} catch (e) {
  console.warn('Supabase client initialization warning:', e);
}

export const supabase = supabaseClient;

// Strict check: Only return true if Supabase URL & Anon Key are configured
export const isSupabaseConfigured = (): boolean => {
  const url = rawSupabaseUrl.trim();
  const key = rawSupabaseAnonKey.trim();
  
  const isValidUrl = url.startsWith('https://') && 
                     url.includes('.supabase.co') && 
                     !url.includes('your-project');

  const isValidKey = key.length > 10;

  return Boolean(isValidUrl && isValidKey && supabase);
};

// Timeout wrapper helper to prevent hanging network requests
export const withTimeout = <T>(promise: Promise<T>, timeoutMs = 6000, errorMsg = 'Operation timed out'): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMsg)), timeoutMs)
    )
  ]);
};

// Helper to convert Base64 string to Blob
const base64ToBlob = (base64Data: string): Blob => {
  try {
    const parts = base64Data.split(';base64,');
    const contentType = parts[0].replace('data:', '');
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  } catch (e) {
    console.warn('base64ToBlob error:', e);
    return new Blob([], { type: 'image/png' });
  }
};

/**
 * Uploads a file (File object, Base64, or relative URL) to Supabase Storage bucket
 */
export const uploadFileToSupabase = async (
  fileOrBase64: File | string,
  folder: 'images' | 'documents' = 'images',
  bucketName: string = defaultBucketName
): Promise<string> => {
  if (!isSupabaseConfigured() || !supabase) {
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
  }

  try {
    // If already uploaded to Supabase Storage, return existing URL directly
    if (typeof fileOrBase64 === 'string' && fileOrBase64.includes('supabase.co/storage/v1/object/public/')) {
      return fileOrBase64;
    }

    let fileBlob: Blob;
    let fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('data:')) {
        fileBlob = base64ToBlob(fileOrBase64);
        const match = fileOrBase64.match(/data:(.*?);/);
        const mime = match ? match[1] : 'image/png';
        const fileExtension = mime.split('/')[1] || 'png';
        fileName = `${fileName}.${fileExtension}`;
      } else if (fileOrBase64.startsWith('/') || fileOrBase64.startsWith('http')) {
        const response = await fetch(fileOrBase64);
        if (!response.ok) return fileOrBase64;
        fileBlob = await response.blob();
        const baseName = fileOrBase64.split('/').pop()?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'asset.png';
        fileName = `${folder}/${Date.now()}_${baseName}`;
      } else {
        return fileOrBase64;
      }
    } else {
      fileBlob = fileOrBase64;
      fileName = `${folder}/${Date.now()}_${fileOrBase64.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }

    // Upload Blob to Supabase Storage Bucket safely with catch
    const res: any = await withTimeout(
      supabase.storage
        .from(bucketName)
        .upload(fileName, fileBlob, {
          cacheControl: '3600',
          upsert: true
        }),
      6000,
      `Supabase upload request timed out`
    ).catch(err => {
      console.warn('Supabase storage upload catch warning:', err);
      return { data: null, error: err };
    });

    if (res?.error || !res?.data?.path) {
      console.warn('Supabase Storage Upload Warning:', res?.error?.message || 'No upload path returned');
      return typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
    }

    // Retrieve Permanent Public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(res.data.path);

    return publicUrlData?.publicUrl || (typeof fileOrBase64 === 'string' ? fileOrBase64 : '');
  } catch (err) {
    console.warn('Supabase storage upload fallback:', err);
    return typeof fileOrBase64 === 'string' ? fileOrBase64 : '';
  }
};
