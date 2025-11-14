import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ProgressChartData } from '../../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ProgressChartsProps {
    quotaProgress: ProgressChartData;
    approvalBreakdown: ProgressChartData;
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({ quotaProgress, approvalBreakdown }) => {
    
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { color: 'hsl(var(--muted-foreground))' }
            },
        },
        cutout: '70%',
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
            },
            y: {
                grid: { color: 'hsl(var(--border))' },
                ticks: { color: 'hsl(var(--muted-foreground))' }
            }
        }
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quota Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    {quotaProgress.datasets[0]?.data.length > 0 ? (
                        <Doughnut data={quotaProgress} options={doughnutOptions} />
                    ) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
                    )}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Approval Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    {approvalBreakdown.datasets[0]?.data.length > 0 ? (
                        <Bar data={approvalBreakdown} options={barOptions} />
                    ) : (
                         <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProgressCharts;