import axios from 'axios';

export interface Finance {
  siteId: string;
  siteName: string;
  category: string;
  date: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  description?: string;
  notes?: string;
  _id?: string;
}

export interface ExtraFinance {
  _id?: string;
  siteId: string;
  date: string;
  name: string;
  transferred: number;
  received: number;
  remaining: number;
  percentage: number;
  receivableAmount: number;
  paymentLogs?: Array<{
    amount: number;
    date: string;
    paidBy: string;
    notes?: string;
  }>;
}

const API_URL = '/api/finance';
const EXTRA_FINANCE_API_URL = '/api/finance/extra-finance';

export const addFinance = async (finance: Finance) => {
  try {
    const response = await axios.post(API_URL, finance);
    return response.data;
  } catch (error) {
    console.error('Error adding finance:', error);
    throw error;
  }
};

export const updateFinance = async (id: string, finance: Partial<Finance>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, finance);
    return response.data;
  } catch (error) {
    console.error('Error updating finance:', error);
    throw error;
  }
};

export const deleteFinance = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting finance:', error);
    throw error;
  }
};

export const getFinances = async (siteId?: string): Promise<Finance[]> => {
  try {
    const params = siteId ? { siteId } : {};
    const response = await axios.get(API_URL, { params });
    
    // Check if response is valid
    if (response.status !== 200) {
      console.error('API Error:', response.status, response.statusText);
      return [];
    }
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.finances)) {
      return response.data.finances;
    } else if (response.data && typeof response.data === 'object') {
      console.error('Unexpected response format:', response.data);
      return [];
    } else {
      console.error('Invalid response data:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching finances:', error);
    return [];
  }
};

export const addExtraFinance = async (data: Omit<ExtraFinance, '_id'>) => {
  try {
    const response = await axios.post(EXTRA_FINANCE_API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error adding extra finance:', error);
    throw error;
  }
};

export const getExtraFinances = async (siteId?: string): Promise<ExtraFinance[]> => {
  try {
    const params = siteId ? { siteId } : {};
    const response = await axios.get(EXTRA_FINANCE_API_URL, { params });
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (Array.isArray(response.data.extraFinances)) {
      return response.data.extraFinances;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching extra finances:', error);
    return [];
  }
};

export const updateExtraFinance = async (id: string, data: Partial<ExtraFinance>) => {
  try {
    const response = await axios.put(`${EXTRA_FINANCE_API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating extra finance:', error);
    throw error;
  }
};

export const deleteExtraFinance = async (id: string) => {
  try {
    const response = await axios.delete(`${EXTRA_FINANCE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting extra finance:', error);
    throw error;
  }
}; 

export const getFinanceSummary = async (siteId?: string) => {
  try {
    const params = siteId ? { siteId } : {};
    const response = await axios.get(`${API_URL}/summary`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching finance summary:', error);
    return {
      totalAmount: 0,
      totalRecords: 0,
      averageAmount: 0,
      categorySummary: {},
      monthlyData: {},
      siteFilter: 'all'
    };
  }
}; 

export const addPaymentLog = async (id: string, data: { amount: number; paidBy: string; notes?: string; date?: Date }) => {
  try {
    const response = await axios.post(`${EXTRA_FINANCE_API_URL}/${id}/payment-log`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding payment log:', error);
    throw error;
  }
}; 