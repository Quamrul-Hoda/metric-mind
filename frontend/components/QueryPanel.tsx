export default function QueryPanel({ query }: { query?: Record<string, unknown> }) {
  if (!query) return null;
  return <pre className="mm-scroll overflow-x-auto rounded-md bg-[var(--mm-code-bg)] p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--mm-code-ink)]">{JSON.stringify(query, null, 2)}</pre>;
}

