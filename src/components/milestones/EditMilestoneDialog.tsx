import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Milestone, UpdateMilestoneData } from '@/types/milestone';
import { useUpdateMilestone } from '@/hooks/use-milestones';

const formSchema = z.object({
  actualCompletion: z.date().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'On Hold']),
  progress: z.number().min(0).max(100),
});

type FormData = z.infer<typeof formSchema>;

interface EditMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: Milestone | null;
}

export const EditMilestoneDialog: React.FC<EditMilestoneDialogProps> = ({
  open,
  onOpenChange,
  milestone,
}) => {
  const { mutate: updateMilestone, isPending } = useUpdateMilestone();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'Pending',
      progress: 0,
    },
  });

  // Update form values when milestone changes
  useEffect(() => {
    if (milestone) {
      form.reset({
        actualCompletion: milestone.actualCompletion ? new Date(milestone.actualCompletion) : undefined,
        status: milestone.status,
        progress: milestone.progress,
      });
    }
  }, [milestone, form]);

  const onSubmit = (data: FormData) => {
    if (!milestone?._id) return;

    const updateData: UpdateMilestoneData = {
      actualCompletion: data.actualCompletion ? data.actualCompletion.toISOString() : null,
      status: data.status,
      progress: data.progress,
    };

    updateMilestone({ id: milestone._id, data: updateData }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
          <DialogDescription>
            Update milestone details. Make changes and save when ready.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="Pending" className="hover:bg-yellow-50 text-yellow-800">⏳ Pending</SelectItem>
                      <SelectItem value="In Progress" className="hover:bg-blue-50 text-blue-800">🔄 In Progress</SelectItem>
                      <SelectItem value="Completed" className="hover:bg-green-50 text-green-800">✅ Completed</SelectItem>
                      <SelectItem value="On Hold" className="hover:bg-red-50 text-red-800">⏸️ On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      placeholder="0"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualCompletion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Not completed yet</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Milestone'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 