"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
  Youtube,
} from "lucide-react";
import { generateZeroRoundTest } from "@/lib/assessment-data";
import { getRemediationsForSkills } from "@/lib/recommendations-data";
import type { Opportunity, ZeroRoundResult } from "@/lib/types";

interface ZeroRoundModalProps {
  opp: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: ZeroRoundResult) => void;
}

export function ZeroRoundModal({ opp, isOpen, onClose, onComplete }: ZeroRoundModalProps) {
  // Generate the 3 stages: Easy (3), Medium (3), Hard (EXACTLY 2)
  const testBank = useMemo(() => {
    return generateZeroRoundTest(opp.requiredSkills);
  }, [opp.requiredSkills]);

  const remediations = useMemo(() => {
    return getRemediationsForSkills(opp.requiredSkills);
  }, [opp.requiredSkills]);

  // Stages: "overview" | "easy" | "easy-result" | "medium" | "medium-result" | "hard" | "hard-result" | "disqualified"
  const [currentStage, setCurrentStage] = useState<
    "overview" | "easy" | "easy-result" | "medium" | "medium-result" | "hard" | "hard-result" | "disqualified"
  >("overview");

  // Answers by stage
  const [easyAnswers, setEasyAnswers] = useState<Record<string, number>>({});
  const [mediumAnswers, setMediumAnswers] = useState<Record<string, number>>({});
  const [hardAnswers, setHardAnswers] = useState<Record<string, number>>({});

  // Proctoring state: NO SCREEN SWITCH ALLOWED
  const [switchCount, setSwitchCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [disqualifiedReason, setDisqualifiedReason] = useState<string | null>(null);

  // Timer
  const [seconds, setSeconds] = useState(0);

  const isTestingActive =
    isOpen &&
    ["easy", "medium", "hard"].includes(currentStage);

  // Monitor screen switch / tab blur
  useEffect(() => {
    if (!isTestingActive) return;

    function handleVisibilityChange() {
      if (document.hidden) {
        handleViolation("Tab switch or screen minimize detected!");
      }
    }

    function handleBlur() {
      handleViolation("Window lost focus! No screen switch allowed.");
    }

    function handleViolation(reason: string) {
      setSwitchCount((prev) => {
        const next = prev + 1;
        if (next >= 2) {
          // Disqualify immediately on second strike
          setCurrentStage("disqualified");
          setDisqualifiedReason(
            "Disqualified from Round 0: Multiple screen switches detected. Strict anti-cheating policy enforced."
          );
          setWarningMessage(null);
        } else {
          setWarningMessage(
            `⚠️ PROCTORING ALERT (Warning 1/2): ${reason} Please stay on this screen. Next switch will result in immediate disqualification!`
          );
        }
        return next;
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      clearInterval(timer);
    };
  }, [isTestingActive]);

  if (!isOpen) return null;

  // Easy stage score calculation
  const easyStats = {
    total: testBank.easy.length,
    answered: Object.keys(easyAnswers).length,
    correct: testBank.easy.filter((q) => easyAnswers[q.id] === q.answer).length,
  };
  const easyScorePct = Math.round((easyStats.correct / (easyStats.total || 1)) * 100);
  const passedEasy = easyScorePct >= 35; // Requirement: >= 35%

  // Medium stage score calculation
  const mediumStats = {
    total: testBank.medium.length,
    answered: Object.keys(mediumAnswers).length,
    correct: testBank.medium.filter((q) => mediumAnswers[q.id] === q.answer).length,
  };
  const mediumScorePct = Math.round((mediumStats.correct / (mediumStats.total || 1)) * 100);
  const passedMedium = mediumScorePct >= 75; // Requirement: >= 75%

  // Hard stage score calculation (exactly 2 questions)
  const hardStats = {
    total: testBank.hard.length,
    answered: Object.keys(hardAnswers).length,
    correct: testBank.hard.filter((q) => hardAnswers[q.id] === q.answer).length,
  };
  const hardScorePct = Math.round((hardStats.correct / (hardStats.total || 1)) * 100);

  // Overall combined score
  const totalQuestions = testBank.easy.length + testBank.medium.length + testBank.hard.length;
  const totalCorrect = easyStats.correct + mediumStats.correct + hardStats.correct;
  const overallPct = Math.round((totalCorrect / (totalQuestions || 1)) * 100);

  function handleStartExam() {
    setSeconds(0);
    setSwitchCount(0);
    setWarningMessage(null);
    setCurrentStage("easy");
  }

  function handleSubmitEasy() {
    setCurrentStage("easy-result");
  }

  function handleProceedToMedium() {
    setCurrentStage("medium");
  }

  function handleSubmitMedium() {
    setCurrentStage("medium-result");
  }

  function handleProceedToHard() {
    setCurrentStage("hard");
  }

  function handleSubmitHard() {
    setCurrentStage("hard-result");
  }

  function handleFinalizeApplication(passed: boolean) {
    const result: ZeroRoundResult = {
      opportunityId: opp.id,
      passed,
      stageReached:
        currentStage === "hard-result"
          ? "completed"
          : currentStage === "medium-result"
          ? "medium"
          : "easy",
      easyScore: easyScorePct,
      mediumScore: currentStage !== "easy-result" ? mediumScorePct : undefined,
      hardScore: currentStage === "hard-result" ? hardScorePct : undefined,
      totalScore: overallPct,
      switchCount,
      completedAt: new Date().toISOString(),
    };
    onComplete(result);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
      <div className="glass max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-teal-500/30 p-6 shadow-2xl">
        {/* Proctoring Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="chip border-teal-500/30 bg-teal-500/10 text-teal-300">
                <Sparkles size={12} /> {opp.company} Zero Round Screening
              </span>
              <span className="chip border-rose-500/30 bg-rose-500/10 text-rose-300">
                <ShieldAlert size={12} /> No Screen Switch Allowed
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-100">
              Round 0 Assessment: {opp.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning Bar if tab switch occurred */}
        {warningMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
            <AlertTriangle size={18} className="shrink-0 text-rose-400" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Live Proctoring Status */}
        {isTestingActive && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-xs">
            <span className="flex items-center gap-1.5 text-teal-300">
              <ShieldCheck size={14} /> Proctored Session Active
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock size={14} className="text-teal-400" /> Time: {Math.floor(seconds / 60)}:
              {seconds % 60 < 10 ? "0" : ""}
              {seconds % 60}
            </span>
            <span className={switchCount > 0 ? "text-rose-400 font-semibold" : "text-slate-400"}>
              Screen switches detected: {switchCount}/1 warning
            </span>
          </div>
        )}

        {/* STAGE: OVERVIEW */}
        {currentStage === "overview" && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-teal-500/20 bg-teal-950/20 p-5">
              <h3 className="text-base font-semibold text-teal-200">
                Adaptive Zero Round Screening Structure
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                To qualify for this position at <strong className="text-white">{opp.company}</strong>,
                you must complete the adaptive screening test tailored to their required tech stack:
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                  <span className="chip border-emerald-400/30 text-emerald-300">Stage 1</span>
                  <p className="mt-2 text-sm font-semibold text-slate-100">Easy Level</p>
                  <p className="mt-1 text-xs text-slate-300">3 Questions</p>
                  <p className="mt-2 text-[11px] font-semibold text-emerald-400">
                    Threshold: Score &ge; 35% to unlock Medium
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
                  <span className="chip border-amber-400/30 text-amber-300">Stage 2</span>
                  <p className="mt-2 text-sm font-semibold text-slate-100">Medium Level</p>
                  <p className="mt-1 text-xs text-slate-300">3 Questions</p>
                  <p className="mt-2 text-[11px] font-semibold text-amber-400">
                    Threshold: Score &ge; 75% to unlock Hard
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5">
                  <span className="chip border-rose-400/30 text-rose-300">Stage 3 (Final)</span>
                  <p className="mt-2 text-sm font-semibold text-slate-100">Hard Level</p>
                  <p className="mt-1 text-xs text-slate-300">Exactly 2 Questions</p>
                  <p className="mt-2 text-[11px] font-semibold text-rose-400">
                    High-impact architectural &amp; problem items
                  </p>
                </div>
              </div>
            </div>

            {/* Strict Anti-Cheat Rules */}
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-4 text-xs">
              <h4 className="flex items-center gap-1.5 font-semibold text-rose-300">
                <ShieldAlert size={16} /> Strict Proctoring &amp; Anti-Cheating Policy
              </h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-slate-300">
                <li>
                  <strong className="text-white">No screen switches allowed:</strong> Leaving this
                  tab, minimizing browser, or using dual screens triggers an instant violation.
                </li>
                <li>
                  <strong className="text-white">Disqualification rule:</strong> 1 warning allowed. A
                  second tab or screen switch immediately terminates and fails the exam.
                </li>
                <li>Ensure a quiet, uninterrupted environment before clicking start.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleStartExam} className="btn btn-primary">
                Start Proctored Exam (Stage 1: Easy)
              </button>
            </div>
          </div>
        )}

        {/* STAGE: EASY QUESTIONS */}
        {currentStage === "easy" && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="chip border-emerald-500/30 bg-emerald-950/30 text-emerald-300">
                Stage 1 of 3: Easy Level (3 Questions)
              </span>
              <span className="text-xs text-slate-400">
                Must score &ge; 35% to advance to Medium
              </span>
            </div>

            {testBank.easy.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {idx + 1} of 3</span>
                  <span className="chip border-teal-500/30 text-teal-300">{q.skillName}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-100">{q.prompt}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isSelected = easyAnswers[q.id] === i;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setEasyAnswers((prev) => ({ ...prev, [q.id]: i }))}
                        className={`w-full text-left rounded-xl border p-2.5 text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-xs text-slate-400">
                {easyStats.answered} of 3 questions answered
              </span>
              <button
                disabled={easyStats.answered < 3}
                onClick={handleSubmitEasy}
                className="btn btn-primary"
              >
                Submit Stage 1 (Easy Level)
              </button>
            </div>
          </div>
        )}

        {/* STAGE: EASY RESULT */}
        {currentStage === "easy-result" && (
          <div className="mt-6 space-y-5 text-center">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full border ${
                passedEasy
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-300"
              }`}
            >
              {passedEasy ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {passedEasy ? "Easy Level Passed!" : "Threshold Not Met (Screening Not Cleared)"}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Score: <strong className="text-white">{easyScorePct}%</strong> (Required: &ge; 35%)
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {passedEasy
                  ? "Congratulations! You exceeded the 35% threshold and unlocked Stage 2 (Medium Level)."
                  : "You did not achieve the minimum 35% score required to advance. Review the recommended gap-filling courses below before re-applying."}
              </p>
            </div>

            {!passedEasy && (
              <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                  <Youtube size={15} /> Suggested Courses &amp; YouTube Tutorials to Fill the Gap
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Fill your skill gap in <strong className="text-white">{opp.requiredSkills.join(", ")}</strong> with these free curated resources:
                </p>

                <div className="mt-3 space-y-3">
                  {remediations.slice(0, 2).map((rem) => (
                    <div key={rem.skillId} className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
                      <span className="chip border-rose-500/30 text-rose-300 text-[10px]">
                        {rem.skillName}
                      </span>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {rem.youtubeVideos.slice(0, 1).map((yt) => (
                          <a
                            key={yt.title}
                            href={yt.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-red-950/30 p-2 text-[11px] text-red-200 hover:bg-red-900/40"
                          >
                            <Youtube size={14} className="shrink-0 text-red-400" />
                            <span className="truncate">{yt.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                        {rem.courses.slice(0, 1).map((c) => (
                          <a
                            key={c.title}
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-blue-950/30 p-2 text-[11px] text-blue-200 hover:bg-blue-900/40"
                          >
                            <BookOpen size={14} className="shrink-0 text-blue-400" />
                            <span className="truncate">{c.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-3">
              {passedEasy ? (
                <button onClick={handleProceedToMedium} className="btn btn-primary">
                  Proceed to Stage 2: Medium Level
                </button>
              ) : (
                <button
                  onClick={() => handleFinalizeApplication(false)}
                  className="btn btn-ghost"
                >
                  Conclude &amp; Submit Score
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE: MEDIUM QUESTIONS */}
        {currentStage === "medium" && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="chip border-amber-500/30 bg-amber-950/30 text-amber-300">
                Stage 2 of 3: Medium Level (3 Questions)
              </span>
              <span className="text-xs text-slate-400">
                Must score &ge; 75% to qualify for Final Hard Round
              </span>
            </div>

            {testBank.medium.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Question {idx + 1} of 3</span>
                  <span className="chip border-amber-500/30 text-amber-300">{q.skillName}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-100">{q.prompt}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isSelected = mediumAnswers[q.id] === i;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMediumAnswers((prev) => ({ ...prev, [q.id]: i }))}
                        className={`w-full text-left rounded-xl border p-2.5 text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-amber-400 bg-amber-500/15 text-amber-100"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-xs text-slate-400">
                {mediumStats.answered} of 3 questions answered
              </span>
              <button
                disabled={mediumStats.answered < 3}
                onClick={handleSubmitMedium}
                className="btn btn-primary"
              >
                Submit Stage 2 (Medium Level)
              </button>
            </div>
          </div>
        )}

        {/* STAGE: MEDIUM RESULT */}
        {currentStage === "medium-result" && (
          <div className="mt-6 space-y-5 text-center">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full border ${
                passedMedium
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-blue-500/40 bg-blue-500/10 text-blue-300"
              }`}
            >
              {passedMedium ? <Award size={32} /> : <CheckCircle2 size={32} />}
            </div>

            <div>
              <h3 className="text-2xl font-bold">
                {passedMedium ? "Medium Level Cleared (&ge; 75%)!" : "Medium Level Completed"}
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Score: <strong className="text-white">{mediumScorePct}%</strong> (Requirement for
                Hard Round: &ge; 75%)
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {passedMedium
                  ? "Outstanding! You cleared the 75% threshold and earned access to the Final Hard Round (2 questions)."
                  : "You passed Easy (&ge; 35%) and completed Medium, but fell below the 75% requirement for the Final Hard Round. Your application will be submitted with your qualifying scores."}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              {passedMedium ? (
                <button onClick={handleProceedToHard} className="btn btn-primary">
                  Proceed to Final Hard Round (2 Questions)
                </button>
              ) : (
                <button
                  onClick={() => handleFinalizeApplication(true)}
                  className="btn btn-primary"
                >
                  Submit Application with Qualified Scores
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE: HARD QUESTIONS (EXACTLY 2 QUESTIONS) */}
        {currentStage === "hard" && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="chip border-rose-500/30 bg-rose-950/30 text-rose-300">
                Stage 3: Final Hard Level (Exactly 2 Questions)
              </span>
              <span className="text-xs text-slate-400">Architectural &amp; System Concepts</span>
            </div>

            {testBank.hard.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Final Question {idx + 1} of 2</span>
                  <span className="chip border-rose-500/30 text-rose-300">{q.skillName}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-100">{q.prompt}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isSelected = hardAnswers[q.id] === i;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHardAnswers((prev) => ({ ...prev, [q.id]: i }))}
                        className={`w-full text-left rounded-xl border p-2.5 text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-rose-400 bg-rose-500/15 text-rose-100"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 size={14} className="text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-xs text-slate-400">
                {hardStats.answered} of 2 hard questions answered
              </span>
              <button
                disabled={hardStats.answered < 2}
                onClick={handleSubmitHard}
                className="btn btn-primary"
              >
                Complete Round 0 Screening
              </button>
            </div>
          </div>
        )}

        {/* STAGE: HARD RESULT (FINAL COMPREHENSIVE REPORT) */}
        {currentStage === "hard-result" && (
          <div className="mt-6 space-y-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-teal-500/40 bg-teal-500/10 text-teal-300">
              <Award size={36} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Round 0 Screening Completed!</h3>
              <p className="mt-1 text-sm text-slate-300">
                Total Candidate Screening Score:{" "}
                <strong className="text-teal-300">{overallPct}%</strong>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
              <div>
                <p className="text-xs text-slate-400">Easy Level</p>
                <p className="text-lg font-bold text-emerald-300">{easyScorePct}%</p>
                <p className="text-[10px] text-slate-400">Passed (&ge; 35%)</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Medium Level</p>
                <p className="text-lg font-bold text-amber-300">{mediumScorePct}%</p>
                <p className="text-[10px] text-slate-400">Passed (&ge; 75%)</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Final Hard Level</p>
                <p className="text-lg font-bold text-rose-300">{hardScorePct}%</p>
                <p className="text-[10px] text-slate-400">
                  {hardStats.correct}/2 questions correct
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-200 text-left">
              <span className="font-semibold">Proctoring Integrity Record:</span> Clean test
              submission ({switchCount} screen switches detected). Verified candidate evaluation.
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={() => handleFinalizeApplication(true)}
                className="btn btn-primary"
              >
                Submit Application with Verified Round 0 Scores
              </button>
            </div>
          </div>
        )}

        {/* STAGE: DISQUALIFIED */}
        {currentStage === "disqualified" && (
          <div className="mt-6 space-y-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400">
              <AlertOctagon size={36} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-rose-400">Proctoring Disqualification</h3>
              <p className="mt-2 text-sm text-slate-300">{disqualifiedReason}</p>
              <p className="mt-2 text-xs text-slate-400">
                Zero Round screening requires full compliance with screen lock proctoring. You may
                not re-apply until the next testing window.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={() => handleFinalizeApplication(false)}
                className="btn btn-ghost border-rose-500/30 text-rose-300"
              >
                Close &amp; Record Incident
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
