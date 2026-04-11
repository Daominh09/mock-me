import { create } from 'zustand';

/**
 * Global session state — shared across dashboard, interview screen, feedback.
 *
 * Fields:
 *   companies    — selected company names (string[]) — maps to company_tags in schema
 *   style        — interviewer style: 'Friendly' | 'Challenge' | 'Thinking'
 *   sessionId    — returned by POST /api/start-session (null until session starts)
 *   question     — full question object returned by the backend (null until session starts)
 *   solutionSet  — array of solution approaches returned by the backend
 *   hints        — array of hints returned by the backend
 *   personaConfig — interviewer persona config object returned by the backend
 */
const useSessionStore = create((set) => ({
  companies:     [],
  style:         'Friendly',
  sessionId:     null,
  question:      null,
  solutionSet:   null,
  hints:         null,
  personaConfig: null,

  setCompanies:     (companies)     => set({ companies }),
  setStyle:         (style)         => set({ style }),
  setSessionId:     (sessionId)     => set({ sessionId }),
  setQuestion:      (question)      => set({ question }),
  setSolutionSet:   (solutionSet)   => set({ solutionSet }),
  setHints:         (hints)         => set({ hints }),
  setPersonaConfig: (personaConfig) => set({ personaConfig }),

  // Called after a session ends or the user resets the form
  clearSession: () => set({
    sessionId: null, question: null, solutionSet: null, hints: null, personaConfig: null,
  }),

  // Full reset back to initial state
  resetAll: () => set({
    companies: [], style: 'Friendly',
    sessionId: null, question: null, solutionSet: null, hints: null, personaConfig: null,
  }),
}));

export default useSessionStore;
