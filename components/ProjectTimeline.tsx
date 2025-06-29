"use client";

import { useState, useMemo, useEffect } from "react";
import { BabyActivity, ActivityType } from "@/types";
import { getActivityConfig, getTimeSlotIndex, generateId } from "@/lib/utils";
import FeedingForm from "./FeedingForm";
import DiaperForm from "./DiaperForm";
import SleepForm from "./SleepForm";

interface ProjectTimelineProps {
  projectType: ActivityType;
  activities: BabyActivity[];
  onAddActivity: (activity: BabyActivity) => void;
  onActivityClick: (activity: BabyActivity) => void;
  onClearActivities?: (projectType: ActivityType) => void;
}

interface FeedingDetails {
  time: string;
  amount: number;
  category: "milk" | "food" | "water";
}

interface DiaperDetails {
  time: string;
  type: "wet" | "dirty" | "both";
  status: "normal" | "unusual";
}

interface SleepDetails {
  time: string;
  type: "nap" | "night";
  duration: number;
}

export default function ProjectTimeline({
  projectType,
  activities,
  onAddActivity,
  onActivityClick,
  onClearActivities,
}: ProjectTimelineProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const config = getActivityConfig(projectType);

  // 客户端时间管理
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 过滤出当前项目的活动
  const projectActivities = useMemo(() => {
    return activities.filter((activity) => activity.type === projectType);
  }, [activities, projectType]);

  // 生成时间槽
  const timeSlots = useMemo(() => {
    return Array.from({ length: 144 }, (_, i) => {
      const hour = Math.floor(i / 6);
      const minute = (i % 6) * 10;
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      // 获取该时间槽的活动
      const slotActivities = projectActivities.filter((activity) => {
        const activitySlot = getTimeSlotIndex(activity.timestamp);
        return activitySlot === i;
      });

      return {
        time,
        hour,
        minute,
        activities: slotActivities,
      };
    });
  }, [projectActivities]);

  const handleTimeSlotClick = (slotIndex: number) => {
    setSelectedTimeSlot(slotIndex);
    setShowAddModal(true);
  };

  const handleAddActivity = (details?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      const newActivity: BabyActivity = {
        id: generateId(),
        type: projectType,
        timestamp: new Date(new Date().setHours(slot.hour, slot.minute, 0, 0)),
        details,
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleFeedingSubmit = (
    feedingDetails: FeedingDetails,
    notes?: string
  ) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(
        new Date().setHours(slot.hour, slot.minute, 0, 0)
      );

      // 如果用户调整了时间，使用调整后的时间
      if (feedingDetails.time && feedingDetails.time !== slot.time) {
        const [hours, minutes] = feedingDetails.time.split(":").map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }

      // 生成活动详情
      const categoryText = {
        milk: "奶粉",
        food: "辅食",
        water: "水",
      }[feedingDetails.category];
      const activityDetails = `${categoryText} ${feedingDetails.amount}ml${
        notes ? ` - ${notes}` : ""
      }`;

      const newActivity: BabyActivity = {
        id: generateId(),
        type: "feeding",
        timestamp: activityTime,
        details: activityDetails,
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleDiaperSubmit = (diaperDetails: DiaperDetails, notes?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(
        new Date().setHours(slot.hour, slot.minute, 0, 0)
      );

      // 如果用户调整了时间，使用调整后的时间
      if (diaperDetails.time && diaperDetails.time !== slot.time) {
        const [hours, minutes] = diaperDetails.time.split(":").map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }

      // 生成活动详情
      const typeText = {
        wet: "尿尿",
        dirty: "便便",
        both: "尿尿+便便",
      }[diaperDetails.type];

      const statusText = diaperDetails.status === "normal" ? "正常" : "异常";
      const activityDetails = `${typeText} (${statusText})${
        notes ? ` - ${notes}` : ""
      }`;

      const newActivity: BabyActivity = {
        id: generateId(),
        type: "diaper",
        timestamp: activityTime,
        details: activityDetails,
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleSleepSubmit = (sleepDetails: SleepDetails, notes?: string) => {
    if (selectedTimeSlot !== null) {
      const slot = timeSlots[selectedTimeSlot];
      let activityTime = new Date(
        new Date().setHours(slot.hour, slot.minute, 0, 0)
      );

      // 如果用户调整了时间，使用调整后的时间
      if (sleepDetails.time && sleepDetails.time !== slot.time) {
        const [hours, minutes] = sleepDetails.time.split(":").map(Number);
        activityTime = new Date(new Date().setHours(hours, minutes, 0, 0));
      }

      // 生成活动详情
      const typeText = sleepDetails.type === "nap" ? "小睡" : "夜间睡眠";
      const durationText =
        sleepDetails.duration >= 60
          ? `${Math.floor(sleepDetails.duration / 60)}小时${
              sleepDetails.duration % 60 > 0
                ? (sleepDetails.duration % 60) + "分钟"
                : ""
            }`
          : `${sleepDetails.duration}分钟`;
      const activityDetails = `${typeText} ${durationText}${
        notes ? ` - ${notes}` : ""
      }`;

      const newActivity: BabyActivity = {
        id: generateId(),
        type: "sleep",
        timestamp: activityTime,
        details: activityDetails,
      };
      onAddActivity(newActivity);
      setShowAddModal(false);
      setSelectedTimeSlot(null);
    }
  };

  const handleModalCancel = () => {
    setShowAddModal(false);
    setSelectedTimeSlot(null);
  };

  const handleClearActivities = () => {
    if (onClearActivities) {
      onClearActivities(projectType);
    }
    setShowClearConfirm(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      {/* 项目时间轴标题 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: config.color }}
          >
            {config.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{config.name}</h3>
            <p className="text-xs text-gray-400">
              {projectActivities.length} 次活动
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-lg text-yellow-400">
            {(() => {
              const lastActivity =
                projectActivities.length > 0
                  ? projectActivities[projectActivities.length - 1]
                  : null;

              if (lastActivity && isClient && currentTime) {
                const timeDiff =
                  currentTime.getTime() - lastActivity.timestamp.getTime();
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor(
                  (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
                );
                return `已过去: ${hours}小时${minutes}分钟`;
              } else if (lastActivity) {
                return "已过去: --:--";
              }
              return "暂无活动";
            })()}
          </div>

          {/* 重置按钮 */}
          {projectActivities.length > 0 && onClearActivities && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              title="清除所有活动"
            >
              重置
            </button>
          )}
        </div>
        <div className="text-xs text-gray-400">10分钟刻度</div>
      </div>

      {/* 时间轴主体 */}
      <div className="flex-1 overflow-hidden p-3">
        <div className="relative">
          {/* 时间刻度 */}
          <div className="relative mb-1 h-4">
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className={`absolute text-center text-xs ${
                  i % 6 === 0 ? "text-gray-300 font-semibold" : "text-gray-500"
                }`}
                style={{
                  left: `${((i * 6) / 143) * 100}%`,
                  transform: "translateX(-50%)",
                  width: "20px",
                }}
              >
                {i.toString().padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* 时间轴轨道 */}
          <div className="relative h-12 bg-gray-700 rounded overflow-hidden">
            {/* 小时分隔线 */}
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                className="absolute top-0 h-10 border-r border-gray-500/50"
                style={{ left: `${((hour * 6) / 143) * 100}%` }}
              />
            ))}

            {/* 时间槽 */}
            {timeSlots.map((slot, index) => {
              const hour = Math.floor(index / 6);
              const isEvenHour = hour % 2 === 0;
              const hasActivities = slot.activities.length > 0;

              return (
                <div
                  key={index}
                  className={`absolute top-0 h-10 border-r border-gray-600/30 cursor-pointer hover:bg-red-600/50 transition-colors ${
                    isEvenHour ? "bg-gray-600/10" : ""
                  } ${
                    hasActivities ? "bg-yellow-500/90 border-yellow-400/50" : ""
                  }`}
                  style={{
                    left: `${(index / 143) * 100}%`,
                    width: `${100 / 143}%`,
                  }}
                  onClick={() => handleTimeSlotClick(index)}
                >
                  {/* 活动图标 - 可点击查看详情 */}
                  {slot.activities.map((activity, activityIndex) => {
                    const activityConfig = getActivityConfig(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: activityConfig.color,
                          zIndex: activityIndex + 10,
                          left: `${activityIndex * 8}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // 阻止冒泡到时间槽点击事件
                          onActivityClick(activity);
                        }}
                        title={`${activityConfig.name} - ${slot.time}${
                          activity.details ? ` - ${activity.details}` : ""
                        }`}
                      >
                        {activityConfig.icon}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* 活动时间显示 - 在slot下方 */}
            {timeSlots.map((slot, index) => {
              if (slot.activities.length > 0) {
                return (
                  <div
                    key={`time-${index}`}
                    className="absolute bottom-0 text-xs text-gray-300 font-medium text-center"
                    style={{
                      left: `${(index / 143) * 100}%`,
                      width: `${100 / 143}%`,
                    }}
                  >
                    {slot.time}
                  </div>
                );
              }
              return null;
            })}

            {/* 当前时间指示器 - 只在客户端显示 */}
            {currentTime && (
              <div
                className="absolute top-0 w-0.5 h-10 bg-red-500 z-10"
                style={{
                  left: `${(getTimeSlotIndex(currentTime) / 143) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* 添加活动模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-white mb-4">
              添加 {config.name} -{" "}
              {selectedTimeSlot !== null
                ? timeSlots[selectedTimeSlot].time
                : ""}
            </h3>

            {projectType === "feeding" ? (
              // 喂养活动专用表单
              <FeedingForm
                initialTime={
                  selectedTimeSlot !== null
                    ? timeSlots[selectedTimeSlot].time
                    : ""
                }
                onSubmit={handleFeedingSubmit}
                onCancel={handleModalCancel}
              />
            ) : projectType === "diaper" ? (
              // 尿布活动专用表单
              <DiaperForm
                initialTime={
                  selectedTimeSlot !== null
                    ? timeSlots[selectedTimeSlot].time
                    : ""
                }
                onSubmit={handleDiaperSubmit}
                onCancel={handleModalCancel}
              />
            ) : projectType === "sleep" ? (
              // 睡眠活动专用表单
              <SleepForm
                initialTime={
                  selectedTimeSlot !== null
                    ? timeSlots[selectedTimeSlot].time
                    : ""
                }
                onSubmit={handleSleepSubmit}
                onCancel={handleModalCancel}
              />
            ) : (
              // 其他活动的通用表单
              <div className="mb-4">
                <textarea
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="添加详情（可选）"
                  rows={3}
                  id="activity-details"
                />
              </div>
            )}

            {projectType !== "feeding" &&
              projectType !== "diaper" &&
              projectType !== "sleep" && (
                <div className="flex gap-2 mt-6">
                  <button
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                    onClick={handleModalCancel}
                  >
                    取消
                  </button>
                  <button
                    className="flex-1 px-4 py-2 text-white rounded transition-colors"
                    style={{ backgroundColor: config.color }}
                    onClick={() => {
                      const details = (
                        document.getElementById(
                          "activity-details"
                        ) as HTMLTextAreaElement
                      )?.value;
                      handleAddActivity(details);
                    }}
                  >
                    添加
                  </button>
                </div>
              )}
          </div>
        </div>
      )}

      {/* 清除确认模态框 */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold text-white mb-4">确认清除</h3>
            <p className="text-gray-300 mb-6">
              确定要清除所有 {config.name} 活动吗？此操作无法撤销。
            </p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                onClick={() => setShowClearConfirm(false)}
              >
                取消
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleClearActivities}
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
