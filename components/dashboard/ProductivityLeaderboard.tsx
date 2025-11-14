import React from 'react';
import { UserProductivityData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Award, TrendingUp, TrendingDown } from 'lucide-react';

interface UserProductivityRankingsProps {
  data: UserProductivityData[];
}

const UserProductivityRankings: React.FC<UserProductivityRankingsProps> = ({ data }) => {
  const topPerformer = data.length > 0 ? data[0] : null;
  const top10 = data.slice(0, 10);

  const overallApprovalRate = data.length > 0
    ? data.reduce((acc, user) => acc + user.valid, 0) / data.reduce((acc, user) => acc + user.valid + user.invalid, 0) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-primary" />
            <div>
                <CardTitle>User Productivity Rankings</CardTitle>
                <p className="text-xs text-muted-foreground">Track interviewer performance, highlight top performers, and quickly spot where support is needed.</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performer Section */}
        <div className="border border-border rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-center text-card-foreground">TOP PERFORMER</h4>
          {topPerformer ? (
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{topPerformer.interviewerId}</p>
              <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div>
                      <p className="text-xs text-muted-foreground">INTERVIEWS</p>
                      <p className="text-xl font-bold">{topPerformer.total}</p>
                  </div>
                  <div>
                      <p className="text-xs text-muted-foreground">APPROVED</p>
                      <p className="text-xl font-bold text-success">{topPerformer.valid}</p>
                  </div>
                  <div>
                      <p className="text-xs text-muted-foreground">FLAGGED</p>
                      <p className="text-xl font-bold text-destructive">{topPerformer.invalid}</p>
                  </div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-sm">Top performer approval rate</p>
                <p className="text-2xl font-bold text-success">{topPerformer.approvalRate.toFixed(1)}%</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
          )}
        </div>

        {/* Top 10 List */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-card-foreground">TOP 10 INTERVIEWERS</h4>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">Overall approval</p>
                <p className="font-bold text-primary">{overallApprovalRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="space-y-2">
            {top10.length > 0 ? top10.map((user, index) => (
              <div key={user.interviewerId} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                <div className="flex items-center">
                    <span className="text-xs w-6 text-muted-foreground">{index + 1}.</span>
                    <span className="font-medium">{user.interviewerId}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Total: {user.total}</span>
                    <span className={`font-semibold ${user.approvalRate >= 95 ? 'text-success' : user.approvalRate >= 85 ? 'text-warning' : 'text-destructive'}`}>
                        {user.approvalRate.toFixed(1)}%
                    </span>
                </div>
              </div>
            )) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Not enough data to display rankings.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProductivityRankings;