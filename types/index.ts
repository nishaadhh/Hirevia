// Strictly HR Role & SaaS Tenant Types
export type UserRole = "HR";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  companyName?: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  headline: string;
  experienceYears: number;
  skills: string[];
  resumeUrl?: string;
  verifiedSkills: string[];
  aiInferredSkills: string[];
  aiMatchScore: number;
  status: "NEW" | "AI_SCREENED" | "READY_FOR_HR_REVIEW" | "HR_SCHEDULED" | "OFFERED" | "REJECTED";
  gmeetLink?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  mockInterviews?: MockInterview[];
  schedules?: InterviewSchedule[];
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  minExp: number;
  requiredSkills: string[];
  preferredSkills: string[];
  salaryRange: string;
  description: string;
  activeStatus: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockInterview {
  id: string;
  candidateId: string;
  candidateName?: string;
  candidateHeadline?: string;
  candidateAvatar?: string;
  jobTitle?: string;
  videoUrl: string;
  transcript: {
    questionText: string;
    candidateAnswer: string;
    timestampSeconds: number;
    score: number;
    category: string;
  }[];
  overallScore: number;
  techScore: number;
  commScore: number;
  leadershipScore: number;
  problemSolvingScore: number;
  status: "PROCESSING" | "READY_FOR_HR_REVIEW" | "REVIEWED";
  completedAt?: string;
  createdAt: string;
  notes?: InterviewNote[];
}

export interface InterviewNote {
  id: string;
  interviewId: string;
  timestampSeconds: number;
  noteText: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
}

export interface InterviewSchedule {
  id: string;
  candidateId: string;
  candidateName?: string;
  candidateHeadline?: string;
  hrUserId: string;
  hrUserName?: string;
  scheduledAt: string;
  durationMinutes: number;
  gmeetLink: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export interface HRAdvisorAnalysis {
  candidateId: string;
  candidateName: string;
  overallFitPercentage: number; // e.g. 92%
  hiringScore: number;
  breakdown: {
    technicalFit: number;
    leadershipPotential: number;
    culturalFit: number;
  };
  strengths: string[];
  redFlags: string[];
  targetedQuestions: {
    question: string;
    type: "TECHNICAL" | "BEHAVIORAL" | "LEADERSHIP";
    whatToListenFor: string;
  }[];
  advisorSummary: string;
}

export interface HRDashboardMetrics {
  activeJobs: number;
  totalCandidates: number;
  aiScreenedCandidates: number;
  readyForHRReview: number;
  scheduledInterviews: number;
  alertCandidate?: {
    candidateId: string;
    name: string;
    headline: string;
    jobTitle: string;
    aiMatchScore: number;
    interviewId: string;
    status: string;
    gmeetLink?: string;
  };
}

export function parseJsonArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
