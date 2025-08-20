
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, ArrowDown, ArrowUp, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

type SiteFinanceCardProps = {
  id: number;
  name: string;
  code: string;
  address: string;
  budget: number;
  expenses: number;
  remaining: number;
  utilization: number;
  allocationDate: string;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

const SiteFinanceCard: React.FC<SiteFinanceCardProps> = ({
  id,
  name,
  code,
  address,
  budget,
  expenses,
  remaining,
  utilization,
  allocationDate,
}) => {
  const remainingPercentage = ((remaining / budget) * 100).toFixed(1);

  return (
    <Card className="p-5 bg-white hover:shadow-md transition-all duration-200 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">Project Code: {code}</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Total Budget</span>
          <div className="flex items-center">
            <span className="text-base font-semibold">{formatCurrency(budget)}</span>
            <div className="ml-2 p-1 bg-blue-100 rounded-full">
              <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1">Allocated on {allocationDate}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Total Expenses</span>
          <div className="flex items-center">
            <span className="text-base font-semibold">{formatCurrency(expenses)}</span>
            <div className="ml-2 p-1 bg-red-100 rounded-full">
              <ArrowDown className="h-3.5 w-3.5 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Remaining Budget</span>
          <div className="flex items-center">
            <span className="text-base font-semibold">{formatCurrency(remaining)}</span>
            <div className="ml-2 p-1 bg-green-100 rounded-full">
              <ArrowUp className="h-3.5 w-3.5 text-green-600" />
            </div>
          </div>
          <span className="text-xs text-gray-500 mt-1">{remainingPercentage}% remaining</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1">Budget Utilization</span>
          <div className="flex items-center">
            <span className="text-base font-semibold">{utilization.toFixed(1)}%</span>
            <div className="ml-2 p-1 bg-yellow-100 rounded-full">
              <DollarSign className="h-3.5 w-3.5 text-yellow-600" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
            <div 
              className={`h-full rounded-full ${
                utilization < 30 ? 'bg-blue-500' : utilization < 70 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Link 
          to={`/finance/site/${id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors hover:scale-105 transform duration-200"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </Card>
  );
};

export default SiteFinanceCard;
