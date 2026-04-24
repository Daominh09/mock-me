import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSessionStore from '../store/sessionStore';
import QuestionDisplay from '../components/layout/QuestionDisplay';

export default function InterviewPage() {
  const navigate  = useNavigate();
  const question  = useSessionStore((s) => s.question);
  const sessionId = useSessionStore((s) => s.sessionId);
  const clearSession = useSessionStore((s) => s.clearSession);

  // Guard: if someone navigates here directly without a session, send them back
  useEffect(() => {
    if (!question || !sessionId) {
      navigate('/dashboard', { replace: true });
    }
  }, [question, sessionId, navigate]);

  if (!question) return null;

  function handleEnd() {
    clearSession();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#1C1917] text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 sticky top-0 z-10 backdrop-blur-sm bg-[#1C1917]/80">
        <span className="text-[#A5CDFE] font-semibold text-sm">MockMe — Interview Session</span>
        <button
          onClick={handleEnd}
          className="text-white/40 hover:text-white/70 text-xs transition-colors"
        >
          End Session
        </button>
      </header>

      {/* Content */}
      <main className="flex flex-1 gap-5 p-6">
        {/* Left: question */}
        <section className="w-[45%] shrink-0">
          <QuestionDisplay question={question} />
        </section>

        {/* Right: code editor placeholder — Phase 3 */}
        <section className="flex-1 rounded-2xl border border-white/12 bg-[#1E1C1A] flex items-center justify-center">
          <p className="text-white/25 text-sm">Code editor — coming in Phase 3</p>
        </section>
      </main>
    </div>
  );
}
