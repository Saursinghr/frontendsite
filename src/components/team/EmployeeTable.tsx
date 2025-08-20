import React from "react";
import { Edit, Save, X, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface EmployeeTableProps {
  employees: Employee[];
  handleEdit: (id: string) => void;
  handleSave: (id: string) => void;
  handleCancel: (id: string) => void;
  handleChange: (id: string, field: string, value: string | number | boolean) => void;
  handleStatusChange: (id: string, checked: boolean) => void;
  onEmployeeClick: (employee: Employee) => void;
  onAssignSite: (employee: Employee) => void;
}

export const EmployeeTable = ({
  employees,
  handleEdit,
  handleSave,
  handleCancel,
  handleChange,
  handleStatusChange,
  onEmployeeClick,
  onAssignSite,
}: EmployeeTableProps) => {

  return (
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company Code</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned Sites</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joining Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salary</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Advance</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {employees.length > 0 ? (
          employees.map((employee) => (
            <tr 
              key={employee.id} 
              className="hover:bg-slate-50 cursor-pointer"
              onClick={() => onEmployeeClick(employee)}
            >
              {/* Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    value={employee.name}
                    onChange={(e) => handleChange(employee.id, "name", e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm font-medium text-slate-900">
                    {employee.name}
                  </div>
                )}
              </td>

              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    value={employee.email}
                    onChange={(e) => handleChange(employee.id, "email", e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-slate-500">{employee.email}</div>
                )}
              </td>

             <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    value={employee.number}
                    onChange={(e) =>
                      handleChange(employee.id, "number", e.target.value)
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-slate-500">{employee.number}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-500">
                  {employee.companyCode || "Not Set"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-500">
                  {(() => {
                    // Ensure assignedSite is always an array
                    const sites = Array.isArray(employee.assignedSite) ? employee.assignedSite : 
                                 (employee.assignedSite ? [employee.assignedSite] : []);
                    
                    if (sites.length === 0) {
                      return "Not Assigned";
                    }
                    
                    if (sites.length === 1) {
                      return sites[0];
                    } else {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {sites.map((site, index) => (
                            <span 
                              key={index} 
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {site}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  })()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    type="date"
                    value={employee.joiningDate}
                    onChange={(e) =>
                      handleChange(employee.id, "joiningDate", e.target.value)
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-slate-500">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    type="number"
                    value={employee.salary || 0}
                    onChange={(e) =>
                      handleChange(employee.id, "salary", parseFloat(e.target.value) || 0)
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-slate-500">
                    ${(employee.salary || 0).toLocaleString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <Input
                    type="number"
                    value={employee.advance || 0}
                    onChange={(e) =>
                      handleChange(employee.id, "advance", parseFloat(e.target.value) || 0)
                    }
                    className="h-8"
                  />
                ) : (
                  <div className="text-sm text-slate-500">
                    ${(employee.advance || 0).toLocaleString()}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.isEditing ? (
                  <select
                    value={employee.position}
                    onChange={(e) =>
                      handleChange(employee.id, "position", e.target.value)
                    }
                    className="flex h-8 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Site Engineer">Site Engineer</option>
                    <option value="Foreman">Foreman</option>
                    <option value="Architect">Architect</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Laborer">Laborer</option>
                  </select>
                ) : (
                  <div className="text-sm text-slate-500">{employee.position}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {employee.isEditing ? (
                    <Switch
                      checked={employee.status === "Active"}
                      onCheckedChange={(checked) =>
                        handleStatusChange(employee.id, checked)
                      }
                    />
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {employee.isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(employee.id);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(employee.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(employee.id);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssignSite(employee);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                                             title="Assign to Sites"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="px-6 py-4 text-center text-sm text-slate-500">
              {employees.length === 0 
                ? "No employees found. Add your first employee!"
                : "No employees match your search criteria"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};