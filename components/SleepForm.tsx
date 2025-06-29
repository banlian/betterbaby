'use client';

import { useState, useEffect } from 'react';

interface SleepDetails {
  time: string;
  type: 'nap' | 'night';
  duration: number;
}

interface SleepFormProps {
  initialTime: string;
  onSubmit: (details: SleepDetails, notes?: string) => void;
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

export default function SleepForm({ initialTime, onSubmit, onCancel, onBack, showBackButton }: SleepFormProps) {
  const timeRange = getTimeRange(initialTime);

  const [sleepDetails, setSleepDetails] = useState<SleepDetails>({
    time: initialTime,
    type: 'nap',
    duration: 60
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
    setSleepDetails((prev) => ({
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
    setSleepDetails((prev) => ({
      ...prev,
      time: newTime,
    }));
  }, [sliderValue, initialTime]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleSubmit = () => {
    const notes = (document.getElementById('sleep-notes') as HTMLTextAreaElement)?.value;
    onSubmit(sleepDetails, notes);
  };

  const handleReset = () => {
    const currentTimeRange = getTimeRange(initialTime);
    const currentSlot = Math.floor(timeToMinutes(initialTime) / 10) * 10;
    const currentTime = minutesToTime(currentSlot);
    setSleepDetails({
      time: currentTime,
      type: 'nap',
      duration: 60
    });
    setSliderValue(Math.floor((currentSlot - currentTimeRange.min) / 10));
    const notesElement = document.getElementById('sleep-notes') as HTMLTextAreaElement;
    if (notesElement) {
      notesElement.value = '';
    }
  };

  const getDurationText = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
    }
    return `${mins}分钟`;
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
          开始时间:{" "}
          <span className="text-blue-400 font-bold">{sleepDetails.time}</span>
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
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider sleep-time-slider"
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

      {/* 睡眠类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          睡眠类型
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              sleepDetails.type === 'nap'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setSleepDetails(prev => ({ ...prev, type: 'nap' }))}
          >
            小睡
          </button>
          <button
            type="button"
            className={`p-3 rounded border transition-colors ${
              sleepDetails.type === 'night'
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setSleepDetails(prev => ({ ...prev, type: 'night' }))}
          >
            夜间睡眠
          </button>
        </div>
      </div>

      {/* 持续时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          持续时间: {getDurationText(sleepDetails.duration)}
        </label>
        <div className="space-y-2">
          {/* 快速选择按钮 */}
          <div className="grid grid-cols-4 gap-2">
            {[30, 60, 90, 120].map((minutes) => (
              <button
                key={minutes}
                type="button"
                className={`p-2 rounded border text-xs transition-colors ${
                  sleepDetails.duration === minutes
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSleepDetails(prev => ({ ...prev, duration: minutes }))}
              >
                {minutes}分钟
              </button>
            ))}
          </div>
          {/* 自定义时间滑块 */}
          <div className="space-y-1">
            <input
              type="range"
              min="15"
              max="480"
              step="15"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              value={sleepDetails.duration}
              onChange={(e) => setSleepDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>15分钟</span>
              <span>8小时</span>
            </div>
          </div>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          备注（可选）
        </label>
        <textarea
          id="sleep-notes"
          className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="添加备注信息（如睡眠质量、环境等）"
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
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
          onClick={handleSubmit}
        >
          添加睡眠
        </button>
      </div>
    </div>
  );
} 