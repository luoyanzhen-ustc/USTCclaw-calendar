/**
 * 日历助手自动初始化
 * 
 * 当 Skill 首次加载时自动执行：
 * 1. 创建默认配置文件
 * 2. 创建 cron 提醒任务
 * 3. 初始化事件文件
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/root/.openclaw/workspace';
const CALENDAR_DIR = path.join(WORKSPACE, 'calendar');
const EVENTS_FILE = path.join(CALENDAR_DIR, 'events.json');
const SETTINGS_FILE = path.join(CALENDAR_DIR, 'settings.json');

/**
 * 初始化日历目录和文件
 */
function initCalendar() {
  console.log('📅 初始化日历助手...');
  
  // 创建目录
  if (!fs.existsSync(CALENDAR_DIR)) {
    fs.mkdirSync(CALENDAR_DIR, { recursive: true });
    console.log('✅ 创建日历目录:', CALENDAR_DIR);
  }
  
  // 初始化事件文件
  if (!fs.existsSync(EVENTS_FILE)) {
    const eventsData = {
      version: 1,
      events: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseCount: 0,
        planCount: 0
      }
    };
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(eventsData, null, 2));
    console.log('✅ 创建事件文件:', EVENTS_FILE);
  }
  
  // 初始化配置文件（零配置，使用默认值）
  if (!fs.existsSync(SETTINGS_FILE)) {
    const settings = {
      timezone: 'Asia/Shanghai',
      defaultView: 'day',
      quietHours: ['23:00', '08:00'],
      notify: {
        channels: ['current'],
        qq: { enabled: false },
        wechat: { enabled: false }
      },
      reminderDefaults: {
        high: [1440, 60],
        medium: [30],
        low: [10]
      },
      ocr: {
        provider: 'qwen-chat',
        enabled: true
      }
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    console.log('✅ 创建配置文件:', SETTINGS_FILE);
  }
  
  console.log('✅ 日历助手初始化完成！');
}

/**
 * 创建自动提醒 cron 任务
 */
function createRemindCron() {
  console.log('⏰ 创建自动提醒任务...');
  
  // 这里需要调用 OpenClaw 的 cron API
  // 由于是初始化脚本，我们输出说明让用户手动执行
  console.log('📋 请执行以下命令创建 cron 任务：');
  console.log('');
  console.log('openclaw cron add --name "calendar-remind" --schedule "*/5 * * * *" --command "node /root/.openclaw/workspace/skills/calendar-assistant/scripts/check-reminders.js"');
  console.log('');
  console.log('或者在 HEARTBEAT.md 中添加提醒检查任务。');
}

// 主程序
if (require.main === module) {
  initCalendar();
  console.log('');
  createRemindCron();
}

module.exports = { initCalendar, createRemindCron };
