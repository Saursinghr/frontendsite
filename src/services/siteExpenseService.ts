import axios from 'axios';

export interface SiteExpenseDocument {
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface SiteExpense {
  _id?: string;
  name: string;
  description: string;
  amount: number;
  addedBy: string;
  date: string;
  documents: SiteExpenseDocument[];
  site: string;
}

export interface SiteExpenseFormData {
  name: string;
  description: string;
  amount: number;
  addedBy: string;
  date: string;
  site: string;
  documents?: File[];
}

const API_URL = '/api/site-expenses';

export const getSiteExpenses = async (siteId: string): Promise<SiteExpense[]> => {
  const response = await axios.get(`${API_URL}/${siteId}`);
  return response.data;
};

export const addSiteExpense = async (expenseData: SiteExpenseFormData): Promise<SiteExpense> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('name', expenseData.name);
  formData.append('description', expenseData.description);
  formData.append('amount', expenseData.amount.toString());
  formData.append('addedBy', expenseData.addedBy);
  formData.append('date', expenseData.date);
  formData.append('site', expenseData.site);
  
  // Add files if any
  if (expenseData.documents) {
    expenseData.documents.forEach((file, index) => {
      formData.append('documents', file);
    });
  }

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateSiteExpense = async (id: string, expense: Partial<SiteExpense>): Promise<SiteExpense> => {
  const response = await axios.put(`${API_URL}/${id}`, expense);
  return response.data;
};

export const deleteSiteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const downloadSiteExpenseDocument = async (expenseId: string, documentIndex: number): Promise<Blob> => {
  try {
    const response = await axios.get(`${API_URL}/${expenseId}/document/${documentIndex}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download document');
  }
}; 