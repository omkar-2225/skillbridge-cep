"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, FileText, Info, Sparkles, Upload } from "lucide-react";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { extractSkillsFromResume } from "@/lib/assessment-data";

export default function RegisterPage() {
  const { register } = useStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [org, setOrg] = useState("");

  // Student-specific fields
  const [collegeName, setCollegeName] = useState("");
  const [year, setYear] = useState<"1st Year" | "2nd Year" | "3rd Year" | "4th Year">("1st Year");
  const [semester, setSemester] = useState("Semester 1");

  // Resume state for >1st Year
  const [resumeFileName, setResumeFileName] = useState("");
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isFirstYear = year === "1st Year";

  // Dynamic semester options based on year
  const semesterOptions = useMemo(() => {
    switch (year) {
      case "1st Year":
        return ["Semester 1", "Semester 2"];
      case "2nd Year":
        return ["Semester 3", "Semester 4"];
      case "3rd Year":
        return ["Semester 5", "Semester 6"];
      case "4th Year":
        return ["Semester 7", "Semester 8"];
    }
  }, [year]);

  // Handle year change and reset semester
  function handleYearChange(newYear: "1st Year" | "2nd Year" | "3rd Year" | "4th Year") {
    setYear(newYear);
    if (newYear === "1st Year") {
      setSemester("Semester 1");
      setResumeFileName("");
      setDetectedSkills([]);
    } else if (newYear === "2nd Year") {
      setSemester("Semester 3");
    } else if (newYear === "3rd Year") {
      setSemester("Semester 5");
    } else {
      setSemester("Semester 7");
    }
  }

  // Handle simulated or real file upload
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      // Read text content if text file, or simulate parse for pdf/docx
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || "";
        const skills = extractSkillsFromResume(text || file.name);
        setDetectedSkills(skills.length > 0 ? skills : ["python", "js", "sql", "react"]);
      };
      reader.readAsText(file);
    }
  }

  function handleUseSampleResume() {
    const sample = "Experienced with React, JavaScript, Python, SQL, REST APIs, and Cloud AWS deployments. Strong in Data Structures and problem solving.";
    setResumeFileName(`${name ? name.replace(/\s+/g, "_") : "Student"}_Resume.pdf`);
    const skills = extractSkillsFromResume(sample);
    setDetectedSkills(skills);
  }

  function submit(e: FormEvent) {
    e.preventDefault();

    if (role === "student" && !isFirstYear && !resumeFileName) {
      setError("Please attach your resume (required for 2nd, 3rd, and 4th year students).");
      return;
    }

    const err = register({
      name,
      email,
      password,
      role,
      org: role === "student" ? collegeName || org : org,
      collegeName: role === "student" ? collegeName : undefined,
      year: role === "student" ? year : undefined,
      semester: role === "student" ? semester : undefined,
      hasResume: role === "student" ? !isFirstYear && Boolean(resumeFileName) : undefined,
      resumeFileName: isFirstYear ? "" : resumeFileName,
      resumeSkills: isFirstYear ? [] : detectedSkills,
    });

    setError(err);
    if (!err) {
      if (role === "student") {
        router.push("/student/assessment");
      } else {
        router.push(`/${role}`);
      }
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="glass w-full max-w-lg rounded-3xl p-7">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <h1 className="mt-6 font-[family-name:var(--font-serif)] text-3xl">Join SKILLBRIDGE</h1>
        <p className="mt-1 text-sm text-slate-400">
          Create an account to start your skill assessment and opportunity matching.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Account Role</label>
            <select className="field" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="student">Student</option>
              <option value="faculty">Academician / Faculty</option>
              <option value="industry">Industry Recruiter / Partner</option>
              <option value="institution">Institution Administrator</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Full Name</label>
              <input
                className="field"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Email Address</label>
              <input
                className="field"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav@nit.edu"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
            <input
              className="field"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
          </div>

          {/* Student-specific academic details */}
          {role === "student" ? (
            <div className="space-y-4 rounded-2xl border border-teal-500/20 bg-teal-950/20 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-300">
                <Sparkles size={16} /> Student Academic Profile
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">College / University Name</label>
                <input
                  className="field"
                  required
                  value={collegeName}
                  onChange={(e) => {
                    setCollegeName(e.target.value);
                    setOrg(e.target.value);
                  }}
                  placeholder="e.g. National Institute of Technology"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Academic Year</label>
                  <select
                    className="field"
                    value={year}
                    onChange={(e) =>
                      handleYearChange(
                        e.target.value as "1st Year" | "2nd Year" | "3rd Year" | "4th Year"
                      )
                    }
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">Semester</label>
                  <select
                    className="field"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    {semesterOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Resume requirement */}
              {isFirstYear ? (
                <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3.5 text-xs text-teal-200">
                  <div className="flex items-start gap-2">
                    <Info size={16} className="mt-0.5 shrink-0 text-teal-300" />
                    <div>
                      <span className="font-semibold text-teal-100">1st Year Students: No Resume Required!</span>
                      <p className="mt-1 leading-relaxed text-slate-300">
                        As a first-year student, focus on engineering fundamentals, mathematics, and problem solving. You will take a foundational Aptitude & CS basics assessment.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-blue-200">
                      <FileText size={15} /> Resume Upload (Required for {year})
                    </label>
                    <button
                      type="button"
                      onClick={handleUseSampleResume}
                      className="text-[11px] text-teal-300 hover:underline"
                    >
                      Autofill Sample Resume
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Your assessment test will evaluate the skills found on your resume.
                  </p>

                  <div className="mt-2.5">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-3 hover:bg-white/5">
                      <Upload size={18} className="text-slate-400" />
                      <span className="mt-1 text-xs text-slate-300">
                        {resumeFileName ? resumeFileName : "Click or browse to upload PDF / DOCX"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {detectedSkills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[11px] font-semibold text-teal-300">
                        Skills detected from resume to be tested:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {detectedSkills.map((sk) => (
                          <span key={sk} className="chip bg-teal-900/40 text-teal-200">
                            <CheckCircle2 size={11} className="text-teal-400" />
                            {sk.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Organization / Institution Name
              </label>
              <input
                className="field"
                required
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="e.g. Nexus Labs or National Institute of Technology"
              />
            </div>
          )}

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button className="btn btn-primary w-full" type="submit">
            Create Account &amp; Proceed to Assessment
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link className="text-teal-300 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
