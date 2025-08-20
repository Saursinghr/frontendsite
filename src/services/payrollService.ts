import axios from 'axios';

const API_BASE_URL = '/api/payroll';

export interface Payment {
  _id?: string;
  date: string;
  amount: number;
  type: 'salary' | 'advance';
  notes: string;
}

export interface PayrollData {
  _id?: string;
  employeeId: string;
  employeeName: string;
  monthlySalary: number;
  totalAdvance: number;
  payments: Payment[];
  status: 'active' | 'inactive';
}

// Get all payrolls
export const getAllPayrolls = async (): Promise<PayrollData[]> => {
  try {
    console.log('Fetching all payrolls from:', API_BASE_URL);
    const response = await axios.get(API_BASE_URL);
    console.log('All payrolls response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    return [];
  }
};

// Get payroll by employee ID
export const getPayrollByEmployee = async (employeeId: string): Promise<PayrollData | null> => {
  try {
    console.log('Fetching payroll for employee:', employeeId);
    const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
    console.log('Payroll by employee response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching payroll for employee:', employeeId, error);
    return null;
  }
};

// Create or update payroll for employee
export const createOrUpdatePayroll = async (data: {
  employeeId: string;
  monthlySalary: number;
  totalAdvance: number;
}): Promise<PayrollData | null> => {
  try {
    console.log('Creating/updating payroll with data:', data);
    const response = await axios.post(`${API_BASE_URL}/employee`, data);
    console.log('Create/update payroll response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating/updating payroll:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    return null;
  }
};

// Add payment to payroll
export const addPayment = async (employeeId: string, data: {
  amount: number;
  type: 'salary' | 'advance';
  notes?: string;
  date?: string;
}): Promise<PayrollData | null> => {
  try {
    console.log('Adding payment for employee:', employeeId, 'with data:', data);
    const response = await axios.post(`${API_BASE_URL}/employee/${employeeId}/payment`, data);
    console.log('Add payment response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error adding payment:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
    }
    return null;
  }
};

// Get payment history for employee
export const getPaymentHistory = async (employeeId: string): Promise<Payment[]> => {
  try {
    console.log('Fetching payment history for employee:', employeeId);
    const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}/payments`);
    console.log('Payment history response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }
};

// Delete payment
export const deletePayment = async (employeeId: string, paymentId: string): Promise<boolean> => {
  try {
    console.log('Deleting payment:', paymentId, 'for employee:', employeeId);
    await axios.delete(`${API_BASE_URL}/employee/${employeeId}/payment/${paymentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting payment:', error);
    return false;
  }
};
