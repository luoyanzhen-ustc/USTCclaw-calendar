/**
 * 日视图展示
 * 
 * 生成指定日期的日程视图
 */

function formatDayView(events, date) {
  if (!events || events.length === 0) {
    return formatEmptyDay(date);
  }
  
  // 按时间排序
  events.sort((a, b) => a.schedule.startTime.localeCompare(b.schedule.startTime));
  
  const dayName = getDayName(date);
  const dateStr = formatDate(date);
  
  let output = `📅 ${dateStr} ${dayName}\n\n`;
  
  for (const event of events) {
    const priorityEmoji = getPriorityEmoji(event.priority);
    
    output += `${event.schedule.startTime} ${priorityEmoji} ${event.title}\n`;
    
    if (event.location) {
      output += `      📍 ${event.location}\n`;
    }
    
    if (event.teacher) {
      output += `      👤 ${event.teacher}\n`;
    }
    
    if (event.notes) {
      output += `      📝 ${event.notes}\n`;
    }
    
    // 提醒时间
    if (event.reminderOffsets && event.reminderOffsets.length > 0) {
      const reminderTime = subtractMinutes(event.schedule.startTime, event.reminderOffsets[0]);
      output += `      ⏰ ${reminderTime} 提醒\n`;
    }
    
    output += '\n';
  }
  
  // 底部统计
  output += `────────\n`;
  output += `今日共 ${events.length} 个事件`;
  output += ` · 高优先级 ${events.filter(e => e.priority === 'high').length} 个`;
  
  return output;
}

function formatEmptyDay(date) {
  const dayName = getDayName(date);
  const dateStr = formatDate(date);
  
  return `📅 ${dateStr} ${dayName}\n\n今天没有安排，好好休息吧！ 🌸\n\n要不要计划点什么？比如学习、运动、或者和朋友出去玩~`;
}

function getDayName(date) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPriorityEmoji(priority) {
  const emoji = {
    high: '⚡',
    medium: '📌',
    low: '📝'
  };
  return emoji[priority] || '📅';
}

function subtractMinutes(timeStr, minutes) {
  const [hour, minute] = timeStr.split(':').map(Number);
  const totalMinutes = hour * 60 + minute - minutes;
  
  const newHour = Math.floor(totalMinutes / 60) % 24;
  const newMinute = totalMinutes % 60;
  
  return `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;
}

/**
 * 周视图展示
 */
function formatWeekView(eventsByDay, startDate) {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  let output = `📅 本周日程 (${formatDate(startDate)})\n\n`;
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);
    const dayEvents = eventsByDay[i + 1] || [];
    
    if (dayEvents.length === 0) {
      output += `${days[i]} ${formatDate(dayDate)}\n`;
      output += `  (无安排)\n\n`;
    } else {
      output += `${days[i]} ${formatDate(dayDate)}\n`;
      
      for (const event of dayEvents) {
        const emoji = getPriorityEmoji(event.priority);
        output += `  ${event.schedule.startTime} ${emoji} ${event.title} @ ${event.location || '地点未定'}\n`;
      }
      
      output += '\n';
    }
  }
  
  return output;
}

module.exports = {
  formatDayView,
  formatWeekView,
  formatEmptyDay
};
