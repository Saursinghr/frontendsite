import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Material } from "@/types/material";
import { updateMaterial, deleteMaterial } from '@/services/materialService';
import { toast } from 'sonner';

interface UpdateMaterialDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void; // callback to refresh materials
}

const UpdateMaterialDialog: React.FC<UpdateMaterialDialogProps> = ({
  material,
  open,
  onOpenChange,
  onUpdated,
}) => {
  const [formData, setFormData] = useState<Partial<Material>>(material || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData(material);
    }
  }, [material]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matId = material?._id;
    if (!matId) return;
    setLoading(true);
    try {
      // Create update data object with correct properties
      const updateData = {
        material: formData.material,
        quantity: formData.quantity,
        unit: formData.unit,
        status: formData.status,
        stockLevel: formData.stockLevel,
        purpose: formData.purpose,
        storageLocation: formData.storageLocation,
        projectId: material?.projectId
      };
      
      await updateMaterial(matId, updateData);
      toast.success('Material updated successfully');
      onOpenChange(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update material');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const matId = material?._id;
    if (!matId) return;
    setLoading(true);
    try {
      await deleteMaterial(matId);
      toast.success('Material deleted successfully');
      onOpenChange(false);
      if (onUpdated) onUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete material');
    } finally {
      setLoading(false);
    }
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] md:max-w-[700px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white p-4 md:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg md:text-xl font-semibold">Update Material</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Material Name - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="material" className="text-sm font-medium">Material Name</Label>
            <Input
              id="material"
              name="material"
              value={formData.material || ""}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Quantity and Unit - Side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                value={formData.quantity || ""}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium">Unit</Label>
              <Input
                id="unit"
                name="unit"
                value={formData.unit || ""}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Status and Stock Level - Side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || "In Stock"}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockLevel" className="text-sm font-medium">Stock Level</Label>
              <Input
                id="stockLevel"
                name="stockLevel"
                value={formData.stockLevel || ""}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Purpose - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium">Purpose</Label>
            <Input
              id="purpose"
              name="purpose"
              value={formData.purpose || ""}
              onChange={handleChange}
              placeholder="Enter purpose for this material"
              className="w-full"
            />
          </div>

          {/* Storage Location - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="storageLocation" className="text-sm font-medium">Storage Location</Label>
            <Input
              id="storageLocation"
              name="storageLocation"
              value={formData.storageLocation || ""}
              onChange={handleChange}
              placeholder="Enter storage location"
              className="w-full"
            />
          </div>

          {/* Project ID - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="projectId" className="text-sm font-medium">Project ID (Site)</Label>
            <Input
              id="projectId"
              name="projectId"
              value={formData.projectId || ""}
              readOnly
              className="w-full bg-gray-50"
            />
          </div>

          {/* Buttons - Responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMaterialDialog;
