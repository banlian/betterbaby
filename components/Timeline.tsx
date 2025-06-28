'use client';

import { useState, useMemo } from 'react';
import { BabyActivity, ActivityType } from '@/types';
import { getActivityConfig, getTimeSlotIndex, generateId } from '@/lib/utils';

interface TimelineProps {
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
}

export default function Timeline({ activities, onAddActivity, onActivityClick }: TimelineProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 生成时间槽
  const timeSlots = useMemo(() => {
    return Array.from({ length: 144 }, (_, i) => {
      const hour = Math.floor(i / 6);
      const minute = (i % 6) * 10;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // 获取该时间槽的活动
      const slotActivities = activities.filter(activity => {
        const activitySlot = getTimeSlotIndex(activity.timestamp);
        return activitySlot === i;
      });

      return {
        time,
        hour,
        minute,
        activities: slotActivities
      };
    });
  }, [activities]);

  const handleTimeSlotClick = (slotIndex: number) => {
    setSelectedTimeSlot(slotIndex);
    setShowAddModal(true);
  };

  const handleAddActivity = (type: ActivityType, details?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      const newActivity: BabyActivity = {
        id: generateId(),
        type,
        timestamp: new Date(new Date().setHours(slot.hour, slot.minute, 0, 0)),
        details
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 时间轴标题 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">今日时间轴</h2>
        <div className="text-sm text-gray-400">24小时 / 10分钟刻度</div>
      </div>

      {/* 时间轴主体 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="relative">
          {/* 时间刻度 */}
          <div className="flex mb-4">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-xs text-gray-500">
                {i.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* 时间轴轨道 */}
          <div className="relative h-16 bg-gray-800 rounded-lg overflow-hidden">
            {/* 时间槽 */}
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className="absolute top-0 h-full border-r border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors"
                style={{ left: `${(index / 143) * 100}%`, width: `${100 / 143}%` }}
                onClick={() => handleTimeSlotClick(index)}
              >
                {/* 活动标记 */}
                {slot.activities.map((activity, activityIndex) => {
                  const config = getActivityConfig(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer project-icon"
                      style={{ 
                        backgroundColor: config.color,
                        zIndex: activityIndex + 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick(activity);
                      }}
                      title={`${config.name} - ${slot.time}`}
                    >
                      {config.icon}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* 当前时间指示器 */}
            <div
              className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
              style={{ 
                left: `${(getTimeSlotIndex(new Date()) / 143) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* 添加活动模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">
              添加活动 - {selectedTimeSlot !== null ? timeSlots[selectedTimeSlot].time : ''}
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(getActivityConfig('feeding')).map(([type, config]) => (
                <button
                  key={type}
                  className="p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  onClick={() => handleAddActivity(type as ActivityType)}
                >
                  <div className="text-2xl mb-1">{config.icon}</div>
                  <div className="text-sm text-white">{config.name}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 