import React, { useState } from 'react';
import { DashboardData } from '../types';
import TabsQCAnalysis from '../components/layout/TabsQCAnalysis';
import QualityControlContent from '../components/dashboard/QualityControlContent';
import AIAnalyst from '../components/analysis/AIAnalyst';

interface DashboardPageProps {
  dashboardData: DashboardData;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ dashboardData }) => {
  const [selectedLga, setSelectedLga] = useState<string>('all');

  // Note: Filtering logic will be handled within the data processor or child components
  // based on selectedLga. For this implementation, we pass the full dataset down.

  return (
    <TabsQCAnalysis
      qualityControlTab={
        <QualityControlContent
          data={dashboardData}
          selectedLga={selectedLga}
          setSelectedLga={setSelectedLga}
        />
      }
      analysisTab={
        // FIX: Pass the entire dashboardData object to AIAnalyst, as it now expects it for context.
        <AIAnalyst data={dashboardData} />
      }
    />
  );
};

export default DashboardPage;
