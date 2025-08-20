
import React from 'react';
import { CircleDollarSign, Clock, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type SiteHeaderProps = {
  site: {
    name: string;
    code: string;
    address: string;
    completionPercentage: number;
    budget: number;
    utilized: number;
    teamSize: number;
    managers: number;
    admins: number;
    totalDays: number;
    daysRemaining: number;
  };
};

const SiteHeader: React.FC<SiteHeaderProps> = ({ site }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const daysPassed = site.totalDays - site.daysRemaining;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="text-gray-500">
           {site.address}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Overall Completion</h3>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-600">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold">{site.completionPercentage}%</p>
            <Progress value={site.completionPercentage} className="h-2" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Project Budget</h3>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-50 text-green-600">
                <CircleDollarSign size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(site.budget)}</p>
            <p className="text-sm text-gray-500">
              {Math.round((site.utilized / site.budget) * 100)}% utilized
            </p>
          </div>
        </div>
        
        
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-yellow-50 text-yellow-600">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold">{site.totalDays} days</p>
            <p className="text-sm text-gray-500">
              {daysPassed} days passed, {site.daysRemaining} days remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
