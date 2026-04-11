import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import useSessionStore from '../store/sessionStore';
import api from '../api/api';

// ── Palette shortcuts ─────────────────────────────────────────────────────────
const DARK = '#1C1917'; // page bg

// ── Trending companies ────────────────────────────────────────────────────────
const TRENDING = [
  { name: 'Meta' },
  { name: 'Google', icon: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )},
  { name: 'TikTok', icon: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="white" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.84 4.84 0 01-1.01-.09z"/>
    </svg>
  )},
  { name: 'Amazon' },
  { name: 'Apple' },
  { name: 'Microsoft' },
  { name: 'Netflix' },
  { name: 'Stripe' },
  { name: 'OpenAI' },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const STYLES = [
  { label: 'Technical',  value: 'technical' },
  { label: 'Behavioral', value: 'behavioral' },
  { label: 'Mixed',      value: 'mixed' },
];

// ── Quick stats bar ───────────────────────────────────────────────────────────
const QUICK_STATS = [
  {
    label: 'Sessions Done',
    value: '12',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/>
      </svg>
    ),
  },
  {
    label: 'Avg Score',
    value: '87%',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
      </svg>
    ),
  },
  {
    label: 'Day Streak',
    value: '5 🔥',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
      </svg>
    ),
  },
  {
    label: 'Companies',
    value: '3',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
      </svg>
    ),
  },
];

// ── Skill progress bars ───────────────────────────────────────────────────────
const SKILLS = [
  { label: 'Coding',        pct: 82 },
  { label: 'System Design', pct: 45 },
  { label: 'Behavioral',    pct: 63 },
  { label: 'Database',      pct: 71 },
];

// ── Recent sessions ───────────────────────────────────────────────────────────
const RECENT = [
  { company: 'Google', role: 'SWE', score: 91, tag: 'Coding' },
  { company: 'Meta',   role: 'PM',  score: 78, tag: 'Behavioral' },
  { company: 'Amazon', role: 'SDE', score: 85, tag: 'System Design' },
];

// ── Dropdown helper ───────────────────────────────────────────────────────────
function Select({ placeholder, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-[#252220] border border-white/12 rounded-xl px-4 py-2.5 text-white/40 text-sm focus:outline-none focus:border-[#A5CDFE]/40 cursor-pointer transition-colors"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/25 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  );
}

// ── Interview setup card ──────────────────────────────────────────────────────
const LOCAL_DEFAULTS = { role: '', category: '', difficulties: [] };

function InterviewSetup() {
  const navigate = useNavigate();

  // Global state — company and style are shared with the rest of the app
  const company      = useSessionStore((s) => s.company);
  const style        = useSessionStore((s) => s.style);
  const setCompany   = useSessionStore((s) => s.setCompany);
  const setStyle     = useSessionStore((s) => s.setStyle);
  const setSessionId = useSessionStore((s) => s.setSessionId);
  const setQuestion  = useSessionStore((s) => s.setQuestion);

  // Local state — only needed inside this form
  const [role,         setRole]         = useState(LOCAL_DEFAULTS.role);
  const [category,     setCategory]     = useState(LOCAL_DEFAULTS.category);
  const [difficulties, setDifficulties] = useState(LOCAL_DEFAULTS.difficulties);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  function toggleDifficulty(d) {
    setDifficulties((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  function handleReset() {
    setRole(LOCAL_DEFAULTS.role);
    setCategory(LOCAL_DEFAULTS.category);
    setDifficulties(LOCAL_DEFAULTS.difficulties);
    setCompany('');
    setStyle('technical');
    setError(null);
  }

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const body = { interview_style: style };
      if (company)             body.company    = company;
      if (difficulties.length) body.difficulty = difficulties.map((d) => d.toLowerCase()).join(',');

      const sessionRes = await api.post('/api/sessions/start/', body);

      setSessionId(sessionRes.data.id);
      setQuestion(sessionRes.data.question);
      navigate('/interview');
    } catch (err) {
      const msg = err.response?.data?.detail || 'No questions found for your filters. Try broadening your selection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // Mock data for testing without backend
  // async function handleStart() {
  //   setSessionId('test-session-123');
  //   setQuestion({
  //     title: 'Two Sum',
  //     description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.\n\nReturn the answer in any order.',
  //     constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.',
  //     difficulty: 'easy',
  //     company_tags: ['Google', 'Amazon'],
  //     topic_tags: ['array', 'hash-table'],
  //   });
  //   navigate('/interview');
  // }

  return (
    <div className="border border-white/12 rounded-2xl overflow-hidden bg-[#1E1C1A]">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-white/10">
        <div className="w-11 h-11 rounded-xl border border-[#A5CDFE]/25 bg-[#A5CDFE]/8 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#A5CDFE]" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-[#A5CDFE] font-semibold text-base">Set up your interview</h2>
          <p className="text-[#6E6E6E] text-xs mt-0.5">Tell us your target company and role to get personalized questions</p>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-white/8">
        <div className="grid grid-cols-[140px_1fr] gap-4 items-start p-5">
          <label className="font-medium text-white/80 text-sm pt-2.5">Role</label>
          <div>
            <Select placeholder="Select a role" options={['Software Engineer', 'Product Manager', 'Data Scientist', 'ML Engineer', 'System Design']} value={role} onChange={setRole}/>
            <p className="text-[#6E6E6E] text-xs mt-1.5">
              <span className="text-white/50 font-medium">Any (default)</span>: All role and question types selected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-4 items-start p-5">
          <label className="font-medium text-white/80 text-sm pt-2.5">Company</label>
          <div>
            <Select placeholder="Select one or many companies" options={['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'TikTok', 'Netflix', 'Stripe', 'Airbnb', 'OpenAI']} value={company} onChange={setCompany}/>
            <p className="text-[#6E6E6E] text-xs mt-1.5">
              <span className="text-white/50 font-medium">Any (default)</span>: All company selected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-4 items-start p-5">
          <label className="font-medium text-white/80 text-sm pt-2.5">Category</label>
          <div>
            <Select placeholder="Select a category" options={['Coding', 'System Design', 'Behavioral', 'Data Structures & Algorithms', 'Database']} value={category} onChange={setCategory}/>
            <p className="text-[#6E6E6E] text-xs mt-1.5">
              <span className="text-white/50 font-medium">Any (default)</span>: All categories selected.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-4 items-start p-5">
          <label className="font-medium text-white/80 text-sm pt-2">Difficulty</label>
          <div>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button key={d} onClick={() => toggleDifficulty(d)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                    difficulties.includes(d)
                      ? 'border-[#A5CDFE]/60 text-[#A5CDFE] bg-[#A5CDFE]/10'
                      : 'border-white/15 text-white/45 hover:border-white/30 hover:text-white/70'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[#6E6E6E] text-xs mt-1.5">
              Select one or more. <span className="text-white/50 font-medium">None selected</span> = all difficulties included.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] gap-4 items-start p-5">
          <label className="font-medium text-white/80 text-sm pt-2 leading-tight">Interviewer<br/>Style</label>
          <div>
            <div className="flex gap-2 flex-wrap">
              {STYLES.map((s) => (
                <button key={s.value} onClick={() => setStyle(s.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                    style === s.value
                      ? 'border-[#A5CDFE]/60 text-[#A5CDFE] bg-[#A5CDFE]/10'
                      : 'border-white/15 text-white/45 hover:border-white/30 hover:text-white/70'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[#6E6E6E] text-xs mt-1.5">
              <span className="text-white/50 font-medium">Practice (default)</span>: Friendly interviewer.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/8 bg-[#1A1815]">
        <div className="flex flex-col gap-1">
          <span className="text-[#6E6E6E] text-xs">Questions is picked by AI</span>
          {error && <span className="text-red-400 text-xs">{error}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="text-white/40 hover:text-white/70 text-xs transition-colors">
            Reset to default
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-[#A5CDFE] hover:bg-[#c2dcfe] disabled:opacity-50 disabled:cursor-not-allowed text-[#1C1917] text-xs font-bold px-5 py-2 rounded-xl transition-colors"
          >
            {loading ? 'Starting…' : 'Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Right panel ───────────────────────────────────────────────────────────────
function StatsWidget() {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#1E1C1A] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#A5CDFE] font-semibold text-sm">Your Stats</h3>
        <a href="#" className="text-[#6E6E6E] text-xs hover:text-white/60 transition-colors">View all →</a>
      </div>
      <div className="space-y-3.5">
        {SKILLS.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">{s.label}</span>
              <span className="text-[#A5CDFE] font-medium">{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#A5CDFE] transition-all duration-700"
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingWidget() {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#1E1C1A] p-5">
      <h3 className="text-[#A5CDFE] font-semibold text-sm mb-3">Trending Companies</h3>
      <div className="flex flex-wrap gap-2">
        {TRENDING.map((c) => (
          <button key={c.name}
            className="flex items-center gap-1.5 border border-white/12 rounded-full px-3 py-1 text-xs text-white/60 hover:border-[#A5CDFE]/40 hover:text-[#A5CDFE] transition-all duration-150">
            {c.icon}
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentWidget() {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#1E1C1A] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#A5CDFE] font-semibold text-sm">Recent Sessions</h3>
        <a href="#" className="text-[#6E6E6E] text-xs hover:text-white/60 transition-colors">History →</a>
      </div>
      <div className="space-y-2.5">
        {RECENT.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
            <div>
              <p className="text-white/80 text-xs font-medium">{r.company} · {r.role}</p>
              <span className="text-[#6E6E6E] text-[10px]">{r.tag}</span>
            </div>
            <span className={`text-xs font-bold ${r.score >= 85 ? 'text-[#A5CDFE]' : 'text-white/50'}`}>
              {r.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HelpWidget() {
  return (
    <div className="rounded-2xl border border-[#A5CDFE]/15 bg-[#A5CDFE]/5 p-4">
      <h3 className="text-[#A5CDFE] font-semibold text-sm mb-1">Need Help?</h3>
      <p className="text-white/40 text-xs leading-relaxed">
        Read our{' '}
        <a href="#" className="text-[#A5CDFE] hover:underline">FAQ</a>
        {' '}or contact us{' '}
        <a href="#" className="text-[#A5CDFE] hover:underline">here</a>.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white flex" style={{ background: DARK }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto page-enter">

        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 sticky top-0 z-10 backdrop-blur-sm bg-[#1C1917]/80">
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <input type="search" placeholder="Search"
                className="w-full bg-[#252220] border border-white/10 rounded-full pl-9 pr-4 py-2 text-white/60 text-sm placeholder:text-white/25 focus:outline-none focus:border-[#A5CDFE]/30 transition-colors"/>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-[#A5CDFE]/40 transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/40" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 gap-5 p-6">

          {/* Main column */}
          <main className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Welcome */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1E1C1A] p-6">
              {/* Glow accent */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#A5CDFE]/6 blur-3xl pointer-events-none" />
              <p className="text-[#6E6E6E] text-xs mb-1 uppercase tracking-widest font-medium">Dashboard</p>
              <h1 className="text-2xl font-bold text-white mb-0.5">Welcome back, <span className="text-[#A5CDFE]">user!</span></h1>
              <p className="text-[#6E6E6E] text-sm">Set up your mock interview with our AI right now.</p>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-4 gap-3">
              {QUICK_STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-[#1E1C1A] p-4 flex flex-col gap-2 hover:border-[#A5CDFE]/25 transition-colors">
                  <div className="text-[#A5CDFE]">{s.icon}</div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[#6E6E6E] text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Interview setup */}
            <InterviewSetup />
          </main>

          {/* Right panel */}
          <aside className="w-60 shrink-0 flex flex-col gap-4">
            <StatsWidget />
            <TrendingWidget />
            <RecentWidget />
            <HelpWidget />
          </aside>
        </div>
      </div>
    </div>
  );
}
