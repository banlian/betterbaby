import { ActivityConfig } from '@/types';

export const ACTIVITY_CONFIGS: Record<string, ActivityConfig> = {
  feeding: {
    type: 'feeding',
    name: '喂养',
    icon: '🍼',
    color: '#3b82f6',
    description: '记录宝宝的喂养情况'
  },
  diaper: {
    type: 'diaper',
    name: '尿布',
    icon: '👶',
    color: '#10b981',
    description: '记录尿布更换情况'
  },
  sleep: {
    type: 'sleep',
    name: '睡眠',
    icon: '😴',
    color: '#8b5cf6',
    description: '记录宝宝的睡眠时间'
  },
  play: {
    type: 'play',
    name: '玩耍',
    icon: '🧸',
    color: '#f59e0b',
    description: '记录宝宝的玩耍活动'
  },
  bath: {
    type: 'bath',
    name: '洗澡',
    icon: '🛁',
    color: '#06b6d4',
    description: '记录宝宝的洗澡时间'
  },
  medicine: {
    type: 'medicine',
    name: '用药',
    icon: '💊',
    color: '#ef4444',
    description: '记录宝宝的用药情况'
  }
};

export const TIME_SLOTS = Array.from({ length: 144 }, (_, i) => {
  const hour = Math.floor(i / 6);
  const minute = (i % 6) * 10;
  return {
    time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    hour,
    minute,
    activities: []
  };
});

export const TIMEZONE = 'Asia/Shanghai'; 