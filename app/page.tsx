'use client';

import { useState, useEffect } from 'react';
import DigitalClock from '@/components/DigitalClock';
import DailyStats from '@/components/DailyStats';
import ProjectTimelines from '@/components/ProjectTimelines';
import ActivityModal from '@/components/ActivityModal';
import { BabyActivity, ActivityType } from '@/types';
import { generateId, getActivityConfig } from '@/lib/utils';

export default function Home() {
  const [activities, setActivities] = useState<BabyActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<BabyActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 从localStorage加载数据
  useEffect(() => {
    const savedActivities = localStorage.getItem('babyActivities');
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      // 转换时间戳为Date对象
      const activitiesWithDates = parsed.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
      setActivities(activitiesWithDates);
    }
  }, []);

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('babyActivities', JSON.stringify(activities));
  }, [activities]);

  // 添加活动
  const handleAddActivity = (activity: BabyActivity) => {
    setActivities(prev => [...prev, activity]);
  };

  // 删除活动
  const handleDeleteActivity = (activity: BabyActivity) => {
    setActivities(prev => prev.filter(a => a.id !== activity.id));
  };

  // 重置所有活动
  const handleResetActivities = () => {
    if (window.confirm('确定要清空所有活动记录吗？此操作不可撤销。')) {
      setActivities([]);
      localStorage.removeItem('babyActivities');
    }
  };

  // 清除特定类型的活动
  const handleClearActivities = (projectType: ActivityType) => {
    const activityConfig = getActivityConfig(projectType);
    if (window.confirm(`确定要清除所有 ${activityConfig.name} 活动吗？此操作不可撤销。`)) {
      setActivities(prev => prev.filter(activity => activity.type !== projectType));
    }
  };

  // 点击活动
  const handleActivityClick = (activity: BabyActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  // 快速添加活动
  const handleQuickAdd = (type: ActivityType) => {
    const newActivity: BabyActivity = {
      id: generateId(),
      type,
      timestamp: new Date()
    };
    handleAddActivity(newActivity);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 主布局 */}
      <div className="h-screen flex flex-col">
        {/* 上方 - 数字时钟 */}
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
          <DigitalClock />
        </div>


        {/* 下方 - 项目时间轴 */}
        <div className="flex-1">
          <ProjectTimelines 
            activities={activities}
            onAddActivity={handleAddActivity}
            onActivityClick={handleActivityClick}
            onResetActivities={handleResetActivities}
            onClearActivities={handleClearActivities}
          />
        </div>
      </div>

      {/* 活动详情模态框 */}
      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
        }}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
} 