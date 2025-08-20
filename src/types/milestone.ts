export interface Milestone {
  _id?: string;
  name: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  estimatedCompletion: string;
  actualCompletion?: string | null;
  description?: string;
  projectId: string;
  assignedTo?: string;
  progress: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMilestoneData {
  name: string;
  status?: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  estimatedCompletion: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface UpdateMilestoneData {
  name?: string;
  status?: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  estimatedCompletion?: string;
  actualCompletion?: string | null;
  description?: string;
  assignedTo?: string;
  progress?: number;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MilestoneResponse {
  message: string;
  milestone?: Milestone;
  milestones?: Milestone[];
  count?: number;
}

export interface MilestoneFilters {
  projectId?: string;
  status?: string;
} 