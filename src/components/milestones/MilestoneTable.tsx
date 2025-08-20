import React from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Milestone } from '@/types/milestone';

interface MilestoneTableProps {
  milestones: Milestone[];
  onEdit: (milestone: Milestone) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const getStatusBadge = (status: Milestone['status']) => {
  const statusConfig = {
    'Pending': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200',
      icon: '⏳'
    },
    'In Progress': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      hover: 'hover:bg-blue-200',
      icon: '🔄'
    },
    'Completed': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-200',
      icon: '✅'
    },
    'On Hold': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200',
      icon: '⏸️'
    },
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.bg} ${config.text} ${config.hover} flex items-center gap-1 font-medium px-3 py-1 rounded-full`}>
      <span>{config.icon}</span>
      {status}
    </Badge>
  );
};



export const MilestoneTable: React.FC<MilestoneTableProps> = ({
  milestones,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-gray-500">Loading milestones...</div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No milestones</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new milestone.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Estimated Completion</TableHead>
            <TableHead>Actual Completion</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {milestones.map((milestone) => (
            <TableRow key={milestone._id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-medium">{milestone.name}</div>
                  {milestone.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {milestone.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(milestone.status)}</TableCell>
              <TableCell>
                <div className="w-full max-w-xs">
                  <div className="flex items-center gap-2">
                    <Progress value={milestone.progress} className="flex-1" />
                    <span className="text-sm text-gray-600">{milestone.progress}%</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(milestone.estimatedCompletion), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                {milestone.actualCompletion
                  ? format(new Date(milestone.actualCompletion), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(milestone)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => milestone._id && onDelete(milestone._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 