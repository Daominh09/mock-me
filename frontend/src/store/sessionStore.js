import { create } from 'zustand';

/**
 * Global session state — shared across dashboard, interview screen, feedback.
 *
 * Fields:
 *   company   — selected company name (string)
 *   style     — interviewer style: 'technical' | 'behavioral' | 'mixed'
 *   sessionId — returned by POST /api/start-session (null until session starts)
 *   question  — full question object returned by the backend (null until session starts)
 */
const useSessionStore = create((set) => ({
  company:   '',
  style:     'technical',
  sessionId: null,
  question:  null,

  setCompany:   (company)   => set({ company }),
  setStyle:     (style)     => set({ style }),
  setSessionId: (sessionId) => set({ sessionId }),
  setQuestion:  (question)  => set({ question }),

  // Called after a session ends or the user resets the form
  clearSession: () => set({ sessionId: null, question: null }),

  // Full reset back to initial state
  resetAll: () => set({ company: '', style: 'technical', sessionId: null, question: null }),
}));

export default useSessionStore;
