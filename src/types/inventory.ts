
export interface Material {
  id: string;
  _id?: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  stockLevel: number;
  lowStockThreshold: number;
  targetStockLevel: number;
  vendor?: string;
  location?: string;
  description?: string;
  purpose?: string;
}

export interface Transaction {
  id: string;
  material: string;
  quantity: number;
  unit: string;
  type: "added" | "removed" | "updated";
  note: string;
  date: string;
  time: string;
  projectId: string;
  materialId?: string;
  materialDetails?: any;
}

export interface AddMaterialData {
  name: string;
  type: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  targetStockLevel: number;
  vendor?: string;
  location?: string;
  description?: string;
  purpose?: string;
}
