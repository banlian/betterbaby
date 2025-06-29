'use client';

import { useState, useEffect } from 'react';

interface FeedingDetails {
  time: string;
  amount: number;
  category: 'milk' | 'food';
}

interface FeedingFormProps {
  initialTime: string;
  onSubmit: (details: FeedingDetails, notes?: string) => void;
  onCancel: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function FeedingForm({ initialTime, onSubmit, onCancel, onBack, showBackButton }: FeedingFormProps) {
  const [feedingDetails, setFeedingDetails] = useState<FeedingDetails>({
    time: initialTime,
    amount: 0,
    category: 'milk'
  });

  // 当初始时间变化时更新表单
  useEffect(() => {
    setFeedingDetails(prev => ({
      ...prev,
      time: initialTime
    }));
  }, [initialTime]);

  const handleSubmit = () => {
    const notes = (document.getElementById('feeding-notes') as HTMLTextAreaElement)?.value;
    onSubmit(feedingDetails, notes);
  };

  const handleReset = () => {
    setFeedingDetails({
      time: initialTime,
      amount: 0,
      category: 'milk'
    });
    const notesElement = document.getElementById('feeding-notes') as HTMLTextAreaElement;
    if (notesElement) {
      notesElement.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 时间调整 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          喂养时间
        </label>
        <input
          type="time"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          value={feedingDetails.time}
          onChange={(e) => setFeedingDetails(prev => ({ ...prev, time: e.target.value }))}
        />
      </div>

      {/* 喂养类别 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          喂养类别
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              feedingDetails.category === 'milk'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFeedingDetails(prev => ({ ...prev, category: 'milk' }))}
          >
            奶粉
          </button>
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              feedingDetails.category === 'food'
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFeedingDetails(prev => ({ ...prev, category: 'food' }))}
          >
            辅食
          </button>
        </div>
      </div>

      {/* 喂养量 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          喂养量 (ml)
        </label>
        <input
          type="number"
          min="0"
          step="5"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="输入喂养量"
          value={feedingDetails.amount || ''}
          onChange={(e) => setFeedingDetails(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
        />
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          备注（可选）
        </label>
        <textarea
          id="feeding-notes"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="添加备注信息"
          rows={2}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {showBackButton && (
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
            onClick={onBack}
          >
            返回
          </button>
        )}
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
          onClick={onCancel}
        >
          取消
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 transition-colors"
          onClick={handleReset}
        >
          重置
        </button>
        <button
          type="button"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          onClick={handleSubmit}
        >
          添加喂养
        </button>
      </div>
    </div>
  );
} 