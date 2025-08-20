
import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';

type Site = {
  id?: number | string;
  name?: string;
  _id?: string;
  siteName?: string;
};

type AddLaborModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddLabor: (laborData: any) => void;
  sites: Site[];
  selectedSite: Site | null;
};

const AddLaborModal: React.FC<AddLaborModalProps> = ({
  isOpen,
  onClose,
  onAddLabor,
  sites,
  selectedSite
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'worker',
    email: '',
    phone: '',
    assignedSiteId: selectedSite ? (selectedSite._id || selectedSite.id)?.toString() : ''
  });

  // Update form when selectedSite prop changes
  useEffect(() => {
    if (selectedSite) {
      setFormData(prev => ({
        ...prev,
        assignedSiteId: (selectedSite._id || selectedSite.id)?.toString() || ''
      }));
    }
  }, [selectedSite]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.role || !formData.email || !formData.phone || !formData.assignedSiteId) {
      toast.error('Please fill out all fields');
      return;
    }
    
    // Create a new labor worker object
    const newLabor = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      assignedSiteId: parseInt(formData.assignedSiteId)
    };

    onAddLabor(newLabor);
    toast.success('New labor worker added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      role: 'worker',
      email: '',
      phone: '',
      assignedSiteId: selectedSite ? (selectedSite._id || selectedSite.id)?.toString() : ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Labor Worker</DialogTitle>
            <DialogDescription>
              Enter the details for the new labor worker.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worker">Worker</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedSiteId">Assigned Site</Label>
                <Select
                  value={formData.assignedSiteId}
                  onValueChange={(value) => handleSelectChange('assignedSiteId', value)}
                  disabled={selectedSite !== null}
                >
                  <SelectTrigger id="assignedSiteId">
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site._id || site.id} value={(site._id || site.id)?.toString()}>
                        {site.siteName || site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Worker</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLaborModal;
