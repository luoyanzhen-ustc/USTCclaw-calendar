# 配置说明

## 配置文件

配置文件位于 `workspace/calendar/settings.json`

## 配置项

### 基础设置

```json
{
  "timezone": "Asia/Shanghai",
  "defaultView": "day",
  "quietHours": ["23:00", "08:00"]
}
```

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `timezone` | string | 时区 | `Asia/Shanghai` |
| `defaultView` | string | 默认视图（`day`/`week`） | `day` |
| `quietHours` | array | 静默时段（不推送提醒） | `["23:00", "08:00"]` |

### 提醒设置

```json
{
  "reminderDefaults": {
    "high": [1440, 60],
    "medium": [30],
    "low": [10]
  }
}
```

| 优先级 | 默认提醒时间 | 说明 |
|--------|--------------|------|
| `high` | `[1440, 60]` | 提前 1 天 + 1 小时 |
| `medium` | `[30]` | 提前 30 分钟 |
| `low` | `[10]` | 提前 10 分钟 |

### 推送渠道

```json
{
  "notify": {
    "channels": ["current", "qq", "wechat"],
    "qq": {
      "enabled": true,
      "groupId": "optional-group-id"
    },
    "wechat": {
      "enabled": true,
      "accountId": "optional-account-id"
    }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `channels` | array | 启用的渠道列表 |
| `qq.enabled` | boolean | 是否启用 QQ 推送 |
| `qq.groupId` | string | QQ 群号（可选） |
| `wechat.enabled` | boolean | 是否启用微信推送 |
| `wechat.accountId` | string | 微信号（可选） |

### OCR 设置

```json
{
  "ocr": {
    "provider": "qwen-chat",
    "enabled": true
  }
}
```

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `provider` | string | OCR 模型 | `qwen-chat` |
| `enabled` | boolean | 是否启用图片识别 | `true` |

## 修改配置

### 方式 1：自然语言

直接对助手说：

```
设置默认提醒为 30 分钟
关闭 QQ 推送
静默时段改为 22 点到 9 点
```

### 方式 2：编辑文件

直接编辑 `workspace/calendar/settings.json`

### 方式 3：命令（开发中）

```
/calendar settings
```

## 配置示例

### 学生配置

```json
{
  "timezone": "Asia/Shanghai",
  "defaultView": "day",
  "quietHours": ["23:00", "08:00"],
  "reminderDefaults": {
    "high": [1440, 60],
    "medium": [30],
    "low": [10]
  },
  "notify": {
    "channels": ["current", "qq"],
    "qq": {
      "enabled": true
    }
  }
}
```

### 上班族配置

```json
{
  "timezone": "Asia/Shanghai",
  "defaultView": "week",
  "quietHours": ["22:00", "09:00"],
  "reminderDefaults": {
    "high": [1440, 120],
    "medium": [60],
    "low": [15]
  },
  "notify": {
    "channels": ["current", "wechat"],
    "wechat": {
      "enabled": true
    }
  }
}
```

## 环境变量

可通过环境变量覆盖配置：

```bash
export CALENDAR_TIMEZONE=Asia/Shanghai
export CALENDAR_QUIET_HOURS=23:00-08:00
export CALENDAR_DEFAULT_REMINDER=30
```

## 下一步

查看 [常见问题](FAQ.md) 了解更多！
