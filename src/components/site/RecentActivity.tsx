
import React from 'react';
import { Bell } from 'lucide-react';

type Activity = {
  id: number;
  user: string;
  action: string;
  description: string;
  timestamp: string;
};

type RecentActivityProps = {
  activities: Activity[];
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Bell size={18} className="text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b pb-4 last:border-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className="font-medium">{activity.user}</span>
                {' '}
                <span className="text-gray-500">{activity.action}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
            <p className="text-xs text-gray-400">{activity.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
