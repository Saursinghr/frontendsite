// components/resources/ResourceTable.tsx
import React from 'react';
import { Card } from '@/components/ui/card';

interface Resource {
  id: number;
  name: string;
  type: string;
  quantity: number;
  status: string;
  assignedTo?: string;
}

interface ResourceTableProps {
  resources: Resource[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-100 text-gray-700">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {resources.map(resource => (
            <tr key={resource.id} className="border-b hover:bg-slate-50">
              <td className="p-3">{resource.name}</td>
              <td className="p-3 capitalize">{resource.type}</td>
              <td className="p-3">{resource.quantity}</td>
              <td className="p-3">
                <span className={`text-sm px-2 py-1 rounded 
                  ${resource.status === 'available' ? 'bg-green-100 text-green-700' :
                    resource.status === 'in use' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'}`}>
                  {resource.status}
                </span>
              </td>
              <td className="p-3">{resource.assignedTo || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default ResourceTable;
