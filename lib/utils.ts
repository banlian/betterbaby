import { format, formatInTimeZone } from 'date-fns-tz';
import { zhCN } from 'date-fns/locale';
import { BabyActivity, ActivityType } from '@/types';

export function formatTime(date: Date, timezone: string = 'Asia/Shanghai'): string {
  return formatInTimeZone(date, timezone, 'HH:mm:ss', { locale: zhCN });
}

export function formatDate(date: Date, timezone: string = 'Asia/Shanghai'): string {
  return formatInTimeZone(date, timezone, 'yyyy年MM月dd日 EEEE', { locale: zhCN });
}

export function formatDateTime(date: Date, timezone: string = 'Asia/Shanghai'): string {
  return formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN });
}

export function getTimeSlotIndex(date: Date): number {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 6 + Math.floor(minutes / 10);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getActivityConfig(type: ActivityType) {
  const configs = {
    feeding: { name: '喂养', icon: '🍼', color: '#3b82f6', targetFrequency: 8 },
    diaper: { name: '尿布', icon: '👶', color: '#10b981', targetFrequency: 6 },
    sleep: { name: '睡眠', icon: '😴', color: '#8b5cf6', targetFrequency: 3 },
    play: { name: '玩耍', icon: '🧸', color: '#f59e0b', targetFrequency: 4 },
    bath: { name: '洗澡', icon: '🛁', color: '#06b6d4', targetFrequency: 1 },
    medicine: { name: '用药', icon: '💊', color: '#ef4444', targetFrequency: 2 },
    custom: { name: '自定义', icon: '📝', color: '#6b7280', targetFrequency: 5 }
  };
  return configs[type] || configs.custom;
}

export function getAllActivityConfigs() {
  return {
    feeding: { name: '喂养', icon: '🍼', color: '#3b82f6', targetFrequency: 8 },
    diaper: { name: '尿布', icon: '👶', color: '#10b981', targetFrequency: 6 },
    sleep: { name: '睡眠', icon: '😴', color: '#8b5cf6', targetFrequency: 3 },
    play: { name: '玩耍', icon: '🧸', color: '#f59e0b', targetFrequency: 4 },
    bath: { name: '洗澡', icon: '🛁', color: '#06b6d4', targetFrequency: 1 },
    medicine: { name: '用药', icon: '💊', color: '#ef4444', targetFrequency: 2 },
    custom: { name: '自定义', icon: '📝', color: '#6b7280', targetFrequency: 5 }
  };
}

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
} 