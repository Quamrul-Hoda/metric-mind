interface QueryComposerProps {
  question: string;
  loading: boolean;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onExampleSelect: (question: string) => void;
}

const examples = [
  "Show total sales by region",
  "Show total profit by region",
  "Show profit margin by region",
  "Show total sales over time",
  "Why did European margins decline?",
];

export default function QueryComposer({
  question,
  loading,
  onQuestionChange,
  onSubmit,
  onClear,
  onExampleSelect,
}: QueryComposerProps) {
  return (
    <section className="composer-panel" aria-labelledby="query-title">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">New analysis</p>
          <h2 id="query-title">Ask a business question</h2>
          <p className="section-subtitle">
            Translate a plain-language question into governed metrics and dimensions.
          </p>
        </div>
        <span className="composer-badge">Natural language</span>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <label className="sr-only" htmlFor="business-question">Business question</label>
        <textarea
          id="business-question"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Example: Show total sales by region"
          rows={3}
          disabled={loading}
        />
        <div className="composer-actions">
          <div className="composer-hint">Press Enter to run · Shift + Enter for a new line</div>
          <div className="action-group">
            {question && (
              <button type="button" className="button button-quiet" onClick={onClear} disabled={loading}>
                Clear
              </button>
            )}
            <button type="submit" className="button button-primary" disabled={loading || !question.trim()}>
              {loading ? "Analyzing…" : "Ask MetricMind"}
            </button>
          </div>
        </div>
      </form>

      <div className="suggestions" aria-label="Suggested questions">
        <span className="suggestions-label">Try a question</span>
        {examples.map((example) => (
          <button
            type="button"
            className="suggestion-chip"
            key={example}
            onClick={() => onExampleSelect(example)}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}

