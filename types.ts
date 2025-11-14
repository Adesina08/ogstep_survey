// Data model from Google Sheets

// FIX: Add a status enum/type to be used consistently.
export const ApprovalStatus = {
  Approved: 'Approved',
  Rejected: 'Not Approved',
  Pending: 'Pending',
} as const;
export type SubmissionStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];


export interface SurveySubmission {
  id: string;
  timestamp: string;
  lga: string;
  // Fix: Add missing state property to match data source.
  state: string;
  interviewerId: string;
  // FIX: Use the more comprehensive SubmissionStatus type.
  submissionStatus: SubmissionStatus;
  errorFlags: string[];
  path: 'Treatment' | 'Control' | 'Unknown';
  ageGroup: string;
  gender: 'Male' | 'Female' | 'Other';
  gps: { lat: number; lon: number };
}

// Processed data for dashboard components
export interface SummaryData {
  overallTarget: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  approvalRate: number;
  notApprovedSubmissions: number;
  notApprovedRate: number;
  completionRate: number;
  treatmentPathCount: number;
  controlPathCount: number;
  unknownPathCount: number;
}

export interface Quota {
  category: string;
  target: number;
  actual: number;
}

export interface UserProductivityData {
  interviewerId: string;
  valid: number;
  invalid: number;
  total: number;
  approvalRate: number;
  totalErrors: number;
}

export interface ErrorBreakdownData {
  code: string;
  label: string;
  count: number;
  percentage: number;
}

export interface AchievementData {
  name: string; // State, LGA, or Interviewer ID
  target: number;
  achieved: number;
  completionRate: number;
  rank: number;
}

export interface ProgressChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      // Fix: Allow backgroundColor to be a string array for multi-color charts.
      backgroundColor: string | string[];
    }[];
}

// FIX: Add SortState type for leaderboard component.
export interface SortState {
  column: keyof UserProductivityData;
  direction: 'asc' | 'desc';
}

// The main object returned by the data hook
export interface DashboardData {
  lastUpdated: string;
  statusMessage: string;
  submissions: SurveySubmission[];
  summary: SummaryData;
  quotaProgress: ProgressChartData;
  statusBreakdown: ProgressChartData;
  quotaByLGA: Quota[];
  quotaByLGAAge: Quota[];
  quotaByLGAGender: Quota[];
  userProductivity: UserProductivityData[];
  errorBreakdown: ErrorBreakdownData[];
  achievementsByState: AchievementData[];
  achievementsByInterviewer: AchievementData[];
  achievementsByLGA: AchievementData[];
  metadata: {
    lgas: string[];
    interviewers: string[];
    errorTypes: { code: string; label: string }[];
  };
}