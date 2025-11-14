import React, { useState, useEffect } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import DashboardHeader from './components/layout/DashboardHeader';
import DashboardPage from './pages/DashboardPage';
import Spinner from './components/ui/Spinner';
import { AlertCircle } from 'lucide-react';
import { Button } from './components/ui/Button';

export type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (!isDarkMode) {
        document.documentElement.classList.add('dark');
    }
    setTheme('dark');
  }, []);

  const setCurrentTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(newTheme);
  };

  return [theme, setCurrentTheme];
};

function App() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboardData();
  const [theme, setTheme] = useTheme();

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-md">
          <div className="mb-3 flex justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Unable to load dashboard data</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error?.message || 'An unknown error occurred.'}</p>
          <Button className="mt-4" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        No data available to display.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        lastUpdated={data.lastUpdated}
        statusMessage={data.statusMessage}
        isRefreshing={isRefetching}
        onRefresh={handleRefresh}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="w-full flex-1 space-y-6 px-4 py-6 sm:px-8">
        <DashboardPage dashboardData={data} />
      </main>
      <footer className="border-t border-border py-4">
        <div className="mx-auto w-full max-w-7xl px-4 text-center text-xs text-muted-foreground">
          © 2025 OGSTEP IMPACT SURVEY
        </div>
      </footer>
    </div>
  );
}

export default App;