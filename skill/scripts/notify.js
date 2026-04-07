/**
 * 多渠道提醒推送
 * 
 * 支持当前聊天、QQ、微信等渠道
 */

async function sendReminder(event, channels = ['current']) {
  const message = formatReminder(event);
  const results = [];
  
  for (const channel of channels) {
    try {
      if (channel === 'current') {
        // 当前聊天
        await sendToCurrentChat(message);
        results.push({ channel: 'current', success: true });
      } else if (channel === 'qq') {
        // QQ 推送
        await sendToQQ(message);
        results.push({ channel: 'qq', success: true });
      } else if (channel === 'wechat') {
        // 微信推送
        await sendToWechat(message);
        results.push({ channel: 'wechat', success: true });
      }
    } catch (error) {
      console.error(`Failed to send to ${channel}:`, error);
      results.push({ channel, success: false, error: error.message });
    }
  }
  
  return results;
}

function formatReminder(event, offsetMinutes = null) {
  const priorityEmoji = {
    high: '⚠️',
    medium: '⏰',
    low: '📅'
  };
  
  let message = `${priorityEmoji[event.priority] || '⏰'} 日程提醒\n\n`;
  message += `📌 ${event.title}\n`;
  
  if (event.schedule) {
    message += `⏰ ${event.schedule.startTime}`;
    if (event.schedule.endTime) {
      message += ` - ${event.schedule.endTime}`;
    }
    message += '\n';
  }
  
  if (event.location) {
    message += `📍 ${event.location}\n`;
  }
  
  if (event.teacher) {
    message += `👤 ${event.teacher}\n`;
  }
  
  if (event.notes) {
    message += `📝 ${event.notes}\n`;
  }
  
  if (offsetMinutes) {
    message += `\n提前 ${offsetMinutes} 分钟提醒\n`;
  }
  
  if (event.priority === 'high') {
    message += `\n⚡ 重要事件，请准时参加！\n`;
  }
  
  return message.trim();
}

/**
 * 发送到当前聊天
 */
async function sendToCurrentChat(message) {
  // 使用 message 工具发送
  // 实际实现由 OpenClaw 框架处理
  console.log('Sending to current chat:', message);
  return { success: true };
}

/**
 * 发送到 QQ
 */
async function sendToQQ(message) {
  // 使用 QQBot 插件发送
  // 需要用户配置 QQ 群号或用户 ID
  console.log('Sending to QQ:', message);
  return { success: true };
}

/**
 * 发送到微信
 */
async function sendToWechat(message) {
  // 使用 WeChat 插件发送
  // 需要用户配置微信号
  console.log('Sending to Wechat:', message);
  return { success: true };
}

/**
 * 检查是否在静默时段
 */
function isQuietHour(settings) {
  const now = new Date();
  const currentHour = now.getHours();
  
  const quietHours = settings.quietHours || ['23:00', '08:00'];
  const [startHour] = quietHours[0].split(':').map(Number);
  const [endHour] = quietHours[1].split(':').map(Number);
  
  if (startHour > endHour) {
    // 跨天（如 23:00-08:00）
    return currentHour >= startHour || currentHour < endHour;
  } else {
    return currentHour >= startHour && currentHour < endHour;
  }
}

module.exports = {
  sendReminder,
  formatReminder,
  sendToCurrentChat,
  sendToQQ,
  sendToWechat,
  isQuietHour
};
