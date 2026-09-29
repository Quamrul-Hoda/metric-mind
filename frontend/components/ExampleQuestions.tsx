"use client";

export const EXAMPLE_QUESTIONS = [
  "Show total sales by region",
  "Show total profit by region",
  "Show profit margin by region",
  "Show total sales over time",
  "Why did European margins decline?",
];

export default function ExampleQuestions({
  onSelect,
  align = "start",
}: {
  onSelect: (question: string) => void;
  align?: "start" | "center";
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${align === "center" ? "justify-center" : "justify-start"}`}>
      {EXAMPLE_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="rounded-md border border-[var(--mm-border)] bg-[var(--mm-surface)] px-3 py-1.5 text-sm text-[var(--mm-ink-muted)] transition-colors hover:border-[var(--mm-accent)] hover:text-[var(--mm-accent)]"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

