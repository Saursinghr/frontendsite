import axios from 'axios';

const API_BASE_URL = '/api';

export interface SiteReportData {
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

export interface ReportResponse {
  success: boolean;
  data: SiteReportData;
  message?: string;
}

export const generateSiteReport = async (
  siteId: string, 
  startDate?: string, 
  endDate?: string
): Promise<SiteReportData> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }
    
    const params = new URLSearchParams();
    params.append('siteId', siteId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axios.get(`${API_BASE_URL}/report/site-report?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to generate report');
    }
  } catch (error) {
    console.error('Error generating site report:', error);
    throw error;
  }
};
