import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp, X, Check, Circle } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getAllSites, SiteResponse } from '@/services/siteService';
import Header from "@/components/layout/Header";
import { useWeeks, useCreateWeek, useUpdateTaskStatus, useUpdateWeek } from '@/hooks/use-weeks';
import { Week, TaskInWeek } from '@/types/week';
import { EditWeekForm } from "@/components/week/EditWeekForm";
import { getTeamMembers, Employee } from '@/services/teamService';

// Components
const TaskItem = ({ task, onToggleStatus }: { task: TaskInWeek; onToggleStatus: () => void }) => (
  <div className={`p-2 rounded border ${
    task.status === "open" 
      ? "bg-blue-50 border-blue-100" 
      : "bg-green-50 border-green-100"
  }`}>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-medium text-blue-800">{task.user}</h4>
        <p className="text-sm text-blue-600">{task.task}</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggleStatus}
        className="flex items-center gap-1"
      >
        {task.status === "open" ? (
          <>
            <Circle className="h-4 w-4 text-blue-500" />
            <span className="text-xs">Open</span>
          </>
        ) : (
          <>
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-xs">Closed</span>
          </>
        )}
      </Button>
    </div>
  </div>
);

const WeekRow = ({ 
  week, 
  isVisible, 
  onToggleVisibility,
  onToggleTaskStatus,
  onEditWeek
}: {
  week: Week; 
  isVisible: boolean; 
  onToggleVisibility: () => void;
  onToggleTaskStatus: (taskIndex: number) => void;
  onEditWeek: (week: Week) => void;
}) => (
  <tr>
    <td className="border p-3 font-semibold text-gray-700 align-top">
      <div className="flex justify-between items-center">
        {week.name}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEditWeek(week)}
        >
          Edit
        </Button>
      </div>
    </td>
    <td className="border p-3 align-top">
      <div className="flex flex-col items-start">
        <Button
          size="sm"
          variant="outline"
          className="gap-1 mb-2"
          onClick={onToggleVisibility}
        >
          {isVisible ? (
            <>
              <ChevronUp className="h-4 w-4" /> Hide Tasks
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> Show Tasks
            </>
          )}
        </Button>
        {isVisible && (
          <div className="mt-1 w-full space-y-2">
            {week.tasks.length > 0 ? (
              week.tasks.map((task, i) => (
                <TaskItem 
                  key={i} 
                  task={task} 
                  onToggleStatus={() => onToggleTaskStatus(i)} 
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">No tasks assigned for this week</p>
            )}
          </div>
        )}
      </div>
    </td>
  </tr>
);

const AddWeekForm = ({ 
  onCancel, 
  onSubmit,
  selectedSite
}: { 
  onCancel: () => void; 
  onSubmit: (weekName: string, tasks: TaskInWeek[]) => void;
  selectedSite: SiteResponse | null;
}) => {
  const [newWeekName, setNewWeekName] = useState("");
  const [tempTask, setTempTask] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [tasksForNewWeek, setTasksForNewWeek] = useState<TaskInWeek[]>([]);
  const [siteEmployees, setSiteEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

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
        console.log('Site assigned users:', siteEmployeeIds);
        console.log('Site name:', selectedSite.siteName);
        console.log('Filtered employees for site:', filteredEmployees);
      } catch (error) {
        console.error('Error fetching site employees:', error);
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
        setTasksForNewWeek([...tasksForNewWeek, {
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
    setTasksForNewWeek(tasksForNewWeek.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (newWeekName.trim() && tasksForNewWeek.length > 0) {
      onSubmit(newWeekName, tasksForNewWeek);
      setNewWeekName("");
      setTasksForNewWeek([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Add New Week</h2>
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
          <input
            type="text"
            value={newWeekName}
            onChange={(e) => setNewWeekName(e.target.value)}
            placeholder="e.g., Week 5"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoadingEmployees}
            >
              <option value="">
                {isLoadingEmployees ? "Loading team members..." : "Select Team Member"}
              </option>
              {siteEmployees.map((employee, index) => (
                <option 
                  key={employee._id} 
                  value={employee._id}
                  className={`py-2 px-3 ${
                    index % 4 === 0 ? 'bg-blue-50 hover:bg-blue-100' :
                    index % 4 === 1 ? 'bg-green-50 hover:bg-green-100' :
                    index % 4 === 2 ? 'bg-purple-50 hover:bg-purple-100' :
                    'bg-orange-50 hover:bg-orange-100'
                  }`}
                >
                  {employee.name} ({employee.position})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={tempTask}
              onChange={(e) => setTempTask(e.target.value)}
              placeholder="Enter task"
              className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <Button type="button" onClick={addTask} disabled={!selectedUser || !tempTask.trim()}>
              Add Task
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
          
          {tasksForNewWeek.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Assigned Tasks:</h4>
              <ul className="space-y-2">
                {tasksForNewWeek.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div>
                      <span className="font-medium text-sm">{item.user}: </span>
                      <span className="text-sm">{item.task}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        item.status === "open" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-green-100 text-green-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => removeTask(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newWeekName.trim() || tasksForNewWeek.length === 0}
            className="border-2"
          >
            Create Week
          </Button>
        </div>
      </div>
    </div>
  );
}


function Tasks() {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);

  const { data: weeks = [], isLoading } = useWeeks(selectedSite?._id);
  const { mutate: createWeek } = useCreateWeek();
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const { mutate: updateWeek } = useUpdateWeek();

  const [visibleTasks, setVisibleTasks] = useState<{ [key: string]: boolean }>({});
  const [showAddWeekForm, setShowAddWeekForm] = useState(false);
  const [showEditWeekForm, setShowEditWeekForm] = useState(false);
  const [editingWeek, setEditingWeek] = useState<Week | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch sites
  useEffect(() => {
    getAllSites()
      .then(setSites)
      .catch((error) => {
        console.error('Error fetching sites:', error);
      });
  }, []);

  // Set selected site based on URL parameter
  useEffect(() => {
    if (id && sites.length > 0) {
      const site = sites.find(site => site._id === id);
      if (site) {
        setSelectedSite(site);
        setShowSiteSelector(false);
      }
    } else if (!id) {
      setSelectedSite(null);
      setShowSiteSelector(true);
    }
  }, [id, sites]);

  const toggleTaskView = (key: string) => {
    setVisibleTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTaskStatus = (weekId: string, taskIndex: number, currentStatus: 'open' | 'closed') => {
    updateTaskStatus({ weekId, taskIndex, status: currentStatus === 'open' ? 'closed' : 'open' });
  };

  const handleAddWeek = (weekName: string, tasks: TaskInWeek[]) => {
    createWeek({ name: weekName, tasks, siteId: selectedSite?._id });
    setShowAddWeekForm(false);
  };

  const handleEditWeek = (week: Week) => {
    setEditingWeek(week);
    setShowEditWeekForm(true);
  };

  const handleUpdateWeek = (updatedWeek: Week) => {
    updateWeek(updatedWeek);
    setShowEditWeekForm(false);
    setEditingWeek(null);
  };

  const handleCancelEdit = () => {
    setShowEditWeekForm(false);
    setEditingWeek(null);
  };

  const handleSelectSite = (siteId: string) => {
    navigate(`/tasks/${siteId}`);
  };

  const handleChangeSite = () => {
    setShowSiteSelector(true);
    navigate(`/tasks`);
  };

  return (
    <MainLayout>
      <div className="p-2 space-y-6 bg-gray-50 min-h-screen">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Tasks Management` : 'Tasks Management'}
          showSiteSelector={showSiteSelector}
          selectedSite={selectedSite ? selectedSite._id : undefined}
          sites={sites}
          onSelectSite={handleSelectSite}
          onChangeSite={handleChangeSite}
        />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Add Week Button */}
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => setShowAddWeekForm(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Week
            </Button>
          </div>

          {/* Add Week Form */}
          {showAddWeekForm && (
            <AddWeekForm 
              onCancel={() => setShowAddWeekForm(false)} 
              onSubmit={handleAddWeek} 
              selectedSite={selectedSite}
            />
          )}

          {/* Edit Week Form */}
          {showEditWeekForm && editingWeek && (
            <EditWeekForm
              week={editingWeek}
              onCancel={handleCancelEdit}
              onSubmit={handleUpdateWeek}
              selectedSite={selectedSite}
            />
          )}

          {/* Weeks Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 font-semibold text-gray-700 min-w-[150px]">Week</th>
                    <th className="border p-3 font-semibold text-gray-700 min-w-[200px]">Tasks Overview</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={2} className="text-center p-4">Loading...</td></tr>
                  ) : weeks.map((week, idx) => {
                    const key = week._id || `week-${idx}`;
                    return (
                      <WeekRow
                        key={key}
                        week={week}
                        isVisible={!!visibleTasks[key]}
                        onToggleVisibility={() => toggleTaskView(key)}
                        onToggleTaskStatus={(taskIndex) => toggleTaskStatus(week._id!, taskIndex, week.tasks[taskIndex].status)}
                        onEditWeek={handleEditWeek}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export { Tasks };