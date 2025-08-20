import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Search, Filter, Users, X } from "lucide-react";
import { toast } from "sonner";
import { EmployeeTable } from "@/components/team/EmployeeTable";
import { EmployeeSummaryCards } from "@/components/team/EmployeeSummaryCards";
import { AddEmployeeModal } from "@/components/team/AddEmployeeModal";
import { AssignSiteModal } from "@/components/team/AssignSiteModal";
import { getTeamMembers, addEmployee, editEmployee } from "@/services/teamService";

interface Employee {
  id: string;
  name: string;
  email: string;
  number: string;
  companyCode: string;
  joiningDate: string;
  salary: number;
  advance: number;
  position: string;
  status: "Active" | "Inactive";
  isAdminVerified?: boolean;
  isEditing: boolean;
  assignedSite?: string[] | string; // Updated to support multiple sites
  // Additional fields for compatibility
  phone: string;
  amount: number;
  additionalAmount: number;
}

const positions = [
  "Project Manager",
  "Site Engineer",
  "Foreman",
  "Architect",
  "Safety Officer",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Administrative",
  "Laborer"
];

const TeamManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [positionFilter, setPositionFilter] = useState("All Positions");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalEditing, setIsModalEditing] = useState(false);
  const [isAssignSiteOpen, setIsAssignSiteOpen] = useState(false);
  const [employeeToAssign, setEmployeeToAssign] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEmployees: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    setLoading(true);
    getTeamMembers({
      page: currentPage,
      limit: 100,
      status: statusFilter !== "All Statuses" ? (statusFilter as "Active" | "Inactive") : undefined,
      position: positionFilter !== "All Positions" ? positionFilter : undefined,
      search: searchQuery || undefined
    })
      .then((data) => {
        // Map API fields to Employee interface
        const employees = data.employees || data;
        const mapped = employees.map((item: any) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          number: item.phone || '',
          companyCode: item.companyCode || '',
          joiningDate: item.joiningDate ? new Date(item.joiningDate).toISOString() : new Date().toISOString(),
          salary: item.amount || 0,
          advance: item.additionalAmount || 0,
          position: item.position,
          status: (item.status === "Active" || item.status === "Inactive" ? item.status : "Active") as "Active" | "Inactive",
          isAdminVerified: item.isAdminVerified || false,
          isEditing: false,
          assignedSite: Array.isArray(item.assignedSite) ? item.assignedSite : 
                       (item.assignedSite ? [item.assignedSite] : []), // Ensure it's always an array
          phone: item.phone || '',
          amount: item.amount || 0,
          additionalAmount: item.additionalAmount || 0,
        }));
        setEmployees(mapped);
        
        // Update pagination info
        if (data.pagination) {
          setPaginationInfo(data.pagination);
          setTotalPages(data.pagination.totalPages);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentPage, statusFilter, positionFilter, searchQuery]);

  useEffect(() => {
    setTotalEmployees(employees.length);
    setActiveEmployees(employees.filter(emp => emp.status === "Active").length);
    setInactiveEmployees(employees.filter(emp => emp.status === "Inactive").length);
  }, [employees]);

  const handleEdit = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, isEditing: true } : emp
      )
    );
  };

  const handleSave = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, isEditing: false } : emp
      )
    );
    toast.success("Employee data saved successfully!");
  };

  const handleCancel = (id: string) => {
    const originalEmployee = employees.find(emp => emp.id === id);
    if (!originalEmployee) return;

    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...originalEmployee, isEditing: false } : emp
      )
    );
  };

  const handleChange = (
    id: string,
    field: keyof Employee,
    value: string | number
  ) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, status: checked ? "Active" : "Inactive" } : emp
      )
    );
  };

  const handleAddEmployee = async (employeeData: {
    name: string;
    email: string;
    position: string;
    phone: string;
    amount: number;
    additionalAmount: number;
    status: "Active" | "Inactive";
  }) => {
    try {
      // Map frontend fields to backend schema
      const payload = {
        name: employeeData.name,
        position: employeeData.position,
        assignedSite: [], // Initialize with empty array for multiple sites
        email: employeeData.email,
        phone: employeeData.phone,
        amount: employeeData.amount || 0,
        additionalAmount: employeeData.additionalAmount || 0,
        status: employeeData.status || 'Active'
      };

      // Call API to save employee
      const savedEmployee = await addEmployee(payload);
      
      // Add new employee to local state with data from backend
      const newEmployee = savedEmployee.employee; // Access the employee object from the response
      setEmployees([
        ...employees,
        {
          id: newEmployee._id,
          name: newEmployee.name,
          email: newEmployee.email,
          number: newEmployee.phone,
          companyCode: newEmployee.companyCode || '',
          joiningDate: newEmployee.joiningDate ? new Date(newEmployee.joiningDate).toISOString() : new Date().toISOString(),
          salary: newEmployee.amount || 0,
          advance: newEmployee.additionalAmount || 0,
          position: newEmployee.position,
          status: newEmployee.status || 'Active',
          isEditing: false,
          assignedSite: newEmployee.assignedSite || [],
          phone: newEmployee.phone || '',
          amount: newEmployee.amount || 0,
          additionalAmount: newEmployee.additionalAmount || 0,
        }
      ]);

      setIsAddEmployeeOpen(false);
      toast.success("New employee added successfully!");
    } catch (err: any) {
      console.error('Error adding employee:', err);
      toast.error(err.response?.data?.message || err.message || "Failed to add employee");
    }
  };

  const handleEditEmployee = async (id: string, employeeData: any) => {
    try {
      // Validate required fields
      if (!employeeData.name || !employeeData.email || !employeeData.position || !employeeData.phone) {
        toast.error("Name, email, position, and phone are required fields");
        return;
      }

      // Prepare payload with correct field names for backend API
      const payload = {
        name: employeeData.name,
        position: employeeData.position,
        assignedSite: employeeData.assignedSite || [],
        email: employeeData.email,
        phone: employeeData.phone,
        amount: Number(employeeData.amount) || 0,
        additionalAmount: Number(employeeData.additionalAmount) || 0,
        status: employeeData.status || 'Active'
      };
      
      console.log('Sending payload to API:', payload);
      
      // Call API to update employee
      const updatedEmployee = await editEmployee(id, payload);
      const editedEmployee = updatedEmployee.employee || updatedEmployee;
      
      console.log('Received response:', editedEmployee);
      
      // Update local state with response data
      setEmployees(employees.map(emp => 
        emp.id === id ? {
          ...emp,
          name: editedEmployee.name,
          email: editedEmployee.email,
          position: editedEmployee.position,
          number: editedEmployee.phone, // Map phone to number for frontend
          companyCode: editedEmployee.companyCode || '',
          salary: editedEmployee.amount || 0,
          advance: editedEmployee.additionalAmount || 0,
          status: editedEmployee.status || 'Active',
          joiningDate: editedEmployee.joiningDate || emp.joiningDate,
          assignedSite: editedEmployee.assignedSite || [],
        } : emp
      ));
      toast.success("Employee updated successfully!");
      setSelectedEmployee(null);
      setIsModalEditing(false);
    } catch (err: any) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || err.message || "Failed to update employee");
    }
  };

  const handleDownloadExcel = () => {
    toast.success("Team data downloaded as Excel file");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalEditing(false);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalEditing(false);
  };

  const handleModalEdit = () => {
    setIsModalEditing(true);
  };

  const handleModalSave = async () => {
    if (!selectedEmployee) return;
    
    try {
      // Validate required fields
      if (!selectedEmployee.name || !selectedEmployee.email || !selectedEmployee.position || !selectedEmployee.number) {
        toast.error("Name, email, position, and phone are required fields");
        return;
      }
      
      // Prepare payload with correct field names for backend API
      const payload = {
        name: selectedEmployee.name,
        position: selectedEmployee.position,
        assignedSite: selectedEmployee.assignedSite || [],
        email: selectedEmployee.email,
        phone: selectedEmployee.number,
        amount: Number(selectedEmployee.salary) || 0,
        additionalAmount: Number(selectedEmployee.advance) || 0,
        status: selectedEmployee.status || 'Active',
        joiningDate: new Date(selectedEmployee.joiningDate)
      };
      
      console.log('Sending payload to API from modal:', payload);
      
      // Call API to update employee
      const updatedEmployee = await editEmployee(selectedEmployee.id, payload);
      const editedEmployee = updatedEmployee.employee || updatedEmployee;
      
      console.log('Received response from modal save:', editedEmployee);
      
      // Update local state with response data
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id ? {
          ...emp,
          name: editedEmployee.name,
          email: editedEmployee.email,
          position: editedEmployee.position,
          number: editedEmployee.phone,
          companyCode: editedEmployee.companyCode || '',
          salary: editedEmployee.amount || 0,
          advance: editedEmployee.additionalAmount || 0,
          status: editedEmployee.status || 'Active',
          joiningDate: editedEmployee.joiningDate ? new Date(editedEmployee.joiningDate).toISOString() : emp.joiningDate,
          assignedSite: editedEmployee.assignedSite || [],
        } : emp
      ));
      
      setIsModalEditing(false);
      toast.success("Employee data updated successfully!");
    } catch (err: any) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || err.message || "Failed to update employee");
    }
  };

  const handleModalChange = (field: keyof Employee, value: string | number) => {
    if (!selectedEmployee) return;
    setSelectedEmployee({ ...selectedEmployee, [field]: value });
  };

  const handleAssignSite = (employee: Employee) => {
    setEmployeeToAssign(employee);
    setIsAssignSiteOpen(true);
  };

  const handleSiteAssigned = () => {
    // Refresh the employee list to get updated data
    fetchEmployees();
  };

  const fetchEmployees = () => {
    setLoading(true);
    getTeamMembers({
      page: currentPage,
      limit: 100,
      status: statusFilter !== "All Statuses" ? (statusFilter as "Active" | "Inactive") : undefined,
      position: positionFilter !== "All Positions" ? positionFilter : undefined,
      search: searchQuery || undefined
    })
      .then((data) => {
        // Map API fields to Employee interface
        const employees = data.employees || data;
        const mapped = employees.map((item: any) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          number: item.phone || '',
          companyCode: item.companyCode || '',
          joiningDate: item.joiningDate ? new Date(item.joiningDate).toISOString() : new Date().toISOString(),
          salary: item.amount || 0,
          advance: item.additionalAmount || 0,
          position: item.position,
          status: (item.status === "Active" || item.status === "Inactive" ? item.status : "Active") as "Active" | "Inactive",
          isAdminVerified: item.isAdminVerified || false,
          isEditing: false,
          assignedSite: Array.isArray(item.assignedSite) ? item.assignedSite : 
                       (item.assignedSite ? [item.assignedSite] : []), // Ensure it's always an array
          phone: item.phone || '',
          amount: item.amount || 0,
          additionalAmount: item.additionalAmount || 0,
        }));
        setEmployees(mapped);
        
        // Update pagination info
        if (data.pagination) {
          setPaginationInfo(data.pagination);
          setTotalPages(data.pagination.totalPages);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <MainLayout>
      <div className="flex flex-col p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
            <p className="text-slate-500">
              Manage your construction team members and their details
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 border-slate-200 text-slate-700"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={() => setIsAddEmployeeOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <EmployeeSummaryCards
          totalEmployees={totalEmployees}
          activeEmployees={activeEmployees}
          inactiveEmployees={inactiveEmployees}
        />

        {/* Employee Table Section */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Users className="h-5 w-5" />
            Team Members
          </h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or company code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10 border-slate-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
                className="flex h-10 w-full sm:w-36 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select
                value={positionFilter}
                onChange={(e) => {
                  setPositionFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filtering
                }}
                className="flex h-10 w-full sm:w-36 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option>All Positions</option>
                {positions.map((position) => (
                  <option key={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
         <div className="border rounded-lg overflow-hidden">
            <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
              <div className="inline-block min-w-full align-middle">
                <EmployeeTable
                  employees={employees}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  handleCancel={handleCancel}
                  handleChange={handleChange}
                  handleStatusChange={handleStatusChange}
                  onEmployeeClick={handleEmployeeClick}
                  onAssignSite={handleAssignSite}
                />
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({paginationInfo.totalEmployees} total employees)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!paginationInfo.hasPrevPage}
                  className="border-slate-200 text-slate-700"
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-slate-200 text-slate-700"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!paginationInfo.hasNextPage}
                  className="border-slate-200 text-slate-700"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-medium">Contact Information</p>
                  <div className="pl-4 space-y-1">
                    {isModalEditing ? (
                      <>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Email:</span>
                          <Input
                            value={selectedEmployee.email}
                            onChange={(e) => handleModalChange('email', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Phone:</span>
                          <Input
                            value={selectedEmployee.number}
                            onChange={(e) => handleModalChange('number', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Company Code:</span>
                          <Input
                            value={selectedEmployee.companyCode}
                            onChange={(e) => handleModalChange('companyCode', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><span className="text-gray-600">Email:</span> {selectedEmployee.email}</p>
                        <p><span className="text-gray-600">Phone:</span> {selectedEmployee.number}</p>
                        <p><span className="text-gray-600">Company Code:</span> {selectedEmployee.companyCode}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Position & Status</p>
                  <div className="pl-4 space-y-1">
                    {isModalEditing ? (
                      <>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Position:</span>
                          <select
                            value={selectedEmployee.position}
                            onChange={(e) => handleModalChange('position', e.target.value)}
                            className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            {positions.map(position => (
                              <option key={position} value={position}>{position}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Status:</span>
                          <select
                            value={selectedEmployee.status}
                            onChange={(e) => handleModalChange('status', e.target.value)}
                            className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Joining Date:</span>
                          <Input
                            type="date"
                            value={selectedEmployee.joiningDate}
                            onChange={(e) => handleModalChange('joiningDate', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><span className="text-gray-600">Position:</span> {selectedEmployee.position}</p>
                        <p>
                          <span className="text-gray-600">Status:</span> 
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            selectedEmployee.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {selectedEmployee.status}
                          </span>
                        </p>
                        <p><span className="text-gray-600">Joining Date:</span> {new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Financial Details</p>
                  <div className="pl-4 space-y-1">
                    {isModalEditing ? (
                      <>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Salary:</span>
                          <Input
                            type="number"
                            value={selectedEmployee.salary}
                            onChange={(e) => handleModalChange('salary', parseFloat(e.target.value))}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 w-24">Advance:</span>
                          <Input
                            type="number"
                            value={selectedEmployee.advance}
                            onChange={(e) => handleModalChange('advance', parseFloat(e.target.value))}
                            className="flex-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p><span className="text-gray-600">Salary:</span> ${selectedEmployee.salary.toLocaleString()}</p>
                        <p><span className="text-gray-600">Advance:</span> ${selectedEmployee.advance.toLocaleString()}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                {isModalEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsModalEditing(false)}
                      className="border-slate-200 text-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleModalSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="border-slate-200 text-slate-700"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleModalEdit}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddEmployeeOpen}
          onClose={() => setIsAddEmployeeOpen(false)}
          onAddEmployee={handleAddEmployee}
          onEditEmployee={handleEditEmployee}
          positions={positions}
          editingEmployee={selectedEmployee}
        />

        {/* Assign Site Modal */}
        <AssignSiteModal
          isOpen={isAssignSiteOpen}
          onClose={() => setIsAssignSiteOpen(false)}
          employee={employeeToAssign}
          onSiteAssigned={handleSiteAssigned}
        />
      </div>
    </MainLayout>
  );
};

export default TeamManagement;