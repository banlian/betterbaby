'use client';

import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '@/lib/utils';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      {/* 时间显示 */}
      <div className="digital-clock text-6xl md:text-8xl lg:text-9xl font-bold mb-4">
        {formatTime(currentTime)}
      </div>
      
      {/* 日期显示 */}
      <div className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-300">
        {formatDate(currentTime)}
      </div>
      
      {/* 时区显示 */}
      <div className="text-sm md:text-base text-gray-400 mt-2">
        时区: Asia/Shanghai (UTC+8)
      </div>
    </div>
  );
} 