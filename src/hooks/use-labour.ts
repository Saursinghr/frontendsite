import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import {
  getLabour,
  getLabourById,
  createLabour,
  updateLabour,
  deleteLabour,
} from '@/services/labourService';
import {
  Labour,
  CreateLabourData,
  UpdateLabourData,
  LabourFilters,
} from '@/types/labour';

// Query keys
export const labourKeys = {
  all: ['labour'] as const,
  lists: () => [...labourKeys.all, 'list'] as const,
  list: (filters?: LabourFilters) => [...labourKeys.lists(), filters] as const,
  details: () => [...labourKeys.all, 'detail'] as const,
  detail: (id: string) => [...labourKeys.details(), id] as const,
};

// Hook to fetch all labour with filters
export const useLabour = (filters?: LabourFilters) => {
  return useQuery({
    queryKey: labourKeys.list(filters),
    queryFn: () => getLabour(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single labour by ID
export const useLabourById = (id: string) => {
  return useQuery({
    queryKey: labourKeys.detail(id),
    queryFn: () => getLabourById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new labour entry
export const useCreateLabour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLabour,
    onSuccess: (newLabour) => {
      // Invalidate and refetch labour list
      queryClient.invalidateQueries({ queryKey: labourKeys.lists() });
      
      toast.success('Labour entry added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add labour entry');
    },
  });
};

// Hook to update a labour entry
export const useUpdateLabour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabourData }) =>
      updateLabour(id, data),
    onSuccess: (updatedLabour) => {
      // Invalidate and refetch labour list
      queryClient.invalidateQueries({ queryKey: labourKeys.lists() });
      
      // Update the specific labour in cache
      if (updatedLabour._id) {
        queryClient.setQueryData(
          labourKeys.detail(updatedLabour._id),
          updatedLabour
        );
      }
      
      toast.success('Labour entry updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update labour entry');
    },
  });
};

// Hook to delete a labour entry
export const useDeleteLabour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLabour,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch labour list
      queryClient.invalidateQueries({ queryKey: labourKeys.lists() });
      
      // Remove the specific labour from cache
      queryClient.removeQueries({ queryKey: labourKeys.detail(deletedId) });
      
      toast.success('Labour entry deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete labour entry');
    },
  });
}; 