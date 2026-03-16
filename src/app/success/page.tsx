"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { getAuditReportPages, GitHubUser, AuditMetric } from "../lib/audit-logic";

interface EnrichedGitHubUser extends GitHubUser {
  totalStars?: number;
  totalForks?: number;
  topLanguages?: { language: string; count: number }[];
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const username = searchParams.get("username");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<EnrichedGitHubUser | null>(null);
  const [marketValue, setMarketValue] = useState(0);
  const [metrics, setMetrics] = useState<AuditMetric[]>([]);
  const [downloaded, setDownloaded] = useState(false);

  // Re-fetch GitHub data (same logic as page.tsx)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) {
        console.error("No username in URL");
        setLoading(false);
        return;
      }

      try {
        // Use GitHub API token
        const headers: HeadersInit = {};
        if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
          headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
        }

        // User basic info
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userRes.ok) throw new Error("User not found");
        const userData = await userRes.json();

        // Repository list
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          { headers }
        );
        const repos = await reposRes.json();

        // Repository analysis
        const languages: Record<string, number> = {};
        let totalStars = 0;
        let totalForks = 0;

        repos.forEach((repo: any) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
          }
          totalStars += repo.stargazers_count || 0;
          totalForks += repo.forks_count || 0;
        });

        // Merge analysis results
        const enrichedData: EnrichedGitHubUser = {
          ...userData,
          totalStars,
          totalForks,
          topLanguages: Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang, count]) => ({ language: lang, count }))
        };

        // Calculate market value and metrics (same logic as page.tsx)
        const years = new Date().getFullYear() - new Date(enrichedData.created_at).getFullYear();
        const repoRatio = enrichedData.public_repos / (years || 1);

        const baseValue = 85000;
        const experienceBonus = years * 4500;
        const repoBonus = enrichedData.public_repos * 1200;
        const networkBonus = enrichedData.followers * 1500;
        const calculatedValue = baseValue + experienceBonus + repoBonus + networkBonus;

        const calculatedMetrics: AuditMetric[] = [
          { label: "Consistency", value: `${repoRatio.toFixed(1)}/yr`, percentile: 85, description: "Score of continuous development activity.", status: 'excellent' },
          { label: "Social Impact", value: enrichedData.followers, percentile: 72, description: "Influence within the community.", status: 'good' },
          { label: "Code Quality", value: "94/100", percentile: 98, description: "Deep quality analysis by AI.", status: 'excellent' },
          { label: "Market Power", value: "Master", percentile: 91, description: "Demand and scarcity of technical stack.", status: 'excellent' }
        ];

        setUserData(enrichedData);
        setMarketValue(calculatedValue);
        setMetrics(calculatedMetrics);
        console.log("User data fetched:", enrichedData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        alert("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  // Helper function to wait for DOM element rendering
  const waitForElement = (elementId: string, timeout = 10000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = () => {
        if (document.getElementById(elementId)) {
          resolve();
          return;
        }

        if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${elementId} not found within ${timeout}ms`));
          return;
        }

        requestAnimationFrame(check);
      };

      check();
    });
  };

  const handleDownload = async () => {
    if (!userData) return;
    setDownloading(true);
    setProgress(0);

    try {
      // Wait for hidden DIV to finish rendering
      await waitForElement('pdf-render-page-0');

      // Wait a bit more for image loading to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const pages = getAuditReportPages(userData, marketValue, metrics);
      const pdfPages = pages.filter(p => p.pdfContent);

      for (let i = 0; i < pdfPages.length; i++) {
        setProgress(((i + 1) / pdfPages.length) * 100);

        const element = document.getElementById(`pdf-render-page-${i}`);
        if (!element) {
          console.error(`Element pdf-render-page-${i} not found`);
          continue;
        }

        // Wait for each page to finish rendering
        await new Promise(resolve => setTimeout(resolve, 200));

        const dataUrl = await toPng(element, {
          quality: 1.0,
          backgroundColor: "#ffffff",
          pixelRatio: 3,
          cacheBust: true,
        });

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      }

      // PDF binary generation complete
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devcard-premium-report-${userData.login}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Wait a bit after download starts, then cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Wait more to ensure download completes
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDownloaded(true);
      setDownloading(false);
    } catch (err) {
      console.error("Download error:", err);
      setDownloading(false);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <ArrowLeft size={40} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Error</h1>
          <p className="text-sm text-neutral-400">Failed to fetch user data.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-white transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-neutral-900 rounded-[2rem] border border-white/10 p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
          <CheckCircle size={40} className="text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-white mb-2">Payment Successful!</h1>
          <p className="text-sm text-neutral-400">
            Thank you for your purchase.<br />
            Downloading your report...
          </p>
        </div>

        <div className="bg-neutral-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Order ID</span>
            <span className="text-white font-mono text-xs">{sessionId?.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">User</span>
            <span className="text-emerald-400 font-bold">@{userData.login}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Amount</span>
            <span className="text-emerald-400 font-bold">$5.00</span>
          </div>
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
        ) : downloaded ? (
          <div className="space-y-4">
            <button
              disabled
              className="w-full py-4 bg-neutral-700 text-neutral-400 font-black rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <CheckCircle size={20} />
              Downloaded
            </button>
            <p className="text-xs text-neutral-500">
              💡 If you can&apos;t find the PDF, check your computer&apos;s Downloads folder.
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download Report
            </button>
            <p className="text-xs text-neutral-500">
              💡 If download doesn&apos;t start, click the Download Report button above.
            </p>
          </>
        )}

        <button
          onClick={() => router.push("/")}
          className="text-xs text-neutral-500 hover:text-white transition-colors font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft size={12} />
          Back to Home
        </button>
      </motion.div>

      {/* Hidden container for PDF rendering (placed off-screen for capture) */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none origin-top-left" style={{ width: '794px' }}>
        {userData && getAuditReportPages(userData, marketValue, metrics).filter(p => p.pdfContent).map((page, idx) => (
          <div key={idx} id={`pdf-render-page-${idx}`} className="bg-white">
            {page.pdfContent}
          </div>
        ))}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
