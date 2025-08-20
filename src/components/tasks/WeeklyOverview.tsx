
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface WeeklyOverviewProps {
  stats: {
    todo: number;
    inProgress: number;
    done: number;
    delayed: number;
  };
}

export default function WeeklyOverview({ stats }: WeeklyOverviewProps) {
  const overviewCards = [
    { title: "To-Do", value: stats.todo, icon: ClipboardList },
    { title: "In Progress", value: stats.inProgress, icon: Clock },
    { title: "Completed", value: stats.done, icon: CheckCircle },
    { title: "Delayed", value: stats.delayed, icon: AlertCircle },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
