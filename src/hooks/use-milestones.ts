import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import {
  getMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  updateMilestoneProgress,
  deleteMilestone,
} from '@/services/milestoneService';
import {
  Milestone,
  CreateMilestoneData,
  UpdateMilestoneData,
  MilestoneFilters,
} from '@/types/milestone';

// Query keys
export const milestoneKeys = {
  all: ['milestones'] as const,
  lists: () => [...milestoneKeys.all, 'list'] as const,
  list: (filters?: MilestoneFilters) => [...milestoneKeys.lists(), filters] as const,
  details: () => [...milestoneKeys.all, 'detail'] as const,
  detail: (id: string) => [...milestoneKeys.details(), id] as const,
};

// Hook to fetch all milestones with filters
export const useMilestones = (filters?: MilestoneFilters) => {
  return useQuery({
    queryKey: milestoneKeys.list(filters),
    queryFn: () => getMilestones(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single milestone by ID
export const useMilestone = (id: string) => {
  return useQuery({
    queryKey: milestoneKeys.detail(id),
    queryFn: () => getMilestoneById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new milestone
export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMilestone,
    onSuccess: (newMilestone) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      
      toast.success('Milestone created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create milestone');
    },
  });
};

// Hook to update a milestone
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMilestoneData }) =>
      updateMilestone(id, data),
    onSuccess: (updatedMilestone) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      
      // Update the specific milestone in cache
      if (updatedMilestone._id) {
        queryClient.setQueryData(
          milestoneKeys.detail(updatedMilestone._id),
          updatedMilestone
        );
      }
      
      toast.success('Milestone updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update milestone');
    },
  });
};

// Hook to update milestone progress
export const useUpdateMilestoneProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, progress }: { id: string; progress: number }) =>
      updateMilestoneProgress(id, progress),
    onSuccess: (updatedMilestone) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      
      // Update the specific milestone in cache
      if (updatedMilestone._id) {
        queryClient.setQueryData(
          milestoneKeys.detail(updatedMilestone._id),
          updatedMilestone
        );
      }
      
      toast.success('Progress updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update progress');
    },
  });
};

// Hook to delete a milestone
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMilestone,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch milestones list
      queryClient.invalidateQueries({ queryKey: milestoneKeys.lists() });
      
      // Remove the specific milestone from cache
      queryClient.removeQueries({ queryKey: milestoneKeys.detail(deletedId) });
      
      toast.success('Milestone deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete milestone');
    },
  });
}; 