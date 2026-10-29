"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const demos: { role: Role; email: string; password: string; label: string; badge?: string }[] = [
  {
    role: "student",
    email: "student@skillbridge.edu",
    password: "student123",
    label: "Student (4th Year)",
    badge: "With Resume",
  },
  {
    role: "student",
    email: "firstyear@skillbridge.edu",
    password: "student123",
    label: "Student (1st Year)",
    badge: "No Resume",
  },
  { role: "faculty", email: "faculty@skillbridge.edu", password: "faculty123", label: "Academician" },
  { role: "industry", email: "industry@skillbridge.edu", password: "industry123", label: "Industry" },
  {
    role: "institution",
    email: "institution@skillbridge.edu",
    password: "admin123",
    label: "Institution",
  },
];

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState(demos[0].email);
  const [password, setPassword] = useState(demos[0].password);
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    setError(result.error);
    if (!result.error && result.role) router.push(`/${result.role}`);
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="glass w-full max-w-md rounded-3xl p-7">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-serif)] text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Role-based access for the full collaboration lifecycle.
        </p>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Email Address</label>
            <input
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button className="btn btn-primary w-full" type="submit">
            Sign In &amp; Continue
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          New student or partner?{" "}
          <Link href="/register" className="text-teal-300 hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-slate-400">One-click Demo Logins</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {demos.map((d) => (
              <button
                key={d.label}
                className="btn btn-ghost flex flex-col items-start p-2 text-left text-xs"
                type="button"
                onClick={() => {
                  setEmail(d.email);
                  setPassword(d.password);
                  setError(null);
                }}
              >
                <span className="font-medium text-slate-200">{d.label}</span>
                {d.badge && <span className="text-[10px] text-teal-300">{d.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
