import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import {
  getMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '@/services/materialService';
import {
  Material,
  CreateMaterialData,
  UpdateMaterialData,
  MaterialFilters,
} from '@/types/material';

// Query keys
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (filters?: MaterialFilters) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
};

// Hook to fetch all materials with filters
export const useMaterials = (filters?: MaterialFilters) => {
  return useQuery({
    queryKey: materialKeys.list(filters),
    queryFn: () => getMaterials(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single material by ID
export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: () => getMaterialById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaterial,
    onSuccess: (newMaterial) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      
      toast.success('Material added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add material');
    },
  });
};

// Hook to update a material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialData }) =>
      updateMaterial(id, data),
    onSuccess: (updatedMaterial) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      
      // Update the specific material in cache
      if (updatedMaterial._id) {
        queryClient.setQueryData(
          materialKeys.detail(updatedMaterial._id),
          updatedMaterial
        );
      }
      
      toast.success('Material updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update material');
    },
  });
};

// Hook to delete a material
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      
      // Remove the specific material from cache
      queryClient.removeQueries({ queryKey: materialKeys.detail(deletedId) });
      
      toast.success('Material deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete material');
    },
  });
}; 