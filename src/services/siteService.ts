import axios from 'axios';

const API_BASE_URL = '/api/dashboard';

export interface Site {
  _id?: string;
  siteName: string;
  siteCode: string;
  address: string;
  estimatedBudget: number;
  teamSize: number;
  startDate: string;
  endDate: string;
  assignedUsers?: string[];
}

export interface SiteResponse {
  _id: string;
  siteName: string;
  siteCode: string;
  address: string;
  estimatedBudget: number;
  teamSize: number;
  startDate: string;
  endDate: string;
  assignedUsers?: string[];
}

// Get all sites
export const getAllSites = async (): Promise<SiteResponse[]> => {
  try {
    const response = await axios.get(API_BASE_URL);
    
    // Check if response is valid
    if (response.status !== 200) {
      console.error('API Error:', response.status, response.statusText);
      return [];
    }
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.sites)) {
      return response.data.sites;
    } else {
      console.error('Invalid response data:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalSites: 0,
      activeProjects: 0,
      totalBudget: 0,
      totalTeamMembers: 0
    };
  }
};

// Add new site
export const addNewSite = async (siteData: Site): Promise<SiteResponse> => {
  try {
    const response = await axios.post(API_BASE_URL, siteData);
    return response.data;
  } catch (error) {
    console.error('Error adding site:', error);
    throw error;
  }
};

// Get site by ID
export const getSiteById = async (siteId: string): Promise<SiteResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${siteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching site:', error);
    throw error;
  }
};

// Update site's assignedUsers
export const updateSiteAssignedUsers = async (siteId: string, employeeId: string, action: 'add' | 'remove'): Promise<SiteResponse> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${siteId}/assigned-users`, {
      employeeId,
      action
    });
    return response.data.site;
  } catch (error) {
    console.error('Error updating site assigned users:', error);
    throw error;
  }
};