"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { extractSkillsFromResume } from "@/lib/assessment-data";
import type { Certification, StudentProfile } from "@/lib/types";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

const SAMPLE_RESUMES = [
  {
    label: "Full-Stack Web Dev Resume",
    fileName: "Resume_FullStack_React_Node.pdf",
    text: "Experienced in JavaScript, TypeScript, React.js, Next.js, Node.js, Express, Tailwind CSS, SQL, PostgreSQL, REST APIs, Git, and LeetCode Data Structures.",
  },
  {
    label: "AI & Data Science Resume",
    fileName: "Resume_AI_DataScience_Python.pdf",
    text: "Proficient in Python, Machine Learning, Deep Learning, PyTorch, Pandas, NumPy, SQL, Database Management, and Quantitative Aptitude with Problem Solving.",
  },
  {
    label: "Cloud & Backend Java Resume",
    fileName: "Resume_Cloud_Backend_Java.pdf",
    text: "Backend engineering with Java, Spring Boot, OOP, Docker, AWS Cloud, Kubernetes, MySQL, PostgreSQL, System Design, and DSA Algorithms.",
  },
];

export function UpdateProfileModal({ isOpen, onClose, profile }: UpdateProfileModalProps) {
  const router = useRouter();
  const { user, updateStudentProfile } = useStore();

  const [collegeName, setCollegeName] = useState(profile.collegeName || user?.org || "");
  const [year, setYear] = useState(profile.year || "1st Year");
  const [semester, setSemester] = useState(profile.semester || "Semester 1");
  const [program, setProgram] = useState(profile.program || "B.Tech Computer Science & Engineering");
  const [cgpa, setCgpa] = useState(profile.cgpa ? String(profile.cgpa) : "8.5");
  const [bio, setBio] = useState(profile.bio || "");

  // Resume state
  const isFirstYear = year === "1st Year";
  const [hasResume, setHasResume] = useState(Boolean(profile.hasResume || profile.resumeFileName));
  const [resumeFileName, setResumeFileName] = useState(profile.resumeFileName || "");
  const [detectedSkills, setDetectedSkills] = useState<string[]>(profile.resumeSkills || []);

  // Courses / Certifications state
  const [certifications, setCertifications] = useState<Certification[]>(profile.certifications || []);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseIssuer, setNewCourseIssuer] = useState("");
  const [newCourseYear, setNewCourseYear] = useState("2026");

  // Status & error handling
  const [error, setError] = useState<string | null>(null);
  const [successPrompt, setSuccessPrompt] = useState(false);

  if (!isOpen) return null;

  // Handle year changes and semester options
  const semesterOptions: Record<string, string[]> = {
    "1st Year": ["Semester 1", "Semester 2"],
    "2nd Year": ["Semester 3", "Semester 4"],
    "3rd Year": ["Semester 5", "Semester 6"],
    "4th Year": ["Semester 7", "Semester 8"],
  };

  function handleYearChange(newYear: string) {
    setYear(newYear);
    const validSems = semesterOptions[newYear] || ["Semester 1"];
    if (!validSems.includes(semester)) {
      setSemester(validSems[0]);
    }
    setError(null);
  }

  function handleAddCourse() {
    if (!newCourseTitle.trim()) return;
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: newCourseTitle.trim(),
      issuer: newCourseIssuer.trim() || "Online MOOC / University",
      year: newCourseYear || "2026",
      verified: true,
    };
    const updatedCerts = [...certifications, newCert];
    setCertifications(updatedCerts);

    // Auto-extract any skills mentioned in course title
    const extractedFromCourse = extractSkillsFromResume(newCourseTitle);
    if (extractedFromCourse.length > 0) {
      const merged = Array.from(new Set([...detectedSkills, ...extractedFromCourse]));
      setDetectedSkills(merged);
    }

    setNewCourseTitle("");
    setNewCourseIssuer("");
  }

  function handleRemoveCourse(id: string) {
    setCertifications(certifications.filter((c) => c.id !== id));
  }

  function handleSampleResumeSelect(sample: (typeof SAMPLE_RESUMES)[0]) {
    setHasResume(true);
    setResumeFileName(sample.fileName);
    const skills = extractSkillsFromResume(sample.text);
    setDetectedSkills(skills);
    setError(null);
  }

  function handleCustomResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHasResume(true);
    setResumeFileName(file.name);
    // If it's a text file or generic read
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || "";
      const skills = extractSkillsFromResume(text || file.name);
      setDetectedSkills(skills.length > 0 ? skills : ["react", "js", "sql", "ds"]);
    };
    reader.readAsText(file);
    setError(null);
  }

  function handleSaveProfile() {
    setError(null);

    // Strict validation: Resume is compulsory if year > 1st Year
    if (!isFirstYear && (!hasResume || !resumeFileName)) {
      setError(
        "Resume is COMPULSORY for 2nd, 3rd, and 4th year students! Please attach or upload a resume to verify your technical profile."
      );
      return;
    }

    if (!user) return;

    // Determine if year changed from 1st Year to 2nd+ or if resume skills updated
    const wasFirstYear = profile.year === "1st Year";
    const promotedToSenior = wasFirstYear && !isFirstYear;
    const skillsChanged =
      detectedSkills.length > 0 &&
      JSON.stringify(detectedSkills) !== JSON.stringify(profile.resumeSkills || []);

    const shouldUnlockAssessment = promotedToSenior || skillsChanged || !isFirstYear;

    updateStudentProfile(user.id, {
      collegeName,
      year,
      semester,
      program,
      cgpa: parseFloat(cgpa) || 8.0,
      bio,
      hasResume: isFirstYear ? hasResume : true,
      resumeFileName: isFirstYear && !hasResume ? undefined : resumeFileName,
      resumeSkills: detectedSkills,
      certifications,
      // If student is promoted to 2nd+ year or updated resume skills, unlock test
      assessed: shouldUnlockAssessment ? false : profile.assessed,
      needsReassessment: shouldUnlockAssessment,
    });

    setSuccessPrompt(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {successPrompt ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-white">Profile Updated Successfully!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your academic year has been updated to <strong>{year} ({semester})</strong> with{" "}
              <strong>{detectedSkills.length} extracted resume skills</strong>.
            </p>

            {!isFirstYear ? (
              <div className="rounded-xl border border-teal-500/30 bg-teal-950/40 p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm">
                  <Sparkles size={16} /> Skill Verification Test Unlocked!
                </div>
                <p className="text-xs text-slate-300">
                  Because you are in <strong>{year}</strong> with verified resume skills (
                  {detectedSkills.map((s) => s.toUpperCase()).join(", ")}), you can now take the
                  10-Question Skill Assessment to verify these skills on your official profile.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/student/assessment");
                    }}
                    className="btn btn-primary w-full text-xs gap-1.5"
                  >
                    <Sparkles size={14} /> Take Resume Skill Test Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <button onClick={onClose} className="btn btn-primary text-xs">
                  Done &amp; Return to Dashboard
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap size={16} /> Academic Progression &amp; Upskilling
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Update Academic Profile, Courses &amp; Resume
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Update your academic year, add newly completed courses/certifications, and attach
                your resume.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 flex items-start gap-2 text-rose-200 text-xs">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Academic Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <GraduationCap size={15} className="text-teal-400" /> 1. Academic Details
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="e.g. National Institute of Technology"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Program / Degree</label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Academic Year <span className="text-teal-400">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="input w-full text-xs font-medium"
                  >
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year">4th Year (Senior / Final)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Semester <span className="text-teal-400">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="input w-full text-xs"
                  >
                    {(semesterOptions[year] || ["Semester 1"]).map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cumulative CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Short Bio</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="e.g. Aspiring full-stack engineer passionate about scalable systems."
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload Section with Strict Conditional Rule */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileCheck2 size={15} className="text-teal-400" /> 2. Resume &amp; Technical Verification
                </h3>

                {isFirstYear ? (
                  <span className="chip border-teal-500/40 bg-teal-500/10 text-teal-300 text-[11px]">
                    Optional for 1st Year
                  </span>
                ) : (
                  <span className="chip border-rose-500/50 bg-rose-500/15 text-rose-300 font-bold text-[11px]">
                    * COMPULSORY for {year}
                  </span>
                )}
              </div>

              {/* Explanatory Banner */}
              {isFirstYear ? (
                <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-3 text-xs text-teal-200">
                  🌱 <strong>1st Year Exemption:</strong> Freshmen are not required to upload a resume. You
                  may optionally attach one if you have personal projects or completed coursework.
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">
                  ⚠️ <strong>Mandatory for {year}:</strong> Because you are in your {year}, industry
                  verification requires an active resume to extract and test your declared skills.
                </div>
              )}

              {/* Sample Quick Resumes or File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Select a template or upload your resume document:
                </label>

                <div className="grid gap-2 sm:grid-cols-3">
                  {SAMPLE_RESUMES.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleSampleResumeSelect(sample)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        resumeFileName === sample.fileName
                          ? "border-teal-400 bg-teal-950/40 text-teal-200"
                          : "border-white/10 bg-slate-800/60 hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <p className="font-semibold">{sample.label}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{sample.fileName}</p>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="btn btn-ghost text-xs cursor-pointer border border-white/15 gap-1.5">
                    <Upload size={14} /> Upload Custom Resume (.pdf, .txt)
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={handleCustomResumeUpload}
                    />
                  </label>
                  {resumeFileName && (
                    <span className="text-xs text-teal-300 font-medium truncate">
                      ✓ Selected: {resumeFileName}
                    </span>
                  )}
                </div>

                {/* Detected Skills Preview */}
                {detectedSkills.length > 0 && (
                  <div className="rounded-xl border border-teal-500/20 bg-slate-950/50 p-3 mt-2">
                    <p className="text-[11px] text-slate-400 mb-1.5">
                      Skills Extracted for {year} Verification Test:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="chip border-teal-500/30 bg-teal-500/15 text-teal-200 text-[10px] uppercase font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Courses / Certifications Gained Section */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <BookOpen size={15} className="text-teal-400" /> 3. Gained Courses &amp; Certifications
              </h3>

              {certifications.length > 0 && (
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-teal-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-200">{cert.title}</p>
                          <p className="text-[11px] text-slate-400">
                            {cert.issuer} · Completed {cert.year}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(cert.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition"
                        title="Remove course"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Course Form */}
              <div className="rounded-xl border border-white/10 bg-slate-800/30 p-3 space-y-2">
                <p className="text-xs font-medium text-slate-300">Add a Newly Gained Course:</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <input
                    type="text"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    placeholder="Course Title (e.g. React & Node Dev)"
                    className="input text-xs"
                  />
                  <input
                    type="text"
                    value={newCourseIssuer}
                    onChange={(e) => setNewCourseIssuer(e.target.value)}
                    placeholder="Platform / Issuer (e.g. NPTEL, Coursera)"
                    className="input text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCourseYear}
                      onChange={(e) => setNewCourseYear(e.target.value)}
                      placeholder="Year (e.g. 2026)"
                      className="input text-xs w-20 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      className="btn btn-ghost border-teal-500/40 text-teal-300 text-xs gap-1 flex-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="btn btn-ghost text-xs">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn btn-primary text-xs gap-1.5"
              >
                <CheckCircle2 size={14} /> Save &amp; Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
