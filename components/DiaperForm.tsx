'use client';

import { useState, useEffect } from 'react';

interface DiaperDetails {
  time: string;
  type: 'wet' | 'dirty' | 'both';
  status: 'normal' | 'unusual';
}

interface DiaperFormProps {
  initialTime: string;
  onSubmit: (details: DiaperDetails, notes?: string) => void;
  onCancel: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function DiaperForm({ initialTime, onSubmit, onCancel, onBack, showBackButton }: DiaperFormProps) {
  const [diaperDetails, setDiaperDetails] = useState<DiaperDetails>({
    time: initialTime,
    type: 'wet',
    status: 'normal'
  });

  // 当初始时间变化时更新表单
  useEffect(() => {
    setDiaperDetails(prev => ({
      ...prev,
      time: initialTime
    }));
  }, [initialTime]);

  const handleSubmit = () => {
    const notes = (document.getElementById('diaper-notes') as HTMLTextAreaElement)?.value;
    onSubmit(diaperDetails, notes);
  };

  const handleReset = () => {
    setDiaperDetails({
      time: initialTime,
      type: 'wet',
      status: 'normal'
    });
    const notesElement = document.getElementById('diaper-notes') as HTMLTextAreaElement;
    if (notesElement) {
      notesElement.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 时间调整 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          更换时间
        </label>
        <input
          type="time"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          value={diaperDetails.time}
          onChange={(e) => setDiaperDetails(prev => ({ ...prev, time: e.target.value }))}
        />
      </div>

      {/* 尿布类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          尿布类型
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              diaperDetails.type === 'wet'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setDiaperDetails(prev => ({ ...prev, type: 'wet' }))}
          >
            尿尿
          </button>
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              diaperDetails.type === 'dirty'
                ? 'bg-yellow-600 border-yellow-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setDiaperDetails(prev => ({ ...prev, type: 'dirty' }))}
          >
            便便
          </button>
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              diaperDetails.type === 'both'
                ? 'bg-orange-600 border-orange-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setDiaperDetails(prev => ({ ...prev, type: 'both' }))}
          >
            都有
          </button>
        </div>
      </div>

      {/* 状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          状态
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              diaperDetails.status === 'normal'
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setDiaperDetails(prev => ({ ...prev, status: 'normal' }))}
          >
            正常
          </button>
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              diaperDetails.status === 'unusual'
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setDiaperDetails(prev => ({ ...prev, status: 'unusual' }))}
          >
            异常
          </button>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          备注（可选）
        </label>
        <textarea
          id="diaper-notes"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="添加备注信息（如颜色、气味等）"
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
          className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition-colors"
          onClick={handleSubmit}
        >
          添加尿布
        </button>
      </div>
    </div>
  );
} 