import React, { useState } from 'react';
import { DashboardData } from '../types';
import QualityControlContent from '../components/dashboard/QualityControlContent';

interface DashboardPageProps {
  dashboardData: DashboardData;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ dashboardData }) => {
  const [selectedLga, setSelectedLga] = useState<string>('all');

  return (
    <QualityControlContent
      data={dashboardData}
      selectedLga={selectedLga}
      setSelectedLga={setSelectedLga}
    />
  );
};

export default DashboardPage;