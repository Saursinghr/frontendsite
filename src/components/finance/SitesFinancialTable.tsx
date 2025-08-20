
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SiteFinancial {
  id: number;
  name: string;
  code: string;
  address: string;
  budget: number;
  expenses: number;
  remaining: number;
  utilization: number;
  allocationDate: string;
}

interface SitesFinancialTableProps {
  sites: SiteFinancial[];
  searchTerm: string;
  activeTab: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: string) => void;
  onAddSite: () => void;
}

const SitesFinancialTable: React.FC<SitesFinancialTableProps> = ({
  sites,
  searchTerm,
  activeTab,
  onSearchChange,
  onTabChange,
  onAddSite
}) => {
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Sites Financial Overview</h2>
        <div className="flex mt-2 sm:mt-0 gap-2">
          <Tabs defaultValue={activeTab} className="mr-2">
            <TabsList className="bg-gray-100">
              <TabsTrigger 
                value="all" 
                onClick={() => onTabChange("all")}
              >
                All Sites
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                onClick={() => onTabChange("active")}
              >
                Active Sites
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                onClick={() => onTabChange("completed")}
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-8 bg-white h-9 w-[180px] text-sm border-gray-200" 
              placeholder="Search sites..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon" className="ml-1">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">Financial summary of all construction sites</p>

      {/* Responsive table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sites.length > 0 ? (
              sites.map((site) => (
                <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">{site.code.substring(0, 2)}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{site.name}</div>
                        <div className="text-xs text-gray-500">{site.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(site.budget)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(site.expenses)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(site.remaining)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{site.utilization.toFixed(1)}%</span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            site.utilization < 30 ? 'bg-blue-500' : 
                            site.utilization < 70 ? 'bg-yellow-500' : 
                            'bg-orange-500'
                          }`}
                          style={{ width: `${site.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/finance/site/${site.id}`}>
                      <Button 
                        variant="outline"
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                      >
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No sites found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SitesFinancialTable;
