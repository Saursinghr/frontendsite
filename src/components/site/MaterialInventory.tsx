
import React from 'react';
import { Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type MaterialData = {
  name: string;
  value: number;
};

type MaterialInventoryProps = {
  data: MaterialData[];
};

const COLORS = ['#FFC107', '#2196F3', '#4CAF50', '#9C27B0'];

const MaterialInventory: React.FC<MaterialInventoryProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Material Inventory</h2>
        <Package size={18} className="text-gray-400" />
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MaterialInventory;
