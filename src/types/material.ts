export interface Material {
  _id?: string;
  material: string;
  quantity: string;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockLevel: string;
  date: string;
  projectId: string;
  purpose?: string;
  storageLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialData {
  material: string;
  quantity: string;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockLevel: string;
  date?: string;
  projectId?: string;
  purpose?: string;
  storageLocation?: string;
}

export interface UpdateMaterialData {
  material?: string;
  quantity?: string;
  unit?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockLevel?: string;
  purpose?: string;
  storageLocation?: string;
  projectId?: string;
  name?: string;
  type?: string;
  cost?: number;
  supplier?: string;
  dateReceived?: string;
  lowStockThreshold?: number;
  description?: string;
}

export interface MaterialResponse {
  message: string;
  material?: Material;
  materials?: Material[];
  count?: number;
}

export interface MaterialFilters {
  projectId?: string;
  type?: string;
  status?: string;
}

export interface UpdateQuantityData {
  quantity: number;
  operation: 'add' | 'subtract';
} 