import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import useSessionStore from '../store/sessionStore';
import SearchableDropdown from '../components/ui/SearchableDropdown';
import { MultiPillGroup } from '../components/primitives/PillGroup';
import { startSession } from '../services/sessionService';


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
  { label: 'Friendly',   value: 'friendly' },
  { label: 'Challenged', value: 'challenged' },
  { label: 'Thinking',   value: 'thinking' },
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

// ── Interview setup card ──────────────────────────────────────────────────────
const STYLE_CAPTIONS = {
  friendly:   'Practice mode — supportive interviewer, great for beginners.',
  challenged: 'Pushes back on your answers to test depth and confidence.',
  thinking:   'Socratic style — guides you to think aloud step by step.',
};

const LOCAL_DEFAULTS = { role: '', topics: [], difficulties: [] };

function InterviewSetup() {
  const navigate = useNavigate();

  const companies      = useSessionStore((s) => s.companies);
  const style          = useSessionStore((s) => s.style);
  const setCompanies   = useSessionStore((s) => s.setCompanies);
  const setStyle       = useSessionStore((s) => s.setStyle);
  const setSessionId   = useSessionStore((s) => s.setSessionId);
  const setQuestion    = useSessionStore((s) => s.setQuestion);
  const setSolutionSet = useSessionStore((s) => s.setSolutionSet);
  const setHints       = useSessionStore((s) => s.setHints);
  const setPersonaConfig = useSessionStore((s) => s.setPersonaConfig);

  const [role,         setRole]         = useState(LOCAL_DEFAULTS.role);
  const [topics,       setTopics]       = useState(LOCAL_DEFAULTS.topics);
  const [difficulties, setDifficulties] = useState(LOCAL_DEFAULTS.difficulties);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  function handleReset() {
    setRole(LOCAL_DEFAULTS.role);
    setTopics(LOCAL_DEFAULTS.topics);
    setDifficulties(LOCAL_DEFAULTS.difficulties);
    setCompanies([]);
    setStyle('friendly');
    setError(null);
  }

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const data = await startSession({ companies, style, topics, difficulties });
      setSessionId(data.id);
      setQuestion(data.question);
      setSolutionSet(data.solution_set ?? null);
      setHints(data.hints ?? null);
      setPersonaConfig(data.persona_config ?? null);
      navigate('/interview');
    } catch (err) {
      setError(err?.response?.data?.detail ?? 'Failed to start session. Please try again.');
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

  // Dynamic difficulty caption
  function diffCaption() {
    if (difficulties.length === 0) {
      return <><span className="text-white/50 font-medium">None selected</span> = all difficulties included.</>;
    }
    if (difficulties.length === DIFFICULTIES.length) {
      return <>All difficulties included.</>;
    }
    return <>Selected: {difficulties.map((d, i) => (
      <span key={d}>{i > 0 && ', '}<span className="text-white/50 font-medium">{d}</span></span>
    ))}.</>;
  }

  return (
    <div className="border border-white/12 rounded-2xl overflow-hidden bg-surface">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-white/10">
        <div className="w-11 h-11 rounded-xl border border-accent/25 bg-accent/8 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-accent font-semibold text-base">Set up your interview</h2>
          <p className="text-muted text-xs mt-0.5">Tell us your target company and role to get personalized questions</p>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-white/8">
        <div className="form-row">
          <label className="font-medium text-white/80 text-sm pt-2.5">Role</label>
          <div>
            <SearchableDropdown
              placeholder="Select a role"
              options={['Software Engineer', 'Product Manager', 'Data Scientist', 'ML Engineer', 'System Design']}
              value={role}
              onChange={setRole}
            />
            <p className="text-muted text-xs mt-1.5">
              {role
                ? <>Role: <span className="text-white/50 font-medium">{role}</span></>
                : <><span className="text-white/50 font-medium">Any (default)</span>: All role types selected.</>
              }
            </p>
          </div>
        </div>

        <div className="form-row">
          <label className="font-medium text-white/80 text-sm pt-2.5">Company</label>
          <div>
            <SearchableDropdown
              placeholder="Select companies"
              options={['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'TikTok', 'Netflix', 'Stripe', 'Airbnb', 'OpenAI']}
              value={companies}
              onChange={setCompanies}
              multiple
            />
            <p className="text-muted text-xs mt-1.5">
              {companies.length > 0
                ? <>Selected: <span className="text-white/50 font-medium">{companies.join(', ')}</span></>
                : <><span className="text-white/50 font-medium">Any (default)</span>: All companies selected.</>
              }
            </p>
          </div>
        </div>

        <div className="form-row">
          <label className="font-medium text-white/80 text-sm pt-2.5">Topic</label>
          <div>
            <SearchableDropdown
              placeholder="Select topics"
              options={['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'System Design', 'Behavioral', 'Database', 'Sorting', 'Binary Search']}
              value={topics}
              onChange={setTopics}
              multiple
            />
            <p className="text-muted text-xs mt-1.5">
              {topics.length > 0
                ? <>Selected: <span className="text-white/50 font-medium">{topics.join(', ')}</span></>
                : <><span className="text-white/50 font-medium">Any (default)</span>: All topics selected.</>
              }
            </p>
          </div>
        </div>

        <div className="form-row">
          <label className="font-medium text-white/80 text-sm pt-2">Difficulty</label>
          <div>
            <MultiPillGroup options={DIFFICULTIES} value={difficulties} onChange={setDifficulties} />
            <p className="text-muted text-xs mt-1.5">{diffCaption()}</p>
          </div>
        </div>

        <div className="form-row">
          <label className="font-medium text-white/80 text-sm pt-2">Interviewer Style</label>
          <div>
            <div className="flex gap-2 flex-wrap">
              {STYLES.map((s) => (
                <button key={s.value} onClick={() => setStyle(s.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                    style === s.value
                      ? 'border-accent/60 text-accent bg-accent/10'
                      : 'border-white/15 text-white/45 hover:border-white/30 hover:text-white/70'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-muted text-xs mt-1.5">
              <span className="text-white/50 font-medium">{STYLES.find((s) => s.value === style)?.label}</span>: {STYLE_CAPTIONS[style]}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/8 bg-surface-dark">
        <div>
          <span className="text-muted text-xs">Question is picked by AI</span>
          {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} disabled={loading}
            className="text-white/40 hover:text-white/70 text-xs transition-colors disabled:opacity-40">
            Reset to default
          </button>
          <button onClick={handleStart} disabled={loading}
            className="bg-accent hover:bg-accent-hover text-page text-xs font-bold px-5 py-2 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
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
    <div className="rounded-2xl border border-white/12 bg-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-accent font-semibold text-sm">Your Stats</h3>
        <a href="#" className="text-muted text-xs hover:text-white/60 transition-colors">View all →</a>
      </div>
      <div className="space-y-3.5">
        {SKILLS.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/60">{s.label}</span>
              <span className="text-accent font-medium">{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
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
    <div className="rounded-2xl border border-white/12 bg-surface p-5">
      <h3 className="text-accent font-semibold text-sm mb-3">Trending Companies</h3>
      <div className="flex flex-wrap gap-2">
        {TRENDING.map((c) => (
          <button key={c.name}
            className="flex items-center gap-1.5 border border-white/12 rounded-full px-3 py-1 text-xs text-white/60 hover:border-accent/40 hover:text-accent transition-all duration-150">
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
    <div className="rounded-2xl border border-white/12 bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-accent font-semibold text-sm">Recent Sessions</h3>
        <a href="#" className="text-muted text-xs hover:text-white/60 transition-colors">History →</a>
      </div>
      <div className="space-y-2.5">
        {RECENT.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/6 last:border-0">
            <div>
              <p className="text-white/80 text-xs font-medium">{r.company} · {r.role}</p>
              <span className="text-muted text-[10px]">{r.tag}</span>
            </div>
            <span className={`text-xs font-bold ${r.score >= 85 ? 'text-accent' : 'text-white/50'}`}>
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
    <div className="rounded-2xl border border-accent/15 bg-accent/5 p-4">
      <h3 className="text-accent font-semibold text-sm mb-1">Need Help?</h3>
      <p className="text-white/40 text-xs leading-relaxed">
        Read our{' '}
        <a href="/faq" className="text-accent hover:underline">FAQ</a>
        {' '}or contact us{' '}
        <a href="/contact" className="text-accent hover:underline">here</a>.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white flex" style={{ background: 'var(--color-page)' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto page-enter">

        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 sticky top-0 z-10 backdrop-blur-sm bg-page/80">
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/25 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <input type="search" placeholder="Search"
                className="w-full bg-input border border-white/10 rounded-full pl-9 pr-4 py-2 text-white/60 text-sm placeholder:text-white/25 focus:outline-none focus:border-accent/30 transition-colors"/>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-accent/40 transition-colors cursor-pointer">
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
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-6">
              {/* Glow accent */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-accent/6 blur-3xl pointer-events-none" />
              <p className="text-muted text-xs mb-1 uppercase tracking-widest font-medium">Dashboard</p>
              <h1 className="text-2xl font-bold text-white mb-0.5">Welcome back, <span className="text-accent">user!</span></h1>
              <p className="text-muted text-sm">Set up your mock interview with our AI right now.</p>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-4 gap-3">
              {QUICK_STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-surface p-4 flex flex-col gap-2 hover:border-accent/25 transition-colors">
                  <div className="text-accent">{s.icon}</div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-muted text-xs">{s.label}</p>
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

        <Footer />
      </div>
    </div>
  );
}
