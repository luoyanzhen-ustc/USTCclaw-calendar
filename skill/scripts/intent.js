/**
 * 自然语言意图识别
 * 
 * 解析用户输入，识别意图（查询、添加、修改、删除）
 */

const intentPatterns = [
  // 查询意图
  {
    pattern: /今天 | 今天 | 今早有 (.*) 课 | 今天有什么/,
    intent: 'query_today',
    priority: 1
  },
  {
    pattern: /明天 | 明晚 | 明天 (.*) 安排/,
    intent: 'query_tomorrow',
    priority: 1
  },
  {
    pattern: /后天 (.*) 安排/,
    intent: 'query_day_after',
    priority: 1
  },
  {
    pattern: /周 (.*) 有 (.*) 课 | 周 (.*) 安排 | 星期 (.*) 有/,
    intent: 'query_weekday',
    priority: 1
  },
  {
    pattern: /这周 | 本周 | 这周 (.*) 安排 | 本周 (.*) 课/,
    intent: 'query_week',
    priority: 1
  },
  {
    pattern: /下周 (.*)/,
    intent: 'query_next_week',
    priority: 1
  },
  
  // 添加意图
  {
    pattern: /我要去 (.*) | 我要 (.*) | 计划 (.*)/,
    intent: 'add_plan',
    priority: 2
  },
  {
    pattern: /(.*) 点 (.*) | 明天 (.*) 点 | 周 (.*) 点/,
    intent: 'add_plan_with_time',
    priority: 2
  },
  {
    pattern: /提醒我 (.*) | 记得 (.*)/,
    intent: 'add_reminder',
    priority: 2
  },
  {
    pattern: /(.*) 去 (.*) | (.*) 和 (.*) 出去玩/,
    intent: 'add_plan',
    priority: 2
  },
  
  // 修改意图
  {
    pattern: /把 (.*) 改成 (.*) | 修改 (.*) 为/,
    intent: 'modify_event',
    priority: 2
  },
  {
    pattern: / (.*) 时间改到/,
    intent: 'modify_event',
    priority: 2
  },
  
  // 删除意图
  {
    pattern: /取消 (.*) | 删除 (.*) | 不要 (.*) 了/,
    intent: 'delete_event',
    priority: 2
  },
  
  // 确认意图
  {
    pattern: /好的 | 确认 | 可以 | 行 | 没问题 | 嗯嗯 | 好哒/,
    intent: 'confirm',
    priority: 3
  },
  
  // 取消意图
  {
    pattern: /不要 | 不用 | 算了 | 取消 | 不了/,
    intent: 'cancel',
    priority: 3
  },
  
  // 提醒设置
  {
    pattern: /提前 (.*) 提醒 | 提醒我提前/,
    intent: 'set_reminder',
    priority: 2
  }
];

/**
 * 检测用户意图
 */
function detectIntent(message) {
  // 按优先级排序
  const sortedPatterns = intentPatterns.sort((a, b) => a.priority - b.priority);
  
  for (const { pattern, intent } of sortedPatterns) {
    if (pattern.test(message)) {
      return {
        intent,
        confidence: 0.8,
        matches: pattern.exec(message)
      };
    }
  }
  
  // 默认：普通聊天
  return {
    intent: 'chat',
    confidence: 0.5,
    matches: null
  };
}

/**
 * 解析时间表达
 */
function parseTimeExpression(text) {
  const now = new Date();
  const result = {
    date: null,
    hour: null,
    minute: 0,
    weekday: null,
    weekOffset: 0
  };
  
  // 相对日期
  if (/今天 | 今天/.test(text)) {
    result.date = new Date(now);
  } else if (/明天 | 明晚/.test(text)) {
    result.date = new Date(now);
    result.date.setDate(result.date.getDate() + 1);
  } else if (/后天/.test(text)) {
    result.date = new Date(now);
    result.date.setDate(result.date.getDate() + 2);
  } else if (/大后天/.test(text)) {
    result.date = new Date(now);
    result.date.setDate(result.date.getDate() + 3);
  }
  
  // 星期几
  const weekdayMatch = text.match(/周 (.*)|星期 (.*)/);
  if (weekdayMatch) {
    const weekdayMap = {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 0, '天': 0
    };
    const day = weekdayMatch[1] || weekdayMatch[2];
    if (weekdayMap[day] !== undefined) {
      result.weekday = weekdayMap[day];
      
      // 计算下周三
      if (/下周/.test(text)) {
        result.weekOffset = 1;
      }
    }
  }
  
  // 时间段
  if (/早上/.test(text)) {
    result.hourRange = [6, 12];
  } else if (/上午/.test(text)) {
    result.hourRange = [8, 12];
  } else if (/下午/.test(text)) {
    result.hourRange = [13, 18];
  } else if (/晚上 | 今晚 | 明晚/.test(text)) {
    result.hourRange = [18, 23];
  }
  
  // 具体时间点
  const timeMatch = text.match(/(\d+)[点：:](\d*)?/);
  if (timeMatch) {
    result.hour = parseInt(timeMatch[1]);
    if (timeMatch[2]) {
      result.minute = parseInt(timeMatch[2]);
    }
  }
  
  // 处理"7 点"、"晚上 7 点"
  const hourMatch = text.match(/(\d+) 点/);
  if (hourMatch && !result.hour) {
    let hour = parseInt(hourMatch[1]);
    if (/晚上/.test(text) && hour < 12) {
      hour += 12;
    } else if (/下午/.test(text) && hour < 12) {
      hour += 12;
    }
    result.hour = hour;
  }
  
  return result;
}

/**
 * 提取事件标题
 */
function extractEventTitle(text) {
  // 去除时间相关词汇
  const title = text
    .replace(/今天 | 明天 | 后天 | 周 (.*)|星期 (.*)|点 | 点/g, '')
    .replace(/我要去 | 我要 | 计划 | 提醒我 | 记得/g, '')
    .trim();
  
  return title || '未命名事件';
}

module.exports = {
  detectIntent,
  parseTimeExpression,
  extractEventTitle,
  intentPatterns
};
