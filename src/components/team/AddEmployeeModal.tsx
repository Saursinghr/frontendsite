import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  amount: number;
  companyCode: string;
  additionalAmount: number;
  status: "Active" | "Inactive";
  isAdminVerified?: boolean;
  isEditing: boolean;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: Omit<Employee, "id" | "isEditing">) => void;
  onEditEmployee?: (id: string, employee: Omit<Employee, "id" | "isEditing">) => void;
  positions: string[];
  editingEmployee?: (Employee & { number?: string }) | null;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
  onEditEmployee,
  positions,
  editingEmployee
}) => {
  const [employee, setEmployee] = useState<Omit<Employee, "id" | "isEditing">>({
    name: "",
    email: "",
    position: "",
    phone: "",
    amount: 0,
    companyCode: "",
    additionalAmount: 0,
    status: "Active",
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Reset form when modal opens/closes or editing employee changes
  useEffect(() => {
    if (editingEmployee) {
      setEmployee({
        name: editingEmployee.name,
        email: editingEmployee.email,
        position: editingEmployee.position,
        phone: editingEmployee.phone || editingEmployee.number || "", // Handle both phone and number fields
        amount: editingEmployee.amount || 0, // Use amount directly
        companyCode: editingEmployee.companyCode || "", // Keep companyCode separate
        additionalAmount: editingEmployee.additionalAmount || 0, // Use additionalAmount directly
        status: editingEmployee.status || "Active",
      });
      console.log('Editing employee data loaded:', editingEmployee);
    } else {
      setEmployee({
        name: "",
        email: "",
        position: "",
        phone: "",
        amount: 0,
        companyCode: "",
        additionalAmount: 0,
        status: "Active",
      });
    }
    // Clear errors when modal opens/closes
    setErrors({});
  }, [isOpen, editingEmployee]);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'position':
        if (!value.trim()) {
          newErrors.position = 'Position is required';
        } else {
          delete newErrors.position;
        }
        break;
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required';
        } else {
          delete newErrors.phone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    // Trim whitespace and validate
    const trimmedEmployee = {
      ...employee,
      name: employee.name.trim(),
      email: employee.email.trim(),
      position: employee.position.trim(),
      phone: employee.phone.trim(),
    };

    // Validate all required fields
    validateField('name', trimmedEmployee.name);
    validateField('email', trimmedEmployee.email);
    validateField('position', trimmedEmployee.position);
    validateField('phone', trimmedEmployee.phone);

    // Check if there are any errors
    const hasErrors = !trimmedEmployee.name || 
                     !trimmedEmployee.email || 
                     !trimmedEmployee.position || 
                     !trimmedEmployee.phone ||
                     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmployee.email);

    if (hasErrors) {
      // Show error message
      const missingFields = [];
      if (!trimmedEmployee.name) missingFields.push('Name');
      if (!trimmedEmployee.email) missingFields.push('Email');
      if (!trimmedEmployee.position) missingFields.push('Position');
      if (!trimmedEmployee.phone) missingFields.push('Phone');
      
      console.error('Validation errors:', errors);
      return; // Don't submit if there are errors
    }

    // Prepare the employee data with correct field names for backend API
    const employeeData = {
      name: trimmedEmployee.name,
      email: trimmedEmployee.email,
      position: trimmedEmployee.position,
      phone: trimmedEmployee.phone,
      companyCode: trimmedEmployee.companyCode || "",
      amount: Number(trimmedEmployee.amount) || 0,
      additionalAmount: Number(trimmedEmployee.additionalAmount) || 0,
      status: trimmedEmployee.status || 'Active'
    };

    // Log the data being sent for debugging
    console.log('Submitting employee data:', employeeData);

    if (editingEmployee && onEditEmployee) {
      onEditEmployee(editingEmployee.id, employeeData);
    } else {
      onAddEmployee(employeeData);
    }
    onClose();
  };

  const isFormValid = employee.name.trim() && 
                     employee.email.trim() && 
                     employee.position.trim() && 
                     employee.phone.trim() &&
                     Object.keys(errors).length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {editingEmployee 
              ? "Update the details of the team member below."
              : "Enter the details of the new team member below."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={employee.name}
                onChange={(e) => {
                  setEmployee({ ...employee, name: e.target.value });
                  validateField('name', e.target.value);
                }}
                placeholder="John Smith"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={employee.email}
                onChange={(e) => {
                  setEmployee({ ...employee, email: e.target.value });
                  validateField('email', e.target.value);
                }}
                placeholder="john.smith@buildtrack.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="position">Position *</Label>
              <select
                id="position"
                value={employee.position}
                onChange={(e) => {
                  setEmployee({ ...employee, position: e.target.value });
                  validateField('position', e.target.value);
                }}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.position ? "border-red-500" : ""}`}
              >
                <option value="">Select position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              {errors.position && (
                <span className="text-red-500 text-sm">{errors.position}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={employee.phone}
                onChange={(e) => {
                  setEmployee({ ...employee, phone: e.target.value });
                  validateField('phone', e.target.value);
                }}
                placeholder="(123) 456-7890"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={employee.amount}
                onChange={(e) => setEmployee({ ...employee, amount: Number(e.target.value) })}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                type="text"
                value={employee.companyCode}
                onChange={(e) => setEmployee({ ...employee, companyCode: e.target.value })}
                placeholder="Enter company code"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <div className="flex items-center gap-2">
                <Switch 
                  id="status"
                  checked={employee.status === "Active"}
                  onCheckedChange={(checked) => setEmployee({ ...employee, status: checked ? "Active" : "Inactive" })}
                />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {editingEmployee ? "Save Changes" : "Add Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};