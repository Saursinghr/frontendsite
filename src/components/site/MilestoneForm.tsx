import React from 'react';
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Milestone } from '../../services/milestoneService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MilestoneFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Milestone, '_id'>) => Promise<void>;
    initialData?: Milestone;
    siteId: string;
}

export const MilestoneForm: React.FC<MilestoneFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    siteId,
}) => {
    const [formData, setFormData] = React.useState<Omit<Milestone, '_id'>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        startDate: initialData?.startDate || new Date(),
        endDate: initialData?.endDate || new Date(),
        status: initialData?.status || 'Not Started',
        progress: initialData?.progress || 0,
        siteId: siteId,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? 'Edit Milestone' : 'Add New Milestone'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={formData.startDate.toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setFormData({ ...formData, startDate: new Date(e.target.value) })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={formData.endDate.toISOString().split('T')[0]}
                                onChange={(e) =>
                                    setFormData({ ...formData, endDate: new Date(e.target.value) })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'Not Started' | 'In Progress' | 'Completed') =>
                                setFormData({ ...formData, status: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                <SelectItem value="Not Started" className="hover:bg-gray-50 text-gray-800">📋 Not Started</SelectItem>
                                <SelectItem value="In Progress" className="hover:bg-blue-50 text-blue-800">🔄 In Progress</SelectItem>
                                <SelectItem value="Completed" className="hover:bg-green-50 text-green-800">✅ Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="progress">Progress (%)</Label>
                        <Input
                            id="progress"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) =>
                                setFormData({ ...formData, progress: Number(e.target.value) })
                            }
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {initialData ? 'Save Changes' : 'Create Milestone'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
