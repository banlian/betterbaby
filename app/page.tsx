'use client';

import { useState, useEffect } from 'react';
import DigitalClock from '@/components/DigitalClock';
import Timeline from '@/components/Timeline';
import ProjectProgress from '@/components/ProjectProgress';
import ActivityModal from '@/components/ActivityModal';
import { BabyActivity, ActivityType } from '@/types';
import { generateId } from '@/lib/utils';

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
        {/* 上方三分之一 - 数字时钟 */}
        <div className="h-1/3 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
          <DigitalClock />
        </div>

        {/* 下方三分之二 - 项目进度和时间轴 */}
        <div className="h-2/3 flex">
          {/* 左侧 - 项目进度 */}
          <div className="w-1/2 border-r border-gray-700">
            <ProjectProgress 
              activities={activities}
              onProjectClick={handleQuickAdd}
            />
          </div>

          {/* 右侧 - 时间轴 */}
          <div className="w-1/2">
            <Timeline 
              activities={activities}
              onAddActivity={handleAddActivity}
              onActivityClick={handleActivityClick}
            />
          </div>
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