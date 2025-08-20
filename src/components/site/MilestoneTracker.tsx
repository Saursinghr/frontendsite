
import React from 'react';
import { Progress } from '@/components/ui/progress';

type MilestoneTrackerProps = {
  milestones: {
    foundation: number;
    structure: number;
    plumbingElectrical: number;
    finishing: number;
  };
};

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ milestones }) => {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
      <h2 className="text-xl font-semibold">Milestone Tracker</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Foundation</span>
            <span className="text-sm font-medium">{milestones.foundation}%</span>
          </div>
          <Progress value={milestones.foundation} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Structure</span>
            <span className="text-sm font-medium">{milestones.structure}%</span>
          </div>
          <Progress value={milestones.structure} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Plumbing & Electrical</span>
            <span className="text-sm font-medium">{milestones.plumbingElectrical}%</span>
          </div>
          <Progress value={milestones.plumbingElectrical} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Finishing</span>
            <span className="text-sm font-medium">{milestones.finishing}%</span>
          </div>
          <Progress value={milestones.finishing} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
