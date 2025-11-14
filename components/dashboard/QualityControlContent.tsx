import React, { useState, useMemo } from 'react';
import { DashboardData } from '../../types';
import { Card, CardContent } from '../ui/Card';
import SummaryCards from './SummaryMetrics';
import UserProductivityRankings from './ProductivityLeaderboard';
import QuotaTracker from './QuotaTracker';
import SubmissionQualityOverview from './ErrorBreakdownChart';
import SubmissionsMap from './SubmissionsMap';
import Achievements from './Achievements'; // New component
import ProgressCharts from './ProgressCharts'; // New component
import FooterActions from '../layout/FooterActions'; // New component

const FilterControls: React.FC<{
    lgas: string[];
    selectedLga: string;
    setSelectedLga: (lga: string) => void;
}> = ({ lgas, selectedLga, setSelectedLga }) => (
    <div>
        <select
            id="lga-filter"
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="min-w-[240px] rounded-md border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
            <option value="all">All LGAs</option>
            {lgas.map(lga => <option key={lga} value={lga}>{lga}</option>)}
        </select>
    </div>
);

interface QualityControlContentProps {
  data: DashboardData;
  selectedLga: string;
  setSelectedLga: (lga: string) => void;
}

const QualityControlContent: React.FC<QualityControlContentProps> = ({ data, selectedLga, setSelectedLga }) => {

    const filteredData = useMemo(() => {
        if (selectedLga === 'all') {
            return data;
        }
        // Note: For a real app, you'd re-run the full data processor on filtered submissions.
        // For this demo, we perform a lightweight filtering on already-aggregated data,
        // which might not be 100% accurate but is sufficient for UI demonstration.
        const filteredSubmissions = data.submissions.filter(s => s.lga === selectedLga);
        const filteredInterviewerIds = new Set(filteredSubmissions.map(s => s.interviewerId));
        
        return {
            ...data,
            submissions: filteredSubmissions,
            userProductivity: data.userProductivity.filter(u => filteredInterviewerIds.has(u.interviewerId)),
            achievementsByInterviewer: data.achievementsByInterviewer.filter(a => filteredInterviewerIds.has(a.name)),
            // More complex recalculations would be needed for other metrics.
        };
    }, [data, selectedLga]);
    
    return (
        <div className="space-y-6">
            <FilterControls lgas={data.metadata.lgas} selectedLga={selectedLga} setSelectedLga={setSelectedLga} />
            <SummaryCards summary={filteredData.summary} />
            
            <ProgressCharts 
                quotaProgress={filteredData.quotaProgress} 
                approvalBreakdown={filteredData.statusBreakdown} 
            />
            
            <SubmissionsMap submissions={filteredData.submissions} />

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-6">
                <QuotaTracker 
                    quotaByLGA={filteredData.quotaByLGA}
                    quotaByLGAAge={filteredData.quotaByLGAAge}
                    quotaByLGAGender={filteredData.quotaByLGAGender}
                />
                <UserProductivityRankings data={filteredData.userProductivity} />
            </div>

            <SubmissionQualityOverview data={filteredData.errorBreakdown} />
            
            <Achievements 
                byInterviewer={filteredData.achievementsByInterviewer} 
                byLGA={filteredData.achievementsByLGA}
            />

            <FooterActions />
        </div>
    );
};

export default QualityControlContent;