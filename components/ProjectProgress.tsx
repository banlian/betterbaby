'use client';

import { useMemo } from 'react';
import { BabyActivity, ActivityType } from '@/types';
import { getActivityConfig, formatTime } from '@/lib/utils';

interface ProjectProgressProps {
  activities: BabyActivity[];
  onProjectClick: (type: ActivityType) => void;
}

export default function ProjectProgress({ activities, onProjectClick }: ProjectProgressProps) {
  // 按类型分组活动
  const projectStats = useMemo(() => {
    const stats: Record<ActivityType, { count: number; activities: BabyActivity[] }> = {
      feeding: { count: 0, activities: [] },
      diaper: { count: 0, activities: [] },
      sleep: { count: 0, activities: [] },
      play: { count: 0, activities: [] },
      bath: { count: 0, activities: [] },
      medicine: { count: 0, activities: [] },
      custom: { count: 0, activities: [] }
    };

    activities.forEach(activity => {
      if (stats[activity.type]) {
        stats[activity.type].count++;
        stats[activity.type].activities.push(activity);
      }
    });

    return stats;
  }, [activities]);

  // 获取今日开始时间
  const todayStart = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // 计算进度百分比
  const getProgressPercentage = (type: ActivityType) => {
    const config = getActivityConfig(type);
    const targetFrequency = config.targetFrequency || 8; // 默认目标次数
    const currentCount = projectStats[type].count;
    return Math.min((currentCount / targetFrequency) * 100, 100);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">项目进度</h2>
        <p className="text-sm text-gray-400">今日活动统计</p>
      </div>

      {/* 项目列表 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {Object.entries(projectStats).map(([type, stats]) => {
          const config = getActivityConfig(type as ActivityType);
          const progress = getProgressPercentage(type as ActivityType);
          const lastActivity = stats.activities[stats.activities.length - 1];

          return (
            <div
              key={type}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onProjectClick(type as ActivityType)}
            >
              {/* 项目头部 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{config.name}</h3>
                    <p className="text-sm text-gray-400">
                      {stats.count} 次 / 今日
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{stats.count}</div>
                  <div className="text-xs text-gray-400">次数</div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>进度</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: config.color
                    }}
                  />
                </div>
              </div>

              {/* 最后活动时间 */}
              {lastActivity && (
                <div className="text-xs text-gray-400">
                  最后: {formatTime(lastActivity.timestamp)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 快速添加按钮 */}
      <div className="p-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-2">
          {['feeding', 'diaper', 'sleep'].map((type) => {
            const config = getActivityConfig(type as ActivityType);
            return (
              <button
                key={type}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => onProjectClick(type as ActivityType)}
              >
                <div className="text-2xl mb-1">{config.icon}</div>
                <div className="text-xs text-white">{config.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 