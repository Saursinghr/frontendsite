
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";
import WeeklyOverview from "./WeeklyOverview";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type TaskStatus = "todo" | "in-progress" | "done" | "delayed";
type TaskPriority = "low" | "medium" | "high";

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: Date;
  status: TaskStatus;
}

const TaskBoard = () => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [view, setView] = useState<"kanban" | "daily">("kanban");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in a real app, this would come from your API
  const tasks: Task[] = [
    {
      id: 1,
      title: "Finalize foundation design",
      description: "Complete the foundation design for the main building",
      priority: "high",
      assignedTo: "John Doe",
      dueDate: new Date("2025-04-15"),
      status: "todo"
    },
    {
      id: 2,
      title: "Order concrete materials",
      description: "Place order for concrete and related materials",
      priority: "medium",
      assignedTo: "Jane Smith",
      dueDate: new Date("2025-04-16"),
      status: "in-progress"
    },
    {
      id: 3,
      title: "Site inspection",
      description: "Conduct weekly site inspection",
      priority: "low",
      assignedTo: "Mike Johnson",
      dueDate: new Date("2025-04-14"),
      status: "done"
    },
    {
      id: 4,
      title: "Update project timeline",
      description: "Revise project timeline based on recent delays",
      priority: "high",
      assignedTo: "Sarah Williams",
      dueDate: new Date("2025-04-13"),
      status: "delayed"
    }
  ];

  const columns: { id: TaskStatus; title: string; tasks: Task[] }[] = [
    { 
      id: "todo", 
      title: "To-Do", 
      tasks: tasks.filter(task => task.status === "todo") 
    },
    { 
      id: "in-progress", 
      title: "In Progress", 
      tasks: tasks.filter(task => task.status === "in-progress") 
    },
    { 
      id: "done", 
      title: "Done", 
      tasks: tasks.filter(task => task.status === "done") 
    },
    { 
      id: "delayed", 
      title: "Delayed", 
      tasks: tasks.filter(task => task.status === "delayed") 
    },
  ];

  const stats = {
    todo: columns.find(col => col.id === "todo")?.tasks.length || 0,
    inProgress: columns.find(col => col.id === "in-progress")?.tasks.length || 0,
    done: columns.find(col => col.id === "done")?.tasks.length || 0,
    delayed: columns.find(col => col.id === "delayed")?.tasks.length || 0,
  };

  const handleAddTask = (task: Task) => {
    // In a real app, this would add the task to your state or database
    console.log("New task added:", task);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  // Get start of the week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  // Format the week display (Apr 14 - Apr 20)
  const weekStart = getWeekStart(selectedDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateWithYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const weekDisplay = `${formatDate(weekStart)} - ${formatDateWithYear(weekEnd)}`;

  // Generate array of days for the week view
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold">Tasks & Schedule</h1>
        <p className="text-muted-foreground">
          Manage your construction project tasks and weekly schedules
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{weekDisplay}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button className="gap-2" onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <WeeklyOverview stats={stats} />

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full"
              >
                <Card className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {column.tasks.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {column.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tasks in this column</p>
                    ) : (
                      column.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          description={task.description}
                          priority={task.priority}
                          assignedTo={task.assignedTo}
                          dueDate={task.dueDate}
                        />
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {daysOfWeek.map((day, index) => {
              const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
              const dayOfMonth = day.getDate();
              const monthAbbr = day.toLocaleDateString('en-US', { month: 'short' });
              
              // Filter tasks for this day
              const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                return taskDate.getDate() === dayOfMonth && 
                       taskDate.getMonth() === day.getMonth();
              });
              
              return (
                <Card key={day.toString()} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{dayName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {monthAbbr} {dayOfMonth}
                      </p>
                    </div>
                  </div>
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2">
                      {dayTasks.map(task => (
                        <TaskCard 
                          key={task.id}
                          title={task.title}
                          priority={task.priority}
                          assignedTo={task.assignedTo}
                          dueDate={task.dueDate}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tasks scheduled
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <AddTaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={setIsAddTaskOpen}
        onTaskAdded={handleAddTask}
      />
    </div>
  );
};

export default TaskBoard;
