import {
  DashboardData,
  SurveySubmission,
  ApprovalStatus,
  UserProductivityData,
  ErrorBreakdownData,
  Quota,
  AchievementData,
  ProgressChartData,
} from '../types';
import { parse, isValid } from 'date-fns';

const parseGps = (gpsString: string): { lat: number; lon: number } => {
    if (typeof gpsString !== 'string') return { lat: 0, lon: 0 };
    const [lat, lon] = gpsString.split(',').map(Number);
    return { lat: isNaN(lat) ? 0 : lat, lon: isNaN(lon) ? 0 : lon };
};

const safelyParseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    // Handle common US format first
    const formats = [
        "M/d/yyyy, H:mm:ss",
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
    ];
    for (const format of formats) {
        const parsedDate = parse(dateString, format, new Date());
        if (isValid(parsedDate)) {
            return parsedDate;
        }
    }
    const directParse = new Date(dateString);
    if (isValid(directParse)) {
        return directParse;
    }
    return null;
}

export const processDashboardData = (rawData: Record<string, any>[]): DashboardData => {
  const submissions: SurveySubmission[] = rawData.map((row, index) => {
    const parsedDate = safelyParseDate(row['Timestamp']);
    return {
      id: row['ID'] || `sub_${index}`,
      timestamp: parsedDate ? parsedDate.toISOString() : new Date(0).toISOString(),
      lga: row['LGA'] || 'Unknown',
      state: row['State'] || 'Unknown',
      interviewerId: row['Interviewer ID'] || 'Unknown',
      submissionStatus: row['Status'] === 'Approved' ? ApprovalStatus.Approved : row['Status'] === 'Not Approved' ? ApprovalStatus.Rejected : ApprovalStatus.Pending,
      errorFlags: row['Error Flags'] ? String(row['Error Flags']).split(',').map(f => f.trim()).filter(Boolean) : [],
      path: ['Treatment', 'Control'].includes(row['Path']) ? row['Path'] : 'Unknown',
      ageGroup: row['Age Group'] || 'Unknown',
      gender: ['Male', 'Female'].includes(row['Gender']) ? row['Gender'] : 'Other',
      gps: parseGps(row['GPS']),
    }
  }).filter(s => isValid(new Date(s.timestamp)) && new Date(s.timestamp).getFullYear() > 2000);

  submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // --- AGGREGATIONS ---

  const totalSubmissions = submissions.length;
  const approvedSubmissions = submissions.filter(s => s.submissionStatus === ApprovalStatus.Approved).length;
  const notApprovedSubmissions = submissions.filter(s => s.submissionStatus === ApprovalStatus.Rejected).length;
  const pendingSubmissions = submissions.filter(s => s.submissionStatus === ApprovalStatus.Pending).length;
  const overallTarget = 1000;
  
  const totalRatedSubmissions = approvedSubmissions + notApprovedSubmissions;
  const approvalRate = totalRatedSubmissions > 0 ? (approvedSubmissions / totalRatedSubmissions) * 100 : 0;
  const notApprovedRate = totalRatedSubmissions > 0 ? (notApprovedSubmissions / totalRatedSubmissions) * 100 : 0;
  
  // User Productivity
  const productivityMap = new Map<string, { total: number; valid: number; invalid: number; errors: number }>();
  submissions.forEach(s => {
      const user = productivityMap.get(s.interviewerId) || { total: 0, valid: 0, invalid: 0, errors: 0 };
      user.total++;
      if (s.submissionStatus === ApprovalStatus.Approved) user.valid++;
      if (s.submissionStatus === ApprovalStatus.Rejected) user.invalid++;
      user.errors += s.errorFlags.length;
      productivityMap.set(s.interviewerId, user);
  });
  
  const userProductivity: UserProductivityData[] = Array.from(productivityMap.entries()).map(([interviewerId, data]) => ({
      interviewerId,
      ...data,
      approvalRate: (data.valid + data.invalid) > 0 ? (data.valid / (data.valid + data.invalid)) * 100 : 0,
      totalErrors: data.errors
  })).sort((a,b) => b.valid - a.valid || a.invalid - b.invalid);

  // Error Breakdown
  const errorMap = new Map<string, number>();
  const allErrorTypes = ['Clustered Interview', 'Duplicate Phone', 'High LOI', 'Interwoven', 'Low LOI', 'Odd Hour', 'Outside LGA Boundary', 'Short Gap', 'Terminated'];
  allErrorTypes.forEach(e => errorMap.set(e, 0));
  submissions.forEach(s => s.errorFlags.forEach(flag => {
      const cleanFlag = flag.trim();
      errorMap.set(cleanFlag, (errorMap.get(cleanFlag) || 0) + 1)
  }));
  const totalErrors = Array.from(errorMap.values()).reduce((sum, count) => sum + count, 0);
  const errorBreakdown: ErrorBreakdownData[] = Array.from(errorMap.entries()).map(([label, count]) => ({
      code: label.replace(/ /g, '_').toUpperCase(),
      label: label,
      count,
      percentage: totalErrors > 0 ? (count / totalErrors) * 100 : 0
  })).sort((a,b) => b.count - a.count);

  const lgas = [...new Set(submissions.map(s => s.lga))].sort();

  // Achievements
  const achievementsByInterviewer = userProductivity.map((user, idx) => ({
      name: user.interviewerId,
      target: Math.ceil(overallTarget / productivityMap.size),
      achieved: user.total,
      completionRate: (user.total / Math.ceil(overallTarget / productivityMap.size)) * 100,
      rank: idx + 1,
      ...user, // include all productivity data
  }));

  const lgaMap = new Map<string, { total: number }>();
  submissions.forEach(s => {
      const lga = lgaMap.get(s.lga) || { total: 0 };
      lga.total++;
      lgaMap.set(s.lga, lga);
  });
  const achievementsByLGA = Array.from(lgaMap.entries()).map(([name, data]) => ({
      name,
      target: Math.ceil(overallTarget / lgaMap.size),
      achieved: data.total,
      completionRate: (data.total / Math.ceil(overallTarget / lgaMap.size)) * 100,
      rank: 0,
  })).sort((a, b) => b.achieved - a.achieved).map((l, idx) => ({...l, rank: idx + 1}));


  return {
    lastUpdated: new Date().toISOString(),
    statusMessage: `${pendingSubmissions} submissions pending review.`,
    submissions,
    summary: {
      overallTarget,
      totalSubmissions,
      approvedSubmissions,
      approvalRate: isNaN(approvalRate) ? 0 : approvalRate,
      notApprovedSubmissions,
      notApprovedRate: isNaN(notApprovedRate) ? 0 : notApprovedRate,
      completionRate: (totalSubmissions / overallTarget) * 100,
      treatmentPathCount: submissions.filter(s => s.path === 'Treatment').length,
      controlPathCount: submissions.filter(s => s.path === 'Control').length,
      unknownPathCount: submissions.filter(s => s.path === 'Unknown').length,
    },
    quotaProgress: {
        labels: ['Completion'],
        datasets: [{
            label: 'Completed',
            data: [totalSubmissions],
            backgroundColor: 'hsl(var(--primary))',
        }, {
            label: 'Remaining',
            data: [Math.max(0, overallTarget - totalSubmissions)],
            backgroundColor: 'hsl(var(--muted))',
        }]
    },
    statusBreakdown: {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [{
            label: 'Submissions by Status',
            data: [approvedSubmissions, notApprovedSubmissions, pendingSubmissions],
            backgroundColor: ['hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--warning))'],
        }]
    },
    quotaByLGA: lgas.map(lga => ({ category: lga, target: Math.ceil(overallTarget/lgas.length), actual: submissions.filter(s => s.lga === lga).length })),
    quotaByLGAAge: [], // Add logic if this data becomes available
    quotaByLGAGender: [], // Add logic if this data becomes available
    userProductivity,
    errorBreakdown,
    achievementsByState: [], // Add logic if multi-state data is available
    achievementsByInterviewer,
    achievementsByLGA,
    metadata: {
      lgas,
      interviewers: [...new Set(submissions.map(s => s.interviewerId))],
      // FIX: The error type 'code' was incorrect (it was the same as the label). This now uses the pre-calculated `errorBreakdown` which has the correct code and label format.
      errorTypes: errorBreakdown.map(({ code, label }) => ({ code, label })),
    },
  };
};