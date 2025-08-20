import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Document {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category: 'Contract' | 'Invoice' | 'Permit' | 'Blueprint' | 'Report' | 'Other';
  projectId: {
    _id: string;
    siteName: string;
    siteCode: string;
  };
  uploadedBy: string;
  tags: string[];
  status: 'Active' | 'Archived' | 'Deleted';
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  category?: string;
  projectId: string;
  uploadedBy: string;
  tags?: string[];
}

export interface DocumentFilters {
  projectId?: string;
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  byCategory: Array<{
    _id: string;
    count: number;
    totalSize: number;
  }>;
}

// Upload document with file
export const uploadDocument = async (formData: FormData): Promise<{ message: string; document: Document }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload document');
  }
};

// Get all documents with filters
export const getDocuments = async (filters: DocumentFilters = {}): Promise<{
  message: string;
  documents: Document[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    documentsPerPage: number;
  };
}> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await axios.get(`${API_BASE_URL}/document?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

// Get document by ID
export const getDocumentById = async (id: string): Promise<{ message: string; document: Document }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch document');
  }
};

// Download document file
export const downloadDocument = async (id: string): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/document/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download document');
  }
};

// Update document metadata
export const updateDocument = async (id: string, data: Partial<DocumentUploadData>): Promise<{ message: string; document: Document }> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/document/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update document');
  }
};

// Delete document (soft delete)
export const deleteDocument = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/document/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete document');
  }
};

// Get document statistics
export const getDocumentStats = async (projectId?: string): Promise<{ message: string; stats: DocumentStats }> => {
  try {
    const params = projectId ? `?projectId=${projectId}` : '';
    const response = await axios.get(`${API_BASE_URL}/document/stats${params}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch document statistics');
  }
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file icon based on mime type
export const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'docx';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'xlsx';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('text')) return 'text';
  return 'file';
}; 