import axios from 'axios';

const API_URL = '/api';

export interface ProcurementStats {
  totalRequests: number;
  pending: number;
  approved: number;
  delivered: number;
}

export interface ProcurementRequest {
  _id: string;
  ItemName: string;
  Quantity: number;
  Vendor: string;
  RequestDate: string;
  DeliveryDate: string;
  Priority: 'Low' | 'Medium' | 'High';
  Status?: 'pending' | 'approved' | 'delivered' | 'cancelled' | 'in_transit';
  siteId?: string;
  vendorRating?: number;
  deliveryTracking?: string;
  notes?: string;
  cost?: number;
}

// Get procurement statistics
export const getProcurementStats = async (siteId?: string): Promise<ProcurementStats> => {
  try {
    const params = siteId ? { siteId } : {};
    const response = await axios.get(`${API_URL}/purchase/stats`, { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching procurement stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch procurement statistics');
  }
};

// Get all procurement requests
export const getAllProcurements = async (siteId?: string): Promise<ProcurementRequest[]> => {
  try {
    const params = siteId ? { siteId } : {};
    const response = await axios.get(`${API_URL}/purchase/all`, { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching procurements:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch procurement requests');
  }
};

// Update procurement status
export const updateProcurementStatus = async (id: string, status: 'pending' | 'approved' | 'delivered' | 'cancelled' | 'in_transit') => {
  try {
    const response = await axios.patch(`${API_URL}/purchase/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error('Error updating procurement status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update procurement status');
  }
};

// Create a new procurement request
export const createProcurement = async (data: {
  ItemName: string;
  Quantity: number;
  Vendor: string;
  RequestDate: string;
  DeliveryDate: string;
  Priority?: string;
  Unit?: string;
  Budget?: number;
  Description?: string;
  AdditionalNotes?: string;
  siteId?: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/purchase`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating procurement:', error);
    throw new Error(error.response?.data?.message || 'Failed to create procurement request');
  }
};

export const updateProcurement = async (id: string, data: Partial<ProcurementRequest>) => {
  try {
    const response = await axios.put(`${API_URL}/purchase/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating procurement:', error);
    throw new Error(error.response?.data?.message || 'Failed to update procurement request');
  }
};