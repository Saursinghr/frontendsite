
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

interface ExpenseCategoryProps {
  category: string;
  color: string;
  percentage: number;
}

interface FinanceOverviewChartsProps {
  barChartData: { name: string; value: number }[];
  expenseCategories: { name: string; value: number }[];
  monthlyTrends: { name: string; income: number; expenses: number }[];
  categoryColors: Record<string, string>;
}

export const FinanceOverviewCharts: React.FC<FinanceOverviewChartsProps> = ({
  barChartData,
  expenseCategories,
  monthlyTrends,
  categoryColors,
}) => {
  const COLORS = Object.values(categoryColors);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-1">Finance Overview</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">Income vs Expenses breakdown</p>
        <div className="h-[250px] sm:h-[350px]">
          <ChartContainer
            config={{
              bar: {
                color: "#3b82f6",
              },
            }}
            className="h-full"
          >
            <RechartsBarChart 
              data={barChartData} 
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value / 100000}00K`}
                domain={[0, 3500000]}
              />
              <Tooltip
                content={<ChartTooltipContent nameKey="name" />}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ChartContainer>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-1">Expenses by Category</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">Distribution of expenses across categories</p>
        <div className="h-[250px] sm:h-[300px]">
          <ChartContainer
            config={{
              ...expenseCategories.reduce((acc, category, index) => {
                return {
                  ...acc,
                  [category.name]: {
                    color: COLORS[index % COLORS.length],
                    label: `${category.name} ${category.value}%`,
                  },
                };
              }, {}),
            }}
            className="h-full"
          >
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                nameKey="name"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, ``]} />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2">
          {expenseCategories.map((category, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 text-xs">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-xs">{category.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6 col-span-1 lg:col-span-2">
        <h3 className="text-base sm:text-lg font-semibold mb-1">Monthly Financial Trends</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">Income and expenses over the past 12 months</p>
        <div className="h-[250px] sm:h-[300px]">
          <ChartContainer
            config={{
              income: {
                color: "#3b82f6",
                label: "Income",
              },
              expenses: {
                color: "#ef4444",
                label: "Expenses",
              },
            }}
            className="h-full"
          >
            <LineChart 
              data={monthlyTrends} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value / 1000}K`} />
              <Tooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatCurrency(value), ``]} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                name="Expenses"
              />
            </LineChart>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default FinanceOverviewCharts;
