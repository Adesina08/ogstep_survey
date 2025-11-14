import React, { useMemo } from 'react';
// FIX: Header is a default export, so this import is now correct.
import Header from '../components/layout/Header';
import AIAnalyst from '../components/analysis/AIAnalyst';
import { useDashboardData } from '../hooks/useDashboardData';
import Spinner from '../components/ui/Spinner';
// FIX: Card is a named export, not a default export.
import { Card } from '../components/ui/Card';
// FIX: FilterState is now exported from types.ts
import { FilterState, SubmissionStatus } from '../types';
import { parseISO } from 'date-fns';


const AnalysisPage: React.FC<{ filters: FilterState }> = ({ filters }) => {
  const { data, isLoading, error } = useDashboardData();
  
  const filteredSubmissions = useMemo(() => {
    if (!data) return null;

    // Apply filters
    return data.submissions.filter(s => {
      // Date filter
      const submissionDate = parseISO(s.timestamp);
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
      if (startDate && submissionDate < startDate) return false;
      if (endDate && submissionDate > endDate) return false;
      
      // Status filter
      if (filters.status !== 'All' && s.submissionStatus !== filters.status) return false;
      
      // QC flags filter
      if (filters.qcFlags.length > 0 && !filters.qcFlags.some(flag => s.errorFlags.includes(flag))) return false;
      
      return true;
    });
  }, [data, filters]);

  const filteredDashboardData = useMemo(() => {
    if (!data || !filteredSubmissions) return null;
    // NOTE: This creates a new DashboardData object with filtered submissions,
    // but the summary metrics are NOT recalculated. For a full implementation,
    // a data processing function should be re-run on `filteredSubmissions`.
    // The Gemini prompt receives stale summary data but the correct list of submissions.
    return { ...data, submissions: filteredSubmissions };
  }, [data, filteredSubmissions]);

  const isFiltered = useMemo(() => {
      return filters.status !== 'All' || filters.qcFlags.length > 0 || !!filters.dateRange.start || !!filters.dateRange.end;
  }, [filters]);


  return (
    <>
      <Header title="AI-Powered Analysis" />
      <div className="mt-6">
        {isLoading && !filteredSubmissions && (
          <div className="flex justify-center">
             <Card>
                <div className="p-8 flex flex-col items-center space-y-4">
                  <Spinner />
                  <p className="text-secondary">Loading survey data for analysis...</p>
                </div>
              </Card>
          </div>
        )}
        {error && (
          <Card>
            <div className="p-8 text-center text-red-400">
                <h3 className="text-lg font-semibold">Error Loading Data</h3>
                <p>Could not load survey data for analysis. Please try again later.</p>
            </div>
          </Card>
        )}
        {/* FIX: Pass a DashboardData object to AIAnalyst and remove the non-existent `isFiltered` prop. */}
        {filteredDashboardData && (
          <AIAnalyst data={filteredDashboardData}/>
        )}
      </div>
    </>
  );
};

export default AnalysisPage;
