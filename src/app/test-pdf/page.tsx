"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export default function TestPDFPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(0);

    try {
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const pages = [
        {
          title: 'Test Page 1',
          render: () => `
            <div style="font-family: Arial, sans-serif; padding: 60px 40px;">
              <h1 style="font-size: 36px; font-weight: bold; color: #4f46e5; margin-bottom: 40px;">Test PDF - Page 1</h1>
              <p style="font-size: 16px; color: #4b5563; line-height: 2; margin-bottom: 40px;">
                This is a test PDF to verify the layout and font sizes.
              </p>
              <div style="background: #dbeafe; padding: 32px; border-radius: 16px; margin-bottom: 32px;">
                <p style="font-size: 14px; color: #1e40af; font-weight: bold; margin-bottom: 12px;">Code Quality</p>
                <p style="font-size: 48px; font-weight: bold; color: #1e40af; margin: 0;">94/100</p>
              </div>
              <div style="margin-top: 80px; padding-top: 32px; border-top: 2px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af;">Page 1 of 2 • Test PDF</p>
              </div>
            </div>
          `
        },
        {
          title: 'Test Page 2',
          render: () => `
            <div style="font-family: Arial, sans-serif; padding: 60px 40px;">
              <h1 style="font-size: 36px; font-weight: bold; color: #4f46e5; margin-bottom: 40px;">Test PDF - Page 2</h1>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 15px;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="border: 2px solid #e5e7eb; padding: 16px; text-align: left;">Metric</th>
                    <th style="border: 2px solid #e5e7eb; padding: 16px; text-align: left;">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 2px solid #e5e7eb; padding: 16px;">Test 1</td>
                    <td style="border: 2px solid #e5e7eb; padding: 16px;">100</td>
                  </tr>
                  <tr>
                    <td style="border: 2px solid #e5e7eb; padding: 16px;">Test 2</td>
                    <td style="border: 2px solid #e5e7eb; padding: 16px;">200</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 80px; padding-top: 32px; border-top: 2px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af;">Page 2 of 2 • Test PDF</p>
              </div>
            </div>
          `
        }
      ];

      for (let i = 0; i < pages.length; i++) {
        setProgress(((i + 1) / pages.length) * 100);

        const pageDiv = document.createElement('div');
        pageDiv.innerHTML = pages[i].render();
        document.body.appendChild(pageDiv);

        const dataUrl = await toPng(pageDiv, {
          quality: 1.0,
          backgroundColor: '#ffffff',
          pixelRatio: 3,
          width: 1240,
          height: 1754,
        });

        document.body.removeChild(pageDiv);

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'MEDIUM');
      }

      pdf.save('test-report.pdf');

      await new Promise(resolve => setTimeout(resolve, 1000));

      setDownloading(false);
      alert('PDF download complete!');
    } catch (err) {
      console.error('Download error:', err);
      setDownloading(false);
      alert('Failed to generate PDF');
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-[2rem] border border-white/10 p-8 text-center space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-black text-white mb-2">🧪 PDF Test Page</h1>
          <p className="text-sm text-neutral-400">
            Test PDF generation without going through the payment flow
          </p>
        </div>

        {downloading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-4 text-neutral-400">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Generating PDF... {Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleDownload}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Generate Test PDF
          </button>
        )}

        <div className="text-left space-y-2 text-xs text-neutral-500">
          <p>✅ Character aspect ratio</p>
          <p>✅ Font size</p>
          <p>✅ Margins</p>
          <p>✅ Download functionality</p>
        </div>
      </div>
    </main>
  );
}
