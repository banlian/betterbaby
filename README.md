# Better Baby - 婴儿培养工具

一个专业的婴儿日常护理记录和培养工具网站，采用深色模式设计，针对iPad和宽屏设备优化。

## 功能特性

### 🕐 数字时钟显示
- 24小时数字卡片模式显示当前时间
- 显示当前日期和时区信息
- 实时更新，文字醒目

### 📊 项目进度管理
- 支持多种婴儿护理项目：喂养、尿布、睡眠、玩耍、洗澡、用药
- 每个项目显示今日进度条和统计信息
- 可自定义添加新项目
- 显示最后活动时间

### ⏰ 时间轴功能
- 24小时时间轴，最小刻度10分钟
- 在时间轴上点击可添加活动标记
- 活动标记显示对应图标，点击查看详情
- 实时显示当前时间位置

### 📱 响应式设计
- 深色模式，护眼设计
- 针对iPad和宽屏设备优化
- 支持触摸操作

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **时间处理**: date-fns + date-fns-tz
- **数据存储**: localStorage

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
betterbaby/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── DigitalClock.tsx   # 数字时钟组件
│   ├── Timeline.tsx       # 时间轴组件
│   ├── ProjectProgress.tsx # 项目进度组件
│   └── ActivityModal.tsx  # 活动详情模态框
├── lib/                   # 工具函数
│   ├── constants.ts       # 常量配置
│   └── utils.ts           # 工具函数
├── types/                 # TypeScript类型定义
│   └── index.ts           # 类型定义
└── betterbaby.md          # 原始需求文档
```

## 使用说明

### 添加活动
1. 在时间轴上点击任意时间点
2. 选择要添加的活动类型
3. 活动将自动添加到对应时间点

### 查看活动详情
1. 点击时间轴上的活动图标
2. 查看活动的详细信息和时间
3. 可以删除不需要的活动

### 快速添加
1. 在项目进度区域点击项目卡片
2. 或使用底部的快速添加按钮
3. 活动将添加到当前时间

## 数据存储

所有数据存储在浏览器的localStorage中，包括：
- 活动记录
- 项目配置
- 用户偏好设置

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License 