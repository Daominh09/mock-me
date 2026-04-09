import PropTypes from 'prop-types';

const DIFFICULTY_COLOR = {
  easy:   'text-green-400',
  medium: 'text-yellow-400',
  hard:   'text-red-400',
};

export default function QuestionDisplay({ question }) {
  const { title, description, constraints, difficulty, company_tags, topic_tags } = question;

  return (
    <div className="rounded-2xl border border-white/12 bg-[#1E1C1A] h-full overflow-y-auto p-6 flex flex-col gap-5">
      {/* Title + meta */}
      <div className="flex flex-col gap-2">
        <h1 className="text-white font-bold text-xl leading-snug">{title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {difficulty && (
            <span className={`text-xs font-semibold capitalize ${DIFFICULTY_COLOR[difficulty] ?? 'text-white/60'}`}>
              {difficulty}
            </span>
          )}
          {company_tags?.map((tag) => (
            <span key={tag} className="text-[10px] border border-white/15 rounded-full px-2 py-0.5 text-white/50">
              {tag}
            </span>
          ))}
          {topic_tags?.map((tag) => (
            <span key={tag} className="text-[10px] border border-[#A5CDFE]/20 rounded-full px-2 py-0.5 text-[#A5CDFE]/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">
        {description}
      </div>

      {/* Constraints */}
      {constraints && (
        <div className="border-t border-white/8 pt-4">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">Constraints</h2>
          <div className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
            {constraints}
          </div>
        </div>
      )}
    </div>
  );
}

QuestionDisplay.propTypes = {
  question: PropTypes.shape({
    title:        PropTypes.string.isRequired,
    description:  PropTypes.string.isRequired,
    constraints:  PropTypes.string,
    difficulty:   PropTypes.string,
    company_tags: PropTypes.arrayOf(PropTypes.string),
    topic_tags:   PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
