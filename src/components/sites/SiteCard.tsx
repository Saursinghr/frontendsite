import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export type SiteCardProps = {
  id: string;
  name: string;
  code: string;
  address?: string;
  completionPercentage: number;
  status: string;
  className?: string;
};

const SiteCard: React.FC<SiteCardProps> = ({
  id,
  name,
  code,
  address,
  completionPercentage,
  status,
  className = '',
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      'completed': {
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
      'planned': {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        hover: 'hover:bg-gray-200',
        icon: '📋'
      }
    };

    const config = statusConfig[status] || statusConfig['planned'];

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.hover}`}>
        <span>{config.icon}</span>
        {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Planned'}
      </span>
    );
  };

  return (
    <Card className={`w-full overflow-hidden transition-all hover:shadow-md ${className}`}>
      <CardHeader className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 w-full">
        <div className="text-sm text-gray-500">
          Project Code: <span className="font-medium text-black">{code}</span>
        </div>

        {address && (
          <div className="flex items-start text-sm text-gray-500">
            <MapPin size={16} className="mt-0.5 mr-1 flex-shrink-0" />
            <span>{address}</span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-end">
        <Link
          to={`/site/${id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SiteCard;
