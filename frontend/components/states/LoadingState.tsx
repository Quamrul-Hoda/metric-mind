export default function LoadingState() {
  return (
    <div className="state-panel loading-state" role="status" aria-live="polite">
      <span className="loading-indicator" aria-hidden="true" />
      <div>
        <strong>Analyzing your question</strong>
        <p>Parsing intent and querying the governed semantic layer.</p>
      </div>
    </div>
  );
}

