
import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FinanceData = {
  category: string;
  value: number;
};

type FinanceOverviewProps = {
  data: FinanceData[];
};

const FinanceOverview: React.FC<FinanceOverviewProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm">
          <p className="font-medium">{payload[0].payload.category}</p>
          <p className="text-buildtrack-blue">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Finance Overview</h2>
        <CircleDollarSign size={18} className="text-gray-400" />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" />
            <YAxis 
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#2563eb" 
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                formatter: (value: number) => formatCurrency(value),
                fontSize: 12,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinanceOverview;
