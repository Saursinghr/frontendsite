import { API_BASE_URL } from '@/config';
import { 
  Milestone, 
  CreateMilestoneData, 
  UpdateMilestoneData, 
  MilestoneResponse, 
  MilestoneFilters 
} from '@/types/milestone';

// Get all milestones with optional filters
export const getMilestones = async (filters?: MilestoneFilters): Promise<Milestone[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.projectId) {
      queryParams.append('projectId', filters.projectId);
    }
    
    if (filters?.status) {
      queryParams.append('status', filters.status);
    }

    const url = `${API_BASE_URL}/milestones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch milestones');
    }
    
    const data: MilestoneResponse = await response.json();
    return data.milestones || [];
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

// Get milestone by ID
export const getMilestoneById = async (id: string): Promise<Milestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch milestone');
    }
    
    const data: MilestoneResponse = await response.json();
    
    if (!data.milestone) {
      throw new Error('Milestone not found');
    }
    
    return data.milestone;
  } catch (error) {
    console.error('Error fetching milestone:', error);
    throw error;
  }
};

// Create new milestone
export const createMilestone = async (milestoneData: CreateMilestoneData): Promise<Milestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(milestoneData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create milestone');
    }
    
    const data: MilestoneResponse = await response.json();
    
    if (!data.milestone) {
      throw new Error('Failed to create milestone');
    }
    
    return data.milestone;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

// Update milestone
export const updateMilestone = async (id: string, updateData: UpdateMilestoneData): Promise<Milestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update milestone');
    }
    
    const data: MilestoneResponse = await response.json();
    
    if (!data.milestone) {
      throw new Error('Failed to update milestone');
    }
    
    return data.milestone;
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

// Update milestone progress
export const updateMilestoneProgress = async (id: string, progress: number): Promise<Milestone> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update milestone progress');
    }
    
    const data: MilestoneResponse = await response.json();
    
    if (!data.milestone) {
      throw new Error('Failed to update milestone progress');
    }
    
    return data.milestone;
  } catch (error) {
    console.error('Error updating milestone progress:', error);
    throw error;
  }
};

// Delete milestone
export const deleteMilestone = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/milestones/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete milestone');
    }
  } catch (error) {
    console.error('Error deleting milestone:', error);
    throw error;
  }
}; 