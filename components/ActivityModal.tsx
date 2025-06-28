'use client';

import { BabyActivity } from '@/types';
import { getActivityConfig, formatDateTime } from '@/lib/utils';

interface ActivityModalProps {
  activity: BabyActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (activity: BabyActivity) => void;
}

export default function ActivityModal({ activity, isOpen, onClose, onDelete }: ActivityModalProps) {
  if (!isOpen || !activity) return null;

  const config = getActivityConfig(activity.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: config.color }}
            >
              {config.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{config.name}</h3>
              <p className="text-sm text-gray-400">活动详情</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="space-y-4">
          {/* 时间信息 */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">时间信息</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">开始时间:</span>
                <span className="text-white">{formatDateTime(activity.timestamp)}</span>
              </div>
              {activity.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-400">持续时间:</span>
                  <span className="text-white">{activity.duration} 分钟</span>
                </div>
              )}
            </div>
          </div>

          {/* 详细信息 */}
          {activity.details && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">详细信息</h4>
              <p className="text-white">{activity.details}</p>
            </div>
          )}

          {/* 活动ID */}
          <div className="text-xs text-gray-500">
            活动ID: {activity.id}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 mt-6">
          {onDelete && (
            <button
              onClick={() => {
                onDelete(activity);
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              删除
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 