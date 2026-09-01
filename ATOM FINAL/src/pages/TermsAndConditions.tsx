import React from 'react';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4">Terms & Conditions</h1>
        
        <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
          Welcome to the ATOMAKK INDIA industrial instrumentation portal. By utilizing our RFQ systems, downloading technical resources, or registering product warranties, you agree to comply with the following terms.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">1. Commercial Proposals & RFQs</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          All commercial quotes generated or emailed via our RFQ console represent preliminary estimates. Final invoices are issued by ATOMAKK India Sales representatives in Chennai and are valid for 30 calendar days from the date of issuance.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">2. Limited Product Warranty</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          ATOMAKK India warrants all new instruments (under standard warranty terms of 1 to 3 years depending on model) against defects in material and craftsmanship. Warranty registration is processed via the online Support console and requires a valid unit serial number.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wide">3. Calibration Certificate & Traceability</h2>
        <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed">
          While our online verification tool confirms the authenticity of calibration certificate records, physical certificate records issued with instruments remain the primary legal metrology documentation. Verification logs reflect historical laboratory data at the time of calibration.
        </p>

        <p className="text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
          Last updated: July 2026. For terms queries, contact atomakkindia@gmail.com.
        </p>
      </div>
    </div>
  );
};
