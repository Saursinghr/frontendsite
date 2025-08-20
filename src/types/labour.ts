export interface Labour {
  _id?: string;
  name: string;
  mason: number;
  helper: number;
  supply: number;
  date: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLabourData {
  name: string;
  mason: number;
  helper: number;
  supply: number;
  date: string;
  projectId: string;
}

export interface UpdateLabourData {
  name?: string;
  category?: 'Mason' | 'Carpenter' | 'Electrician' | 'Plumber' | 'Helper' | 'Supervisor' | 'Other';
  workersCount?: number;
  hoursWorked?: number;
  hourlyRate?: number;
  workDate?: string;
  taskDescription?: string;
  supervisor?: string;
  status?: 'Active' | 'Completed' | 'On Hold';
  overtime?: number;
  overtimeRate?: number;
}

export interface LabourResponse {
  message: string;
  labour?: Labour[];
  count?: number;
}

export interface LabourStatsResponse {
  message: string;
  projectId: string;
  summary: {
    totalEntries: number;
    totalCost: number;
    totalHours: number;
    averageCostPerHour: number;
  };
  categoryStats: Record<string, {
    count: number;
    totalCost: number;
    totalHours: number;
    totalWorkers: number;
  }>;
  statusStats: Record<string, number>;
}

export interface LabourFilters {
  projectId?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} 