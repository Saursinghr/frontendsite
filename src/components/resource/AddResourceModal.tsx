// components/resources/AddResourceModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (resource: any) => void;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onAddResource }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: 1,
    status: 'available'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.type && formData.quantity > 0) {
      onAddResource(formData);
      onClose();
      setFormData({ name: '', type: '', quantity: 1, status: 'available' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              placeholder="Resource name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={formData.type} onValueChange={(val) => handleSelectChange(val, 'type')}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
            />
          </div>

          <div className="text-right">
            <Button onClick={handleSubmit}>Add Resource</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddResourceModal;
