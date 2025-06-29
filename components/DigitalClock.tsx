'use client';

import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '@/lib/utils';

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    // Set initial time
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Don't render anything until we're on the client side
  if (!isClient || !currentTime) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-white">
        <div className="digital-clock text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
          --:--:--
        </div>
        <div className="text-lg md:text-xl lg:text-2xl font-medium text-gray-300">
          -------- ------
        </div>
        <div className="text-xs md:text-sm text-gray-400 mt-1">
          时区: Asia/Shanghai (UTC+8)
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-48 text-white">
      {/* 时间显示 */}
      <div className="digital-clock text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
        {formatTime(currentTime)}
      </div>
      
      {/* 日期显示 */}
      <div className="text-lg md:text-xl lg:text-2xl font-medium text-gray-300">
        {formatDate(currentTime)}
      </div>
      
      {/* 时区显示 */}
      <div className="text-xs md:text-sm text-gray-400 mt-1">
        时区: Asia/Shanghai (UTC+8)
      </div>
    </div>
  );
} 