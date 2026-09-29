"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar, { type View } from "./Sidebar";

export default function AppShell({
  active,
  onNavigate,
  status,
  children,
}: {
  active: View;
  onNavigate: (view: View) => void;
  status: "unknown" | "online" | "offline";
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--mm-bg)]">
      <Sidebar
        active={active}
        status={status}
        open={mobileNavOpen}
        onNavigate={onNavigate}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          status={status}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
