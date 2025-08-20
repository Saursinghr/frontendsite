import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateMaterialData } from "@/types/material";
import { useCreateMaterial } from "@/hooks/use-materials";

const addMaterialSchema = z.object({
  material: z.string().min(1, 'Material name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required'),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']),
  stockLevel: z.string().min(1, 'Stock Level is required'),
  date: z.string().min(1, 'Date is required'),
  projectId: z.string().min(1, 'Project ID is required'),
});

type FormData = z.infer<typeof addMaterialSchema>;

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSiteId?: string;
}

const AddMaterialDialog: React.FC<AddMaterialDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedSiteId 
}) => {
  const createMaterial = useCreateMaterial();

  const form = useForm<FormData>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      material: '',
      quantity: '',
      unit: '',
      status: 'In Stock',
      stockLevel: '',
      date: new Date().toISOString().split('T')[0],
      projectId: selectedSiteId || '',
    },
  });

  // Always set projectId to selectedSiteId when dialog opens
  useEffect(() => {
    if (open && selectedSiteId) {
      form.setValue('projectId', selectedSiteId);
    }
  }, [open, selectedSiteId, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const materialData: CreateMaterialData = {
        material: data.material,
        quantity: data.quantity,
        unit: data.unit,
        status: data.status,
        stockLevel: data.stockLevel,
        date: data.date,
        projectId: selectedSiteId || data.projectId,
      };

      await createMaterial.mutateAsync(materialData);
      // Reset form and close dialog
      form.reset({
        material: '',
        quantity: '',
        unit: '',
        status: 'In Stock',
        stockLevel: '',
        date: new Date().toISOString().split('T')[0],
        projectId: selectedSiteId || '',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating material:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] p-4 bg-white">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter material name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded px-2 py-2">
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level (%) *</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="Enter stock level (0-100)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter project ID" 
                      {...field} 
                      value={selectedSiteId || field.value}
                      readOnly={!!selectedSiteId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createMaterial.isPending}
              >
                {createMaterial.isPending ? 'Adding...' : 'Add Material'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaterialDialog;
