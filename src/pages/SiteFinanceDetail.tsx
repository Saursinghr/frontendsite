
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, DollarSign, Search, Filter, Plus, Calendar, ArrowUp,
  ArrowDown, ClipboardList, Check, X, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Site data
const sites = [
  {
    id: 1,
    name: "Riverside Apartments",
    code: "RA-2023",
    address: "456 River Rd, Chicago, IL 60601",
    budget: 3500000,
    totalExpenses: 68000,
    remaining: 3432000,
    remainingPercentage: 98.1,
    utilization: 1.9,
    allocationDate: "3/10/2023",
    expenseEntries: 10,
    expensesByCategory: [
      { name: "Materials", value: 55 },
      { name: "Labor", value: 14 },
      { name: "Equipment", value: 10 },
      { name: "Subcontractors", value: 9 },
      { name: "Permits", value: 3 },
      { name: "Insurance", value: 4 },
      { name: "Utilities", value: 1 },
      { name: "Miscellaneous", value: 3 },
    ],
    budgetAllocation: [
      { name: "Materials", budget: 110000, spent: 40000 },
      { name: "Labor", budget: 90000, spent: 10000 },
      { name: "Equipment", budget: 60000, spent: 7000 },
      { name: "Subcontractors", budget: 45000, spent: 6000 },
      { name: "Insurance", budget: 25000, spent: 3000 },
      { name: "Miscellaneous", budget: 20000, spent: 2000 },
    ],
    expenses: [
      { id: "exp-001", date: "4/15/2023", category: "Materials", description: "Concrete delivery", amount: 12500, status: "Approved" },
      { id: "exp-002", date: "4/12/2023", category: "Equipment", description: "Excavator rental", amount: 8750, status: "Approved" },
      { id: "exp-003", date: "4/10/2023", category: "Labor", description: "Weekly wages", amount: 15200, status: "Approved" },
      { id: "exp-004", date: "4/8/2023", category: "Subcontractors", description: "Electrical work", amount: 9800, status: "Approved" },
      { id: "exp-005", date: "4/5/2023", category: "Permits", description: "Building permits", amount: 3500, status: "Approved" },
      { id: "exp-006", date: "4/18/2023", category: "Materials", description: "Steel reinforcement", amount: 7800, status: "Pending" },
      { id: "exp-007", date: "4/20/2023", category: "Utilities", description: "Site electricity", amount: 1200, status: "Pending" },
      { id: "exp-008", date: "4/2/2023", category: "Insurance", description: "Monthly insurance premium", amount: 4500, status: "Approved" },
      { id: "exp-009", date: "4/22/2023", category: "Miscellaneous", description: "Site security", amount: 2800, status: "Rejected" },
      { id: "exp-010", date: "4/25/2023", category: "Equipment", description: "Tool replacements", amount: 1950, status: "Pending" },
    ]
  },
  {
    id: 2,
    name: "Sunset Mall Renovation",
    code: "SMR-2023",
    address: "789 Sunset Blvd, Los Angeles, CA 90001",
    budget: 2800000,
    totalExpenses: 68000,
    remaining: 2732000,
    remainingPercentage: 97.6,
    utilization: 2.4,
    allocationDate: "11/5/2022",
    expenseEntries: 10,
    expensesByCategory: [
      { name: "Materials", value: 55 },
      { name: "Labor", value: 14 },
      { name: "Equipment", value: 10 },
      { name: "Subcontractors", value: 9 },
      { name: "Permits", value: 3 },
      { name: "Insurance", value: 4 },
      { name: "Utilities", value: 1 },
      { name: "Miscellaneous", value: 3 },
    ],
    budgetAllocation: [
      { name: "Materials", budget: 110000, spent: 40000 },
      { name: "Labor", budget: 90000, spent: 10000 },
      { name: "Equipment", budget: 60000, spent: 7000 },
      { name: "Subcontractors", budget: 45000, spent: 6000 },
      { name: "Insurance", budget: 25000, spent: 3000 },
      { name: "Miscellaneous", budget: 20000, spent: 2000 },
    ],
    expenses: [
      { id: "exp-001", date: "4/15/2023", category: "Materials", description: "Concrete delivery", amount: 12500, status: "Approved" },
      { id: "exp-002", date: "4/12/2023", category: "Equipment", description: "Excavator rental", amount: 8750, status: "Approved" },
      { id: "exp-003", date: "4/10/2023", category: "Labor", description: "Weekly wages", amount: 15200, status: "Approved" },
      { id: "exp-004", date: "4/8/2023", category: "Subcontractors", description: "Electrical work", amount: 9800, status: "Approved" },
      { id: "exp-005", date: "4/5/2023", category: "Permits", description: "Building permits", amount: 3500, status: "Approved" },
      { id: "exp-006", date: "4/18/2023", category: "Materials", description: "Steel reinforcement", amount: 7800, status: "Pending" },
      { id: "exp-007", date: "4/20/2023", category: "Utilities", description: "Site electricity", amount: 1200, status: "Pending" },
      { id: "exp-008", date: "4/2/2023", category: "Insurance", description: "Monthly insurance premium", amount: 4500, status: "Approved" },
      { id: "exp-009", date: "4/22/2023", category: "Miscellaneous", description: "Site security", amount: 2800, status: "Rejected" },
      { id: "exp-010", date: "4/25/2023", category: "Equipment", description: "Tool replacements", amount: 1950, status: "Pending" },
    ]
  },
  {
    id: 3,
    name: "Highland Park Residences",
    code: "HPR-2023",
    address: "321 Highland Ave, Boston, MA 02115",
    budget: 4200000,
    totalExpenses: 68000,
    remaining: 4132000,
    remainingPercentage: 98.4,
    utilization: 1.6,
    allocationDate: "5/20/2023",
    expenseEntries: 10,
    expensesByCategory: [
      { name: "Materials", value: 55 },
      { name: "Labor", value: 14 },
      { name: "Equipment", value: 10 },
      { name: "Subcontractors", value: 9 },
      { name: "Permits", value: 3 },
      { name: "Insurance", value: 4 },
      { name: "Utilities", value: 1 },
      { name: "Miscellaneous", value: 3 },
    ],
    budgetAllocation: [
      { name: "Materials", budget: 110000, spent: 40000 },
      { name: "Labor", budget: 90000, spent: 10000 },
      { name: "Equipment", budget: 60000, spent: 7000 },
      { name: "Subcontractors", budget: 45000, spent: 6000 },
      { name: "Insurance", budget: 25000, spent: 3000 },
      { name: "Miscellaneous", budget: 20000, spent: 2000 },
    ],
    expenses: [
      { id: "exp-001", date: "4/15/2023", category: "Materials", description: "Concrete delivery", amount: 12500, status: "Approved" },
      { id: "exp-002", date: "4/12/2023", category: "Equipment", description: "Excavator rental", amount: 8750, status: "Approved" },
      { id: "exp-003", date: "4/10/2023", category: "Labor", description: "Weekly wages", amount: 15200, status: "Approved" },
      { id: "exp-004", date: "4/8/2023", category: "Subcontractors", description: "Electrical work", amount: 9800, status: "Approved" },
      { id: "exp-005", date: "4/5/2023", category: "Permits", description: "Building permits", amount: 3500, status: "Approved" },
      { id: "exp-006", date: "4/18/2023", category: "Materials", description: "Steel reinforcement", amount: 7800, status: "Pending" },
      { id: "exp-007", date: "4/20/2023", category: "Utilities", description: "Site electricity", amount: 1200, status: "Pending" },
      { id: "exp-008", date: "4/2/2023", category: "Insurance", description: "Monthly insurance premium", amount: 4500, status: "Approved" },
      { id: "exp-009", date: "4/22/2023", category: "Miscellaneous", description: "Site security", amount: 2800, status: "Rejected" },
      { id: "exp-010", date: "4/25/2023", category: "Equipment", description: "Tool replacements", amount: 1950, status: "Pending" },
    ]
  },
  {
    id: 4,
    name: "Tech Hub Campus",
    code: "THC-2022",
    address: "555 Innovation Way, San Francisco, CA 94103",
    budget: 7500000,
    totalExpenses: 68000,
    remaining: 7432000,
    remainingPercentage: 99.1,
    utilization: 0.9,
    allocationDate: "6/10/2022",
    expenseEntries: 10,
    expensesByCategory: [
      { name: "Materials", value: 55 },
      { name: "Labor", value: 14 },
      { name: "Equipment", value: 10 },
      { name: "Subcontractors", value: 9 },
      { name: "Permits", value: 3 },
      { name: "Insurance", value: 4 },
      { name: "Utilities", value: 1 },
      { name: "Miscellaneous", value: 3 },
    ],
    budgetAllocation: [
      { name: "Materials", budget: 110000, spent: 40000 },
      { name: "Labor", budget: 90000, spent: 10000 },
      { name: "Equipment", budget: 60000, spent: 7000 },
      { name: "Subcontractors", budget: 45000, spent: 6000 },
      { name: "Insurance", budget: 25000, spent: 3000 },
      { name: "Miscellaneous", budget: 20000, spent: 2000 },
    ],
    expenses: [
      { id: "exp-001", date: "4/15/2023", category: "Materials", description: "Concrete delivery", amount: 12500, status: "Approved" },
      { id: "exp-002", date: "4/12/2023", category: "Equipment", description: "Excavator rental", amount: 8750, status: "Approved" },
      { id: "exp-003", date: "4/10/2023", category: "Labor", description: "Weekly wages", amount: 15200, status: "Approved" },
      { id: "exp-004", date: "4/8/2023", category: "Subcontractors", description: "Electrical work", amount: 9800, status: "Approved" },
      { id: "exp-005", date: "4/5/2023", category: "Permits", description: "Building permits", amount: 3500, status: "Approved" },
      { id: "exp-006", date: "4/18/2023", category: "Materials", description: "Steel reinforcement", amount: 7800, status: "Pending" },
      { id: "exp-007", date: "4/20/2023", category: "Utilities", description: "Site electricity", amount: 1200, status: "Pending" },
      { id: "exp-008", date: "4/2/2023", category: "Insurance", description: "Monthly insurance premium", amount: 4500, status: "Approved" },
      { id: "exp-009", date: "4/22/2023", category: "Miscellaneous", description: "Site security", amount: 2800, status: "Rejected" },
      { id: "exp-010", date: "4/25/2023", category: "Equipment", description: "Tool replacements", amount: 1950, status: "Pending" },
    ]
  },
  {
    id: 5,
    name: "Central Station Remodel",
    code: "CSR-2023",
    address: "100 Transit Plaza, Seattle, WA 98101",
    budget: 3200000,
    totalExpenses: 68000,
    remaining: 3132000,
    remainingPercentage: 97.9,
    utilization: 2.1,
    allocationDate: "2/15/2023",
    expenseEntries: 10,
    expensesByCategory: [
      { name: "Materials", value: 55 },
      { name: "Labor", value: 14 },
      { name: "Equipment", value: 10 },
      { name: "Subcontractors", value: 9 },
      { name: "Permits", value: 3 },
      { name: "Insurance", value: 4 },
      { name: "Utilities", value: 1 },
      { name: "Miscellaneous", value: 3 },
    ],
    budgetAllocation: [
      { name: "Materials", budget: 110000, spent: 40000 },
      { name: "Labor", budget: 90000, spent: 10000 },
      { name: "Equipment", budget: 60000, spent: 7000 },
      { name: "Subcontractors", budget: 45000, spent: 6000 },
      { name: "Insurance", budget: 25000, spent: 3000 },
      { name: "Miscellaneous", budget: 20000, spent: 2000 },
    ],
    expenses: [
      { id: "exp-001", date: "4/15/2023", category: "Materials", description: "Concrete delivery", amount: 12500, status: "Approved" },
      { id: "exp-002", date: "4/12/2023", category: "Equipment", description: "Excavator rental", amount: 8750, status: "Approved" },
      { id: "exp-003", date: "4/10/2023", category: "Labor", description: "Weekly wages", amount: 15200, status: "Approved" },
      { id: "exp-004", date: "4/8/2023", category: "Subcontractors", description: "Electrical work", amount: 9800, status: "Approved" },
      { id: "exp-005", date: "4/5/2023", category: "Permits", description: "Building permits", amount: 3500, status: "Approved" },
      { id: "exp-006", date: "4/18/2023", category: "Materials", description: "Steel reinforcement", amount: 7800, status: "Pending" },
      { id: "exp-007", date: "4/20/2023", category: "Utilities", description: "Site electricity", amount: 1200, status: "Pending" },
      { id: "exp-008", date: "4/2/2023", category: "Insurance", description: "Monthly insurance premium", amount: 4500, status: "Approved" },
      { id: "exp-009", date: "4/22/2023", category: "Miscellaneous", description: "Site security", amount: 2800, status: "Rejected" },
      { id: "exp-010", date: "4/25/2023", category: "Equipment", description: "Tool replacements", amount: 1950, status: "Pending" },
    ]
  },
];

// Define category colors
const CATEGORY_COLORS = {
  "Materials": "#3b82f6",
  "Labor": "#10b981",
  "Equipment": "#f59e0b",
  "Subcontractors": "#ef4444",
  "Permits": "#8b5cf6",
  "Insurance": "#ec4899",
  "Utilities": "#06b6d4",
  "Miscellaneous": "#6b7280"
};

const COLORS = Object.values(CATEGORY_COLORS);

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-200',
      icon: '✅'
    },
    Pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200',
      icon: '⏳'
    },
    Rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200',
      icon: '❌'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.hover}`}>
      <span>{config.icon}</span>
      {status}
    </span>
  );
};

// Custom tooltip formatter
const CustomTooltipFormatter = (value: number, name: string, props: any) => {
  if (name === 'spent' || name === 'budget') {
    return [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)];
  }
  return [value, name];
};

const SiteFinanceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({
    site: "",
    category: "",
    date: "",
    paymentMethod: "",
    refNumber: "",
    description: "",
    amount: "",
    notes: ""
  });

  const site = sites.find((s) => s.id === Number(id));

  if (!site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Site not found</h2>
          <p className="text-gray-600 mb-6">The requested site could not be found.</p>
          <Button onClick={() => navigate("/finance")} className="mx-auto">
            Back to Finance Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const filteredExpenses = site.expenses.filter(expense => {
    const matchesSearch = searchTerm === "" || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || expense.category === selectedCategory;
    const matchesStatus = selectedStatus === null || expense.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <MainLayout>
      <main className="px-4 py-6 md:px-6 md:py-8 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-3"
              onClick={() => navigate("/finance")}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{site.name} - Finance</h1>
              <p className="text-sm text-gray-500">Project Code: {site.code} | {site.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">April 2023</span>
            </div>
            <Button variant="outline" className="border-gray-200">
              <span className="text-sm">Reports</span>
            </Button>
            <Button variant="outline" className="border-gray-200">
              <span className="text-sm">Export</span>
            </Button>
            <Button 
              className="gap-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowAddExpenseDialog(true)}
            >
              <span className="text-sm">Add Expense</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <Card className="p-5 bg-white hover-scale animate-fade-in">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Budget</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{formatCurrency(site.budget)}</span>
                <div className="p-2 bg-blue-100 rounded-full">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1">Allocated on {site.allocationDate}</span>
            </div>
          </Card>
          
          <Card className="p-5 bg-white hover-scale animate-fade-in">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Expenses</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{formatCurrency(site.totalExpenses)}</span>
                <div className="p-2 bg-red-100 rounded-full">
                  <ArrowDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{site.expenseEntries} expense entries</span>
            </div>
          </Card>
          
          <Card className="p-5 bg-white hover-scale animate-fade-in">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Remaining Budget</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{formatCurrency(site.remaining)}</span>
                <div className="p-2 bg-green-100 rounded-full">
                  <ArrowUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{site.remainingPercentage}% remaining</span>
            </div>
          </Card>
          
          <Card className="p-5 bg-white hover-scale animate-fade-in">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Budget Utilization</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{site.utilization.toFixed(1)}%</span>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                <div 
                  className={`h-full rounded-full ${site.utilization < 30 ? 'bg-blue-500' : site.utilization < 70 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                  style={{ width: `${site.utilization}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-1">Expenses by Category</h3>
            <p className="text-sm text-gray-500 mb-4">Breakdown of expenses across different categories</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={site.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {site.expensesByCategory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, ``]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {site.expensesByCategory.map((category, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ 
                      backgroundColor: CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || COLORS[index % COLORS.length]
                    }}
                  ></div>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold mb-1">Budget Allocation</h3>
            <p className="text-sm text-gray-500 mb-4">How the budget is allocated across categories</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={site.budgetAllocation}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value: number, name: string, props: any) => CustomTooltipFormatter(value, name, props)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget Allocated" fill="#94a3b8" barSize={20} />
                  <Bar dataKey="spent" name="Amount Spent" fill="#3b82f6" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="bg-white p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Expenses</h3>
              <p className="text-sm text-gray-500">All expenses for {site.name}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-8 w-[200px] text-sm" 
                  placeholder="Search expenses..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 text-sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Category
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS] }}
                        ></div>
                        {expense.category}
                      </div>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={expense.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </MainLayout>
  );
};

export default SiteFinanceDetail;
