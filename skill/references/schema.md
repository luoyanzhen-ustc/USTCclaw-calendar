# 事件数据结构

## 事件对象

```json
{
  "id": "evt-001",
  "type": "course|plan|reminder",
  "title": "事件标题",
  "priority": "high|medium|low",
  "schedule": {
    "kind": "weekly|once|range",
    "weekday": 1-7,
    "startTime": "HH:MM",
    "endTime": "HH:MM",
    "date": "YYYY-MM-DD",
    "weeks": "1-15",
    "weekStart": 1,
    "weekEnd": 15
  },
  "location": "地点",
  "teacher": "教师姓名",
  "notes": "备注",
  "reminderOffsets": [30, 1440],
  "active": true,
  "completed": false,
  "source": "image|chat|manual",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## 字段说明

### 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符，格式 `evt-xxx` |
| `type` | string | 事件类型：`course`（课程）、`plan`（计划）、`reminder`（提醒） |
| `title` | string | 事件标题 |
| `priority` | string | 优先级：`high`、`medium`、`low` |
| `schedule` | object | 时间安排（见下文） |
| `active` | boolean | 是否启用 |

### schedule 对象

#### 周期性事件（课程）

```json
{
  "kind": "weekly",
  "weekday": 1,
  "startTime": "09:45",
  "endTime": "11:20",
  "weeks": "1-15",
  "weekStart": 1,
  "weekEnd": 15
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `kind` | string | `weekly`（每周重复） |
| `weekday` | number | 1-7（周一到周日） |
| `startTime` | string | 开始时间 `HH:MM` |
| `endTime` | string | 结束时间 `HH:MM` |
| `weeks` | string | 周次范围，如 `"1-15"`、`"6-15"` |
| `weekStart` | number | 起始周 |
| `weekEnd` | number | 结束周 |

#### 单次事件（临时计划）

```json
{
  "kind": "once",
  "date": "2026-04-08",
  "startTime": "19:00",
  "endTime": "21:00"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `kind` | string | `once`（单次） |
| `date` | string | 日期 `YYYY-MM-DD` |
| `startTime` | string | 开始时间 |
| `endTime` | string | 结束时间 |

### 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `location` | string | 地点 |
| `teacher` | string | 教师/负责人 |
| `notes` | string | 备注 |
| `reminderOffsets` | array | 提醒时间（分钟），如 `[30, 1440]` 表示提前 30 分钟和 1 天 |
| `source` | string | 来源：`image`（图片识别）、`chat`（聊天添加）、`manual`（手动） |
| `completed` | boolean | 是否已完成 |

## 优先级定义

| 优先级 | 说明 | 默认提醒时间 |
|--------|------|--------------|
| `high` | 重要事件（考试、答辩、截止日期） | 提前 1 天 + 1 小时 |
| `medium` | 普通课程、会议 | 提前 30 分钟 |
| `low` | 日常计划、休闲活动 | 提前 10 分钟 |

## 事件类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `course` | 课程 | 高等数学、机器学习 |
| `plan` | 临时计划 | 图书馆学习、和朋友出去玩 |
| `reminder` | 提醒事项 | 交作业、还书 |

## 存储位置

`workspace/calendar/events.json`

## 示例

```json
{
  "id": "evt-001",
  "type": "course",
  "title": "数学分析 (B2)",
  "priority": "medium",
  "schedule": {
    "kind": "weekly",
    "weekday": 1,
    "startTime": "09:45",
    "endTime": "11:20",
    "weeks": "1-18",
    "weekStart": 1,
    "weekEnd": 18
  },
  "location": "3C202",
  "teacher": "张娜",
  "notes": "带习题册",
  "reminderOffsets": [30],
  "active": true,
  "source": "image",
  "createdAt": "2026-04-07T11:30:00.000Z"
}
```
