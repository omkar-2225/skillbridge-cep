import type { LearningProgram, Opportunity, Skill, SkillScore, StudentProfile } from "./types";
import { ROLE_TEMPLATES } from "./seed";

export function skillMap(scores: SkillScore[]) {
  return Object.fromEntries(scores.map((s) => [s.skillId, s.level]));
}

export function matchOpportunity(profile: StudentProfile | undefined, opp: Opportunity) {
  if (!profile) return 42;
  const map = skillMap(profile.skills);
  const vals = opp.requiredSkills.map((id) => map[id] ?? 25);
  const avg = vals.reduce((a, b) => a + b, 0) / Math.max(vals.length, 1);
  const interestBoost = profile.interests.some((i) =>
    `${opp.title} ${opp.description}`.toLowerCase().includes(i.toLowerCase().split(" ")[0])
  )
    ? 6
    : 0;
  return Math.min(99, Math.round(avg * 0.92 + interestBoost));
}

export function gapAgainst(profile: StudentProfile, required: string[], skills: Skill[]) {
  const map = skillMap(profile.skills);
  return required
    .map((id) => {
      const skill = skills.find((s) => s.id === id);
      const level = map[id] ?? 0;
      return {
        id,
        name: skill?.name ?? id,
        level,
        gap: Math.max(0, 75 - level),
        category: skill?.category ?? "technical",
      };
    })
    .sort((a, b) => b.gap - a.gap);
}

export function recommendRoles(profile: StudentProfile) {
  const map = skillMap(profile.skills);
  return Object.entries(ROLE_TEMPLATES)
    .map(([key, role]) => {
      const avg =
        role.skills.reduce((sum, id) => sum + (map[id] ?? 0), 0) / role.skills.length;
      const missing = role.skills.filter((id) => (map[id] ?? 0) < 60);
      return { key, ...role, fit: Math.round(avg), missing };
    })
    .sort((a, b) => b.fit - a.fit);
}

export function recommendPrograms(profile: StudentProfile, programs: LearningProgram[]) {
  const map = skillMap(profile.skills);
  return programs
    .map((p) => {
      const gaps = p.skills.map((id) => Math.max(0, 70 - (map[id] ?? 0)));
      const relevance = gaps.reduce((a, b) => a + b, 0) / p.skills.length;
      return { ...p, relevance: Math.round(relevance) };
    })
    .sort((a, b) => b.relevance - a.relevance);
}

export function overallReadiness(profile: StudentProfile) {
  if (!profile.skills.length) return 0;
  const tech = profile.skills.filter((s) =>
    ["python", "java", "js", "react", "sql", "ml", "ds", "cloud", "cyber", "uiux"].includes(
      s.skillId
    )
  );
  const avg = tech.reduce((a, b) => a + b.level, 0) / tech.length;
  return Math.round(avg);
}
