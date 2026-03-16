"use client";

import { ArrowLeft, Mail, FileText, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-8"
          >
            <ArrowLeft size={14} /> Back to Home
          </button>
          
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Legal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Legal Information</h1>
          <p className="text-neutral-500 text-lg">Last updated: March 2026</p>
        </div>

        {/* Business Information */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-black">Business Information</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-6">
            <div>
              <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Business Name</div>
              <div className="text-xl font-black text-white">DevCard.Pro</div>
            </div>
            
            <div>
              <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">Service Description</div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                DevCard.Pro provides AI-powered GitHub profile analysis reports. Upon payment, users receive a detailed PDF report analyzing their engineering identity, technical skills, and career growth opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Support */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black">Customer Support</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <p className="text-neutral-300 text-sm leading-relaxed mb-6">
              For any inquiries, please contact us at:
            </p>
            <a
              href="mailto:support@devcard.pro"
              className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-black text-white transition-all active:scale-95"
            >
              <Mail size={18} />
              kobap2501@gmail.com
            </a>
          </div>
        </section>

        {/* Refund Policy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <XCircle size={24} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-black">Refund Policy</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
              <p className="text-amber-200 font-bold text-center">
                All sales are final. Due to the digital nature of our products, we do not offer refunds once the report has been generated and delivered.
              </p>
            </div>
            
            <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
              <p>
                Since our service delivers immediate digital value upon payment completion, we cannot accept return requests or provide refunds after the PDF report has been generated.
              </p>
              <p>
                If you experience any technical issues with your report or have concerns about the quality, please contact our support team. We will work with you to resolve any problems and ensure your satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-black">Cancellation Policy</h2>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
              <p className="text-blue-200 font-bold text-center">
                Not applicable. DevCard.Pro uses a one-time payment model with no recurring subscriptions.
              </p>
            </div>
            
            <div className="space-y-4 text-neutral-300 text-sm leading-relaxed">
              <p>
                Our service operates on a pay-per-report basis. Each report purchase is a single transaction with no ongoing billing or subscription commitments.
              </p>
              <p>
                You can purchase additional reports at any time, but there are no automatic renewals or recurring charges to cancel.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-12 border-t border-white/5 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">DevCard.Pro</span>
          </div>
          <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">
            © 2026 DevCard.Pro - Engineering Intelligence Platform
          </p>
        </div>
      </div>
    </main>
  );
}
