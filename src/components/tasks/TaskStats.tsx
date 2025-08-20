
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, Clock, AlertCircle } from "lucide-react";

const TaskStats = () => {
  // Mock data - would come from your state management in production
  const stats = [
    { title: "Total Tasks", value: 24, icon: ClipboardList },
    { title: "In Progress", value: 8, icon: Clock },
    { title: "Completed", value: 12, icon: CheckCircle },
    { title: "Delayed", value: 4, icon: AlertCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskStats;
