import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ErrorBreakdownData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

interface SubmissionQualityOverviewProps {
  data: ErrorBreakdownData[];
}

const SubmissionQualityOverview: React.FC<SubmissionQualityOverviewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [chartColors, setChartColors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const style = getComputedStyle(document.body);
    setChartColors({
        'Clustered Interview': style.getPropertyValue('--chart-1').trim(),
        'Duplicate Phone': style.getPropertyValue('--chart-2').trim(),
        'High LOI': style.getPropertyValue('--chart-3').trim(),
        'Interwoven': style.getPropertyValue('--chart-4').trim(),
        'Low LOI': style.getPropertyValue('--chart-5').trim(),
        'Odd Hour': '#A855F7',
        'Outside LGA Boundary': '#F97316',
        'Short Gap': '#10B981',
        'Terminated': '#6B7280',
    });
  }, []);

  const getTabClass = (tabId: 'chart' | 'table') => {
      return `px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
          activeTab === tabId
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:bg-muted/50'
      }`;
  };
  
  const totalErrors = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-warning" />
            <div>
                <CardTitle>Submission quality overview</CardTitle>
                <p className="text-xs text-muted-foreground">Breakdown of all quality control flags triggered.</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-2 p-1" aria-label="Tabs">
             <button onClick={() => setActiveTab('chart')} className={getTabClass('chart')}>
                Chart
             </button>
             <button onClick={() => setActiveTab('table')} className={getTabClass('table')}>
                Table
             </button>
          </nav>
        </div>
        <div className="mt-4">
            {activeTab === 'chart' && (
                 <div style={{ height: '350px' }}>
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[{ name: 'Errors', ...data.reduce((obj, item) => ({...obj, [item.label]: item.count }), {}) }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                             <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                             <YAxis stroke="hsl(var(--muted-foreground))" />
                             <Tooltip
                                 contentStyle={{
                                     backgroundColor: 'hsl(var(--card))',
                                     borderColor: 'hsl(var(--border))',
                                 }}
                             />
                             <Legend wrapperStyle={{fontSize: '12px'}}/>
                             {data.map(item => (
                                 <Bar key={item.code} dataKey={item.label} stackId="a" fill={chartColors[item.label] || '#8884d8'} />
                             ))}
                         </BarChart>
                     </ResponsiveContainer>
                </div>
            )}
            {activeTab === 'table' && (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted-foreground">
                            <tr className="border-b border-border">
                                <th className="p-2 font-medium">Error Type</th>
                                <th className="p-2 font-medium text-right">Count</th>
                                <th className="p-2 font-medium text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.code} className="border-b border-border/50">
                                    <td className="p-2">{item.label}</td>
                                    <td className="p-2 text-right">{item.count}</td>
                                    <td className="p-2 text-right">{item.percentage.toFixed(1)}%</td>
                                </tr>
                            ))}
                            <tr className="font-semibold bg-muted/50">
                                <td className="p-2">Total Errors</td>
                                <td className="p-2 text-right">{totalErrors}</td>
                                <td className="p-2 text-right">100.0%</td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionQualityOverview;