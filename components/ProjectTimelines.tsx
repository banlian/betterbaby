'use client';

import { ActivityType } from '@/types';
import { getAllActivityConfigs } from '@/lib/utils';
import ProjectTimeline from './ProjectTimeline';
import { BabyActivity } from '@/types';

interface ProjectTimelinesProps {
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
  onResetActivities: () => void;
  onClearActivities?: (projectType: ActivityType) => void;
}

export default function ProjectTimelines({ 
  activities, 
  onAddActivity, 
  onActivityClick,
  onResetActivities,
  onClearActivities
}: ProjectTimelinesProps) {
  const activityConfigs = getAllActivityConfigs();

  // 清除特定类型活动的处理函数
  const handleClearActivities = (projectType: ActivityType) => {
    if (onClearActivities) {
      onClearActivities(projectType);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="text-lg font-bold text-white">宝宝活动记录</div>
        <button
          onClick={onResetActivities}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          title="清空所有活动记录"
        >
          重置活动
        </button>
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
              onClearActivities={handleClearActivities}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 