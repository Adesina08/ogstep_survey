import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Target, ListChecks, CheckCircle2, XCircle, Footprints, GitBranch } from 'lucide-react';
import { SummaryData } from '../../types';

interface SummaryCardsProps {
  summary: SummaryData;
}

const MetricCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    value: string; 
    subtitle: string;
    iconBgClass: string;
}> = ({ icon, title, value, subtitle, iconBgClass }) => (
    <Card className="p-4 flex justify-between items-center">
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBgClass}`}>
            {icon}
        </div>
    </Card>
);

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard 
            icon={<Target size={24} />} 
            title="Target interviews" 
            value={summary.overallTarget.toLocaleString()} 
            subtitle={`Completion: ${summary.completionRate.toFixed(1)}%`}
            iconBgClass="bg-primary/20 text-primary"
        />
        <MetricCard 
            icon={<ListChecks size={24} />} 
            title="Total submissions" 
            value={summary.totalSubmissions.toLocaleString()} 
            subtitle="All entries received"
            iconBgClass="bg-muted-foreground/20 text-muted-foreground"
        />
        <MetricCard 
            icon={<CheckCircle2 size={24} />} 
            title="Approved interviews" 
            value={summary.approvedSubmissions.toLocaleString()} 
            subtitle={`Approval rate: ${summary.approvalRate.toFixed(1)}%`}
            iconBgClass="bg-success/20 text-success"
        />
        <MetricCard 
            icon={<XCircle size={24} />} 
            title="Flagged interviews" 
            value={summary.notApprovedSubmissions.toLocaleString()} 
            subtitle={`Flag rate: ${summary.notApprovedRate.toFixed(1)}%`}
            iconBgClass="bg-destructive/20 text-destructive"
        />
        <MetricCard 
            icon={<Footprints size={24} />} 
            title="Treatment path" 
            value={summary.treatmentPathCount.toLocaleString()} 
            subtitle="Submissions with OGSTEP path"
            iconBgClass="bg-blue-500/20 text-blue-400"
        />
        <MetricCard 
            icon={<GitBranch size={24} />} 
            title="Control path" 
            value={summary.controlPathCount.toLocaleString()} 
            subtitle="Submissions without OGSTEP path"
            iconBgClass="bg-purple-500/20 text-purple-400"
        />
    </div>
  );
};

export default SummaryCards;