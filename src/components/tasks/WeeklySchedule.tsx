
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WeeklyScheduleProps {
  weekStart: Date;
  showSchedule: boolean;
}

const WeeklySchedule = ({ weekStart }: WeeklyScheduleProps) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="kanban">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["To-Do", "In Progress", "Done", "Delayed"].map((status, index) => (
              <div key={status} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{status}</h3>
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">0</span>
                </div>
                <Card className="p-4">
                  <p className="text-muted-foreground text-sm">No tasks in this column</p>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {days.map((day) => (
              <Card key={day.toISOString()} className="p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="font-medium">{format(day, "EEEE")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(day, "MMM d")}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No tasks scheduled
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklySchedule;
