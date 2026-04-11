import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { PillGroup } from '../components/primitives/PillGroup';

const FAQ_SECTIONS = [
  {
    category: 'Getting Started',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
      </svg>
    ),
    items: [
      {
        q: 'How does MockMe work?',
        a: 'Choose your target role, company, interview style, and difficulty. Our AI interviewer conducts a realistic mock interview — asking questions, following up on your answers, and providing detailed feedback immediately after.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'Yes, a free account is required so we can save your session history, track your progress, and personalize your experience over time.',
      },
      {
        q: 'What interview types are supported?',
        a: 'We support Coding (LeetCode-style), System Design, Behavioral (STAR method), and Database/SQL rounds — all tailored to your target company and role.',
      },
      {
        q: 'How do I pick a company?',
        a: 'From the dashboard, use the Company selector to choose one or more companies (Google, Meta, Amazon, etc.). Leaving it blank means questions are drawn from all companies in our bank.',
      },
    ],
  },
  {
    category: 'Interview Practice',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
    items: [
      {
        q: 'What are the interviewer styles?',
        a: 'Friendly is a supportive practice mode great for beginners. Challenge pushes back on your answers to test depth. Thinking uses a Socratic approach, guiding you to reason through problems step by step.',
      },
      {
        q: 'How accurate is the AI feedback?',
        a: 'Our AI is trained on thousands of real interview patterns from top tech companies, calibrated to give feedback that mirrors what an actual interviewer would say — covering correctness, communication, and efficiency.',
      },
      {
        q: 'Can I practice the same question multiple times?',
        a: 'Yes. Each new session selects a question based on your filters, but you can always reset and start a new session on the same topic to practice variations.',
      },
      {
        q: 'What is the solution set?',
        a: 'After your interview session, MockMe reveals the reference solution set — multiple approaches (brute force, optimal) with time/space complexity breakdowns so you can compare against your answer.',
      },
      {
        q: 'Are hints available during the interview?',
        a: 'Yes. If you get stuck, you can request a hint. Hints are tiered — each one nudges you further toward the solution without giving it away entirely.',
      },
    ],
  },
  {
    category: 'Account & Billing',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
      </svg>
    ),
    items: [
      {
        q: 'Is MockMe free?',
        a: 'We offer a free tier with a limited number of sessions per month. A paid plan unlocks unlimited sessions, all interviewer styles, and full session history.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the login page, click "Reset here" under the login form. You\'ll receive an email with a reset link within a few minutes.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Go to Settings → Account → Delete Account. This permanently removes all your data including session history and progress.',
      },
    ],
  },
  {
    category: 'Privacy & Data',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
      </svg>
    ),
    items: [
      {
        q: 'Is my interview data private?',
        a: 'Yes. Your sessions and responses are only visible to you. We never share personal data or session content with third parties.',
      },
      {
        q: 'Does MockMe record audio or video?',
        a: 'No. MockMe is entirely text and code-based. No audio or video is ever captured.',
      },
      {
        q: 'How long is my session history stored?',
        a: 'Session history is kept indefinitely on active accounts. If you delete your account, all data is permanently erased within 30 days.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/10 py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-white/85 text-sm font-medium">{q}</span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-white/35 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState(null);

  const visibleSections = activeCategory
    ? FAQ_SECTIONS.filter((s) => s.category === activeCategory)
    : FAQ_SECTIONS;

  return (
    <div className="bg-page min-h-screen text-white page-enter">
      <Navbar />

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 max-w-3xl mx-auto">
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">Help Center</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">How can we help?</h1>
        <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto">
          Find answers to common questions about MockMe, or{' '}
          <Link to="/contact" className="text-accent hover:underline">contact us</Link>
          {' '}if you need more help.
        </p>
      </section>

      {/* Category filter */}
      <div className="max-w-3xl mx-auto px-6 mb-10 flex justify-center">
        <PillGroup
          options={FAQ_SECTIONS.map((s) => s.category)}
          value={activeCategory}
          onChange={(v) => setActiveCategory(activeCategory === v ? null : v)}
          nullable
        />
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-12">
        {visibleSections.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg border border-accent/20 bg-accent/8 flex items-center justify-center text-accent shrink-0">
                {section.icon}
              </div>
              <h2 className="text-white font-semibold text-base">{section.category}</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface overflow-hidden px-5">
              {section.items.map((item) => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still stuck CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-2xl border border-white/10 bg-surface p-8">
          <h3 className="text-white font-semibold text-lg mb-2">Still have questions?</h3>
          <p className="text-white/45 text-sm mb-5">
            Our team is happy to help. Reach out and we'll get back to you within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-accent hover:bg-accent-hover text-page text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
