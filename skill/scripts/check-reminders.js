#!/usr/bin/env node

/**
 * 日历提醒检查脚本
 * 每 5 分钟运行一次，检查即将发生的事件并发送提醒
 */

const fs = require('fs');
const path = require('path');

// 配置文件路径
const EVENTS_FILE = '/root/.openclaw/workspace/calendar/events.json';
const SETTINGS_FILE = '/root/.openclaw/workspace/calendar/settings.json';

/**
 * 获取当前时间
 */
function getCurrentTime() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: now.getDay() === 0 ? 7 : now.getDay(), // 周日=7
    hours: now.getHours(),
    minutes: now.getMinutes(),
    timestamp: now.getTime()
  };
}

/**
 * 格式化时间为 HH:MM
 */
function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * 检查事件是否应该提醒
 */
function shouldRemind(event, currentTime) {
  if (!event.active) return false;
  
  const schedule = event.schedule;
  const reminderOffsets = event.reminderOffsets || [30]; // 默认提前 30 分钟
  
  // 检查事件类型
  if (schedule.kind === 'once') {
    // 一次性事件
    const eventDate = new Date(`${schedule.date}T${schedule.startTime}:00`);
    const eventTime = eventDate.getTime();
    
    // 检查是否是今天
    const today = `${currentTime.year}-${String(currentTime.month).padStart(2, '0')}-${String(currentTime.day).padStart(2, '0')}`;
    if (schedule.date !== today) return false;
    
    // 检查每个提醒时间点
    for (const offsetMinutes of reminderOffsets) {
      const reminderTime = eventTime - (offsetMinutes * 60 * 1000);
      const timeDiff = currentTime.timestamp - reminderTime;
      
      // 在提醒时间的 1 分钟内触发
      if (timeDiff >= 0 && timeDiff < 60 * 1000) {
        return {
          shouldRemind: true,
          offsetMinutes: offsetMinutes,
          event: event
        };
      }
    }
  } else if (schedule.kind === 'weekly') {
    // 周期性事件（课程）
    if (schedule.weekday !== currentTime.weekday) return false;
    
    // 检查周次范围
    const weekRanges = schedule.weekRanges;
    if (!weekRanges) return false;
    
    // 计算当前是第几周（需要学期开始日期）
    // 这里简化处理，假设配置文件中有学期信息
    
    // 检查时间
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const eventTimeToday = new Date();
    eventTimeToday.setHours(startHour, startMin, 0, 0);
    const eventTimestamp = eventTimeToday.getTime();
    
    for (const offsetMinutes of reminderOffsets) {
      const reminderTime = eventTimestamp - (offsetMinutes * 60 * 1000);
      const timeDiff = currentTime.timestamp - reminderTime;
      
      if (timeDiff >= 0 && timeDiff < 60 * 1000) {
        return {
          shouldRemind: true,
          offsetMinutes: offsetMinutes,
          event: event
        };
      }
    }
  }
  
  return false;
}

/**
 * 发送提醒消息
 */
function sendReminder(event, channels) {
  const message = `⏰ 提醒：${event.title}\n\n` +
    `📅 时间：${event.schedule.startTime}\n` +
    `📍 地点：${event.location || '未指定'}\n\n` +
    `该加油啦！💪`;
  
  console.log('📢 发送提醒：');
  console.log(message);
  console.log('\n推送渠道：', channels.join(', '));
  
  // TODO: 实际发送到 QQ/微信/当前聊天
  // 这里需要调用 OpenClaw 的 message API
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 检查提醒...', new Date().toISOString());
  
  // 读取事件文件
  const eventsData = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  const events = eventsData.events || [];
  
  // 获取当前时间
  const currentTime = getCurrentTime();
  console.log('当前时间：', formatTime(currentTime.hours, currentTime.minutes));
  console.log('今天是：', ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][currentTime.weekday - 1]);
  
  // 检查每个事件
  for (const event of events) {
    const result = shouldRemind(event, currentTime);
    
    if (result && result.shouldRemind) {
      console.log('\n✅ 触发提醒！');
      const channels = event.notifyChannels || ['current'];
      sendReminder(event, channels);
    }
  }
  
  console.log('\n检查完成。');
}

// 运行
main();
