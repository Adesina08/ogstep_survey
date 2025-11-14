import React, { useState } from 'react';
import { Quota } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';

interface QuotaTrackerProps {
  quotaByLGA: Quota[];
  quotaByLGAAge: Quota[];
  quotaByLGAGender: Quota[];
}

type QuotaTab = 'lga' | 'age' | 'gender';

const QuotaTable: React.FC<{ data: Quota[], headers: string[] }> = ({ data, headers }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
                <tr className="border-b border-border">
                    {headers.map(h => <th key={h} className="p-2 font-medium">{h}</th>)}
                    <th className="p-2 font-medium text-right">Target</th>
                    <th className="p-2 font-medium text-right">Achieved</th>
                    <th className="p-2 font-medium text-right">Balance</th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? data.map((item) => {
                    const balance = item.target - item.actual;
                    return (
                        <tr key={item.category} className="border-b border-border/50">
                            <td className="p-2" colSpan={headers.length - 2 > 0 ? headers.length - 2 : 1}>{item.category}</td>
                            <td className="p-2 text-right">{item.target}</td>
                            <td className="p-2 text-right">{item.actual}</td>
                            <td className={`p-2 text-right font-semibold ${balance > 0 ? 'text-warning' : 'text-success'}`}>{balance}</td>
                        </tr>
                    )
                }) : (
                    <tr>
                        <td colSpan={headers.length + 3} className="text-center p-8 text-muted-foreground">No data for this category.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);


const QuotaTracker: React.FC<QuotaTrackerProps> = ({ quotaByLGA, quotaByLGAAge, quotaByLGAGender }) => {
  const [activeTab, setActiveTab] = useState<QuotaTab>('lga');

  const tabs: { id: QuotaTab; label: string; data: Quota[], headers: string[] }[] = [
    { id: 'lga', label: 'By LGA', data: quotaByLGA, headers: ['State', 'LGA'] },
    { id: 'age', label: 'By LGA & Age', data: quotaByLGAAge, headers: ['Category'] },
    { id: 'gender', label: 'By LGA & Gender', data: quotaByLGAGender, headers: ['Category'] },
  ];

  const getTabClass = (tabId: QuotaTab) => {
      return `px-4 py-2 text-sm font-medium rounded-md transition-colors border ${
          activeTab === tabId
              ? 'bg-primary/10 border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:bg-muted/50'
      }`;
  };

  const currentTabData = tabs.find(t => t.id === activeTab);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quota Tracker</CardTitle>
        <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export Quota Data
        </Button>
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
            {currentTabData && <QuotaTable data={currentTabData.data} headers={currentTabData.headers} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotaTracker;