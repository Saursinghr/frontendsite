import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FiCalendar, FiDollarSign, FiLoader, FiMapPin, FiUsers, FiX } from 'react-icons/fi';

export type User = {
  id: string;
  name: string;
  role: string;
  email?: string;
};

type AddSiteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSite: (siteData: any) => void;
  users?: User[];
  isLoading?: boolean;
};

const AddSiteModal: React.FC<AddSiteModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddSite, 
  users = [],
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    budget: '',
    teamSize: '',
    startDate: '',
    assignedUsers: [] as string[],
    durationValue: '',
    durationUnit: 'months',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelect = (userId: string) => {
    if (!formData.assignedUsers.includes(userId)) {
      setFormData((prev) => ({
        ...prev,
        assignedUsers: [...prev.assignedUsers, userId]
      }));
    }
  };

  const removeUser = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.filter(id => id !== userId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSite = {
      name: formData.name,
      address: formData.address,
      budget: parseFloat(formData.budget) || 0,
      teamSize: parseInt(formData.teamSize) || 0,
      startDate: formData.startDate,
      assignedUsers: formData.assignedUsers,
      durationValue: formData.durationValue,
      durationUnit: formData.durationUnit,
    };

    onAddSite(newSite);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      budget: '',
      teamSize: '',
      startDate: '',
      assignedUsers: [],
      durationValue: '',
      durationUnit: 'months',
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const getAvailableUsers = () => {
    return users.filter(user => !formData.assignedUsers.includes(user.id));
  };

  const getSelectedUsers = () => {
    return users.filter(user => formData.assignedUsers.includes(user.id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-xl p-4">
        <div onSubmit={handleSubmit}>
          <DialogHeader className="mb-3">
            <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiMapPin size={18} /> Add New Construction Site
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Fill in the details below to create a new site entry.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-3">
            {/* Row 1: Site Name & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-medium">Site Name</Label>
                  <Input
                    id="site-name"
                    name="name"
                    placeholder="Enter site name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-8 text-sm px-2 py-1"
                  />
                </div>

                             <div className="space-y-1">
                 <Label htmlFor="budget" className="text-xs font-medium">Estimated Budget (₹)</Label>
                 <Input
                   id="budget"
                   name="budget"
                   type="number"
                   min="0"
                   step="0.01"
                   placeholder="Enter budget in rupees"
                   value={formData.budget}
                   onChange={handleChange}
                   required
                   className="h-8 text-sm px-2 py-1"
                 />
               </div>
            </div>

            {/* Row 2: Address */}
            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs font-medium">Site Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
                required
                className="h-8 text-sm px-2 py-1"
              />
            </div>

            {/* Row 3: Start Date */}
            <div className="space-y-1">
              <Label htmlFor="startDate" className="text-xs font-medium">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="h-8 text-sm px-2 py-1"
              />
            </div>

            {/* Row 4: Team Size */}
            <div className="space-y-1">
              <Label htmlFor="teamSize" className="text-xs font-medium">Team Size</Label>
              <Input
                id="teamSize"
                name="teamSize"
                type="number"
                min="1"
                placeholder="Enter number of team members"
                value={formData.teamSize}
                onChange={handleChange}
                required
                className="h-8 text-sm px-2 py-1"
              />
            </div>

            {/* Row 5: Duration (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Project Duration (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="durationValue"
                    name="durationValue"
                    type="number"
                    min="1"
                    placeholder="e.g. 6"
                    value={formData.durationValue}
                    onChange={handleChange}
                    className="h-8 text-sm px-2 py-1"
                  />
                  <Select
                    value={formData.durationUnit}
                    onValueChange={(value) => handleSelectChange('durationUnit', value)}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-sm">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent className="text-sm bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="days" className="text-sm bg-white text-gray-800 hover:bg-gray-50">Days</SelectItem>
                      <SelectItem value="weeks" className="text-sm bg-white text-gray-800 hover:bg-gray-50">Weeks</SelectItem>
                      <SelectItem value="months" className="text-sm bg-white text-gray-800 hover:bg-gray-50">Months</SelectItem>
                      <SelectItem value="years" className="text-sm bg-white text-gray-800 hover:bg-gray-50">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Row 6: Assign Users */}
              <div className="space-y-1">
                <Label className="flex items-center gap-1 text-sm">
                  <FiUsers size={14} />
                  Assign Team Members
                </Label>
              
              {/* Selected Users Display */}
              {getSelectedUsers().length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md border border-gray-200 min-h-[60px] shadow-sm">
                  {getSelectedUsers().map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-xs shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-xs">{user.name}</span>
                        <span className="text-[10px] text-indigo-600">{user.role}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        className="hover:bg-indigo-200 rounded-full p-0.5 ml-1"
                        aria-label="Remove user"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* User Selection Dropdown */}
              <Select
                value=""
                onValueChange={handleUserSelect}
                disabled={users.length === 0 || getAvailableUsers().length === 0}
              >
                <SelectTrigger className="w-full h-8 text-sm bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500">
                  <SelectValue placeholder={
                    users.length > 0 
                      ? getAvailableUsers().length > 0 
                        ? "+ Add team members to this site"
                        : "All available team members selected"
                      : "No team members available"
                  } />
                </SelectTrigger>
                {getAvailableUsers().length > 0 && (
                  <SelectContent className="max-h-[200px] overflow-y-auto bg-white border border-gray-200 shadow-lg">
                    {getAvailableUsers().map((user) => (
                      <SelectItem key={user.id} value={user.id} className="bg-white text-gray-800 hover:bg-gray-50 focus:bg-gray-50">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{user.name}</span>
                          <span className="text-xs text-gray-600">{user.role}</span>
                          {user.email && <span className="text-xs text-gray-500">{user.email}</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              
              {users.length === 0 && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-700">
                    No team members available. You can add team members later from the Team Management page.
                  </p>
                </div>
              )}
              
              {formData.assignedUsers.length > 0 && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 font-medium">
                    {formData.assignedUsers.length} team member{formData.assignedUsers.length > 1 ? 's' : ''} assigned to this site
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 py-1 px-3 h-8 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700 py-1 px-3 h-8 text-sm"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <FiLoader className="mr-1 h-3 w-3 animate-spin" /> Adding...
                </>
              ) : (
                "Add Site"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSiteModal;