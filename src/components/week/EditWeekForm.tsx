import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Week, TaskInWeek } from "@/types/week";
import { getTeamMembers, Employee } from '@/services/teamService';
import { SiteResponse } from '@/services/siteService';

interface EditWeekFormProps {
  week: Week;
  onCancel: () => void;
  onSubmit: (week: Week) => void;
  selectedSite: SiteResponse | null;
}

export function EditWeekForm({ week, onCancel, onSubmit, selectedSite }: EditWeekFormProps) {
  const [editedWeekName, setEditedWeekName] = useState(week.name);
  const [editedTasks, setEditedTasks] = useState<TaskInWeek[]>(week.tasks);
  const [tempTask, setTempTask] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [siteEmployees, setSiteEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  useEffect(() => {
    setEditedWeekName(week.name);
    setEditedTasks(week.tasks);
  }, [week]);

  // Fetch site-specific employees based on assignedUsers and assignedSite
  useEffect(() => {
    const fetchSiteEmployees = async () => {
      if (!selectedSite) {
        setSiteEmployees([]);
        return;
      }

      setIsLoadingEmployees(true);
      try {
        // Get all employees first
        const allEmployeesResponse = await getTeamMembers({ status: 'Active' });
        const allEmployees = allEmployeesResponse.employees || [];
        
        // Filter employees based on both:
        // 1. Site's assignedUsers array
        // 2. Employee's assignedSite field matching the site name
        const siteEmployeeIds = selectedSite.assignedUsers || [];
        const filteredEmployees = allEmployees.filter(employee => {
          const isInAssignedUsers = siteEmployeeIds.includes(employee._id || employee.id || '');
          const isAssignedToSite = employee.assignedSite === selectedSite.siteName;
          return isInAssignedUsers || isAssignedToSite;
        });
        
        setSiteEmployees(filteredEmployees);
        console.log('EditWeekForm - Site assigned users:', siteEmployeeIds);
        console.log('EditWeekForm - Site name:', selectedSite.siteName);
        console.log('EditWeekForm - Filtered employees for site:', filteredEmployees);
      } catch (error) {
        console.error('Error fetching site employees in EditWeekForm:', error);
        setSiteEmployees([]);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchSiteEmployees();
  }, [selectedSite]);

  const addTask = () => {
    if (tempTask.trim() && selectedUser) {
      const employee = siteEmployees.find(emp => emp._id === selectedUser);
      if (employee) {
        setEditedTasks([...editedTasks, {
          user: `${employee.name} (${employee.position})`,
          task: tempTask,
          status: "open"
        }]);
        setTempTask("");
        setSelectedUser("");
      }
    }
  };

  const removeTask = (index: number) => {
    setEditedTasks(editedTasks.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (editedWeekName.trim() && editedTasks.length > 0) {
      onSubmit({
        ...week,
        name: editedWeekName,
        tasks: editedTasks,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Edit Week</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Week Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Week Name *
          </label>
          <Input
            type="text"
            value={editedWeekName}
            onChange={(e) => setEditedWeekName(e.target.value)}
            placeholder="e.g., Week 5"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Required field. Name your week clearly.</p>
        </div>
        
        {/* Task Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Tasks to Site Team Members *
          </label>
          <div className="flex gap-2">
            <Select onValueChange={setSelectedUser} value={selectedUser} disabled={isLoadingEmployees}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={isLoadingEmployees ? "Loading team members..." : "Select Team Member"} />
              </SelectTrigger>
              <SelectContent>
                {siteEmployees.map((employee, index) => (
                  <SelectItem 
                    key={employee._id} 
                    value={employee._id || ''}
                    className={`${
                      index % 4 === 0 ? 'bg-blue-50 hover:bg-blue-100' :
                      index % 4 === 1 ? 'bg-green-50 hover:bg-green-100' :
                      index % 4 === 2 ? 'bg-purple-50 hover:bg-purple-100' :
                      'bg-orange-50 hover:bg-orange-100'
                    }`}
                  >
                    {employee.name} ({employee.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={tempTask}
              onChange={(e) => setTempTask(e.target.value)}
              placeholder="Enter task"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button type="button" onClick={addTask} disabled={!selectedUser || !tempTask.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedSite && (!selectedSite.assignedUsers || selectedSite.assignedUsers.length === 0) && siteEmployees.length === 0 && !isLoadingEmployees && (
            <p className="mt-2 text-sm text-amber-600">
              No team members assigned to this site. Please assign team members to this site first using the Team Management section.
            </p>
          )}
          
          {selectedSite && siteEmployees.length === 0 && !isLoadingEmployees && (
            <p className="mt-2 text-sm text-amber-600">
              No active team members found for this site. Please check if team members are assigned to this site and are active.
            </p>
          )}
          
          {editedTasks.length > 0 && (
            <div className="mt-4 space-y-2">
              {editedTasks.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{item.user}: {item.task}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeTask(index)}>
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!editedWeekName.trim() || editedTasks.length === 0}>
            Update Week
          </Button>
        </div>
      </div>
    </div>
  );
}