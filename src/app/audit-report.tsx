"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, ShieldCheck, Award, X, Lock, ShieldCheck as ShieldSecure } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from '@stripe/stripe-js';
import { getAuditReportPages, type GitHubUser, type AuditMetric } from "./lib/audit-logic";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export function AuditReport({ user, marketValue, metrics, onClose }: { user: GitHubUser, marketValue: number, metrics: AuditMetric[], onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  const pages = useMemo(() => getAuditReportPages(user, marketValue, metrics), [user, marketValue, metrics]);
  const webPages = pages.filter(p => p.webContent);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create Stripe Checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.login,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create session');
      }

      if (result.url) {
        // Redirect to Stripe Checkout page
        window.location.href = result.url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setProcessing(false);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Please try again'}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="max-w-2xl w-full bg-neutral-950 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)] flex flex-col h-[85vh] relative overflow-hidden">

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[400] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            >
              <div className="max-w-md w-full bg-neutral-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <Award size={40} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-2">Premium Report</h2>
                    <p className="text-sm text-neutral-400">Strategic Technical Analysis Report</p>
                  </div>

                  <div className="bg-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Executive Summary</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Skills Gap Analysis</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Technical Debt Radar</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Career Acceleration Plan</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <span className="text-neutral-300 font-bold">Total</span>
                      <span className="text-2xl font-black text-emerald-400">$5.00</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Pay $5.00 & Download</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPayment(false)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors font-black uppercase tracking-widest"
                  >
                    Return to Preview
                  </button>
                </div>

                <div className="bg-neutral-800 px-8 py-4 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <ShieldSecure size={12} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <Lock size={12} />
                    <span>SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Mode UI */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[300] bg-black flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">PDF Preview Mode</span>
                  <span className="text-[10px] text-neutral-500">Page {previewPage + 1} / {pages.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewPage(p => Math.max(p - 1, 0))}
                    disabled={previewPage === 0}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPreviewPage(p => Math.min(p + 1, pages.length - 1))}
                    disabled={previewPage === pages.length - 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    <ArrowLeft size={16} className="rotate-180" />
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 ml-4"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-8 bg-neutral-900">
                <div className="max-w-[210mm] mx-auto bg-white text-black" style={{ width: '210mm', minHeight: '297mm' }}>
                  {pages[previewPage].pdfContent}
                </div>
              </div>
              <div className="p-4 border-t border-white/10 bg-black text-center">
                <p className="text-[10px] text-neutral-500">Use ← → keys to navigate / ESC to close</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={onClose} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors z-20">
          <ArrowLeft size={24} />
        </button>

        <div className="p-12 flex-1 flex flex-col overflow-hidden">
          <div className="mb-12 text-left">
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2 flex items-center gap-3">
              <ShieldCheck size={16} /> Technical Analysis Insight (Preview)
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none">{webPages[currentPage]?.title}</h2>
            <p className="text-neutral-500 text-xs font-bold mt-3 uppercase tracking-widest">{webPages[currentPage]?.subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 text-left">
            {webPages[currentPage]?.webContent}
          </div>

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5">
            <div className="flex gap-2">
              {webPages.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentPage ? 'w-8 bg-indigo-500' : 'w-2 bg-white/10'}`} />
              ))}
            </div>
            <div className="flex gap-4">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all active:scale-95"
              >
                <ArrowLeft size={20}/>
              </button>
              <button
                onClick={() => window.open('/devcard-premium-report-paz522.pdf', '_blank')}
                className="px-6 py-4 rounded-2xl bg-transparent border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
              >
                View Sample
              </button>
              {currentPage < webPages.length - 1 ? (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  Next Page
                </button>
              ) : (
                <button
                  onClick={() => setShowPayment(true)}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-[10px] uppercase tracking-widest hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <Lock size={16} />
                  <span>Get Full Report for $5</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
