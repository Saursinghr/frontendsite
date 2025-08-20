import axios from 'axios';

const API_URL = '/api/inventory';

export const getAllInventory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addInventoryMaterial = async (material) => {
  // Map frontend fields to backend fields and ensure all required fields are present
  const payload = {
    MaterialName: material.name,
    MaterialType: material.type,
    Quantity: Number(material.quantity),
    Unit: Number(material.unit),
    LowStockThreshold: Number(material.lowStockThreshold),
    TargetStockLevel: Number(material.targetStockLevel),
    VendorSupplier: material.vendor || '',
    StorageLocation: material.location || '',
    Description: material.description || '',
  };
  const response = await axios.post(API_URL, payload);
  return response.data;
};

// Remove material from inventory
export const removeInventoryMaterial = async (materialId: string, quantity: number, description?: string) => {
  const response = await axios.post(`${API_URL}/remove`, {
    materialId,
    quantity,
    description
  });
  return response.data;
};

// Transaction History APIs
export const getAllTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data;
};

export const getTransactionsByDate = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_URL}/transactions/date`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getTransactionsByMaterial = async (materialName: string) => {
  const response = await axios.get(`${API_URL}/transactions`, {
    params: { materialName }
  });
  return response.data;
};

export const getTransactionsByProject = async (projectId: string) => {
  const response = await axios.get(`${API_URL}/transactions/project/${projectId}`);
  return response.data;
}; 