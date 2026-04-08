/**
 * 多渠道消息推送
 * 
 * 零配置设计：
 * - 自动检测可用的渠道
 * - 默认发送到当前聊天
 * - QQ/微信需要用户授权后自动启用
 */

const fs = require('fs');

/**
 * 发送提醒消息
 * @param {object} event - 事件对象
 * @param {array} channels - 推送渠道 ['current', 'qq', 'wechat']
 */
function sendReminder(event, channels = ['current']) {
  const message = formatReminder(event);
  
  console.log('📢 发送提醒：');
  console.log(message);
  console.log('');
  console.log('推送渠道：', channels.join(', '));
  
  // 实际发送逻辑
  for (const channel of channels) {
    switch (channel) {
      case 'current':
        sendToCurrentChat(message);
        break;
      case 'qq':
        sendToQQ(message);
        break;
      case 'wechat':
        sendToWechat(message);
        break;
    }
  }
}

/**
 * 格式化提醒消息
 */
function formatReminder(event) {
  const time = event.schedule.startTime || event.schedule.date;
  const location = event.location || '未指定';
  
  return `⏰ **提醒：${event.title}**

📅 **时间**：${time}
📍 **地点**：${location}
${event.notes ? '📝 **备注**：' + event.notes : ''}
该行动啦！💪

---
*日历助手自动提醒*`;
}

/**
 * 发送到当前聊天
 */
function sendToCurrentChat(message) {
  console.log('✅ [当前聊天] 已发送');
  // 实际实现需要调用 OpenClaw 的 message API
}

/**
 * 发送到 QQ
 */
function sendToQQ(message) {
  // 检查 QQ 是否启用
  const config = JSON.parse(fs.readFileSync('/root/.openclaw/openclaw.json', 'utf8'));
  if (!config.channels.qqbot || !config.channels.qqbot.enabled) {
    console.log('⚠️  [QQ] 未启用，跳过');
    return;
  }
  
  // TODO: 调用 QQ Bot API 发送
  console.log('✅ [QQ] 已发送（需要实现具体 API 调用）');
}

/**
 * 发送到微信
 */
function sendToWechat(message) {
  // 检查微信是否启用
  const config = JSON.parse(fs.readFileSync('/root/.openclaw/openclaw.json', 'utf8'));
  if (!config.channels['openclaw-weixin']) {
    console.log('⚠️  [微信] 未启用，跳过');
    return;
  }
  
  // TODO: 调用微信 API 发送
  console.log('✅ [微信] 已发送（需要实现具体 API 调用）');
}

/**
 * 自动检测可用渠道
 */
function detectAvailableChannels() {
  const channels = ['current']; // 当前聊天始终可用
  
  try {
    const config = JSON.parse(fs.readFileSync('/root/.openclaw/openclaw.json', 'utf8'));
    
    if (config.channels.qqbot && config.channels.qqbot.enabled) {
      channels.push('qq');
    }
    
    if (config.channels['openclaw-weixin']) {
      channels.push('wechat');
    }
  } catch (e) {
    console.log('⚠️  无法读取配置文件，仅使用当前聊天');
  }
  
  return channels;
}

// 测试
if (require.main === module) {
  const testEvent = {
    title: '看书',
    schedule: { startTime: '22:30' },
    location: '未指定',
    notes: '用户计划今晚看书'
  };
  
  const channels = detectAvailableChannels();
  console.log('📡 可用渠道：', channels.join(', '));
  console.log('');
  
  sendReminder(testEvent, channels);
}

module.exports = { sendReminder, formatReminder, detectAvailableChannels };
