"use client";

import { Guard, Shell } from "@/components/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Guard role="institution">
      <Shell role="institution">{children}</Shell>
    </Guard>
  );
}
