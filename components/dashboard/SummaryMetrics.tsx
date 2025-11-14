import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Target, ListChecks, CheckCircle2, XCircle, Footprints, GitBranch } from 'lucide-react';
import { SummaryData } from '../../types';

interface SummaryCardsProps {
  summary: SummaryData;
}

interface MetricCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    subtitle: string;
    variant: 'primary' | 'success' | 'destructive' | 'muted' | 'blue' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, title, value, subtitle, variant }) => {
    const variantClasses = {
        primary: 'border-t-primary text-primary',
        success: 'border-t-success text-success',
        destructive: 'border-t-destructive text-destructive',
        muted: 'border-t-muted-foreground text-muted-foreground',
        blue: 'border-t-blue-500 text-blue-400',
        purple: 'border-t-purple-500 text-purple-400',
    };

    return (
        <Card className={`border-t-4 ${variantClasses[variant]} transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className={`h-6 w-6 ${variantClasses[variant]}`} strokeWidth={1.5} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-card-foreground">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
};


const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
    const cardData: MetricCardProps[] = [
        {
            icon: Target,
            title: "Target interviews",
            value: summary.overallTarget.toLocaleString(),
            subtitle: `Completion: ${summary.completionRate.toFixed(1)}%`,
            variant: 'primary',
        },
        {
            icon: ListChecks,
            title: "Total submissions",
            value: summary.totalSubmissions.toLocaleString(),
            subtitle: "All entries received",
            variant: 'muted',
        },
        {
            icon: CheckCircle2,
            title: "Approved interviews",
            value: summary.approvedSubmissions.toLocaleString(),
            subtitle: `Approval rate: ${summary.approvalRate.toFixed(1)}%`,
            variant: 'success',
        },
        {
            icon: XCircle,
            title: "Flagged interviews",
            value: summary.notApprovedSubmissions.toLocaleString(),
            subtitle: `Flag rate: ${summary.notApprovedRate.toFixed(1)}%`,
            variant: 'destructive',
        },
        {
            icon: Footprints,
            title: "Treatment path",
            value: summary.treatmentPathCount.toLocaleString(),
            subtitle: "Submissions with OGSTEP path",
            variant: 'blue',
        },
        {
            icon: GitBranch,
            title: "Control path",
            value: summary.controlPathCount.toLocaleString(),
            subtitle: "Submissions without OGSTEP path",
            variant: 'purple',
        },
    ];
    
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cardData.map(data => <MetricCard key={data.title} {...data} />)}
    </div>
  );
};

export default SummaryCards;