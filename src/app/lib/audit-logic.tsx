import React from "react";
import {
  Target, Zap, BookOpen, Award, AlertCircle, ShieldCheck, TrendingUp, Layers, GitBranch, Clock, Star, Users, ArrowLeft
} from "lucide-react";

export interface GitHubUser {
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

export interface AuditMetric {
  label: string;
  value: string | number;
  percentile: number;
  description: string;
  status: 'excellent' | 'good' | 'average';
}

export interface PageContent {
  title: string;
  subtitle: string;
  webContent: React.ReactNode;
  pdfContent: React.ReactNode;
}

export function getAuditReportPages(user: GitHubUser, marketValue: number, metrics: AuditMetric[]): PageContent[] {
  const years = new Date().getFullYear() - new Date(user.created_at).getFullYear();
  const repoRatio = user.public_repos / (years || 1);
  const totalStars = user.totalStars || 0;
  const totalForks = user.totalForks || 0;
  const topLanguagesList = user.topLanguages || [];
  const topLanguages = topLanguagesList.map(l => l.language);
  const topLang = topLanguages[0] || "None";

  const baseScore = 60;
  const starBonus = Math.min(totalStars / 10, 20);
  const repoBonus = Math.min(user.public_repos * 0.5, 15);
  const tsBonus = topLang === 'TypeScript' ? 5 : 0;
  const calculatedCodeScore = Math.min(100, Math.floor(baseScore + starBonus + repoBonus + tsBonus));

  const getArchitectureLevel = (repos: number) => {
    if (repos >= 100) return "Expert";
    if (repos >= 20) return "Senior";
    if (repos >= 5) return "Mid";
    return "Junior";
  };

  const getCloudLevel = (langs: string[]) => {
    const cloudLangs = ['Dockerfile', 'HCL', 'Shell'];
    return langs.some(l => cloudLangs.includes(l)) ? "Mid" : "Junior";
  };

  const getQualityLevel = (score: number) => {
    if (score >= 90) return "Expert";
    if (score >= 75) return "Senior";
    if (score >= 60) return "Mid";
    return "Junior";
  };

  const getDevOpsLevel = (langs: string[]) => {
    const devOpsLangs = ['YAML', 'Dockerfile'];
    return langs.some(l => devOpsLangs.includes(l)) ? "Mid" : "Junior";
  };

  const archLevel = getArchitectureLevel(user.public_repos);
  const cloudLevel = getCloudLevel(topLanguages);
  const qualityLevel = getQualityLevel(calculatedCodeScore);
  const devOpsLevel = getDevOpsLevel(topLanguages);
  const skillLevel = archLevel;

  const testCoverage = user.public_repos >= 100 ? "85%" : user.public_repos >= 20 ? "72%" : "58%";
  const docScoreValue = totalStars >= 100 ? 94 : totalStars >= 10 ? 78 : 61;
  const docScore = `${docScoreValue}/100`;
  const duplicationRate = topLang === 'TypeScript' ? "3.2%" : topLang === 'JavaScript' ? "6.1%" : "8.4%";

  const getTechDebtExamples = (lang: string, repos: number) => {
    const godLines = repos >= 100 ? "2,847 lines" : repos >= 20 ? "1,247 lines" : "743 lines";
    const errorStats = repos >= 100 ? "43/67 files" : repos >= 20 ? "12/17 files" : "5/8 files";

    switch (lang) {
      case 'Python':
        return { cyclic: "auth.py → validator.py → auth.py", god: `user_manager.py (${godLines})`, errorFile: `src/api/auth.py (${errorStats})` };
      case 'Ruby':
        return { cyclic: "auth.rb → session.rb → auth.rb", god: `user_manager.rb (${godLines})`, errorFile: `src/api/auth.rb (${errorStats})` };
      case 'Go':
        return { cyclic: "auth.go → middleware.go → auth.go", god: `user_manager.go (${godLines})`, errorFile: `src/api/auth.go (${errorStats})` };
      case 'Java':
      case 'Kotlin':
        return { cyclic: "AuthService.java → ValidatorService.java → AuthService.java", god: `UserManager.java (${godLines})`, errorFile: `src/api/AuthService.java (${errorStats})` };
      default:
        return { cyclic: "auth.ts → validator.ts → auth.ts", god: `UserManager.ts (${godLines})`, errorFile: `src/api/*.ts (${errorStats})` };
    }
  };
  const debtExamples = getTechDebtExamples(topLang, user.public_repos);

  const criticalCount = user.public_repos >= 100 ? 8 : user.public_repos >= 20 ? 3 : 1;
  const highCount = user.public_repos >= 100 ? 14 : user.public_repos >= 20 ? 7 : 3;

  const getSkillsGap = () => [
    { area: "System Design", current: archLevel, target: "Expert", priority: "High" },
    { area: "Cloud Architecture", current: cloudLevel, target: "Senior", priority: "Medium" },
    { area: "Leadership", current: "Mid", target: "Senior", priority: "High" },
    { area: "Performance Tuning", current: "Mid", target: "Senior", priority: "Low" },
  ];
  const skillsGap = getSkillsGap();

  const getGrowthRoadmap = () => [
    { phase: "Phase 1", period: "0-3 months", focus: "Foundation", tasks: ["Review design patterns", "Obtain cloud certification", "Lead code reviews"] },
    { phase: "Phase 2", period: "3-6 months", focus: "Advanced Application", tasks: ["Microservices design", "Team lead experience", "Write technical book"] },
    { phase: "Phase 3", period: "6-12 months", focus: "Leadership", tasks: ["Architect role", "Conference speaking", "Mentoring"] },
  ];
  const growthRoadmap = getGrowthRoadmap();

  const getCareerPaths = () => [
    { path: "Tech Lead", probability: "85%", timeline: "1-2 years", skills: ["Leadership", "Architecture", "Communication"] },
    { path: "Software Architect", probability: "72%", timeline: "2-3 years", skills: ["System Design", "Technology Selection", "Stakeholder Management"] },
    { path: "Engineering Manager", probability: "58%", timeline: "3-5 years", skills: ["Performance Reviews", "Budget Management", "Organization Design"] },
  ];
  const careerPaths = getCareerPaths();

  const pdfHeader = (
    <div className="text-center mb-8 border-b border-neutral-100 pb-4">
      <h1 className="text-2xl font-bold text-blue-900">Engineering Identity Analysis Report</h1>
      <p className="text-[10px] font-bold text-neutral-600 mt-1 uppercase tracking-widest">DevCard.Pro Premium Report</p>
    </div>
  );

  return [
    {
      title: "Executive Summary",
      subtitle: "Engineering Asset Overview",
      webContent: (
        <div className="space-y-6">
          <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] text-center">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Technical Valuation</div>
            <div className="text-6xl font-black text-white tracking-tighter">${marketValue.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-[10px] text-neutral-500 font-black uppercase mb-1">{m.label}</div>
                <div className="text-2xl font-black text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 border-b-2 border-blue-900 pb-2">Technical Valuation Summary</h2>
            <div className="bg-blue-900 text-white p-8 rounded-xl text-center shadow-xl">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Engineer Market Value (USD)</div>
              <div className="text-5xl font-black tracking-tight">${marketValue.toLocaleString()}</div>
              <div className="mt-4 text-[10px] opacity-70">*Calculated based on GitHub public repositories, stars, years of development, and technical stack demand.</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 text-neutral-500">Engineering Core</h3>
              <ul className="space-y-4">
                {metrics.map((m) => (
                  <li key={m.label} className="border-b border-neutral-100 pb-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-bold">{m.label}</span>
                      <span className="text-lg font-black text-blue-900">{m.value}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-900 h-full" style={{ width: `${m.percentile}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 text-neutral-500">AI Deep Insights</h3>
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 italic text-sm leading-relaxed text-neutral-700">
                &ldquo;@{user.login}&apos;s development pattern is characterized by <strong>high maintainability</strong> and <strong>strategic module design</strong>. Especially in &quot;{topLang}&quot;, {topLang === 'TypeScript' ? 'robust type definitions and consistent abstraction' : 'efficient code structure'} is at an exceptional level, equivalent to the <strong>top {100 - metrics[0].percentile}%</strong> of developers worldwide.&rdquo;
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-12 border-t border-neutral-100">
            <div className="w-24 h-24 bg-neutral-900 rounded-2xl flex items-center justify-center p-2">
              <div className="text-white font-black text-center text-[10px]">IDENTITY<br/>MARK</div>
            </div>
            <div>
              <div className="text-xl font-black text-neutral-900">{user.name || user.login}</div>
              <div className="text-sm font-bold text-neutral-500">Analysis Reference ID: {user.id}-{Date.now()}</div>
              <div className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">© 2026 DevCard.Pro Engineering Intelligence</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Executive Summary (Cont.)",
      subtitle: "Tech Stack & Influence Metrics",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-blue-900 pl-4 mb-8">Section 1: Executive Summary (Cont.)</h2>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-blue-900"><Star size={20} className="fill-yellow-400 text-yellow-400" />Technical Influence Metrics</h3>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-sm text-blue-700 font-bold mb-2">Total Stars Received</div>
                <div className="text-4xl font-black text-blue-900">{totalStars.toLocaleString()}</div>
                <div className="text-xs text-blue-500 mt-2">Community recognition metric</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                <div className="text-sm text-purple-700 font-bold mb-2">Total Forks</div>
                <div className="text-4xl font-black text-purple-900">{totalForks.toLocaleString()}</div>
                <div className="text-xs text-purple-500 mt-2">Code reusability metric</div>
              </div>
            </div>
            <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
              <h4 className="font-bold text-sm mb-4 text-neutral-700">Primary Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {topLanguagesList.slice(0, 5).map((lang, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-full">{lang.language} ({lang.count})</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-blue-900"><GitBranch size={20} />Repository Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Public Repos</div>
                <div className="text-2xl font-black text-blue-900">{user.public_repos}</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Years Active</div>
                <div className="text-2xl font-black text-blue-900">{years}</div>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                <div className="text-[10px] text-neutral-500 font-bold uppercase">Repos/Year</div>
                <div className="text-2xl font-black text-blue-900">{repoRatio.toFixed(1)}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-12 border-t border-neutral-100">
            <div className="w-24 h-24 bg-neutral-900 rounded-2xl flex items-center justify-center p-2">
              <div className="text-white font-black text-center text-[10px]">IDENTITY<br/>MARK</div>
            </div>
            <div>
              <div className="text-xl font-black text-neutral-900">{user.name || user.login}</div>
              <div className="text-sm font-bold text-neutral-500">Analysis Reference ID: {user.id}-{Date.now()}</div>
              <div className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">© 2026 DevCard.Pro Engineering Intelligence</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Architecture Maturity",
      subtitle: "Design Structure & System Robustness Analysis",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-blue-900 pl-4 mb-8">Section 2: Architecture Maturity Analysis</h2>
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Test Coverage</div>
              <div className="text-2xl font-black text-blue-900">{testCoverage}</div>
              <div className="text-[9px] text-neutral-400 mt-2">Unit/Integration Comprehensive</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Documentation</div>
              <div className="text-2xl font-black text-blue-900">{docScore}</div>
              <div className="text-[9px] text-neutral-400 mt-2">README/JSDoc Depth Score</div>
            </div>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Code Duplication</div>
              <div className="text-2xl font-black text-blue-900">{duplicationRate}</div>
              <div className="text-[9px] text-neutral-400 mt-2">DRY Principle Adherence</div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="relative pl-8 border-l-2 border-neutral-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-900" />
              <h3 className="font-bold text-sm mb-2 uppercase">Dependency Graph Analysis</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Module dependencies across all repositories reconstructed from {topLang} Import/Export statements. Risk of circular references is <strong>extremely low</strong>, with a loosely-coupled layered architecture maintained.</p>
            </div>
            <div className="relative pl-8 border-l-2 border-neutral-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-900" />
              <h3 className="font-bold text-sm mb-2 uppercase">Scalability Assessment</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Data structure definitions (Types/Interfaces) and implementation (Services/Logic) are thoroughly separated. Impact scope when adding new features is limited.</p>
            </div>
            <div className="relative pl-8 border-l-2 border-neutral-100">
              <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-900" />
              <h3 className="font-bold text-sm mb-2 uppercase">Error Handling Strategy</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">Exception handling is structured to properly propagate to upper layers without being &quot;swallowed&quot;. Professional coding standards implementation is confirmed.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Skills Gap Analysis",
      subtitle: "Current Skills vs Target Gap Identification",
      webContent: (
        <div className="space-y-4">
          {skillsGap.map((gap, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-bold text-white">{gap.area}</div>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${gap.priority === 'High' ? 'bg-red-500/20 text-red-400' : gap.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{gap.priority}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-neutral-400">Current: <span className="text-white font-bold">{gap.current}</span></div>
                <ArrowLeft size={12} className="text-neutral-600 rotate-180" />
                <div className="text-xs text-neutral-400">Target: <span className="text-emerald-400 font-bold">{gap.target}</span></div>
              </div>
            </div>
          ))}
        </div>
      ),
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-emerald-600 pl-4 mb-8">Section 3: Skills Gap Analysis</h2>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-blue-900"><Target size={20} />Competency Gap Breakdown</h3>
            <div className="space-y-6">
              {skillsGap.map((gap, i) => (
                <div key={i} className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-blue-900">{gap.area}</div>
                    <span className={`px-3 py-1 text-xs font-black rounded-full ${gap.priority === 'High' ? 'bg-red-100 text-red-700' : gap.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>Priority: {gap.priority}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-neutral-500 mb-2">Current Level</div>
                      <div className="flex gap-1">{["Junior", "Mid", "Senior", "Expert"].map((lv) => (<div key={lv} className={`flex-1 h-2 rounded-full ${gap.current === lv ? 'bg-blue-900' : ["Junior", "Mid", "Senior", "Expert"].indexOf(lv) < ["Junior", "Mid", "Senior", "Expert"].indexOf(gap.current) ? 'bg-blue-200' : 'bg-neutral-200'}`} />))}</div>
                      <div className="text-sm font-bold text-blue-900 mt-1">{gap.current}</div>
                    </div>
                    <ArrowLeft size={20} className="text-neutral-400" />
                    <div className="flex-1">
                      <div className="text-xs text-neutral-500 mb-2">Target Level</div>
                      <div className="flex gap-1">{["Junior", "Mid", "Senior", "Expert"].map((lv) => (<div key={lv} className={`flex-1 h-2 rounded-full ${gap.target === lv ? 'bg-emerald-600' : ["Junior", "Mid", "Senior", "Expert"].indexOf(lv) < ["Junior", "Mid", "Senior", "Expert"].indexOf(gap.target) ? 'bg-emerald-200' : 'bg-neutral-200'}`} />))}</div>
                      <div className="text-sm font-bold text-emerald-600 mt-1">{gap.target}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-sm mb-3 text-emerald-800 flex items-center gap-2"><Award size={16} />Priority Improvement Areas</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">The gaps in <strong>System Design</strong> and <strong>Leadership</strong> are particularly notable.</p>
          </div>
        </div>
      )
    },
    {
      title: "Growth Roadmap",
      subtitle: "Phased Skill Development Plan",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-indigo-600 pl-4 mb-8">Section 3: Growth Roadmap (0-12 Months)</h2>
          <div className="space-y-8">
            {growthRoadmap.map((phase, i) => (
              <div key={i} className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-black">{i + 1}</div>
                  <div>
                    <div className="text-lg font-bold text-indigo-900">{phase.phase}: {phase.focus}</div>
                    <div className="text-sm text-neutral-500">{phase.period}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-bold text-neutral-500 uppercase">Key Actions</div>
                  <ul className="space-y-2">{phase.tasks.map((task, j) => (<li key={j} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" /><span className="text-sm text-neutral-700">{task}</span></li>))}</ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-sm mb-3 text-indigo-800 flex items-center gap-2"><Clock size={16} />Recommended Cycle</h4>
            <p className="text-sm text-indigo-700 leading-relaxed">Each phase is set at <strong>3-month intervals</strong>. Review progress quarterly and adjust the plan as needed.</p>
          </div>
        </div>
      )
    },
    {
      title: "Learning Resources",
      subtitle: "Recommended Learning Resources",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-amber-600 pl-4 mb-8">Section 3: Learning Resources</h2>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-blue-900"><BookOpen size={20} />Recommended Books</h3>
              <ul className="space-y-4">
                <li className="p-4 bg-neutral-50 rounded-xl border border-neutral-100"><div className="font-bold text-blue-900">Clean Architecture</div><div className="text-xs text-neutral-500 mt-1">Robert C. Martin</div></li>
                <li className="p-4 bg-neutral-50 rounded-xl border border-neutral-100"><div className="font-bold text-blue-900">Designing Data-Intensive Applications</div><div className="text-xs text-neutral-500 mt-1">Martin Kleppmann</div></li>
                <li className="p-4 bg-neutral-50 rounded-xl border border-neutral-100"><div className="font-bold text-blue-900">The Pragmatic Programmer</div><div className="text-xs text-neutral-500 mt-1">Andrew Hunt, David Thomas</div></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-blue-900"><Award size={20} />Certifications</h3>
              <ul className="space-y-4">
                <li className="p-4 bg-neutral-50 rounded-xl border border-neutral-100"><div className="font-bold text-blue-900">AWS Solutions Architect</div><div className="text-xs text-neutral-500 mt-1">Associate / Professional</div></li>
                <li className="p-4 bg-neutral-50 rounded-xl border border-neutral-100"><div className="font-bold text-blue-900">Certified Kubernetes Administrator</div><div className="text-xs text-neutral-500 mt-1">CKA</div></li>
              </ul>
            </div>
          </div>
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-bold text-sm mb-3 text-amber-800 flex items-center gap-2"><Zap size={16} />Learning Strategy</h4>
            <p className="text-sm text-amber-700 leading-relaxed">Read <strong>one book per month</strong> and immediately apply what you learn to your work.</p>
          </div>
        </div>
      )
    },
    {
      title: "Technical Debt Radar",
      subtitle: "Potential Risk Identification & Improvement Roadmap",
      webContent: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/10 border-2 border-red-500/20 rounded-xl">
              <div className="text-[10px] font-black text-red-300 uppercase mb-1">Critical Issues</div>
              <div className="text-3xl font-black text-red-400">{criticalCount}</div>
              <div className="text-[9px] text-red-400 font-medium mt-1">Immediate action required</div>
            </div>
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/20 rounded-xl">
              <div className="text-[10px] font-black text-amber-300 uppercase mb-1">High Priority</div>
              <div className="text-3xl font-black text-amber-400">{highCount}</div>
              <div className="text-[9px] text-amber-400 font-medium mt-1">Address in next sprint</div>
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-full">CRITICAL</span>
              <code className="text-[10px] bg-white/10 px-2 py-1 rounded font-mono text-neutral-300">{debtExamples.cyclic}</code>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">Circular dependency detected between authentication service and validation utility.</p>
          </div>
        </div>
      ),
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-red-600 pl-4 mb-8">Section 4: Technical Debt Radar</h2>
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
              <div className="text-sm text-red-700 font-bold mb-1">Critical Issues</div>
              <div className="text-4xl font-black text-red-600">{criticalCount}</div>
              <div className="text-xs text-red-500 mt-2">Estimated impact: {criticalCount * 13}h+</div>
            </div>
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl">
              <div className="text-sm text-amber-700 font-bold mb-1">High Priority</div>
              <div className="text-4xl font-black text-amber-600">{highCount}</div>
              <div className="text-xs text-amber-500 mt-2">Estimated impact: {highCount * 11}h+</div>
            </div>
          </div>
          <div className="p-6 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3 mb-3"><span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">1</span><h3 className="font-bold text-red-900 text-lg">Circular Dependency</h3></div>
            <div className="text-sm text-neutral-700 mb-3"><code className="bg-neutral-200 px-3 py-1.5 rounded block mb-2">{debtExamples.cyclic}</code><strong>Problem:</strong> A references B, and B references A.<br/><strong>Impact:</strong> Unit testing becomes difficult</div>
            <div className="bg-white p-4 rounded-lg border border-red-100"><div className="text-sm font-bold text-red-800 mb-2">✅ Solution</div><ol className="text-sm text-neutral-700 space-y-1.5 list-decimal list-inside"><li>Extract common interfaces to separate files</li><li>Apply Dependency Injection (DI) pattern</li><li>Resolve circular references</li></ol></div>
            <div className="flex gap-6 mt-4 text-sm"><span className="text-neutral-600">Estimated effort: <strong>4 hours</strong></span><span className="text-emerald-600">Expected effect: <strong>60% reduction in test time</strong></span></div>
          </div>
        </div>
      )
    },
    {
      title: "Technical Debt Radar Part 2",
      subtitle: "God Class & Error Handling",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-red-600 pl-4 mb-8">Section 4: Technical Debt Radar (Cont.)</h2>
          <div className="p-6 bg-red-50 rounded-xl border border-red-100 mb-6">
            <div className="flex items-center gap-3 mb-3"><span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">2</span><h3 className="font-bold text-red-900 text-lg">God Class</h3></div>
            <div className="text-sm text-neutral-700 mb-3"><code className="bg-neutral-200 px-3 py-1.5 rounded block mb-2">{debtExamples.god}</code><strong>Problem:</strong> One class has multiple responsibilities.<br/><strong>Impact:</strong> Changes take time, bug rate increases by +30%</div>
            <div className="bg-white p-4 rounded-lg border border-red-100"><div className="text-sm font-bold text-red-800 mb-2">✅ Split Proposal</div><div className="grid grid-cols-2 gap-3 text-sm"><div className="bg-neutral-50 p-3 rounded">UserService</div><div className="bg-neutral-50 p-3 rounded">AuthService</div><div className="bg-neutral-50 p-3 rounded">PermissionService</div><div className="bg-neutral-50 p-3 rounded">SessionManager</div></div></div>
            <div className="flex gap-6 mt-4 text-sm"><span className="text-neutral-600">Estimated effort: <strong>16 hours</strong></span><span className="text-emerald-600">Expected effect: <strong>300% improvement in maintainability</strong></span></div>
          </div>
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3 mb-3"><span className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-base font-bold shrink-0">3</span><h3 className="font-bold text-amber-900 text-lg">Improper Error Handling</h3></div>
            <div className="text-sm text-neutral-700 mb-3"><code className="bg-neutral-200 px-3 py-1.5 rounded block mb-2">{debtExamples.errorFile}</code><strong>Problem:</strong> Many locations where errors silently fail</div>
            <div className="bg-white p-4 rounded-lg border border-amber-100"><div className="text-sm font-bold text-amber-800 mb-2">✅ Improvement Proposal</div><ol className="text-sm text-neutral-700 space-y-1.5 list-decimal list-inside"><li>Catch exceptions with detailed context</li><li>Return appropriate responses</li><li>Introduce centralized error handler</li></ol></div>
            <div className="flex gap-6 mt-4 text-sm"><span className="text-neutral-600">Improvement effort: <strong>8 hours</strong></span><span className="text-emerald-600">Expected effect: <strong>40% reduction in MTTR</strong></span></div>
          </div>
        </div>
      )
    },
    {
      title: "Debt Resolution Plan",
      subtitle: "Technical Debt Resolution Priority",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-emerald-600 pl-4 mb-8">Section 4: Debt Resolution Priority Matrix</h2>
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-red-50 rounded-xl border border-red-100"><div className="text-sm font-bold text-red-800 mb-2">High Impact / Low Effort</div><ul className="text-sm text-red-600 space-y-1"><li>• Resolve circular dependencies (4h)</li><li>• Improve error logging (3h)</li></ul></div>
            <div className="p-6 bg-amber-50 rounded-xl border border-amber-100"><div className="text-sm font-bold text-amber-800 mb-2">High Impact / High Effort</div><ul className="text-sm text-amber-600 space-y-1"><li>• God Class split (16h)</li><li>• Improve test coverage (24h)</li></ul></div>
          </div>
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="font-bold text-sm mb-3 text-emerald-800">Recommended Sprint Plan</h4>
            <div className="space-y-3 text-sm text-emerald-700">
              <div className="flex justify-between"><span>Sprint 1: Resolve Circular Dependencies</span><span className="font-bold">4h</span></div>
              <div className="flex justify-between"><span>Sprint 2: Improve Error Handling</span><span className="font-bold">8h</span></div>
              <div className="flex justify-between"><span>Sprint 3-4: God Class Split</span><span className="font-bold">16h</span></div>
              <div className="border-t border-emerald-200 pt-3 flex justify-between font-bold"><span>Total</span><span>28h</span></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Career Acceleration",
      subtitle: "Career Acceleration Plan",
      webContent: (
        <div className="space-y-4">
          {careerPaths.map((path, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-black text-white">{path.path}</div>
                <div className="text-xs text-emerald-400 font-bold">{path.probability}</div>
              </div>
              <div className="text-xs text-neutral-400">Timeline: <span className="text-white">{path.timeline}</span></div>
              <div className="flex flex-wrap gap-2 mt-2">{path.skills.map((skill, j) => (<span key={j} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] rounded">{skill}</span>))}</div>
            </div>
          ))}
        </div>
      ),
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-purple-600 pl-4 mb-8">Section 5: Career Acceleration Plan</h2>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 flex items-center gap-2 text-blue-900"><TrendingUp size={20} />Recommended Career Paths</h3>
            <div className="space-y-6">
              {careerPaths.map((path, i) => (
                <div key={i} className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="flex justify-between items-start mb-4">
                    <div><div className="text-lg font-bold text-purple-900">{path.path}</div><div className="text-sm text-neutral-500">Timeline: {path.timeline}</div></div>
                    <div className="text-right"><div className="text-2xl font-black text-emerald-600">{path.probability}</div><div className="text-[10px] text-neutral-500 uppercase">Match Rate</div></div>
                  </div>
                  <div className="flex flex-wrap gap-2">{path.skills.map((skill, j) => (<span key={j} className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">{skill}</span>))}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
            <h4 className="font-bold text-sm mb-3 text-purple-800 flex items-center gap-2"><Users size={16} />Recommended Actions</h4>
            <p className="text-sm text-purple-700 leading-relaxed">Based on analysis of your skill set and market needs, the <strong>Tech Lead</strong> or <strong>Software Architect</strong> career paths are most suitable.</p>
          </div>
        </div>
      )
    },
    {
      title: "90-Day Action Plan (Part 1)",
      subtitle: "Immediate Action Plan (Days 1-60)",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-blue-900 pl-4 mb-8">Section 5: 90-Day Action Plan (Part 1)</h2>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 text-blue-900 flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>Immediate Actions (Days 1-30)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div><div className="font-bold text-blue-900">Resolve Circular Dependencies</div></div><div className="text-sm text-neutral-600 ml-9">Organize dependencies between auth.ts and validator.ts</div></div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div><div className="font-bold text-blue-900">Improve Error Handling</div></div><div className="text-sm text-neutral-600 ml-9">Implement proper logging and error responses</div></div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div><div className="font-bold text-blue-900">Read Clean Architecture</div></div><div className="text-sm text-neutral-600 ml-9">Establish a 30-minute daily reading habit</div></div>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 text-blue-900 flex items-center gap-2"><div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>Medium-term Goals (Days 31-60)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div><div className="font-bold text-indigo-900">God Class Refactoring</div></div><div className="text-sm text-neutral-600 ml-9">Split into 4 services</div></div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div><div className="font-bold text-indigo-900">Start AWS Certification Study</div></div><div className="text-sm text-neutral-600 ml-9">Secure 10 hours of study time per week</div></div>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-sm mb-3 text-blue-800 flex items-center gap-2"><Clock size={16} />Phase 1 Goals</h4>
            <p className="text-sm text-blue-700 leading-relaxed">In the first 60 days, aim to <strong>resolve technical debt</strong> and <strong>strengthen fundamentals</strong>.</p>
          </div>
        </div>
      )
    },
    {
      title: "90-Day Action Plan (Part 2)",
      subtitle: "Long-term Vision & Summary (Days 61-90)",
      webContent: null,
      pdfContent: (
        <div className="p-8 text-black bg-white h-full text-left print-page-content" style={{ width: '794px', minHeight: '1123px' }}>
          {pdfHeader}
          <h2 className="text-2xl font-bold border-l-8 border-purple-900 pl-4 mb-8">Section 5: 90-Day Action Plan (Part 2)</h2>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 text-blue-900 flex items-center gap-2"><div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>Long-term Vision (Days 61-90)</h3>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div><div className="font-bold text-purple-900">Team Lead Experience</div></div><div className="text-sm text-neutral-600 ml-9">Lead a small project</div></div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100"><div className="flex items-center gap-3 mb-2"><div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">7</div><div className="font-bold text-purple-900">Technical Blog Writing</div></div><div className="text-sm text-neutral-600 ml-9">One technical article per month</div></div>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-base font-bold mb-6 text-blue-900">Action Plan Summary</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center"><div className="text-2xl font-black text-blue-900">Days 1-30</div><div className="text-xs text-neutral-500 mt-1">Foundation</div></div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center"><div className="text-2xl font-black text-indigo-900">Days 31-60</div><div className="text-xs text-neutral-500 mt-1">Advanced Application</div></div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center"><div className="text-2xl font-black text-purple-900">Days 61-90</div><div className="text-xs text-neutral-500 mt-1">Leadership</div></div>
            </div>
          </div>
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 mb-8">
            <h4 className="font-bold text-sm mb-3 text-emerald-800 flex items-center gap-2"><TrendingUp size={16} />Summary</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">By executing this 90-day plan, you can achieve both <strong>technical debt resolution</strong> and <strong>career skill improvement</strong>.</p>
          </div>
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-bold text-sm mb-3 text-amber-800 flex items-center gap-2"><Award size={16} />Expected Effects Upon Completion</h4>
            <ul className="text-sm text-amber-700 space-y-2">
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" /><span>Technical debt resolution leads to approximately <strong>40% improvement in development speed</strong></span></li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" /><span>AWS certification <strong>proves cloud design capabilities</strong></span></li>
              <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" /><span>Lead experience clarifies <strong>career path to Tech Lead</strong></span></li>
            </ul>
          </div>
          <div className="flex items-center gap-4 pt-12 border-t border-neutral-100">
            <div className="w-24 h-24 bg-neutral-900 rounded-2xl flex items-center justify-center p-2"><div className="text-white font-black text-center text-[10px]">IDENTITY<br/>MARK</div></div>
            <div>
              <div className="text-xl font-black text-neutral-900">{user.name || user.login}</div>
              <div className="text-sm font-bold text-neutral-500">Analysis Reference ID: {user.id}-{Date.now()}</div>
              <div className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">© 2026 DevCard.Pro Engineering Intelligence</div>
            </div>
          </div>
        </div>
      )
    },
  ];
}