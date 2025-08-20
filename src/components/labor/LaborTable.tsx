import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Edit, Check, X, Clock, MapPin } from 'lucide-react';

type Worker = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Clocked In' | 'Clocked Out';
  lastActivity: string;
  clockIn?: {
    time: string;
    location: string;
  };
  clockOut?: {
    time: string;
    location: string;
  };
};

interface LaborTableProps {
  workers: Worker[];
}

const LaborTable: React.FC<LaborTableProps> = ({ workers }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedActivity, setEditedActivity] = useState<string>("");
  const [workersData, setWorkersData] = useState<Worker[]>(workers || []);

  useEffect(() => {
    setWorkersData(workers || []);
  }, [workers]);

  const handleEditClick = (worker: Worker) => {
    setEditingId(worker.id);
    setEditedActivity(worker.lastActivity);
  };

  const handleSaveClick = (id: number) => {
    setWorkersData(workersData.map(worker => 
      worker.id === id ? { ...worker, lastActivity: editedActivity } : worker
    ));
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Manager</span>;
      case 'supervisor':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Supervisor</span>;
      case 'admin':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Admin</span>;
      case 'driver':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Driver</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Worker</span>;
    }
  };

  const getStatusBadge = (status: 'Clocked In' | 'Clocked Out') => {
    const statusConfig = {
      'Clocked In': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        hover: 'hover:bg-green-200',
        icon: '🟢'
      },
      'Clocked Out': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        hover: 'hover:bg-red-200',
        icon: '🔴'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.hover}`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  if (workersData.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No workers found</h3>
        <p className="mt-1 text-sm text-gray-500">No workers match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workersData.map((worker) => (
            <TableRow key={worker.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{worker.name}</TableCell>
              <TableCell>{getRoleBadge(worker.role)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{worker.email}</div>
                  <div className="text-gray-500">{worker.phone}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(worker.status)}</TableCell>
              
              {/* Clock In Display Only */}
              <TableCell>
                {worker.clockIn ? (
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{worker.clockIn.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">{worker.clockIn.location}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Not clocked in</div>
                )}
              </TableCell>
              
              {/* Clock Out Display Only */}
              <TableCell>
                {worker.clockOut ? (
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span>{worker.clockOut.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs">{worker.clockOut.location}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Not clocked out</div>
                )}
              </TableCell>
              
              <TableCell>
                {editingId === worker.id ? (
                  <input
                    type="text"
                    value={editedActivity}
                    onChange={(e) => setEditedActivity(e.target.value)}
                    className="border rounded px-2 py-1 text-sm w-full"
                  />
                ) : (
                  <div className="text-sm text-gray-600">{worker.lastActivity}</div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {editingId === worker.id ? (
                    <>
                      <button 
                        onClick={() => handleSaveClick(worker.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={handleCancelClick}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(worker)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LaborTable;