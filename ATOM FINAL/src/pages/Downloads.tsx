import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Cpu, Laptop, HardDriveDownload, BookOpen } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { initialCatalogItems } from '../db/mockData';

export const Downloads: React.FC = () => {
  const { catalogItems } = useApp();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const files = (catalogItems && catalogItems.length > 0) ? catalogItems : initialCatalogItems;

  const handleDownload = (id: string, name: string, fileUrl?: string) => {
    setDownloadingId(id);
    let targetUrl = fileUrl || '/brochures/CAL-4000_datasheet.pdf';

    // 1. Handle Google Drive URLs
    if (targetUrl.includes('drive.google.com')) {
      const match = targetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        targetUrl = `https://drive.google.com/file/d/${match[1]}/view`;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setDownloadingId(null);
      return;
    }

    // 2. Convert Base64 data URLs to Blob Object URLs so Chrome/Safari opens & downloads them seamlessly
    let blobObjectUrl: string | null = null;
    if (targetUrl.startsWith('data:')) {
      try {
        const parts = targetUrl.split(';base64,');
        const mime = parts[0].replace('data:', '') || 'application/pdf';
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: mime });
        targetUrl = URL.createObjectURL(blob);
        blobObjectUrl = targetUrl;
      } catch (e) {
        console.warn('Failed to convert base64 to Blob URL:', e);
      }
    }

    // 3. Open PDF in new browser tab
    window.open(targetUrl, '_blank');

    // 4. Trigger file download fallback
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (blobObjectUrl) {
      setTimeout(() => URL.revokeObjectURL(blobObjectUrl!), 15000);
    }

    setTimeout(() => {
      setDownloadingId(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">DOWNLOAD CENTRE</h2>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Product Catalogues</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Download official ATOMAKK Instruments corporate brochure and technical product catalogues.
          </p>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files.map(file => (
            <GlassCard key={file.id} className="p-6 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    file.category === 'manual'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : file.category === 'software' 
                      ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                      : file.category === 'technical'
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {file.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{file.type}</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors flex items-center space-x-2">
                    {file.category === 'manual' && <BookOpen className="w-4 h-4 text-emerald-500 inline shrink-0" />}
                    <span>{file.name}</span>
                  </h3>
                  <p className="text-xs text-slate-550 dark:text-slate-450 leading-relaxed">
                    {file.desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button 
                  onClick={() => handleDownload(file.id, file.name, file.url)}
                  disabled={downloadingId !== null}
                  className="w-full py-3 bg-slate-900 hover:bg-orange-500 dark:bg-slate-850 hover:text-white text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingId === file.id ? 'Opening File...' : 'Download File'}</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
};
