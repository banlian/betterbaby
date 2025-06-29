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

// 时间转换工具函数
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

// 获取指定时间前后半小时的时间范围
function getTimeRange(initialTime: string): {
  min: number;
  max: number;
  current: number;
} {
  const initialMinutes = timeToMinutes(initialTime);
  const currentSlot = Math.floor(initialMinutes / 10) * 10; // 对齐到10分钟

  const minMinutes = currentSlot - 30; // 前30分钟
  const maxMinutes = currentSlot + 30; // 后30分钟

  return {
    min: Math.max(0, minMinutes),
    max: Math.min(1430, maxMinutes), // 23:50
    current: currentSlot,
  };
}

export default function DiaperForm({ initialTime, onSubmit, onCancel, onBack, showBackButton }: DiaperFormProps) {
  const timeRange = getTimeRange(initialTime);

  const [diaperDetails, setDiaperDetails] = useState<DiaperDetails>({
    time: initialTime,
    type: 'wet',
    status: 'normal'
  });

  // 计算滑动条的值（以10分钟为单位）
  const [sliderValue, setSliderValue] = useState(() => {
    const currentMinutes = timeToMinutes(initialTime);
    const normalizedValue = Math.max(
      timeRange.min,
      Math.min(timeRange.max, currentMinutes)
    );
    return Math.floor((normalizedValue - timeRange.min) / 10);
  });

  // 当初始时间变化时更新表单
  useEffect(() => {
    const newTimeRange = getTimeRange(initialTime);
    setDiaperDetails((prev) => ({
      ...prev,
      time: initialTime,
    }));
    const currentMinutes = timeToMinutes(initialTime);
    const normalizedValue = Math.max(
      newTimeRange.min,
      Math.min(newTimeRange.max, currentMinutes)
    );
    setSliderValue(Math.floor((normalizedValue - newTimeRange.min) / 10));
  }, [initialTime]);

  // 当滑动条值变化时更新时间
  useEffect(() => {
    const currentTimeRange = getTimeRange(initialTime);
    const newTime = minutesToTime(currentTimeRange.min + sliderValue * 10);
    setDiaperDetails((prev) => ({
      ...prev,
      time: newTime,
    }));
  }, [sliderValue, initialTime]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    const notes = (document.getElementById('diaper-notes') as HTMLTextAreaElement)?.value;
    onSubmit(diaperDetails, notes);
  };

  const handleReset = () => {
    const currentTimeRange = getTimeRange(initialTime);
    const currentSlot = Math.floor(timeToMinutes(initialTime) / 10) * 10;
    const currentTime = minutesToTime(currentSlot);
    setDiaperDetails({
      time: currentTime,
      type: 'wet',
      status: 'normal'
    });
    setSliderValue(Math.floor((currentSlot - currentTimeRange.min) / 10));
    const notesElement = document.getElementById('diaper-notes') as HTMLTextAreaElement;
    if (notesElement) {
      notesElement.value = '';
    }
  };

  // 生成时间刻度标签
  const generateTimeLabels = () => {
    const labels = [];
    const currentTimeRange = getTimeRange(initialTime);
    const totalSlots =
      Math.floor((currentTimeRange.max - currentTimeRange.min) / 10) + 1;

    for (let i = 0; i < totalSlots; i++) {
      const minutes = currentTimeRange.min + i * 10;
      const time = minutesToTime(minutes);
      if (minutes % 60 === 0) {
        // 整点显示
        labels.push(
          <div key={i} className="text-xs text-gray-400 text-center">
            {time}
          </div>
        );
      } else if (minutes % 10 === 0) {
        // 30分钟显示
        labels.push(
          <div key={i} className="text-xs text-gray-500 text-center">
            {time}
          </div>
        );
      } else {
        labels.push(
          <div key={i} className="text-xs text-gray-600 text-center">
            ·
          </div>
        );
      }
    }
    return labels;
  };

  return (
    <div className="space-y-4">
      {/* 时间滑动控件 */}
      <div>
        <label className="block text-lg font-medium text-gray-300 mb-2">
          更换时间:{" "}
          <span className="text-blue-400 font-bold">{diaperDetails.time}</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="0"
            max={Math.floor(
              (getTimeRange(initialTime).max - getTimeRange(initialTime).min) /
                10
            )}
            step="1"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider diaper-time-slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                (sliderValue /
                  Math.floor(
                    (getTimeRange(initialTime).max -
                      getTimeRange(initialTime).min) /
                      10
                  )) *
                100
              }%, #374151 ${
                (sliderValue /
                  Math.floor(
                    (getTimeRange(initialTime).max -
                      getTimeRange(initialTime).min) /
                      10
                  )) *
                100
              }%, #374151 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 px-1">
            {generateTimeLabels()}
          </div>
        </div>
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