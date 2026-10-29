"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ASSESSMENT_QUESTIONS, initialState } from "./seed";
import type {
  Application,
  ApplicationStatus,
  AppState,
  Collaboration,
  LearningProgram,
  Opportunity,
  Role,
  StudentProfile,
  User,
  ZeroRoundResult,
} from "./types";
import { matchOpportunity } from "./matching";

const KEY = "skillbridge-state-v2";
const SESSION = "skillbridge-session";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
  org: string;
  collegeName?: string;
  year?: string;
  semester?: string;
  hasResume?: boolean;
  resumeFileName?: string;
  resumeSkills?: string[];
};

type Ctx = {
  ready: boolean;
  state: AppState;
  user: User | null;
  login: (email: string, password: string) => { error: string | null; role?: Role };
  register: (input: RegisterInput) => string | null;
  logout: () => void;
  saveAssessment: (userId: string, answers: Record<string, number>) => void;
  saveAptitudeAndSkillTest: (
    userId: string,
    data: {
      totalScore: number;
      aptitudeScore: number;
      easyScore: number;
      mediumScore: number;
      hardScore: number;
      skillScores: Record<string, number>;
      answers: Record<string, number>;
      weakSkills: string[];
    }
  ) => void;
  updateStudentProfile: (userId: string, data: Partial<StudentProfile>) => void;
  apply: (opportunityId: string) => void;
  applyWithZeroRound: (opportunityId: string, zeroRoundResult: ZeroRoundResult) => void;
  setStatus: (applicationId: string, status: ApplicationStatus, feedback?: string) => void;
  postOpportunity: (opp: Omit<Opportunity, "id" | "companyId">) => void;
  postProgram: (p: Omit<LearningProgram, "id" | "companyId">) => void;
  enrollCollab: (id: string) => void;
  postCollab: (c: Omit<Collaboration, "id" | "enrolled">) => void;
};

const StoreContext = createContext<Ctx | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Merge with initial state so any updated/new demo records are available
        setState({
          ...initialState,
          ...parsed,
          skills: initialState.skills,
          users: [
            ...initialState.users,
            ...((parsed.users || []).filter(
              (u: User) => !initialState.users.some((init) => init.id === u.id)
            )),
          ],
        });
      } catch {
        setState(initialState);
      }
    }
    setUserId(localStorage.getItem(SESSION));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const user = useMemo(
    () => state.users.find((u) => u.id === userId) ?? null,
    [state.users, userId]
  );

  const login = useCallback(
    (email: string, password: string) => {
      const found = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) return { error: "Invalid email or password." };
      setUserId(found.id);
      localStorage.setItem(SESSION, found.id);
      return { error: null, role: found.role };
    },
    [state.users]
  );

  const register = useCallback(
    (input: RegisterInput) => {
      if (state.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return "An account with this email already exists.";
      }
      const id = uid("u");
      const nextUser: User = {
        id,
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        org: input.collegeName || input.org,
        avatar: input.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };

      const isFirstYear = input.year === "1st Year";
      const studentProfile: StudentProfile = {
        userId: id,
        year: input.year || "1st Year",
        semester: input.semester || (isFirstYear ? "Semester 1" : "Semester 3"),
        collegeName: input.collegeName || input.org,
        program: "B.Tech Computer Science",
        cgpa: 8.0,
        interests: isFirstYear
          ? ["Programming Fundamentals", "Problem Solving"]
          : ["Full Stack Development", "Cloud", "Placement Prep"],
        skills: state.skills.map((sk) => {
          const isIdentified = (input.resumeSkills || []).includes(sk.id);
          return { skillId: sk.id, level: isIdentified ? 55 : isFirstYear ? 35 : 30 };
        }),
        assessed: false,
        bio: isFirstYear
          ? "1st Year student focused on core programming foundations and problem solving."
          : `Student at ${input.collegeName || input.org} targeting high-impact tech roles.`,
        hasResume: !isFirstYear && Boolean(input.hasResume),
        resumeFileName: isFirstYear ? "" : input.resumeFileName || `${input.name.replace(/\s+/g, "_")}_Resume.pdf`,
        resumeUrl: isFirstYear ? "" : `${input.name.replace(/\s+/g, "_")}_Resume.pdf`,
        resumeSkills: isFirstYear ? [] : input.resumeSkills || [],
        aptitudeScore: 0,
        certifications: [],
        projects: [],
        achievements: [],
        zeroRoundResults: {},
      };

      setState((s) => ({
        ...s,
        users: [...s.users, nextUser],
        students: input.role === "student" ? [...s.students, studentProfile] : s.students,
      }));
      setUserId(id);
      localStorage.setItem(SESSION, id);
      return null;
    },
    [state.users, state.skills]
  );

  const logout = useCallback(() => {
    setUserId(null);
    localStorage.removeItem(SESSION);
  }, []);

  const updateStudentProfile = useCallback((uidUser: string, data: Partial<StudentProfile>) => {
    setState((s) => ({
      ...s,
      students: s.students.map((st) => (st.userId === uidUser ? { ...st, ...data } : st)),
    }));
  }, []);

  const saveAssessment = useCallback((uidUser: string, answers: Record<string, number>) => {
    setState((s) => {
      const levels: Record<string, number[]> = {};
      for (const q of ASSESSMENT_QUESTIONS) {
        const v = answers[q.id];
        if (v === undefined) continue;
        const score =
          q.type === "likert" ? Math.round((v / 5) * 100) : v === q.answer ? 90 : 35;
        levels[q.skillId] = [...(levels[q.skillId] ?? []), score];
      }
      return {
        ...s,
        students: s.students.map((st) => {
          if (st.userId !== uidUser) return st;
          const skills = s.skills.map((sk) => {
            const existing = st.skills.find((x) => x.skillId === sk.id)?.level ?? 30;
            const samples = levels[sk.id];
            const level = samples
              ? Math.round(samples.reduce((a, b) => a + b, 0) / samples.length)
              : existing;
            return { skillId: sk.id, level };
          });
          return { ...st, skills, assessed: true };
        }),
      };
    });
  }, []);

  const saveAptitudeAndSkillTest = useCallback(
    (
      uidUser: string,
      data: {
        totalScore: number;
        aptitudeScore: number;
        easyScore: number;
        mediumScore: number;
        hardScore: number;
        skillScores: Record<string, number>;
        answers: Record<string, number>;
        weakSkills: string[];
      }
    ) => {
      setState((s) => ({
        ...s,
        students: s.students.map((st) => {
          if (st.userId !== uidUser) return st;
          const updatedSkills = st.skills.map((sk) => {
            if (data.skillScores[sk.skillId] !== undefined) {
              return { skillId: sk.skillId, level: data.skillScores[sk.skillId] };
            }
            return sk;
          });
          return {
            ...st,
            skills: updatedSkills,
            aptitudeScore: data.aptitudeScore,
            assessed: true,
            needsReassessment: false,
            assessmentAnswers: data.answers,
            assessmentSummary: {
              totalScore: data.totalScore,
              aptitudeScore: data.aptitudeScore,
              easyScore: data.easyScore,
              mediumScore: data.mediumScore,
              hardScore: data.hardScore,
              skillScores: data.skillScores,
              completedAt: new Date().toISOString(),
              weakSkills: data.weakSkills,
            },
          };
        }),
      }));
    },
    []
  );

  const apply = useCallback(
    (opportunityId: string) => {
      if (!user) return;
      setState((s) => {
        if (s.applications.some((a) => a.opportunityId === opportunityId && a.applicantId === user.id)) {
          return s;
        }
        const opp = s.opportunities.find((o) => o.id === opportunityId);
        const profile = s.students.find((st) => st.userId === user.id);
        const matchScore = opp ? matchOpportunity(profile, opp) : 50;
        const app: Application = {
          id: uid("app"),
          opportunityId,
          applicantId: user.id,
          role: user.role,
          status: "applied",
          appliedAt: new Date().toISOString().slice(0, 10),
          matchScore,
          progress: 10,
        };
        return { ...s, applications: [app, ...s.applications] };
      });
    },
    [user]
  );

  const applyWithZeroRound = useCallback(
    (opportunityId: string, zeroRoundResult: ZeroRoundResult) => {
      if (!user) return;
      setState((s) => {
        const opp = s.opportunities.find((o) => o.id === opportunityId);
        const profile = s.students.find((st) => st.userId === user.id);
        const matchScore = opp ? matchOpportunity(profile, opp) : 50;

        const updatedZeroResults = {
          ...(profile?.zeroRoundResults || {}),
          [opportunityId]: zeroRoundResult,
        };

        const existingAppIdx = s.applications.findIndex(
          (a) => a.opportunityId === opportunityId && a.applicantId === user.id
        );

        const appStatus: ApplicationStatus = zeroRoundResult.passed
          ? zeroRoundResult.totalScore >= 80
            ? "shortlisted"
            : "applied"
          : "rejected";

        const appProgress = zeroRoundResult.passed
          ? zeroRoundResult.totalScore >= 80
            ? 45
            : 25
          : 100;

        const updatedStudents = s.students.map((st) =>
          st.userId === user.id ? { ...st, zeroRoundResults: updatedZeroResults } : st
        );

        if (existingAppIdx >= 0) {
          const updatedApps = [...s.applications];
          updatedApps[existingAppIdx] = {
            ...updatedApps[existingAppIdx],
            status: appStatus,
            progress: appProgress,
            zeroRoundResult,
            feedback: zeroRoundResult.passed
              ? `Passed Round 0 with ${zeroRoundResult.totalScore}% score.`
              : `Did not clear Round 0 screening threshold (${zeroRoundResult.totalScore}%).`,
          };
          return { ...s, students: updatedStudents, applications: updatedApps };
        }

        const newApp: Application = {
          id: uid("app"),
          opportunityId,
          applicantId: user.id,
          role: user.role,
          status: appStatus,
          appliedAt: new Date().toISOString().slice(0, 10),
          matchScore,
          progress: appProgress,
          zeroRoundResult,
          feedback: zeroRoundResult.passed
            ? `Passed Round 0 Technical Screening with ${zeroRoundResult.totalScore}% score.`
            : `Did not clear Round 0 screening threshold (${zeroRoundResult.totalScore}%).`,
        };

        return { ...s, students: updatedStudents, applications: [newApp, ...s.applications] };
      });
    },
    [user]
  );

  const setStatus = useCallback(
    (applicationId: string, status: ApplicationStatus, feedback?: string) => {
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === applicationId
            ? {
                ...a,
                status,
                feedback: feedback ?? a.feedback,
                progress:
                  status === "completed"
                    ? 100
                    : status === "offered"
                      ? 90
                      : status === "interview"
                        ? 60
                        : status === "shortlisted"
                          ? 35
                          : status === "rejected"
                            ? 100
                            : a.progress,
              }
            : a
        ),
      }));
    },
    []
  );

  const postOpportunity = useCallback(
    (opp: Omit<Opportunity, "id" | "companyId">) => {
      if (!user) return;
      setState((s) => ({
        ...s,
        opportunities: [
          { ...opp, id: uid("opp"), companyId: user.id },
          ...s.opportunities,
        ],
      }));
    },
    [user]
  );

  const postProgram = useCallback(
    (p: Omit<LearningProgram, "id" | "companyId">) => {
      if (!user) return;
      setState((s) => ({
        ...s,
        programs: [{ ...p, id: uid("lp"), companyId: user.id }, ...s.programs],
      }));
    },
    [user]
  );

  const enrollCollab = useCallback(
    (id: string) => {
      if (!user) return;
      setState((s) => ({
        ...s,
        collaborations: s.collaborations.map((c) =>
          c.id === id && !c.enrolled.includes(user.id)
            ? { ...c, enrolled: [...c.enrolled, user.id] }
            : c
        ),
      }));
    },
    [user]
  );

  const postCollab = useCallback(
    (c: Omit<Collaboration, "id" | "enrolled">) => {
      setState((s) => ({
        ...s,
        collaborations: [{ ...c, id: uid("col"), enrolled: [] }, ...s.collaborations],
      }));
    },
    []
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      user,
      login,
      register,
      logout,
      saveAssessment,
      saveAptitudeAndSkillTest,
      updateStudentProfile,
      apply,
      applyWithZeroRound,
      setStatus,
      postOpportunity,
      postProgram,
      enrollCollab,
      postCollab,
    }),
    [
      ready,
      state,
      user,
      login,
      register,
      logout,
      saveAssessment,
      saveAptitudeAndSkillTest,
      updateStudentProfile,
      apply,
      applyWithZeroRound,
      setStatus,
      postOpportunity,
      postProgram,
      enrollCollab,
      postCollab,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
