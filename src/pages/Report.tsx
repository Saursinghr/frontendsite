import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  DollarSign, 
  CheckCircle,
  Building2,
  Download,
  FileText,
  RefreshCw,
  TrendingUp,
  Calendar,
  CalendarDays
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllSites, SiteResponse } from '@/services/siteService';
import { generateSiteReport as generateRealSiteReport, SiteReportData as RealSiteReportData } from '@/services/reportService';

interface SiteReportData {
  siteId: string;
  siteName: string;
  attendance: {
    totalWorkers: number;
    presentToday: number;
    absentToday: number;
    attendanceRate: number;
    weeklyTrend: Array<{ date: string; present: number; absent: number }>;
  };
  labor: {
    totalLabor: number;
    masons: number;
    helpers: number;
    totalHours: number;
    laborCost: number;
  };
  materials: {
    totalMaterials: number;
    totalQuantity: number;
    totalCost: number;
    materialBreakdown: Array<{ name: string; quantity: number; cost: number }>;
  };
  expenses: {
    totalExpenses: number;
    totalExpenseCount: number;
    expenseBreakdown: Array<{ category: string; amount: number; count: number }>;
    monthlyExpenses: Array<{ month: string; amount: number }>;
  };
  tasks: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    completionRate: number;
    taskBreakdown: Array<{ status: string; count: number; color: string }>;
  };
}

const Reports = () => {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [reportData, setReportData] = useState<SiteReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchSites();
    // Show demo data immediately
    generateDemoReport();
  }, []);

  useEffect(() => {
    if (id && sites.length > 0) {
      const site = sites.find(site => site._id === id);
      if (site) {
        setSelectedSite(site);
      }
    }
  }, [id, sites]);

  useEffect(() => {
    if (selectedSite) {
      generateSiteReport(selectedSite._id, startDate, endDate);
    } else {
      generateDemoReport();
    }
  }, [selectedSite, startDate, endDate]);

  const handleDateRangeChange = () => {
    if (selectedSite) {
      generateSiteReport(selectedSite._id, startDate, endDate);
    }
  };

  const handleSelectSite = (siteId: string) => {
    const site = sites.find(s => s._id === siteId);
    if (site) {
      setSelectedSite(site);
      // Generate real report data for selected site
      generateSiteReport(siteId, startDate, endDate);
    }
  };

  const handleChangeSite = () => {
    setSelectedSite(null);
    setSelectedCard(null);
    generateDemoReport();
  };

  const generateDemoReport = () => {
    setIsLoading(true);
    const demoReport: SiteReportData = {
      siteId: 'demo',
      siteName: 'Demo Site',
      attendance: {
        totalWorkers: 15,
        presentToday: 12,
        absentToday: 3,
        attendanceRate: 80,
        weeklyTrend: [
          { date: 'Mon', present: 12, absent: 3 },
          { date: 'Tue', present: 14, absent: 1 },
          { date: 'Wed', present: 13, absent: 2 },
          { date: 'Thu', present: 15, absent: 0 },
          { date: 'Fri', present: 11, absent: 4 },
          { date: 'Sat', present: 8, absent: 7 },
          { date: 'Sun', present: 0, absent: 15 }
        ]
      },
      labor: {
        totalLabor: 30,
        masons: 12,
        helpers: 18,
        totalHours: 450,
        laborCost: 225000
      },
      materials: {
        totalMaterials: 8,
        totalQuantity: 1500,
        totalCost: 180000,
        materialBreakdown: [
          { name: 'Cement', quantity: 500, cost: 25000 },
          { name: 'Steel', quantity: 200, cost: 80000 },
          { name: 'Bricks', quantity: 10000, cost: 50000 },
          { name: 'Sand', quantity: 100, cost: 15000 },
          { name: 'Aggregate', quantity: 150, cost: 20000 }
        ]
      },
      expenses: {
        totalExpenses: 265000,
        totalExpenseCount: 8,
        expenseBreakdown: [
          { category: 'Materials', amount: 106000, count: 3 },
          { category: 'Labor', amount: 79500, count: 2 },
          { category: 'Equipment', amount: 53000, count: 2 },
          { category: 'Other', amount: 26500, count: 1 }
        ],
        monthlyExpenses: [
          { month: 'Jan', amount: 39750 },
          { month: 'Feb', amount: 47700 },
          { month: 'Mar', amount: 58300 },
          { month: 'Apr', amount: 53000 },
          { month: 'May', amount: 39750 },
          { month: 'Jun', amount: 26500 }
        ]
      },
      tasks: {
        totalTasks: 6,
        completedTasks: 2,
        inProgressTasks: 2,
        pendingTasks: 2,
        completionRate: 33,
        taskBreakdown: [
          { status: 'Completed', count: 2, color: '#10b981' },
          { status: 'In Progress', count: 2, color: '#f59e0b' },
          { status: 'Pending', count: 2, color: '#ef4444' }
        ]
      }
    };
    setReportData(demoReport);
    setIsLoading(false);
  };

  const fetchSites = async () => {
    try {
      const sitesData = await getAllSites();
      setSites(sitesData);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const generateSiteReport = async (siteId: string, start?: string, end?: string) => {
    setIsLoading(true);
    try {
      // Fetch real data from API
      const realReportData = await generateRealSiteReport(siteId, start, end);
      setReportData(realReportData);
    } catch (error) {
      console.error('Error fetching real report data:', error);
      // Generate empty report data instead of null
      const emptyReportData: SiteReportData = {
        siteId,
        siteName: selectedSite?.siteName || 'Unknown Site',
        attendance: {
          totalWorkers: 0,
          presentToday: 0,
          absentToday: 0,
          attendanceRate: 0,
          weeklyTrend: [
            { date: 'Mon', present: 0, absent: 0 },
            { date: 'Tue', present: 0, absent: 0 },
            { date: 'Wed', present: 0, absent: 0 },
            { date: 'Thu', present: 0, absent: 0 },
            { date: 'Fri', present: 0, absent: 0 },
            { date: 'Sat', present: 0, absent: 0 },
            { date: 'Sun', present: 0, absent: 0 }
          ]
        },
        labor: {
          totalLabor: 0,
          masons: 0,
          helpers: 0,
          totalHours: 0,
          laborCost: 0
        },
        materials: {
          totalMaterials: 0,
          totalQuantity: 0,
          totalCost: 0,
          materialBreakdown: []
        },
        expenses: {
          totalExpenses: 0,
          totalExpenseCount: 0,
          expenseBreakdown: [],
          monthlyExpenses: [
            { month: 'Jan', amount: 0 },
            { month: 'Feb', amount: 0 },
            { month: 'Mar', amount: 0 },
            { month: 'Apr', amount: 0 },
            { month: 'May', amount: 0 },
            { month: 'Jun', amount: 0 }
          ]
        },
        tasks: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          pendingTasks: 0,
          completionRate: 0,
          taskBreakdown: [
            { status: 'Completed', count: 0, color: '#10b981' },
            { status: 'In Progress', count: 0, color: '#f59e0b' },
            { status: 'Pending', count: 0, color: '#ef4444' }
          ]
        }
      };
      setReportData(emptyReportData);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`${reportData.siteName} - Site Report`, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, pageWidth - 14, 30, { align: 'right' });
    
    let yPosition = 40;
    
    // Summary Cards
    doc.setFontSize(14);
    doc.text('Summary', 14, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text(`Attendance Rate: ${reportData.attendance.attendanceRate}%`, 14, yPosition);
    yPosition += 7;
    doc.text(`Total Labor: ${reportData.labor.totalLabor} workers`, 14, yPosition);
    yPosition += 7;
    doc.text(`Materials Used: ${reportData.materials.totalMaterials} types`, 14, yPosition);
    yPosition += 7;
    doc.text(`Total Expenses: ₹${reportData.expenses.totalExpenses.toLocaleString()}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Task Completion: ${reportData.tasks.completionRate}%`, 14, yPosition);
    yPosition += 15;
    
    // Detailed Sections
    doc.setFontSize(14);
    doc.text('Detailed Breakdown', 14, yPosition);
    yPosition += 15;
    
    // Attendance Details
    doc.setFontSize(12);
    doc.text('Attendance:', 14, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(`Total Workers: ${reportData.attendance.totalWorkers}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Present Today: ${reportData.attendance.presentToday}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Absent Today: ${reportData.attendance.absentToday}`, 20, yPosition);
    yPosition += 10;
    
    // Labor Details
    doc.setFontSize(12);
    doc.text('Labor:', 14, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(`Masons: ${reportData.labor.masons}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Helpers: ${reportData.labor.helpers}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Total Hours: ${reportData.labor.totalHours}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Labor Cost: ₹${reportData.labor.laborCost.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    
    // Materials Details
    doc.setFontSize(12);
    doc.text('Materials:', 14, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(`Total Cost: ₹${reportData.materials.totalCost.toLocaleString()}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Total Quantity: ${reportData.materials.totalQuantity}`, 20, yPosition);
    yPosition += 10;
    
    // Tasks Details
    doc.setFontSize(12);
    doc.text('Tasks:', 14, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.text(`Completed: ${reportData.tasks.completedTasks}`, 20, yPosition);
    yPosition += 5;
    doc.text(`In Progress: ${reportData.tasks.inProgressTasks}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Pending: ${reportData.tasks.pendingTasks}`, 20, yPosition);
    
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on ${format(new Date(), 'PPPpp')}`, pageWidth / 2, footerY, { align: 'center' });
    
    doc.save(`${reportData.siteName}-site-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const renderSummaryCards = () => {
    if (!reportData) return null;

    const summaryCards = [
      {
        id: 'attendance',
        title: 'Attendance',
        value: `${reportData.attendance.attendanceRate}%`,
        subtitle: `${reportData.attendance.presentToday}/${reportData.attendance.totalWorkers} present today`,
        icon: Users,
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      },
      {
        id: 'labor',
        title: 'Total Labor',
        value: reportData.labor.totalLabor.toString(),
        subtitle: `${reportData.labor.masons} masons, ${reportData.labor.helpers} helpers`,
        icon: Users,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      {
        id: 'materials',
        title: 'Materials Used',
        value: reportData.materials.totalMaterials.toString(),
        subtitle: `₹${reportData.materials.totalCost.toLocaleString()} total cost`,
        icon: Package,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
      },
      {
        id: 'expenses',
        title: 'Total Expenses',
        value: `₹${reportData.expenses.totalExpenses.toLocaleString()}`,
        subtitle: `${reportData.expenses.totalExpenseCount} expense entries`,
        icon: DollarSign,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-600'
      },
      {
        id: 'tasks',
        title: 'Complete Tasks',
        value: `${reportData.tasks.completionRate}%`,
        subtitle: `${reportData.tasks.completedTasks}/${reportData.tasks.totalTasks} tasks completed`,
        icon: CheckCircle,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`hover:shadow-lg transition-shadow border-0 shadow-sm cursor-pointer ${
                selectedCard === card.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon size={24} className={card.textColor} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCharts = () => {
    if (!reportData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Weekly Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reportData.attendance.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Task Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.tasks.taskBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.tasks.taskBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.expenses.monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Material Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Material Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.materials.materialBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!reportData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Attendance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Workers:</span>
                <span className="font-medium">{reportData.attendance.totalWorkers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Present Today:</span>
                <span className="font-medium text-green-600">{reportData.attendance.presentToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Absent Today:</span>
                <span className="font-medium text-red-600">{reportData.attendance.absentToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate:</span>
                <span className="font-medium">{reportData.attendance.attendanceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labor Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Labor Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Labor:</span>
                <span className="font-medium">{reportData.labor.totalLabor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Masons:</span>
                <span className="font-medium">{reportData.labor.masons}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Helpers:</span>
                <span className="font-medium">{reportData.labor.helpers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Hours:</span>
                <span className="font-medium">{reportData.labor.totalHours}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Labor Cost:</span>
                <span className="font-medium">₹{reportData.labor.laborCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={20} />
              Materials Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Materials:</span>
                <span className="font-medium">{reportData.materials.totalMaterials}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Quantity:</span>
                <span className="font-medium">{reportData.materials.totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Cost:</span>
                <span className="font-medium">₹{reportData.materials.totalCost.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {reportData.materials.materialBreakdown.map((material, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{material.name}</span>
                  <span className="text-sm">₹{material.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign size={20} />
              Expenses Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Expenses:</span>
                <span className="font-medium">₹{reportData.expenses.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Entries:</span>
                <span className="font-medium">{reportData.expenses.totalExpenseCount}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {reportData.expenses.expenseBreakdown.map((expense, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{expense.category}</span>
                  <span className="text-sm">₹{expense.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Tasks Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks:</span>
                <span className="font-medium">{reportData.tasks.totalTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{reportData.tasks.completedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress:</span>
                <span className="font-medium text-yellow-600">{reportData.tasks.inProgressTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="font-medium text-red-600">{reportData.tasks.pendingTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <span className="font-medium">{reportData.tasks.completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSelectedCardDetails = () => {
    if (!reportData || !selectedCard) return null;

    switch (selectedCard) {
      case 'attendance':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Attendance Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Attendance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Workers:</span>
                      <span className="font-medium">{reportData.attendance.totalWorkers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Present Today:</span>
                      <span className="font-medium text-green-600">{reportData.attendance.presentToday}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Absent Today:</span>
                      <span className="font-medium text-red-600">{reportData.attendance.absentToday}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance Rate:</span>
                      <span className="font-medium">{reportData.attendance.attendanceRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Weekly Attendance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportData.attendance.weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 'labor':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Labor Details</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Labor Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Labor:</span>
                    <span className="font-medium">{reportData.labor.totalLabor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Masons:</span>
                    <span className="font-medium">{reportData.labor.masons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Helpers:</span>
                    <span className="font-medium">{reportData.labor.helpers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Hours:</span>
                    <span className="font-medium">{reportData.labor.totalHours}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Labor Cost:</span>
                    <span className="font-medium">₹{reportData.labor.laborCost.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'materials':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Materials Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={20} />
                    Materials Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Materials:</span>
                      <span className="font-medium">{reportData.materials.totalMaterials}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Quantity:</span>
                      <span className="font-medium">{reportData.materials.totalQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Cost:</span>
                      <span className="font-medium">₹{reportData.materials.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {reportData.materials.materialBreakdown.map((material, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{material.name}</span>
                        <span className="text-sm">₹{material.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Material Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.materials.materialBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 'expenses':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Expenses Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign size={20} />
                    Expenses Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Expenses:</span>
                      <span className="font-medium">₹{reportData.expenses.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Entries:</span>
                      <span className="font-medium">{reportData.expenses.totalExpenseCount}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {reportData.expenses.expenseBreakdown.map((expense, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{expense.category}</span>
                        <span className="text-sm">₹{expense.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.expenses.monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 'tasks':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Tasks Details</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle size={20} />
                    Tasks Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Tasks:</span>
                      <span className="font-medium">{reportData.tasks.totalTasks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed:</span>
                      <span className="font-medium text-green-600">{reportData.tasks.completedTasks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">In Progress:</span>
                      <span className="font-medium text-yellow-600">{reportData.tasks.inProgressTasks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="font-medium text-red-600">{reportData.tasks.pendingTasks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completion Rate:</span>
                      <span className="font-medium">{reportData.tasks.completionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Task Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.tasks.taskBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {reportData.tasks.taskBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderDateRange = () => {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays size={20} />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleDateRangeChange}
                className="w-full"
                disabled={isLoading}
              >
                <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Update Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Site Report` : 'Site Reports'}
          showSiteSelector={!selectedSite}
          selectedSite={selectedSite?._id}
          sites={sites}
          onSelectSite={handleSelectSite}
          onChangeSite={handleChangeSite}
        />

        <main className="flex-1 overflow-auto p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header Section */}
            <motion.div variants={childVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Site Report</h1>
                <p className="text-gray-600 mt-1">
                  {selectedSite
                    ? `Comprehensive report for ${selectedSite.siteName} (${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd, yyyy')})`
                    : reportData?.siteName === 'Demo Site'
                    ? 'Demo report - Select a site to view real data'
                    : 'Select a site to view detailed reports'}
                </p>
                                 {reportData?.siteName === 'Demo Site' && (
                   <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                     <p className="text-sm text-blue-700">
                       💡 This is demo data. Select a site from the dropdown above to view real project data.
                     </p>
                   </div>
                 )}
                                   {selectedSite && reportData?.siteName !== 'Demo Site' && reportData?.attendance.totalWorkers > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">
                        ✅ Real data loaded from database for {selectedSite.siteName}
                      </p>
                    </div>
                  )}
                  {selectedSite && reportData?.siteName !== 'Demo Site' && reportData?.attendance.totalWorkers === 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-700">
                        ⚠️ No data found for {selectedSite.siteName}. This may be due to authentication issues or no data in the selected date range.
                      </p>
                    </div>
                  )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => selectedSite ? generateSiteReport(selectedSite._id) : generateDemoReport()}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                  Refresh
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download size={16} />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <FileText size={16} className="mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Site Selection */}
            {!selectedSite && (
              <motion.div variants={childVariants} className="bg-white rounded-lg border p-6">
                <div className="text-center">
                  <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Select a Site</h3>
                  <p className="mt-1 text-sm text-gray-500 mb-4">
                    Choose a site from the dropdown above to view its comprehensive report
                  </p>
                  {sites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      {sites.slice(0, 6).map((site) => (
                        <Card 
                          key={site._id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedSite(site)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Building2 size={24} className="text-blue-500" />
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900">{site.siteName}</h4>
                                <p className="text-sm text-gray-500">{site.siteCode}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-700">
                        No sites available. Please add some sites first.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Report Content */}
            {(selectedSite || reportData) && (
              <>
                {renderDateRange()}
                
                {/* Summary Cards */}
                <motion.div variants={childVariants}>
                  {renderSummaryCards()}
                </motion.div>

                {/* Selected Card Details */}
                {selectedCard && (
                  <motion.div variants={childVariants}>
                    {renderSelectedCardDetails()}
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center py-12"
                  >
                    <div className="text-center">
                      <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-900">Generating Report</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Please wait while we compile your data...
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </main>
      </div>
    </MainLayout>
  );
};

export default Reports;