export default function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <section className="mm-fade-in rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6">
      <p className="text-xs font-medium text-[var(--mm-verified)]">Analysis complete</p>
      <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-medium text-[var(--mm-ink)]">{title}</h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--mm-ink)]">{body}</p>
    </section>
  );
}

