import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="border-4 border-muted border-t-primary rounded-full w-12 h-12 animate-spin" style={{borderColor: 'var(--text-muted)', borderTopColor: 'var(--primary)'}}></div>
  );
};

export default Spinner;
