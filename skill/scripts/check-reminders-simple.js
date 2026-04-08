#!/usr/bin/env node

/**
 * 日历提醒检查脚本（简化版）
 * 直接输出提醒信息，由调用者负责发送
 */

const fs = require('fs');

const EVENTS_FILE = '/root/.openclaw/workspace/calendar/events.json';

function getCurrentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: now.getDay() === 0 ? 7 : now.getDay(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    timestamp: now.getTime(),
    dateStr: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  };
}

function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function checkReminders() {
  const currentTime = getCurrentTime();
  console.log(`🔍 检查提醒... ${currentTime.dateStr} ${formatTime(currentTime.hours, currentTime.minutes)}`);
  
  // 读取事件
  const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  const events = eventsData.events || [];
  
  const reminders = [];
  
  for (const event of events) {
    if (!event.active) continue;
    
    const schedule = event.schedule;
    const reminderOffsets = event.reminderOffsets || [30];
    
    // 检查一次性事件
    if (schedule.kind === 'once') {
      if (schedule.date !== currentTime.dateStr) continue;
      
      const [eventHour, eventMin] = schedule.startTime.split(':').map(Number);
      const eventTime = new Date();
      eventTime.setHours(eventHour, eventMin, 0, 0);
      const eventTimestamp = eventTime.getTime();
      
      for (const offsetMinutes of reminderOffsets) {
        const reminderTime = eventTimestamp - (offsetMinutes * 60 * 1000);
        const timeDiff = currentTime.timestamp - reminderTime;
        
        // 在提醒时间的 1 分钟内触发
        if (timeDiff >= 0 && timeDiff < 60 * 1000) {
          reminders.push({
            event: event,
            offsetMinutes: offsetMinutes,
            channels: event.notifyChannels || ['current']
          });
        }
      }
    }
    // 检查周期性事件（课程）
    else if (schedule.kind === 'weekly') {
      if (schedule.weekday !== currentTime.weekday) continue;
      
      const [eventHour, eventMin] = schedule.startTime.split(':').map(Number);
      const eventTime = new Date();
      eventTime.setHours(eventHour, eventMin, 0, 0);
      const eventTimestamp = eventTime.getTime();
      
      for (const offsetMinutes of reminderOffsets) {
        const reminderTime = eventTimestamp - (offsetMinutes * 60 * 1000);
        const timeDiff = currentTime.timestamp - reminderTime;
        
        if (timeDiff >= 0 && timeDiff < 60 * 1000) {
          reminders.push({
            event: event,
            offsetMinutes: offsetMinutes,
            channels: event.notifyChannels || ['current']
          });
        }
      }
    }
  }
  
  if (reminders.length > 0) {
    console.log(`\n✅ 找到 ${reminders.length} 个提醒：\n`);
    for (const r of reminders) {
      const e = r.event;
      console.log(`⏰ ${e.title}`);
      console.log(`   时间：${e.schedule.startTime}`);
      console.log(`   地点：${e.location || '未指定'}`);
      console.log(`   渠道：${r.channels.join(', ')}`);
      console.log(`   提前：${r.offsetMinutes} 分钟\n`);
    }
    
    // 输出 JSON 格式供调用者解析
    console.log('\n---JSON START---');
    console.log(JSON.stringify({ reminders }, null, 2));
    console.log('---JSON END---');
  } else {
    console.log('\n暂无提醒。');
  }
  
  return reminders;
}

// 运行
if (require.main === module) {
  checkReminders();
}

module.exports = { checkReminders };
