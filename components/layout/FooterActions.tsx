import React from 'react';
import { Button } from '../ui/Button';
import { Download, CheckCircle, XCircle, Flag } from 'lucide-react';

const FooterActions: React.FC = () => {
    // Note: Export functionality is not implemented, so buttons are disabled.
    return (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-center gap-4 sticky bottom-4">
            <Button variant="default" size="sm" disabled>
                <Download className="mr-2 h-4 w-4" />
                Export All Data
            </Button>
            <Button variant="outline" size="sm" className="border-success text-success hover:bg-success/10 hover:text-success" disabled>
                 <CheckCircle className="mr-2 h-4 w-4" />
                Export Approved Data
            </Button>
            <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" disabled>
                 <XCircle className="mr-2 h-4 w-4" />
                Export Not Approved Data
            </Button>
            <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10 hover:text-warning" disabled>
                 <Flag className="mr-2 h-4 w-4" />
                Export Error Flags
            </Button>
        </div>
    );
};

export default FooterActions;