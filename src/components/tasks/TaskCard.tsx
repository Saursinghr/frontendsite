
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User2 } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
}

const TaskCard = ({
  title,
  description,
  priority,
  assignedTo,
  dueDate,
}: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="p-4 space-y-3 hover:shadow-md transition-shadow border-l-4 border-transparent hover:border-l-primary">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium line-clamp-2">{title}</h3>
          <Badge variant="outline" className={`${getPriorityColor(priority)} border`}>
            {priority}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User2 className="h-4 w-4" />
          <span>{assignedTo}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{format(dueDate, 'MMM d, yyyy')}</span>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
