
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinanceSummaryCardProps {
  title: string;
  value: string;
  change: number;
  period: string;
  icon?: React.ReactNode;
  iconBackground?: string;
  className?: string;
}

const FinanceSummaryCard: React.FC<FinanceSummaryCardProps> = ({
  title,
  value,
  change,
  period,
  icon,
  iconBackground = 'bg-blue-100',
  className,
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className={cn(
      "bg-white p-3 sm:p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow animate-fade-in",
      className
    )}>
      <h3 className="text-xs sm:text-sm text-gray-500 mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold">{value}</p>
        {icon && (
          <div className={cn("p-1.5 sm:p-2 rounded-full", iconBackground)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-center mt-2 text-xs">
        <span className={cn(
          "flex items-center gap-1 font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 ml-1">from {period}</span>
      </div>
    </div>
  );
};

export default FinanceSummaryCard;
