interface ErrorStateProps {
  title: string;
  message: string;
  onDismiss?: () => void;
}

export default function ErrorState({ title, message, onDismiss }: ErrorStateProps) {
  return (
    <div className="state-panel error-state" role="alert">
      <div className="state-icon" aria-hidden="true">!</div>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {onDismiss && <button className="button button-quiet" type="button" onClick={onDismiss}>Dismiss</button>}
    </div>
  );
}

