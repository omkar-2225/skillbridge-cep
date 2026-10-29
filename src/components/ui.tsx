"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { ThemeToggle } from "./theme-toggle";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30">
        <Sparkles size={18} />
      </span>
      {!compact && (
        <span>
          <span className="block text-sm font-semibold tracking-[0.18em]">SKILLBRIDGE</span>
          <span className="block text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Academia × Industry
          </span>
        </span>
      )}
    </Link>
  );
}

const NAV: Record<Role, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  student: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/assessment", label: "Skill Assessment", icon: Sparkles },
    { href: "/student/roadmaps", label: "Roadmaps", icon: Compass },
    { href: "/student/mapping", label: "Skill Mapping", icon: BookOpen },
    { href: "/student/internships", label: "Internships", icon: Briefcase },
    { href: "/student/placements", label: "Placements", icon: Building2 },
    { href: "/student/learn", label: "Learning", icon: GraduationCap },
    { href: "/student/portfolio", label: "Portfolio", icon: Users },
  ],
  faculty: [
    { href: "/faculty", label: "Dashboard", icon: LayoutDashboard },
    { href: "/faculty/opportunities", label: "Faculty Opportunities", icon: Briefcase },
    { href: "/faculty/collaborate", label: "Collaboration", icon: Users },
  ],
  industry: [
    { href: "/industry", label: "Dashboard", icon: LayoutDashboard },
    { href: "/industry/post", label: "Post Opening", icon: Briefcase },
    { href: "/industry/programs", label: "Learning Programs", icon: BookOpen },
    { href: "/industry/applicants", label: "Applicants", icon: Users },
    { href: "/industry/collaborate", label: "Collaborate", icon: Sparkles },
  ],
  institution: [
    { href: "/institution", label: "Analytics", icon: LayoutDashboard },
    { href: "/institution/students", label: "Students", icon: GraduationCap },
    { href: "/institution/demand", label: "Skill Demand", icon: Sparkles },
  ],
};

export function Guard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, ready } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(`/${user.role}`);
  }, [ready, user, role, router]);

  if (!ready || !user || user.role !== role) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-400">Loading portal…</div>
    );
  }
  return <>{children}</>;
}

export function Shell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, logout } = useStore();
  const path = usePathname();
  const router = useRouter();
  const items = NAV[role];

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="glass hidden lg:flex flex-col p-5">
        <Logo />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const active = path === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  active ? "bg-teal-400/15 text-teal-200" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="btn btn-ghost mt-4 w-full"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:px-8">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm text-slate-400 lg:block">
            Signed in as <span className="text-slate-100">{user?.name}</span> · {user?.org}
          </p>
          <div className="flex items-center gap-2.5">
            <span className="chip hidden sm:inline-flex">
              <Bell size={12} /> Live demo
            </span>
            <ThemeToggle />
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-400/20 text-sm font-semibold">
              {user?.avatar}
            </div>
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2 lg:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                path === item.href ? "bg-teal-400/20 text-teal-200" : "text-slate-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <p className="chip mb-3">{kicker}</p>
      <h1 className="font-[family-name:var(--font-serif)] text-3xl tracking-tight md:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 max-w-2xl text-slate-400">{subtitle}</p>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-serif)] text-3xl">{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </Card>
  );
}

export function SkillBar({ name, level, warn }: { name: string; level: number; warn?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{name}</span>
        <span className={warn ? "text-amber-300" : "text-teal-300"}>{level}%</span>
      </div>
      <div className="bar">
        <span style={{ width: `${level}%`, background: warn ? "#f5c16c" : undefined }} />
      </div>
    </div>
  );
}
