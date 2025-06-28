export interface BabyActivity {
  id: string;
  type: ActivityType;
  timestamp: Date;
  details?: string;
  duration?: number; // 分钟
}

export type ActivityType = 
  | 'feeding' 
  | 'diaper' 
  | 'sleep' 
  | 'play' 
  | 'bath' 
  | 'medicine' 
  | 'custom';

export interface ActivityConfig {
  type: ActivityType;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
  activities: BabyActivity[];
}

export interface Project {
  id: string;
  name: string;
  type: ActivityType;
  icon: string;
  color: string;
  activities: BabyActivity[];
  targetFrequency?: number; // 每日目标次数
} 