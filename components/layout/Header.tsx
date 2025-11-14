import React from 'react';

// FIX: Add a component definition and default export to make this a valid module.
const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header>
      <h1 className="text-3xl font-bold tracking-tight text-card-foreground">{title}</h1>
    </header>
  );
};

export default Header;
