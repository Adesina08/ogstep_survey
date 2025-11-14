import React from 'react';
import { SurveySubmission, ApprovalStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Map, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

interface SubmissionsMapProps {
    submissions: SurveySubmission[];
}

const WorldMapSVG: React.FC = () => (
    <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <g fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.5">
            <path d="M499.999 499.5c276.142 0 499.999-111.954 499.999-249.75S776.141 0 499.999 0C223.858 0 0 111.954 0 249.75S223.858 499.5 499.999 499.5z" fill="hsl(var(--background))" stroke="none" />
            <path d="M493 249l-13-14-14 1-13-13-1-20-13-8-1-10-10-2-12 1-15-1-10 11-1-14-14-10-18 6-11-2-11 5-11-2-10 12-11-3-11 2-25-10-10-5-10-1-12 5-10-1-9 1-10-2-10 1-13-1-11-5-14 1-12 5-15-1-16 1-15-1-11 1-11-1-11-2-10-1-10-3-10-1-11-1-10-3-10-2-11-1-11-2-11-1-11-1-10-2-11-1-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1l-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1l-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1l-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1z" />
            <path d="M545 237l-13-14-14 1-13-13-1-20-13-8-1-10-10-2-12 1-15-1-10 11-1-14-14-10-18 6-11-2-11 5-11-2-10 12-11-3-11 2-25-10-10-5-10-1-12 5-10-1-9 1-10-2-10 1-13-1-11-5-14 1-12 5-15-1-16 1-15-1-11 1-11-1-11-2-10-1-10-3-10-1-11-1-10-3-10-2-11-1-11-2-11-1-11-1-10-2-11-1-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1l-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1l-10-3-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1-10-3-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-11-1-10-3-10-2-10-2-11-1z" />
        </g>
    </svg>
);


const SubmissionsMap: React.FC<SubmissionsMapProps> = ({ submissions }) => {

    const convertGPSToSVG = (lat: number, lon: number) => {
        // Very rough approximation for West Africa on a world map
        const x = (lon + 180) / 360 * 1000;
        const y = (90 - lat) / 180 * 500;
        return { x: x, y: y };
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Map className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle>OGUN LGA MAP</CardTitle>
                            <p className="text-xs text-muted-foreground">Submissions by LGA</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <select className="min-w-[120px] text-xs rounded-md border-input bg-background px-2 py-1 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <option>All LGAs</option>
                        </select>
                        <select className="min-w-[120px] text-xs rounded-md border-input bg-background px-2 py-1 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <option>All Error Types</option>
                        </select>
                         <select className="min-w-[120px] text-xs rounded-md border-input bg-background px-2 py-1 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <option>All Interviewers</option>
                        </select>
                        <Button variant="outline" size="sm" disabled>Export Map</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-2">
                <div className="relative" style={{height: '450px'}}>
                    <WorldMapSVG />
                    <div className="absolute top-0 left-0 w-full h-full">
                        {submissions.map(s => {
                             if (!s.gps || typeof s.gps.lat !== 'number' || typeof s.gps.lon !== 'number') return null;
                             const {x, y} = convertGPSToSVG(s.gps.lat, s.gps.lon);
                             const color = s.submissionStatus === ApprovalStatus.Approved ? 'hsl(var(--success))' : (s.submissionStatus === ApprovalStatus.Rejected ? 'hsl(var(--destructive))' : 'hsl(var(--warning))');

                             return (
                                <MapPin key={s.id} className="absolute -ml-2 -mt-4" style={{ left: `${x}px`, top: `${y}px`}} color={color} fill={color} fillOpacity={0.4} size={16}/>
                             );
                        })}
                    </div>
                    {submissions.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-muted-foreground">No location data to display.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SubmissionsMap;