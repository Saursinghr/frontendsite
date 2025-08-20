import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllWeeks, createWeek, updateTaskStatus, updateWeek } from '@/services/weekService';
import { Week } from '@/types/week';

export const useWeeks = (siteId?: string) => {
  return useQuery<Week[]>({
    queryKey: ['weeks', siteId],
    queryFn: () => getAllWeeks(siteId),
  });
};

export const useUpdateWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWeek,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weeks'] }),
  });
};

export const useCreateWeek = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWeek,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weeks'] }),
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weekId, taskIndex, status }: { weekId: string; taskIndex: number; status: 'open' | 'closed' }) => updateTaskStatus(weekId, taskIndex, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weeks'] }),
  });
};