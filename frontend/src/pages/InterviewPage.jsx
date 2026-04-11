import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSessionStore from '../store/sessionStore';
import QuestionDisplay from '../components/ui/QuestionDisplay';
import Sidebar from '../components/layout/Sidebar';

function LoadingGate() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p className="text-white/50 text-sm">Preparing your interview…</p>
    </div>
  );
}

export default function InterviewPage() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const question  = useSessionStore((s) => s.question);

  // Guard: if there's no session (e.g. direct URL access), send back to dashboard
  useEffect(() => {
    if (sessionId === null && question === null) {
      navigate('/dashboard', { replace: true });
    }
  }, [sessionId, question, navigate]);

  const isLoading = !question;

  return (
    <div className="min-h-screen text-white flex" style={{ background: 'var(--color-page)' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto page-enter">  
        <header className="flex items-center justify-between px-8 py-3.5 border-b border-white/8 sticky top-0 z-10 backdrop-blur-sm bg-page/80">
          <p className="text-accent font-semibold text-sm">Mock Interview</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/40 hover:text-white/70 text-xs transition-colors">
            ← Back to dashboard
          </button>
        </header>

        {isLoading ? (
          <LoadingGate />
        ) : (
          <div className="flex flex-1 gap-5 p-6">
            {/* Main column */}
            <main className="flex-1 min-w-0 flex flex-col gap-5">
              <QuestionDisplay question={question} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
