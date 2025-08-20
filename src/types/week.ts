export interface TaskInWeek {
  user: string;
  task: string;
  status: 'open' | 'closed';
}

export interface Week {
  _id?: string;
  name: string;
  tasks: TaskInWeek[];
  siteId?: string;
} 