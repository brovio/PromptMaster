import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function ResponsiveGrid({ 
  children, 
  columns = { default: 1, sm: 2, lg: 3 },
  gap = 4 
}: ResponsiveGridProps) {
  const getGridCols = () => {
    return [
      `grid-cols-${columns.default}`,
      columns.sm && `sm:grid-cols-${columns.sm}`,
      columns.md && `md:grid-cols-${columns.md}`,
      columns.lg && `lg:grid-cols-${columns.lg}`,
      columns.xl && `xl:grid-cols-${columns.xl}`,
    ].filter(Boolean).join(' ');
  };

  return (
    <div className={`grid ${getGridCols()} gap-${gap}`}>
      {children}
    </div>
  );
}