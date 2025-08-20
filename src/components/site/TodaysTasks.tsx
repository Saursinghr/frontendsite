
import React from 'react';
import { Clock } from 'lucide-react';

type Task = {
  id: number;
  name: string;
  status: string;
  priority: string;
  assignedTo: string;
};

type TodaysTasksProps = {
  tasks: Task[];
};

const TodaysTasks: React.FC<TodaysTasksProps> = ({ tasks }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'done': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        hover: 'hover:bg-green-200',
        icon: '✅'
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        hover: 'hover:bg-blue-200',
        icon: '🔄'
      },
      'todo': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        hover: 'hover:bg-gray-200',
        icon: '📋'
      }
    };

    const config = statusConfig[status] || statusConfig['todo'];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.hover}`}>
        <span>{config.icon}</span>
        {status === 'done' ? 'Done' : status === 'in-progress' ? 'In Progress' : 'To Do'}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Today's Tasks</h2>
        <Clock size={18} className="text-gray-400" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="pb-2 font-medium">Task</th>
              <th className="pb-2 font-medium">Assigned To</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b last:border-0">
                <td className="py-3 pr-4">{task.name}</td>
                <td className="py-3 pr-4">{task.assignedTo}</td>
                <td className="py-3">{getStatusBadge(task.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysTasks;
