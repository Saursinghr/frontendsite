import axios from 'axios';

const API_URL = '/api';

// Employee interface for type safety
export interface Employee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  amount: number;
  companyCode?: string;
  additionalAmount?: number;
  status: 'Active' | 'Inactive';
  isAdminVerified?: boolean;
  assignedSite?: string[] | string; // Updated to support both array and string for backward compatibility
  joiningDate?: Date;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeFilters {
  status?: 'Active' | 'Inactive';
  position?: string;
  assignedSite?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Get all employees with optional filters
export const getTeamMembers = async (filters?: EmployeeFilters) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_URL}/employee${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    throw new Error(error.message || 'Failed to fetch team members');
  }
};

// Add new employee
export const addEmployee = async (employeeData: Omit<Employee, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'joiningDate'>) => {
  try {
    const response = await axios.post(`${API_URL}/employee/add`, employeeData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding employee:', error);
    throw new Error(error.response?.data?.message || 'Failed to add employee');
  }
};

// Update employee
export const editEmployee = async (id: string, employeeData: Partial<Employee>) => {
  try {
    const response = await axios.put(`${API_URL}/employee/update/${id}`, employeeData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating employee:', error);
    throw new Error(error.response?.data?.message || 'Failed to update employee');
  }
};

// Get employee by ID
export const getEmployeeById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/employee/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch employee');
  }
};

// Delete employee
export const deleteEmployee = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/employee/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete employee');
  }
};

// Toggle employee status (Active/Inactive)
export const toggleEmployeeStatus = async (id: string) => {
  try {
    const response = await axios.put(`${API_URL}/employee/${id}/toggle-status`);
    return response.data;
  } catch (error: any) {
    console.error('Error toggling employee status:', error);
    throw new Error(error.response?.data?.message || 'Failed to toggle employee status');
  }
};

// Get employee statistics
export const getEmployeeStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/employee/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employee statistics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch employee statistics');
  }
};

// Get all unique positions
export const getPositions = async () => {
  try {
    const response = await axios.get(`${API_URL}/employee/positions`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch positions');
  }
};

// Assign employee to site (legacy function for backward compatibility)
export const assignEmployeeToSite = async (employeeId: string, siteName: string) => {
  try {
    const response = await axios.put(`${API_URL}/employee/${employeeId}/assign-site`, {
      assignedSites: [siteName],
      action: 'replace'
    });
    return response.data;
  } catch (error: any) {
    console.error('Error assigning employee to site:', error);
    throw new Error(error.response?.data?.message || 'Failed to assign employee to site');
  }
};

// Assign employee to multiple sites
export const assignEmployeeToSites = async (employeeId: string, siteNames: string[], action: 'add' | 'remove' | 'replace' = 'replace') => {
  try {
    const response = await axios.put(`${API_URL}/employee/${employeeId}/assign-site`, {
      assignedSites: siteNames,
      action: action
    });
    return response.data;
  } catch (error: any) {
    console.error('Error assigning employee to sites:', error);
    throw new Error(error.response?.data?.message || 'Failed to assign employee to sites');
  }
};

// Legacy support for old API calls
export const getEmployees = getTeamMembers;
