/**
 * USTC 学期周次计算工具
 */

/**
 * 计算当前是学期第几周
 * @param {string} semesterStart - 开学日期 (YYYY-MM-DD)
 * @param {string} targetDate - 目标日期 (YYYY-MM-DD)，默认为今天
 * @returns {number} 第几周（从 1 开始）
 */
function calculateWeekNumber(semesterStart, targetDate = null) {
  const start = new Date(semesterStart);
  const target = targetDate ? new Date(targetDate) : new Date();
  
  // 计算相差的天数
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 计算周次（第 1 周从开学当天开始）
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  return weekNumber > 0 ? weekNumber : 0;
}

/**
 * 获取当前周次（从配置读取开学日期）
 * @param {object} settings - 设置对象
 * @returns {number} 当前周次
 */
function getCurrentWeek(settings) {
  if (!settings.semester || !settings.semester.startDate) {
    throw new Error('未配置学期开学日期');
  }
  
  return calculateWeekNumber(settings.semester.startDate);
}

/**
 * 检查课程在当前周是否上课
 * @param {object} event - 课程事件
 * @param {number} currentWeek - 当前周次
 * @returns {boolean} 是否上课
 */
function isCourseActive(event, currentWeek) {
  if (!event.active) return false;
  
  const weekRanges = event.schedule.weekRanges;
  if (!weekRanges) return false;
  
  // 检查当前周是否在任意一个周次范围内
  return weekRanges.some(range => {
    const [start, end] = range;
    return currentWeek >= start && currentWeek <= end;
  });
}

/**
 * 格式化周次范围
 * @param {array} weekRanges - 周次范围 [[1,5], [7,14]]
 * @returns {string} 格式化字符串 "1~5, 7~14 周"
 */
function formatWeekRanges(weekRanges) {
  return weekRanges
    .map(range => {
      const [start, end] = range;
      return start === end ? `${start}周` : `${start}~${end}周`;
    })
    .join(', ');
}

/**
 * 获取学期信息
 * @param {object} settings - 设置对象
 * @returns {object} 学期信息
 */
function getSemesterInfo(settings) {
  const semester = settings.semester;
  if (!semester) {
    return null;
  }
  
  const currentWeek = calculateWeekNumber(semester.startDate);
  const startDate = new Date(semester.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (semester.weekCount * 7));
  
  return {
    name: semester.name,
    startDate: semester.startDate,
    endDate: endDate.toISOString().split('T')[0],
    weekCount: semester.weekCount,
    currentWeek: currentWeek,
    progress: Math.round((currentWeek / semester.weekCount) * 100)
  };
}

// 测试
if (require.main === module) {
  const settings = {
    semester: {
      name: "2026 春季学期",
      startDate: "2026-02-23",
      weekCount: 20
    }
  };
  
  console.log('📅 学期信息：');
  console.log(getSemesterInfo(settings));
  
  console.log('\n📊 当前周次：', getCurrentWeek(settings));
  
  // 测试课程激活
  const testEvent = {
    active: true,
    schedule: {
      weekRanges: [[1, 5], [7, 14]]
    }
  };
  
  console.log('\n✅ 课程在第 15 周是否上课？', isCourseActive(testEvent, 15));
  console.log('✅ 课程在第 6 周是否上课？', isCourseActive(testEvent, 6));
  console.log('✅ 课程在第 3 周是否上课？', isCourseActive(testEvent, 3));
}

module.exports = {
  calculateWeekNumber,
  getCurrentWeek,
  isCourseActive,
  formatWeekRanges,
  getSemesterInfo
};
