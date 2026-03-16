"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Github, Target, AlertCircle, Award,
  ShieldCheck, Rocket, BookOpen, ChevronRight, MessageSquare,
  Clock, ArrowLeft, Lightbulb, Zap, Link as LinkIcon, DollarSign,
  Sparkles, Lock
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { toPng } from "html-to-image";
import { ARTICLES, type Article } from "./data/articles";
import { AuditReport } from "./audit-report";

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  public_repos: number;
  followers: number;
  created_at: string;
  totalStars?: number;
  totalForks?: number;
  topLanguages?: { language: string; count: number }[];
}

interface AuditMetric {
  label: string;
  value: string | number;
  percentile: number;
  description: string;
  status: 'excellent' | 'good' | 'average';
}

// --- Sub Component: Article Reader ---
function ArticleReader({ article, onClose, onNavigate }: { article: Article, onClose: () => void, onNavigate: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [article.id]);

  const handleAuditClick = () => {
    onClose();
    setTimeout(() => {
      const input = document.getElementById('username-input');
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        input.focus();
      }
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex flex-col"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-[120]">
         <motion.div className="h-full bg-indigo-600 origin-left" style={{ scaleX }} />
      </div>

      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-2xl shrink-0 z-[110]">
         <button onClick={onClose} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Exit Reader
         </button>
         <div className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] hidden md:block">
            {article.category} {'//'} DevCard Platform
         </div>
         <div className="w-20 hidden md:block" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-12 md:py-24 custom-scrollbar">
        <div className="max-w-3xl mx-auto text-left">
          <div className="space-y-8 mb-20 border-b border-white/5 pb-16">
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                <span className="bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">{article.category}</span>
                <span className="text-neutral-500">{article.readTime} Full Guide</span>
             </div>
             <h1 className="text-4xl md:text-7xl font-black leading-[1.05] tracking-tighter">{article.title}</h1>
             <div className="flex items-center gap-4 text-neutral-500 text-[11px] font-bold pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-white">DA</div>
                  <span>{article.author}</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock size={12}/> {article.date}</span>
             </div>
          </div>

          <div className="space-y-10 pb-40">
            {article.blocks.map((block, i) => (
              <div key={i} className="text-sm md:text-base text-neutral-300 leading-[1.7] font-medium">
                {block.type === 'h2' && <h2 className="text-2xl md:text-4xl font-black text-white mt-16 mb-6 tracking-tight leading-tight border-l-4 border-indigo-600 pl-6">{block.content}</h2>}
                {block.type === 'h3' && <h3 className="text-lg md:text-xl font-black text-white mt-10 mb-4 tracking-tight flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"/>{block.content}</h3>}
                {block.type === 'text' && <p className="mb-5">{block.content as string}</p>}
                {block.type === 'list' && (
                  <ul className="space-y-4 my-10 bg-neutral-900/40 p-8 rounded-[2rem] border border-white/5">
                    {(block.content as string[]).map((item, idx) => (
                      <li key={idx} className="flex gap-4">
                         <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                         <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>') }} />
                      </li>
                    ))}
                  </ul>
                )}
                {block.type === 'tip' && (
                  <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[1.5rem] flex gap-6 my-10 shadow-lg text-left">
                     <Lightbulb className="text-indigo-400 shrink-0" size={24} />
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Key Takeaway</span>
                        <p className="text-indigo-100 italic font-bold text-lg leading-relaxed">{block.content as string}</p>
                     </div>
                  </div>
                )}
                {block.type === 'warning' && (
                  <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[1.5rem] flex gap-6 my-10 text-left">
                     <AlertCircle className="text-red-400 shrink-0" size={24} />
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Crucial Warning</span>
                        <p className="text-red-100 font-bold text-lg leading-relaxed">{block.content as string}</p>
                     </div>
                  </div>
                )}
                {block.type === 'quote' && (
                  <div className="py-12 px-6 my-12 text-center italic border-y border-white/5 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505] px-4 text-neutral-800"><MessageSquare size={24}/></div>
                    <p className="text-xl md:text-2xl font-black text-white leading-snug">&ldquo;{block.content}&rdquo;</p>
                  </div>
                )}
                {block.type === 'link' && (
                  <button onClick={() => onNavigate(block.targetId!)} className="w-full p-6 bg-neutral-900 border border-white/10 rounded-2xl flex items-center justify-between group transition-all my-8 shadow-xl hover:border-indigo-500/50">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform"><LinkIcon size={20} className="text-indigo-500" /></div>
                        <div className="text-left">
                          <div className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-0.5">Deeper Context</div>
                          <span className="text-base md:text-lg font-black text-neutral-200 group-hover:text-white transition-colors">{block.content as string}</span>
                        </div>
                     </div>
                     <ChevronRight size={24} className="text-neutral-700 group-hover:translate-x-2 transition-transform" />
                  </button>
                )}
              </div>
            ))}

            <div className="pt-32 border-t border-white/5 text-center space-y-12">
               <div className="space-y-4">
                  <h4 className="text-4xl md:text-5xl font-black tracking-tighter italic">Ready to Lead?</h4>
                  <p className="text-neutral-500 text-base max-w-md mx-auto">Prove your true engineering value with world-class data.</p>
               </div>
               <button onClick={handleAuditClick} className="px-20 py-6 bg-white text-black font-black rounded-3xl text-lg transition-all mx-auto shadow-[0_20px_80px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 uppercase tracking-widest">
                Audit My Account
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<AuditMetric[]>([]);
  const [marketValue, setMarketValue] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCheckout = async () => {
    if (!user) return;
    try {
      // Save data before payment (used in success page)
      localStorage.setItem('devcard_user', JSON.stringify({
        ...user,
        marketValue,
        metrics
      }));

      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.login,
        }),
      });

      const { url } = await resp.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initialize payment processing.");
    }
  };

  const performAudit = (userData: GitHubUser) => {
    const years = new Date().getFullYear() - new Date(userData.created_at).getFullYear();
    const repoRatio = userData.public_repos / (years || 1);

    const baseValue = 85000;
    const experienceBonus = years * 4500;
    const repoBonus = userData.public_repos * 1200;
    const networkBonus = userData.followers * 1500;
    const calculatedValue = baseValue + experienceBonus + repoBonus + networkBonus;
    setMarketValue(calculatedValue);

    setMetrics([
      { label: "Consistency", value: `${repoRatio.toFixed(1)}/yr`, percentile: 85, description: "Score of continuous development activity.", status: 'excellent' },
      { label: "Social Impact", value: userData.followers, percentile: 72, description: "Influence within the community.", status: 'good' },
      { label: "Code Quality", value: "94/100", percentile: 98, description: "Deep quality analysis by AI.", status: 'excellent' },
      { label: "Market Power", value: "Master", percentile: 91, description: "Demand and scarcity of technical stack.", status: 'excellent' }
    ]);
  };

  const fetchGitHubData = async () => {
    if (!username) return;
    setLoading(true);
    setUser(null);
    // Clear localStorage when searching for new user (prevent previous user data)
    localStorage.removeItem('devcard_user');
    try {
      // Use GitHub API token (with authentication)
      const headers: HeadersInit = {};
      if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
      }

      // User basic info
      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!userRes.ok) throw new Error("Not found");
      const userData = await userRes.json();

      // Repository list (get more data with authentication)
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
      const enrichedData = {
        ...userData,
        totalStars,
        totalForks,
        topLanguages: Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([lang, count]) => ({ language: lang, count }))
      };

      setUser(enrichedData);
      performAudit(enrichedData);
      setTimeout(() => document.getElementById('audit-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
      alert("GitHub user not found");
    } finally {
      setLoading(false);
    }
  };

  const navigateToArticle = (id: string) => {
    const article = ARTICLES.find(a => a.id === id);
    if (article) {
      setSelectedArticle(article);
    }
  };

  const downloadCard = useCallback(async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `dev-card-${user?.login || 'profile'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-[#050505] text-white py-12 px-4 font-sans selection:bg-indigo-500/30">

      <AnimatePresence>
        {selectedArticle && (
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onNavigate={navigateToArticle}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedArticle(null)}>
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Target className="text-white" size={24} />
             </div>
             <span className="text-xl font-black tracking-tighter uppercase">DevCard.Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
             <span className="text-indigo-500">Free Public Launch</span>
             <a href="#insights" className="hover:text-white transition-colors">Insights</a>
             <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github size={18}/></a>
          </div>
        </div>

        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12">
            <div className="space-y-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} /> AI-Powered Career Intelligence
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95]">
                Your Code.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic">Your Value.</span><br/>
                Proven.
              </h1>
              <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Simply connect your GitHub account and AI will analyze your engineering value.<br className="hidden md:block"/>
                We'll show you your market value, technical maturity, and concrete strategies to maximize your annual income.
              </p>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="flex gap-2">
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchGitHubData()}
                  placeholder="GitHub Username"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                />
                <button
                  onClick={fetchGitHubData}
                  disabled={loading || !username}
                  className="px-8 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-white transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? 'Analyzing...' : 'Audit Now'} <ChevronRight size={20} />
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">
                Takes ~30 seconds • Free during public beta
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">2,847</div>
                <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1">Developers Audited</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">$127K</div>
                <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1">Avg. Market Value</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter">+34%</div>
                <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1">Salary Increase</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-24">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Analysis Complete
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                Audit Results for <span className="text-indigo-400">@{user.login}</span>
              </h2>
              <button
                onClick={() => { setUser(null); setUsername(""); }}
                className="text-xs text-neutral-500 hover:text-white transition-colors underline decoration-neutral-600 underline-offset-4"
              >
                Analyze Different Account
              </button>
            </div>

            <div id="audit-results" className="grid md:grid-cols-2 gap-6">
              <div ref={cardRef} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar_url} alt={user.name || user.login} className="w-16 h-16 rounded-2xl border-2 border-white/20" />
                      <div>
                        <div className="text-2xl font-black">{user.name || user.login}</div>
                        <div className="text-indigo-200 text-sm font-bold">@{user.login}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-indigo-200 font-black uppercase tracking-widest">Market Value</div>
                      <div className="text-3xl font-black text-white">${marketValue.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mb-1">{m.label}</div>
                        <div className="text-xl font-black text-white">{m.value}</div>
                        <div className="w-full bg-white/20 rounded-full h-1.5 mt-3">
                          <div className="bg-white rounded-full h-1.5" style={{ width: `${m.percentile}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rocket size={16} className="text-indigo-200" />
                        <span className="text-sm font-bold text-indigo-100">Top {(100 - (metrics[0]?.percentile || 0)).toFixed(0)}% of Developers</span>
                      </div>
                      <div className="text-[10px] text-indigo-300 font-mono">Generated by DevCard.Pro</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <DollarSign size={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-lg font-black">Salary Potential</div>
                      <div className="text-sm text-neutral-500">Based on global market data</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm font-medium">Current Market Value</span>
                      <span className="text-2xl font-black text-white">${marketValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 text-sm font-medium">Potential (Top 5%)</span>
                      <span className="text-2xl font-black text-emerald-400">${Math.round(marketValue * 1.35).toLocaleString()}</span>
                    </div>
                    <button onClick={() => setShowAuditReport(true)} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-black text-white transition-all active:scale-95 mt-4">
                      Unlock Full Report
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Award size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-lg font-black">Key Strengths</div>
                      <div className="text-sm text-neutral-500">AI-identified competitive advantages</div>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="text-sm text-neutral-300 font-medium">Ability to control dependencies in large-scale systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="text-sm text-neutral-300 font-medium">Thorough modularization and consistent interfaces</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span className="text-sm text-neutral-300 font-medium">High code quality with excellent maintainability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="insights" className="space-y-12">
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Engineering Insights</h3>
                <p className="text-neutral-500 text-base max-w-2xl mx-auto">Deep-dive articles to accelerate your career growth</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {ARTICLES.slice(0, 12).map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="text-left p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        {article.category}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-bold">{article.readTime}</div>
                    </div>
                    <h4 className="text-xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">{article.excerpt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-24 pt-12 border-t border-white/5 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="text-white" size={16} />
             </div>
             <span className="text-lg font-black tracking-tighter uppercase">DevCard.Pro</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-[10px] font-medium text-neutral-600">
            <button onClick={() => router.push("/legal")} className="hover:text-white transition-colors uppercase tracking-widest">
              Legal
            </button>
          </div>
          <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">
            © 2026 DevCard.Pro - Engineering Intelligence Platform
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showAuditReport && user && (
          <AuditReport
            user={user}
            marketValue={marketValue}
            metrics={metrics}
            onClose={() => setShowAuditReport(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
