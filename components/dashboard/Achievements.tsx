import React, { useState } from 'react';
import { AchievementData } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trophy } from 'lucide-react';

interface AchievementsProps {
  byInterviewer: AchievementData[];
  byLGA: AchievementData[];
}

type AchievementTab = 'interviewer' | 'lga';

const AchievementTable: React.FC<{ data: AchievementData[], isInterviewer: boolean }> = ({ data, isInterviewer }) => (
    <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground sticky top-0 bg-card">
                <tr className="border-b border-border">
                    <th className="p-2 font-medium">{isInterviewer ? 'Interviewer ID' : 'LGA'}</th>
                    <th className="p-2 font-medium text-right">Total</th>
                    {isInterviewer && <th className="p-2 font-medium text-right">Approved</th>}
                    {isInterviewer && <th className="p-2 font-medium text-right">Not Approved</th>}
                    {isInterviewer && <th className="p-2 font-medium text-right">Treatment</th>}
                    {isInterviewer && <th className="p-2 font-medium text-right">Control</th>}
                    <th className="p-2 font-medium text-right">% Approved</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item) => (
                    <tr key={item.name} className="border-b border-border/50">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-right">{item.achieved}</td>
                         {isInterviewer && <td className="p-2 text-right text-success">{(item as any).valid}</td>}
                        {isInterviewer && <td className="p-2 text-right text-destructive">{(item as any).invalid}</td>}
                        {isInterviewer && <td className="p-2 text-right text-blue-400">0</td>}
                        {isInterviewer && <td className="p-2 text-right text-purple-400">0</td>}
                        <td className={`p-2 text-right font-semibold ${item.completionRate >= 95 ? 'text-success' : 'text-warning'}`}>{isInterviewer ? `${(item as any).approvalRate.toFixed(1)}%` : `${item.completionRate.toFixed(1)}%`}</td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={isInterviewer ? 7 : 3} className="text-center p-8 text-muted-foreground">No achievement data available.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);


const Achievements: React.FC<AchievementsProps> = ({ byInterviewer, byLGA }) => {
  const [activeTab, setActiveTab] = useState<AchievementTab>('interviewer');

   const tabs: { id: AchievementTab; label: string; data: AchievementData[], isInterviewer: boolean }[] = [
    { id: 'interviewer', label: 'By Interviewer', data: byInterviewer, isInterviewer: true },
    { id: 'lga', label: 'By LGA', data: byLGA, isInterviewer: false },
  ];

  const getTabClass = (tabId: AchievementTab) => {
      return `px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
          activeTab === tabId
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:bg-muted/50'
      }`;
  };

  const currentTabData = tabs.find(t => t.id === activeTab);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <CardTitle>Achievements</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-2 p-1" aria-label="Tabs">
            {tabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={getTabClass(tab.id)}>
                    {tab.label}
                 </button>
            ))}
          </nav>
        </div>
        <div className="mt-4">
            {currentTabData && <AchievementTable data={currentTabData.data} isInterviewer={currentTabData.isInterviewer} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;