import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetricMind — Agentic Semantic BI Engine",
  description: "Ask business questions in plain language and get answers grounded in a governed semantic layer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () { try { var stored = localStorage.getItem("metricmind_theme"); var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", stored ? stored === "dark" : prefersDark); } catch (e) {} })();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
