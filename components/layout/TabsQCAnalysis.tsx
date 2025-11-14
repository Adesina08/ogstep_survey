import React, { useState } from 'react';

interface TabsQCAnalysisProps {
  qualityControlTab: React.ReactNode;
  analysisTab: React.ReactNode;
}

const TabsQCAnalysis: React.FC<TabsQCAnalysisProps> = ({ qualityControlTab, analysisTab }) => {
  const [activeTab, setActiveTab] = useState<'qc' | 'analysis'>('qc');

  const getTabClass = (tabName: 'qc' | 'analysis') => {
    return `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === tabName
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted'
    }`;
  };

  return (
    <div>
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-4 p-1" aria-label="Tabs">
          <button onClick={() => setActiveTab('qc')} className={getTabClass('qc')}>
            Quality Control
          </button>
          <button onClick={() => setActiveTab('analysis')} className={getTabClass('analysis')}>
            AI Analyst
          </button>
        </nav>
      </div>
      <div className="mt-6">
        {activeTab === 'qc' && qualityControlTab}
        {activeTab === 'analysis' && analysisTab}
      </div>
    </div>
  );
};

export default TabsQCAnalysis;
