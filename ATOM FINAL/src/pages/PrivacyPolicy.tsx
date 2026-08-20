import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4">Privacy Policy</h1>
        
        <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
          At ATOMAKK India, we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard personal and business data collected during your interaction with this web application.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">Data Collected</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          We collect information you explicitly submit through our online Request for Quote (RFQ) forms, Contact Us forms, and Newsletter signups, which may include your name, company name, email address, phone number, and instrument requirements.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">Data Usage</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          We use collected details solely to prepare commercial sales proposals, provide technical recalibration support, process custom insert designs, and answer dealership queries. We never sell, lease, or distribute data to third parties.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">Client Confidentiality</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          Due to NABL regulations and NDA terms with pharmaceuticals and defense labs, all custom calibration measurements, serial numbers, and certificate history are stored securely and treated as strictly confidential.
        </p>

        <p className="text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Last updated: July 2026. For inquiries, email support@atomakk.com.
        </p>
      </div>
    </div>
  );
};
