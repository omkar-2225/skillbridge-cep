export type Role = "student" | "faculty" | "industry" | "institution";

export type SkillCategory = "technical" | "soft" | "domain";

export type OpportunityType =
  | "internship"
  | "job"
  | "apprenticeship"
  | "project"
  | "fdp"
  | "faculty-internship"
  | "consultancy"
  | "research";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected"
  | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  org?: string;
  department?: string;
  avatar: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface SkillScore {
  skillId: string;
  level: number;
}

export interface ZeroRoundResult {
  opportunityId: string;
  passed: boolean;
  stageReached: "easy" | "medium" | "hard" | "completed";
  easyScore: number;
  mediumScore?: number;
  hardScore?: number;
  totalScore: number;
  switchCount: number;
  completedAt: string;
}

export interface AssessmentSummary {
  totalScore: number;
  aptitudeScore: number;
  easyScore: number;
  mediumScore: number;
  hardScore: number;
  skillScores: Record<string, number>;
  completedAt: string;
  weakSkills: string[];
}

export interface StudentProfile {
  userId: string;
  year: string;
  semester?: string;
  collegeName?: string;
  program: string;
  cgpa: number;
  interests: string[];
  skills: SkillScore[];
  assessed: boolean;
  bio: string;
  resumeUrl: string;
  hasResume?: boolean;
  resumeFileName?: string;
  resumeSkills?: string[];
  aptitudeScore?: number;
  certifications: Certification[];
  projects: Project[];
  achievements: string[];
  zeroRoundResults?: Record<string, ZeroRoundResult>;
  assessmentSummary?: AssessmentSummary;
  assessmentAnswers?: Record<string, number>;
  needsReassessment?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  companyId: string;
  company: string;
  location: string;
  mode: "onsite" | "hybrid" | "remote";
  stipend?: string;
  duration?: string;
  deadline: string;
  description: string;
  requiredSkills: string[];
  eligibility: string;
  openings: number;
  audience: "student" | "faculty" | "both";
}

export interface LearningProgram {
  id: string;
  title: string;
  provider: string;
  companyId: string;
  skills: string[];
  duration: string;
  format: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface Application {
  id: string;
  opportunityId: string;
  applicantId: string;
  role: Role;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
  feedback?: string;
  progress?: number;
  zeroRoundResult?: ZeroRoundResult;
}

export interface Collaboration {
  id: string;
  title: string;
  type: "mentorship" | "workshop" | "guest-lecture" | "challenge" | "live-project" | "research";
  host: string;
  date: string;
  description: string;
  seats: number;
  enrolled: string[];
}

export interface AppState {
  users: User[];
  skills: Skill[];
  students: StudentProfile[];
  opportunities: Opportunity[];
  programs: LearningProgram[];
  applications: Application[];
  collaborations: Collaboration[];
}
