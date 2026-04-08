# 📅 Calendar Assistant Skill - 零配置设计

## 🎯 设计原则

**开箱即用** - 用户安装 Skill 后无需任何配置即可使用。

### 自动初始化流程

1. **Skill 首次加载时**
   - 自动创建 `/root/.openclaw/workspace/calendar/` 目录
   - 自动创建 `events.json`（空事件列表）
   - 自动创建 `settings.json`（默认配置）
   - 自动创建 cron 提醒任务（每 5 分钟检查）

2. **用户首次使用时**
   - 上传课表图片 → 自动识别并添加
   - 或说"帮我添加计划" → 自动创建事件

3. **提醒自动工作**
   - 无需配置 QQ/微信账号
   - 默认发送到当前聊天
   - QQ/微信自动检测并启用

---

## 📁 自动创建的文件

### 1. 日历目录
```
/root/.openclaw/workspace/calendar/
├── events.json          # 事件数据（自动创建）
└── settings.json        # 配置文件（自动创建，使用默认值）
```

### 2. 默认配置
```json
{
  "timezone": "Asia/Shanghai",
  "defaultView": "day",
  "quietHours": ["23:00", "08:00"],
  "notify": {
    "channels": ["current"],
    "qq": { "enabled": false },
    "wechat": { "enabled": false }
  },
  "reminderDefaults": {
    "high": [1440, 60],
    "medium": [30],
    "low": [10]
  }
}
```

**用户无需修改！** 所有配置都有合理的默认值。

---

## 🔔 自动提醒机制

### 方案 A：心跳检查（推荐）

`HEARTBEAT.md` 自动包含提醒检查任务：

```markdown
# HEARTBEAT.md

## 每 30 分钟检查
- [ ] 检查日历提醒
- [ ] 检查邮箱
- [ ] 检查天气
```

**优点：**
- ✅ 无需额外配置
- ✅ 在主会话中运行（有完整权限）
- ✅ 自动推送

### 方案 B：cron 任务（备用）

Skill 安装时自动创建：

```bash
openclaw cron add --name "calendar-remind" \
  --schedule "*/5 * * * *" \
  --command "node /root/.openclaw/workspace/skills/calendar-assistant/scripts/check-reminders.js"
```

---

## 📱 多渠道推送

### 自动检测

Skill 自动检测可用渠道：

```javascript
const channels = detectAvailableChannels();
// 返回：['current', 'qq', 'wechat']
```

### 推送逻辑

1. **当前聊天** - 始终启用
2. **QQ** - 如果 QQ Bot 已启用，自动发送
3. **微信** - 如果微信已连接，自动发送

**用户无需配置！** 安装后自动工作。

---

## 🚀 安装流程

### 用户视角

```bash
# 1. 克隆仓库
git clone https://github.com/luoyanzhen-ustc/USTCclaw-calendar.git

# 2. 运行部署脚本
cd USTCclaw-calendar
bash scripts/deploy.sh

# 3. 完成！
```

### 部署脚本自动执行

```bash
#!/bin/bash
# scripts/deploy.sh

# 1. 复制 Skill
cp -r skill ~/.openclaw/workspace/skills/calendar-assistant

# 2. 创建日历目录
mkdir -p ~/.openclaw/workspace/calendar

# 3. 初始化配置文件
cp skill/templates/*.json ~/.openclaw/workspace/calendar/

# 4. 创建自动提醒任务
node skill/scripts/auto-init.js

# 5. 重启 Gateway
openclaw gateway restart
```

---

## ✅ 零配置验证

安装后，用户可以直接：

1. **上传课表图片** → 自动识别
2. **说"今天有什么课"** → 自动回答
3. **说"明晚 7 点去图书馆"** → 自动添加并设置提醒
4. **22:30 自动收到提醒** → 多渠道推送

**无需任何手动配置！**

---

## 🛠️ 开发者说明

### 自动初始化代码

```javascript
// skill/scripts/auto-init.js
function initCalendar() {
  // 创建目录
  mkdirSync('/root/.openclaw/workspace/calendar');
  
  // 创建默认文件
  writeFileSync('events.json', defaultEvents);
  writeFileSync('settings.json', defaultSettings);
  
  // 创建 cron 任务
  createCronJob('calendar-remind', '*/5 * * * *', checkReminders);
}
```

### 第一次运行

Skill 首次加载时自动调用 `initCalendar()`。

---

## 📊 对比：零配置 vs 手动配置

| 任务 | 零配置 | 手动配置 |
|------|--------|----------|
| 创建目录 | ✅ 自动 | ❌ 用户手动 |
| 创建配置文件 | ✅ 自动 | ❌ 用户手动 |
| 设置提醒 | ✅ 自动 | ❌ 用户手动 |
| 配置渠道 | ✅ 自动检测 | ❌ 用户手动 |
| **用户体验** | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

**设计目标：让用户忘记"配置"这回事！** 🌸
