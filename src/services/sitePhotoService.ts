import axios from 'axios';

const API_BASE_URL = '/api/site-photos';

export interface SitePhoto {
  _id: string;
  siteId: string;
  siteName: string;
  photoFile: string;
  name: string;
  description: string;
  uploadedBy: string;
  uploadDate: string;
  uploadTime: string;
  category: string;
  additionalInfo: string;
  tags: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SitePhotoStats {
  totalPhotos: number;
  thisMonth: number;
  categories: Record<string, number>;
  totalSize: number;
}

// Upload new site photo
export const uploadSitePhoto = async (photoData: FormData): Promise<SitePhoto> => {
  try {
    const response = await axios.post(API_BASE_URL, photoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload site photo');
  }
};

// Get all photos for a specific site
export const getSitePhotos = async (siteId: string): Promise<SitePhoto[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/site/${siteId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch site photos');
  }
};

// Get all site photos
export const getAllSitePhotos = async (): Promise<SitePhoto[]> => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch all site photos');
  }
};

// Update site photo by id
export const updateSitePhoto = async (id: string, updateData: Partial<SitePhoto>): Promise<SitePhoto> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update site photo');
  }
};

// Delete site photo by id
export const deleteSitePhoto = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete site photo');
  }
};

// Get photo statistics for a site
export const getSitePhotoStats = async (siteId: string): Promise<SitePhotoStats> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/site/${siteId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch site photo statistics');
  }
}; 