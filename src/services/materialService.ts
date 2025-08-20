import { API_BASE_URL } from '@/config';
import { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  MaterialResponse, 
  MaterialFilters
} from '@/types/material';

// Get all materials with optional filters
export const getMaterials = async (filters?: MaterialFilters): Promise<Material[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters?.projectId) {
      queryParams.append('projectId', filters.projectId);
    }

    const url = `${API_BASE_URL}/materials${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    
    const data: MaterialResponse = await response.json();
    return data.materials || [];
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Get material by ID
export const getMaterialById = async (id: string): Promise<Material> => {
  try {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch material');
    }
    
    const data: MaterialResponse = await response.json();
    
    if (!data.material) {
      throw new Error('Material not found');
    }
    
    return data.material;
  } catch (error) {
    console.error('Error fetching material:', error);
    throw error;
  }
};

// Create new material
export const createMaterial = async (materialData: CreateMaterialData): Promise<Material> => {
  try {
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create material');
    }
    
    const data: MaterialResponse = await response.json();
    
    if (!data.material) {
      throw new Error('Failed to create material');
    }
    
    return data.material;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

// Update material
export const updateMaterial = async (id: string, updateData: UpdateMaterialData): Promise<Material> => {
  try {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update material');
    }
    
    const data: MaterialResponse = await response.json();
    
    if (!data.material) {
      throw new Error('Failed to update material');
    }
    
    return data.material;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};



// Delete material
export const deleteMaterial = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete material');
    }
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
}; 