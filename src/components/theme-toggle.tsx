"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved theme or preference
    const saved = localStorage.getItem("skillbridge-theme") as "dark" | "light" | null;
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  function applyTheme(newTheme: "dark" | "light") {
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    }
    localStorage.setItem("skillbridge-theme", newTheme);
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 ${className}`}
        aria-label="Toggle theme"
      >
        <Moon size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white ${
        theme === "light"
          ? "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
          : "border-white/10 text-teal-300 hover:border-teal-400/30"
      } ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle light and dark mode"
    >
      {theme === "dark" ? (
        <Sun size={17} className="text-amber-300 transition-transform hover:rotate-45" />
      ) : (
        <Moon size={17} className="text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

