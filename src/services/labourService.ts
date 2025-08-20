import { API_BASE_URL } from '@/config';
import { 
  Labour, 
  CreateLabourData, 
  UpdateLabourData, 
  LabourResponse, 
  LabourFilters
} from '@/types/labour';

// Get all labour entries with optional filters
export const getLabour = async (filters?: LabourFilters): Promise<Labour[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.projectId) {
      queryParams.append('projectId', filters.projectId);
    }

    const url = `${API_BASE_URL}/labour${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch labour');
    }
    
    const data: LabourResponse = await response.json();
    return data.labour || [];
  } catch (error) {
    console.error('Error fetching labour:', error);
    throw error;
  }
};

// Get labour entry by ID
export const getLabourById = async (id: string): Promise<Labour> => {
  try {
    const response = await fetch(`${API_BASE_URL}/labour/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch labour');
    }
    
    const data: LabourResponse = await response.json();
    
    if (!data.labour) {
      throw new Error('Labour not found');
    }
    
    return data.labour;
  } catch (error) {
    console.error('Error fetching labour:', error);
    throw error;
  }
};

// Create new labour entry
export const createLabour = async (labourData: CreateLabourData): Promise<Labour> => {
  try {
    const response = await fetch(`${API_BASE_URL}/labour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labourData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create labour');
    }
    
    const data: LabourResponse = await response.json();
    
    if (!data.labour) {
      throw new Error('Failed to create labour');
    }
    
    return data.labour;
  } catch (error) {
    console.error('Error creating labour:', error);
    throw error;
  }
};

// Update labour entry
export const updateLabour = async (id: string, updateData: UpdateLabourData): Promise<Labour> => {
  try {
    const response = await fetch(`${API_BASE_URL}/labour/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update labour');
    }
    
    const data: LabourResponse = await response.json();
    
    if (!data.labour) {
      throw new Error('Failed to update labour');
    }
    
    return data.labour;
  } catch (error) {
    console.error('Error updating labour:', error);
    throw error;
  }
};

// Delete labour entry
export const deleteLabour = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/labour/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete labour');
    }
  } catch (error) {
    console.error('Error deleting labour:', error);
    throw error;
  }
}; 