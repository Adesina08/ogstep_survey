import React from 'react';
import { RefreshCw, Sun, Moon, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Theme } from '../../App';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  lastUpdated: string;
  statusMessage: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeToggle: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void }> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  statusMessage,
  isRefreshing,
  onRefresh,
  theme,
  setTheme
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">OGSTEP SURVEY</h1>
              <p className="text-xs text-muted-foreground">
                Real-time quality control dashboard for survey data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-xs font-semibold flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-success" /> Status</p>
                <p className="text-xs text-muted-foreground">{statusMessage}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">version not set</p>
                <p className="text-xs text-muted-foreground">Latest submissions from data available</p>
            </div>
            <Button variant="default" size="sm" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;