'use client';

import { useState, useMemo } from 'react';
import { BabyActivity, ActivityType } from '@/types';
import { getActivityConfig, getTimeSlotIndex, generateId } from '@/lib/utils';
import FeedingForm from './FeedingForm';

interface ProjectTimelineProps {
  projectType: ActivityType;
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
}

interface FeedingDetails {
  time: string;
  amount: number;
  category: 'milk' | 'food';
}

export default function ProjectTimeline({ 
  projectType, 
  activities, 
  onAddActivity, 
  onActivityClick 
}: ProjectTimelineProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const config = getActivityConfig(projectType);

  // 过滤出当前项目的活动
  const projectActivities = useMemo(() => {
    return activities.filter(activity => activity.type === projectType);
  }, [activities, projectType]);

  // 生成时间槽
  const timeSlots = useMemo(() => {
    return Array.from({ length: 144 }, (_, i) => {
      const hour = Math.floor(i / 6);
      const minute = (i % 6) * 10;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // 获取该时间槽的活动
      const slotActivities = projectActivities.filter(activity => {
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
  }, [projectActivities]);

  const handleTimeSlotClick = (slotIndex: number) => {
    setSelectedTimeSlot(slotIndex);
    setShowAddModal(true);
  };

  const handleAddActivity = (details?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      const newActivity: BabyActivity = {
        id: generateId(),
        type: projectType,
        timestamp: new Date(new Date().setHours(slot.hour, slot.minute, 0, 0)),
        details
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleFeedingSubmit = (feedingDetails: FeedingDetails, notes?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(new Date().setHours(slot.hour, slot.minute, 0, 0));
      
      // 如果用户调整了时间，使用调整后的时间
      if (feedingDetails.time && feedingDetails.time !== slot.time) {
        const [hours, minutes] = feedingDetails.time.split(':').map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }
      
      // 生成活动详情
      const categoryText = feedingDetails.category === 'milk' ? '奶粉' : '辅食';
      const activityDetails = `${categoryText} ${feedingDetails.amount}ml${notes ? ` - ${notes}` : ''}`;
      
      const newActivity: BabyActivity = {
        id: generateId(),
        type: 'feeding',
        timestamp: activityTime,
        details: activityDetails
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
    setSelectedTimeSlot(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-800">
      {/* 项目时间轴标题 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: config.color }}
          >
            {config.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{config.name}</h3>
            <p className="text-xs text-gray-400">{projectActivities.length} 次活动</p>
          </div>
        </div>
        <div className="text-xs text-gray-400">10分钟刻度</div>
      </div>

      {/* 时间轴主体 */}
      <div className="flex-1 overflow-hidden p-3">
        <div className="relative">
          {/* 时间刻度 */}
          <div className="relative mb-1 h-4">
            {Array.from({ length: 25 }, (_, i) => (
              <div 
                key={i} 
                className={`absolute text-center text-xs ${
                  i % 6 === 0 ? 'text-gray-300 font-semibold' : 'text-gray-500'
                }`}
                style={{ 
                  left: `${(i * 6 / 143) * 100}%`,
                  transform: 'translateX(-50%)',
                  width: '20px'
                }}
              >
                {i.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* 时间轴轨道 */}
          <div className="relative h-10 bg-gray-700 rounded overflow-hidden">
            {/* 小时分隔线 */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="absolute top-0 h-full border-r border-gray-500/50"
                style={{ left: `${(hour * 6 / 143) * 100}%` }}
              />
            ))}
            
            {/* 时间槽 */}
            {timeSlots.map((slot, index) => {
              const hour = Math.floor(index / 6);
              const isEvenHour = hour % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`absolute top-0 h-full border-r border-gray-600/30 cursor-pointer hover:bg-gray-600/50 transition-colors ${
                    isEvenHour ? 'bg-gray-600/10' : ''
                  }`}
                  style={{ left: `${(index / 143) * 100}%`, width: `${100 / 143}%` }}
                  onClick={() => handleTimeSlotClick(index)}
                >
                  {/* 活动标记 */}
                  {slot.activities.map((activity, activityIndex) => (
                    <div key={activity.id} className="relative">
                      <div
                        className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center text-xs cursor-pointer"
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
                      {/* 时间标签 */}
                      <div
                        className="absolute top-6 left-0 text-xs text-gray-300 bg-gray-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-gray-600 whitespace-nowrap shadow-sm hover:bg-gray-700/90 hover:text-white transition-colors"
                        style={{ 
                          zIndex: activityIndex + 1,
                          left: `${activityIndex * 20}px`
                        }}
                      >
                        {slot.time}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

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
              添加 {config.name} - {selectedTimeSlot !== null ? timeSlots[selectedTimeSlot].time : ''}
            </h3>
            
            {projectType === 'feeding' ? (
              // 喂养活动专用表单
              <FeedingForm
                initialTime={selectedTimeSlot !== null ? timeSlots[selectedTimeSlot].time : ''}
                onSubmit={handleFeedingSubmit}
                onCancel={handleModalCancel}
              />
            ) : (
              // 其他活动的通用表单
              <div className="mb-4">
                <textarea
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="添加详情（可选）"
                  rows={3}
                  id="activity-details"
                />
              </div>
            )}

            {projectType !== 'feeding' && (
              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  onClick={handleModalCancel}
                >
                  取消
                </button>
                <button
                  className="flex-1 px-4 py-2 text-white rounded transition-colors"
                  style={{ backgroundColor: config.color }}
                  onClick={() => {
                    const details = (document.getElementById('activity-details') as HTMLTextAreaElement)?.value;
                    handleAddActivity(details);
                  }}
                >
                  添加
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 