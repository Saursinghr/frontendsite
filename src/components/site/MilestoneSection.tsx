import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddMilestone, useEditMilestone, useSiteMilestones } from '@/hooks/use-milestones';
import { Progress } from "@/components/ui/progress";
import { Milestone } from '@/services/milestoneService';
import { format } from 'date-fns';

interface AddMilestoneFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
}

interface MilestoneSectionProps {
  siteId: string;
}

export function MilestoneSection({ siteId }: MilestoneSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AddMilestoneFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    progress: 0
  });

  const { milestones, isLoading } = useSiteMilestones(siteId);
  const { addMilestone, isLoading: isAdding } = useAddMilestone();
  const { editMilestone, isLoading: isEditing } = useEditMilestone();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMilestone({
        ...formData,
        siteId
      });
      setIsAddDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Not Started',
        progress: 0
      });
    } catch (error) {
      console.error('Failed to add milestone:', error);
    }
  };

  const handleStatusChange = async (milestoneId: string, newStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    try {
      await editMilestone({
        id: milestoneId,
        data: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update milestone status:', error);
    }
  };

  const handleProgressChange = async (milestoneId: string, newProgress: number) => {
    try {
      await editMilestone({
        id: milestoneId,
        data: { progress: newProgress }
      });
    } catch (error) {
      console.error('Failed to update milestone progress:', error);
    }
  };

  if (isLoading) return <div>Loading milestones...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Milestones</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Milestone</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogDescription>
                Create a new milestone for this project.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Milestone'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {milestones.map((milestone: Milestone) => (
          <div key={milestone._id} className="border p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{milestone.title}</h3>
                <p className="text-sm text-gray-500">{milestone.description}</p>
              </div>
              <Select
                value={milestone.status}
                onValueChange={(value: 'Not Started' | 'In Progress' | 'Completed') => 
                  handleStatusChange(milestone._id, value)
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Not Started" className="hover:bg-gray-50 text-gray-800">📋 Not Started</SelectItem>
                  <SelectItem value="In Progress" className="hover:bg-blue-50 text-blue-800">🔄 In Progress</SelectItem>
                  <SelectItem value="Completed" className="hover:bg-green-50 text-green-800">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Progress: {milestone.progress}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={milestone.progress}
                  onChange={(e) => handleProgressChange(milestone._id, Number(e.target.value))}
                  className="w-[200px]"
                />
              </div>
              <Progress value={milestone.progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Start: {format(new Date(milestone.startDate), 'MMM d, yyyy')}</span>
                <span>End: {format(new Date(milestone.endDate), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
