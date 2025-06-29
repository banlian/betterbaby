'use client';

import { useMemo, useState, useEffect } from 'react';
import { BabyActivity, ActivityType } from '@/types';
import { getActivityConfig, getAllActivityConfigs, formatTime } from '@/lib/utils';

interface DailyStatsProps {
  activities: BabyActivity[];
}

export default function DailyStats({ activities }: DailyStatsProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  const activityConfigs = getAllActivityConfigs();

  // 客户端时间管理
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算时间差的函数
  const getTimeDifference = (lastTime: Date): string => {
    if (!isClient || !currentTime) return '--:--';
    
    const diffMs = currentTime.getTime() - lastTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}小时${diffMinutes}分钟`;
    } else {
      return `${diffMinutes}分钟`;
    }
  };

  // 计算今日各项目统计和上次时间
  const dailyStats = useMemo(() => {
    if (!isClient || !currentTime) {
      // 在服务器端或客户端时间未初始化时，返回空统计
      const emptyStats: Record<ActivityType, { count: number; lastTime: Date | null }> = {
        feeding: { count: 0, lastTime: null },
        diaper: { count: 0, lastTime: null },
        sleep: { count: 0, lastTime: null },
        play: { count: 0, lastTime: null },
        bath: { count: 0, lastTime: null },
        medicine: { count: 0, lastTime: null },
        custom: { count: 0, lastTime: null }
      };
      return emptyStats;
    }

    const todayStart = new Date(currentTime);
    todayStart.setHours(0, 0, 0, 0);
    
    const todayActivities = activities.filter(activity => 
      activity.timestamp >= todayStart
    );

    const stats: Record<ActivityType, { count: number; lastTime: Date | null }> = {
      feeding: { count: 0, lastTime: null },
      diaper: { count: 0, lastTime: null },
      sleep: { count: 0, lastTime: null },
      play: { count: 0, lastTime: null },
      bath: { count: 0, lastTime: null },
      medicine: { count: 0, lastTime: null },
      custom: { count: 0, lastTime: null }
    };

    // 计算今日统计
    todayActivities.forEach(activity => {
      if (stats[activity.type]) {
        stats[activity.type].count++;
      }
    });

    // 计算每个项目的上次时间（包括今天和之前的所有活动）
    activities.forEach(activity => {
      if (stats[activity.type] && (!stats[activity.type].lastTime || activity.timestamp > stats[activity.type].lastTime!)) {
        stats[activity.type].lastTime = activity.timestamp;
      }
    });

    return stats;
  }, [activities, isClient, currentTime]);

  // 计算总次数
  const totalActivities = useMemo(() => {
    return Object.values(dailyStats).reduce((sum, stat) => sum + stat.count, 0);
  }, [dailyStats]);

  return (
    <div className="w-full bg-gray-800 border-b border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">今日统计</h3>
          <div className="text-2xl font-bold text-blue-400">{totalActivities}</div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(activityConfigs).map(([type, config]) => {
            const stat = dailyStats[type as ActivityType];
            const progress = Math.min((stat.count / (config.targetFrequency || 8)) * 100, 100);
            
            return (
              <div key={type} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.icon}
                  </div>
                  <span className="text-white font-semibold">{stat.count}</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">{config.name}</div>
                
                {/* 显示上次时间和已过去时间 */}
                {stat.lastTime && (
                  <div className="text-sm text-gray-300 mb-1">
                    <div>上次: <br/> {formatTime(stat.lastTime)}</div>
                    <div className="text-yellow-400 font-bold text-sm ml-2">
                      已过去: <br/> {getTimeDifference(stat.lastTime)}
                    </div>
                  </div>
                )}
                
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
            );
          })}
        </div>
      </div>
    </div>
  );
} 