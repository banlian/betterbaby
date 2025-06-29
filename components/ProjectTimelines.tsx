'use client';

import { ActivityType } from '@/types';
import { getAllActivityConfigs } from '@/lib/utils';
import ProjectTimeline from './ProjectTimeline';
import { BabyActivity } from '@/types';

interface ProjectTimelinesProps {
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
}

export default function ProjectTimelines({ 
  activities, 
  onAddActivity, 
  onActivityClick 
}: ProjectTimelinesProps) {
  const activityConfigs = getAllActivityConfigs();

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">项目时间轴</h2>
        <p className="text-sm text-gray-400">每个项目的独立时间轴</p>
      </div>

      {/* 时间轴列表 - 每个项目占一行 */}
      <div className="flex-1 overflow-auto">
        {Object.entries(activityConfigs).map(([type, config]) => (
          <div key={type} className="h-40 border-b border-gray-700">
            <ProjectTimeline
              projectType={type as ActivityType}
              activities={activities}
              onAddActivity={onAddActivity}
              onActivityClick={onActivityClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 