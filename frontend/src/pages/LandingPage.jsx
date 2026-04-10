import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

// ── Company logos for the ticker ────────────────────────────────────────────
const COMPANIES = [
  {
    name: 'Meta',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 40 40" className="h-5 w-5" fill="none">
          <path d="M20 16.5C18.1 13.5 15.5 11 12.5 11C8.4 11 5 15.1 5 20.5C5 24.5 6.9 27 9.5 27C11.5 27 13 25.7 15 22.5L20 14.5"
            stroke="#0866FF" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M20 14.5L25 22.5C27 25.7 28.5 27 30.5 27C33.1 27 35 24.5 35 20.5C35 15.1 31.6 11 27.5 11C24.5 11 21.9 13.5 20 16.5"
            stroke="#0866FF" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M15 22.5C17 25.8 18.5 27.5 20 27.5C21.5 27.5 23 25.8 25 22.5"
            stroke="#0866FF" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <span className="font-semibold text-white text-sm tracking-wide">Meta</span>
      </span>
    ),
  },
  {
    name: 'Google',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-semibold text-white text-sm">Google</span>
      </span>
    ),
  },
  {
    name: 'Amazon',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#FF9900">
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.872-1.234-1.276-1.813-2.106-1.731 1.767-2.958 2.297-5.202 2.297-2.656 0-4.72-1.641-4.72-4.921 0-2.563 1.389-4.309 3.369-5.164 1.714-.757 4.108-.891 5.942-1.099v-.41c0-.753.059-1.641-.383-2.294-.385-.582-1.124-.822-1.776-.822-1.207 0-2.284.619-2.548 1.903-.054.285-.266.566-.558.581l-3.114-.336c-.262-.059-.552-.271-.476-.673C5.817 2.088 9.002.96 11.83.96c1.454 0 3.354.387 4.502 1.489 1.454 1.359 1.315 3.172 1.315 5.146v4.658c0 1.401.58 2.016 1.127 2.772.192.269.233.591-.01.791l-1.62 1.979z"/>
        </svg>
        <span className="font-semibold text-white text-sm">amazon</span>
      </span>
    ),
  },
  {
    name: 'TikTok',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.84 4.84 0 01-1.01-.09z"/>
        </svg>
        <span className="font-semibold text-white text-sm">TikTok</span>
      </span>
    ),
  },
  {
    name: 'Apple',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <span className="font-semibold text-white text-sm">Apple</span>
      </span>
    ),
  },
  {
    name: 'Microsoft',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 21 21" className="h-5 w-5">
          <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
          <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
          <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
          <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
        </svg>
        <span className="font-semibold text-white text-sm">Microsoft</span>
      </span>
    ),
  },
  {
    name: 'Stripe',
    logo: (
      <span className="flex items-center gap-2 text-[#635BFF] font-semibold text-sm">Stripe</span>
    ),
  },
  {
    name: 'Airbnb',
    logo: (
      <span className="flex items-center gap-2 text-[#FF5A5F] font-semibold text-sm">airbnb</span>
    ),
  },
  {
    name: 'Spotify',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#1DB954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        <span className="font-semibold text-[#1DB954] text-sm">Spotify</span>
      </span>
    ),
  },
  {
    name: 'Uber',
    logo: <span className="font-black text-white text-sm tracking-tight">Uber</span>,
  },
  {
    name: 'OpenAI',
    logo: (
      <span className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="white">
          <path d="M22.28 9.28a5.995 5.995 0 00-.52-4.94 6.06 6.06 0 00-6.52-2.91A6.065 6.065 0 0010.64.22a6.058 6.058 0 00-5.77 4.2 6.065 6.065 0 00-4.05 2.94 6.055 6.055 0 00.75 7.1 5.995 5.995 0 00.52 4.94 6.06 6.06 0 006.52 2.91 6.065 6.065 0 004.6 2.21 6.058 6.058 0 005.76-4.21 6.065 6.065 0 004.05-2.94 6.056 6.056 0 00-.74-7.09zm-9.17 12.87a4.496 4.496 0 01-2.89-1.05l.14-.08 4.8-2.77a.796.796 0 00.4-.69v-6.76l2.03 1.17a.07.07 0 01.04.06v5.6a4.516 4.516 0 01-4.52 4.52zm-9.69-4.14a4.5 4.5 0 01-.54-3.02l.14.09 4.8 2.77a.77.77 0 00.79 0l5.86-3.38v2.34a.08.08 0 01-.03.07L9.43 19.2a4.506 4.506 0 01-6.17-1.63l.16.44zm-1.2-10.43a4.5 4.5 0 012.36-1.97v5.7a.77.77 0 00.39.68l5.85 3.38-2.03 1.17a.08.08 0 01-.07 0L3.8 13.07a4.51 4.51 0 01-.63-5.49zm16.68 3.87l-5.86-3.39 2.03-1.17a.08.08 0 01.07 0l4.9 2.83a4.5 4.5 0 01-.7 8.13v-5.71a.796.796 0 00-.44-.69zm2.02-3.02l-.14-.09-4.8-2.77a.77.77 0 00-.79 0L9.55 9.67V7.33a.08.08 0 01.03-.07l4.9-2.83a4.51 4.51 0 016.64 4.67zm-12.71 4.18l-2.03-1.17a.08.08 0 01-.04-.06V6.04a4.51 4.51 0 017.41-3.47l-.14.08-4.8 2.77a.796.796 0 00-.4.69v6.77zM12 9.86l2.66 1.54L12 12.94 9.34 11.4 12 9.86z"/>
        </svg>
        <span className="font-semibold text-white text-sm">OpenAI</span>
      </span>
    ),
  },
];

// ── Feature cards — all 4 get the tilt hover effect ─────────────────────────
const FEATURE_CARDS = [
  {
    id: 'cloud-ide',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
    title: 'Cloud IDE',
    description: 'A hyper-realistic IDE for skill assessment and development',
  },
  {
    id: 'f2',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: 'Instant Feedback',
    description: 'AI-powered real-time feedback after every response',
  },
  {
    id: 'f3',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm6.75-4.5C9.75 8.004 10.254 7.5 10.875 7.5h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 019.75 19.875V8.625zm6.75-3c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V5.625z"/>
      </svg>
    ),
    title: 'Progress Tracking',
    description: 'Interview replays, notes, and personalized feedback',
  },
  {
    id: 'f4',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
      </svg>
    ),
    title: 'Expert Interviewers',
    description: 'Trained AI personas from top-tier tech companies',
  },
];

// ── How it works ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  { num: '01', title: 'Choose your settings', desc: 'Pick your roles, companies, categories and difficulties' },
  { num: '02', title: 'Mock Interviews', desc: 'Simulate real interviews with top engineers. Coding, System Design, Behavioral, etc.' },
  { num: '03', title: 'Instant Feedback', desc: 'Get feedback after each session' },
  { num: '04', title: 'Tracking Progress', desc: 'Interview replays, notes, and feedback + personalize' },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'How does this work?', a: 'Choose your target role, company, and difficulty. Our AI interviewer will conduct a realistic mock interview and provide detailed feedback immediately after.' },
  { q: 'What kind of interviews can I practice?', a: 'We support Coding (LeetCode-style), System Design, Behavioral (STAR method), and more — tailored to your target company.' },
  { q: 'Is my data private?', a: 'Yes. Your sessions and responses are only visible to you. We never share personal data with third parties.' },
  { q: 'How accurate is the AI feedback?', a: 'Our AI is trained on thousands of real interview patterns from top tech companies, giving feedback that mirrors what a real interviewer would say.' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function CompanyTicker() {
  const items = [...COMPANIES, ...COMPANIES];
  return (
    <div className="border-y border-white/10 py-6 overflow-hidden">
      <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 40s linear infinite' }}>
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-2 px-6 shrink-0">
            {c.logo}
          </span>
        ))}
      </div>
    </div>
  );
}

// All 4 cards share the same tilt + #A5CDFE bg on hover
function FeatureCard({ card }) {
  return (
    <div className="rounded-2xl p-5 border border-white/10 flex flex-col gap-3 transition-all duration-300 cursor-default bg-[#252220] hover:-rotate-3 hover:bg-[#A5CDFE] hover:border-transparent group">
      <div className="text-[#A5CDFE] group-hover:text-[#1C1917] transition-colors duration-300">
        {card.icon}
      </div>
      <p className="font-semibold text-sm text-white group-hover:text-[#1C1917] transition-colors duration-300">
        {card.title}
      </p>
      <p className="text-xs leading-relaxed text-white/55 group-hover:text-[#1C1917]/65 transition-colors duration-300">
        {card.description}
      </p>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-5 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between">
        <span className="text-white/90 text-sm font-medium">{q}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      {open && (
        <p className="mt-3 text-white/50 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function TestimonialCarousel() {
  const testimonials = [
    { name: 'Alex Chen', role: 'SWE @ Google', text: '"MockMe completely changed how I prepared for interviews. The AI felt like a real interviewer — it pushed back, asked follow-ups, and gave me honest feedback. I landed my dream job within 6 weeks."' },
    { name: 'Sarah Kim', role: 'PM @ Meta', text: '"The behavioral interview practice was incredibly realistic. The AI picked up on vague answers and asked me to elaborate, exactly like a real PM interview. Highly recommended for anyone targeting top tech."' },
    { name: 'Marcus Johnson', role: 'ML Engineer @ OpenAI', text: '"I used MockMe for system design prep and the feedback was surprisingly detailed. It pointed out bottlenecks in my designs I hadn\'t considered. Worth every minute."' },
  ];
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((idx - 1 + testimonials.length) % testimonials.length);
  const next = () => setIdx((idx + 1) % testimonials.length);
  const t = testimonials[idx];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex gap-8 items-center bg-[#1E1C1A] rounded-3xl p-8 min-h-64">
        <div className="w-40 h-40 rounded-2xl bg-white/8 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-white/20" fill="currentColor">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-white/75 text-sm leading-relaxed italic mb-4">{t.text}</p>
          <p className="text-white/50 text-sm">{t.name} — {t.role}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        {[prev, next].map((fn, i) => (
          <button key={i} onClick={fn}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-[#1C1917] min-h-screen text-white page-enter">
      <Navbar />

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-24 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight mb-6">
          Land Your Dream Job
          <br />
          With Our{' '}
          <span className="text-[#A5CDFE]">(AI Name).</span>
        </h1>
        <p className="text-white/55 max-w-xl mx-auto text-base mb-10">
          World-class interview prep accessible to everyone. From product managers to senior software
          engineers — master the delivery, not just the answer.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/signup">
            <Button variant="primary" className="px-6 py-3">Get Started</Button>
          </Link>
          <a href="#how" className="text-white/55 hover:text-white text-sm transition-colors flex items-center gap-1.5">
            See how it works
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Ticker */}
      <CompanyTicker />

      {/* Feature 1 */}
      <section className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center section-enter"
        style={{ animationDelay: '0.1s' }}>
        <div className="rounded-3xl bg-white/5 border border-white/10 aspect-square max-w-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-16 w-16 text-white/15" fill="currentColor">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Accelerate Your Skill<br />At Your Own Pace
          </h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-md">
            We've made world-class interview prep accessible to everyone. From budding product managers
            to senior software engineers and data roles, dive into thousands of curated, job-winning
            practice questions. Your path to success starts here.
          </p>
        </div>
      </section>

      {/* Feature 2 — all 4 cards with tilt hover */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-16 items-start section-enter"
        style={{ animationDelay: '0.15s' }}>
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Gain confidence<br />and get real results
          </h2>
          <p className="text-white/55 text-sm leading-relaxed max-w-md">
            Don't just solve the problem — master the delivery. Technical brilliance only gets you
            halfway; the best candidates can articulate their logic under pressure. Our platform is
            designed to turn your technical knowledge into a polished, professional performance.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURE_CARDS.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-24 section-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold text-center mb-16">How does MockMe work?</h2>
        <div className="relative grid grid-cols-4 gap-6">
          <div className="absolute top-13 left-[11%] right-[11%] border-t border-dashed border-white/15 -z-100" />
          {HOW_STEPS.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center gap-4 relative group cursor-default">
              <span className="text-8xl font-bold text-white/16 transition-all duration-300 group-hover:text-[#A5CDFE] group-hover:[text-shadow:0_0_20px_#A5CDFE,0_0_50px_#A5CDFE,0_0_80px_#A5CDFE80]">{step.num}</span>
              <div className="w-2 h-2 rounded-full bg-[#A5CDFE]" />
              <p className="font-semibold text-white/90 text-sm">{step.title}</p>
              <p className="text-white/40 text-xs leading-relaxed">{step.desc}</p>
            </div>  
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-24 section-enter" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">Don't just take our word for it</h2>
        </div>
        <TestimonialCarousel />
        <div className="text-center mt-12">
          <Link to="/signup">
            <Button variant="primary" className="px-10 py-3">Give it a try!</Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-5xl mx-auto px-6 py-24 section-enter" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-3xl font-bold text-center text-[#A5CDFE] mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
