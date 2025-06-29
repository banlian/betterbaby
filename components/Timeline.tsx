'use client';

import { useState, useMemo, useEffect } from 'react';
import { BabyActivity, ActivityType } from '@/types';
import { getActivityConfig, getTimeSlotIndex, generateId, getAllActivityConfigs } from '@/lib/utils';
import FeedingForm from './FeedingForm';
import DiaperForm from './DiaperForm';
import SleepForm from './SleepForm';

interface TimelineProps {
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
}

interface FeedingDetails {
  time: string;
  amount: number;
  category: 'milk' | 'food';
}

interface DiaperDetails {
  time: string;
  type: 'wet' | 'dirty' | 'both';
  status: 'normal' | 'unusual';
}

interface SleepDetails {
  time: string;
  type: 'nap' | 'night';
  duration: number;
}

export default function Timeline({ activities, onAddActivity, onActivityClick }: TimelineProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // 客户端时间管理
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleActivityTypeSelect = (type: ActivityType) => {
    setSelectedActivityType(type);
    if (type === 'feeding' || type === 'diaper' || type === 'sleep') {
      // 如果是需要详细表单的活动，直接显示对应表单
      return;
    }
    // 其他活动直接添加
    handleAddActivity(type);
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
      setSelectedActivityType(null);
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
      setSelectedActivityType(null);
    }
  };

  const handleDiaperSubmit = (diaperDetails: DiaperDetails, notes?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(new Date().setHours(slot.hour, slot.minute, 0, 0));
      
      // 如果用户调整了时间，使用调整后的时间
      if (diaperDetails.time && diaperDetails.time !== slot.time) {
        const [hours, minutes] = diaperDetails.time.split(':').map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }
      
      // 生成活动详情
      const typeText = {
        wet: '尿尿',
        dirty: '便便',
        both: '尿尿+便便'
      }[diaperDetails.type];
      
      const statusText = diaperDetails.status === 'normal' ? '正常' : '异常';
      const activityDetails = `${typeText} (${statusText})${notes ? ` - ${notes}` : ''}`;
      
      const newActivity: BabyActivity = {
        id: generateId(),
        type: 'diaper',
        timestamp: activityTime,
        details: activityDetails
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
      setSelectedActivityType(null);
    }
  };

  const handleSleepSubmit = (sleepDetails: SleepDetails, notes?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(new Date().setHours(slot.hour, slot.minute, 0, 0));
      
      // 如果用户调整了时间，使用调整后的时间
      if (sleepDetails.time && sleepDetails.time !== slot.time) {
        const [hours, minutes] = sleepDetails.time.split(':').map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }
      
      // 生成活动详情
      const typeText = sleepDetails.type === 'nap' ? '小睡' : '夜间睡眠';
      const durationText = sleepDetails.duration >= 60 
        ? `${Math.floor(sleepDetails.duration / 60)}小时${sleepDetails.duration % 60 > 0 ? sleepDetails.duration % 60 + '分钟' : ''}`
        : `${sleepDetails.duration}分钟`;
      const activityDetails = `${typeText} ${durationText}${notes ? ` - ${notes}` : ''}`;
      
      const newActivity: BabyActivity = {
        id: generateId(),
        type: 'sleep',
        timestamp: activityTime,
        details: activityDetails
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
      setSelectedActivityType(null);
    }
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
    setSelectedTimeSlot(null);
    setSelectedActivityType(null);
  };

  const handleBackToActivitySelection = () => {
    setSelectedActivityType(null);
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
          <div className="relative mb-4 h-4">
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
                {i.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* 时间轴轨道 */}
          <div className="relative h-20 bg-gray-800 rounded-lg overflow-hidden">
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
                  className={`absolute top-0 h-full border-r border-gray-700/30 cursor-pointer hover:bg-gray-700/50 transition-colors ${
                    isEvenHour ? 'bg-gray-700/10' : ''
                  }`}
                  style={{ left: `${(index / 143) * 100}%`, width: `${100 / 143}%` }}
                  onClick={() => handleTimeSlotClick(index)}
                >
                  {/* 活动标记 */}
                  {slot.activities.map((activity, activityIndex) => {
                    const config = getActivityConfig(activity.type);
                    return (
                      <div key={activity.id} className="relative">
                        <div
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
                        {/* 时间标签 */}
                        <div
                          className="absolute top-8 left-0 text-xs text-gray-300 bg-gray-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-gray-600 whitespace-nowrap shadow-sm hover:bg-gray-700/90 hover:text-white transition-colors"
                          style={{ 
                            zIndex: activityIndex + 1,
                            left: `${activityIndex * 25}px`
                          }}
                        >
                          {slot.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* 当前时间指示器 - 只在客户端显示 */}
            {isClient && currentTime && (
              <div
                className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
                style={{ 
                  left: `${(getTimeSlotIndex(currentTime) / 143) * 100}%` 
                }}
              />
            )}
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
            
            {!selectedActivityType ? (
              // 活动类型选择
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(getAllActivityConfigs()).map(([type, config]) => (
                  <button
                    key={type}
                    className="flex items-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    onClick={() => handleActivityTypeSelect(type as ActivityType)}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: config.color }}
                    >
                      {config.icon}
                    </div>
                    <span className="text-white">{config.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              // 活动详情输入
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: getActivityConfig(selectedActivityType).color }}
                  >
                    {getActivityConfig(selectedActivityType).icon}
                  </div>
                  <span className="text-white font-medium">
                    {getActivityConfig(selectedActivityType).name}
                  </span>
                </div>
                
                <textarea
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="添加详情（可选）"
                  rows={3}
                  id="activity-details"
                />
              </div>
            )}

            <div className="flex gap-2 mt-6">
              {selectedActivityType && (
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  onClick={() => setSelectedActivityType(null)}
                >
                  返回
                </button>
              )}
              <button
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedTimeSlot(null);
                  setSelectedActivityType(null);
                }}
              >
                取消
              </button>
              {selectedActivityType && (
                <button
                  className="flex-1 px-4 py-2 text-white rounded transition-colors"
                  style={{ backgroundColor: getActivityConfig(selectedActivityType).color }}
                  onClick={() => {
                    const details = (document.getElementById('activity-details') as HTMLTextAreaElement)?.value;
                    handleAddActivity(selectedActivityType, details);
                  }}
                >
                  添加
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 