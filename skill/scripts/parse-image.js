/**
 * 课表图片识别
 * 
 * 调用 Qwen-VL 模型识别课表图片，提取课程信息
 */

async function parseScheduleImage(imagePath) {
  const prompt = `
你是一名专业的课表识别助手。请识别这张课程表图片，并输出为 JSON 格式。

输出格式：
{
  "courses": [
    {
      "weekday": 1-7,
      "periods": "节次如 3-4",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "name": "课程名称",
      "code": "课程代码",
      "location": "地点",
      "weeks": "周次范围如 1-15 周",
      "teacher": "教师姓名",
      "credits": 学分（数字）
    }
  ],
  "periodTimes": {
    "1-2": ["07:50", "09:25"],
    "3-4": ["09:45", "11:20"],
    "6-7": ["14:00", "15:35"],
    "8-9": ["15:55", "17:30"],
    "11-12": ["19:30", "21:05"]
  }
}

注意事项：
1. 处理合并单元格（同一时间多门课程）
2. 识别周次范围（如"1-15 周"、"6-15 周"）
3. 课程代码通常是英文 + 数字组合（如 EE3005.01）
4. 如果某些信息不清晰，标记 needsReview: true
5. 星期几根据课表布局推断（从左到右：周一到周日）
`;

  try {
    // 调用 Qwen-VL 模型
    const result = await callModel('ustc/qwen-chat', {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image', image_url: { url: imagePath } }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(result);
    
    // 验证结果
    if (!parsed.courses || parsed.courses.length === 0) {
      throw new Error('未能识别到课程信息');
    }

    return {
      success: true,
      courses: parsed.courses,
      periodTimes: parsed.periodTimes || getDefaultPeriodTimes()
    };
  } catch (error) {
    console.error('课表识别失败:', error);
    return {
      success: false,
      error: '图片识别失败，请重新上传清晰的课表截图',
      suggestions: [
        '确保图片清晰，避免模糊',
        '确保光线充足，避免反光',
        '或者手动输入课表信息'
      ]
    };
  }
}

function getDefaultPeriodTimes() {
  return {
    '1-2': ['07:50', '09:25'],
    '3-4': ['09:45', '11:20'],
    '5': ['11:30', '12:15'],
    '6-7': ['14:00', '15:35'],
    '8-9': ['15:55', '17:30'],
    '10': ['17:30', '18:20'],
    '11-12': ['19:30', '21:05']
  };
}

/**
 * 将识别结果转换为事件
 */
function coursesToEvents(courses, periodTimes) {
  const events = [];

  for (const course of courses) {
    const event = {
      id: generateId(),
      type: 'course',
      title: course.name,
      priority: 'medium',
      schedule: {
        kind: 'weekly',
        weekday: course.weekday,
        startTime: course.startTime,
        endTime: course.endTime,
        weeks: course.weeks,
        weekStart: parseWeekStart(course.weeks),
        weekEnd: parseWeekEnd(course.weeks)
      },
      location: course.location,
      teacher: course.teacher,
      notes: course.code ? `课程代码：${course.code}` : '',
      reminderOffsets: [30],
      active: true,
      source: 'image',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.push(event);
  }

  return events;
}

function generateId() {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function parseWeekStart(weeks) {
  const match = weeks.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

function parseWeekEnd(weeks) {
  const match = weeks.match(/(\d+)[^-]*$/);
  return match ? parseInt(match[1]) : 18;
}

module.exports = {
  parseScheduleImage,
  coursesToEvents,
  getDefaultPeriodTimes
};
