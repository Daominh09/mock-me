import PropTypes from 'prop-types';

export default function QuestionDisplay({ question }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl border border-accent/25 bg-accent/8 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <h2 className="text-white font-semibold text-base">{question.title}</h2>
      </div>

      {/* Description */}
      <div className="px-6 py-5 border-b border-white/8">
        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{question.description}</p>
      </div>

      {/* Constraints */}
      {question.constraints?.length > 0 && (
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Constraints</p>
          <ul className="space-y-1.5">
            {question.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-accent mt-0.5 shrink-0">·</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

QuestionDisplay.propTypes = {
  question: PropTypes.shape({
    title:       PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    constraints: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
