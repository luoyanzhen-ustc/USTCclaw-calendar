#!/usr/bin/env node

/**
 * 测试 OCR 识别功能
 * 
 * 使用方法：
 * node scripts/test-ocr.js examples/sample-schedule.png
 */

const path = require('path');
const fs = require('fs');

async function testOCR(imagePath) {
  console.log('🔍 开始测试 OCR 识别...\n');
  console.log(`图片路径：${imagePath}\n`);
  
  // 检查文件是否存在
  if (!fs.existsSync(imagePath)) {
    console.error('❌ 错误：图片文件不存在');
    process.exit(1);
  }
  
  try {
    // 调用 parse-image.js
    const { parseScheduleImage } = require('./skill/scripts/parse-image.js');
    
    console.log('⏳ 正在识别...\n');
    const result = await parseScheduleImage(imagePath);
    
    if (result.success) {
      console.log('✅ 识别成功！\n');
      console.log(`识别到 ${result.courses.length} 门课程\n`);
      
      console.log('📚 课程列表：');
      console.log('─────────────────────────────────────');
      
      for (const course of result.courses) {
        console.log(`\n${course.weekday}. ${course.name}`);
        console.log(`   时间：${course.periods}节 (${course.startTime}-${course.endTime})`);
        console.log(`   地点：${course.location}`);
        console.log(`   周次：${course.weeks}`);
        if (course.teacher) {
          console.log(`   教师：${course.teacher}`);
        }
        if (course.code) {
          console.log(`   代码：${course.code}`);
        }
      }
      
      console.log('\n─────────────────────────────────────');
      console.log('\n⏰ 节次时间：');
      for (const [periods, times] of Object.entries(result.periodTimes)) {
        console.log(`   ${periods}节：${times[0]}-${times[1]}`);
      }
      
      console.log('\n✅ 测试完成！');
    } else {
      console.error('❌ 识别失败：');
      console.error(result.error);
      console.error('\n建议：');
      if (result.suggestions) {
        for (const suggestion of result.suggestions) {
          console.error(`   - ${suggestion}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ 测试失败：', error.message);
    console.error('\n堆栈跟踪：');
    console.error(error.stack);
    process.exit(1);
  }
}

// 主程序
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📖 使用方法：');
  console.log('   node scripts/test-ocr.js <图片路径>\n');
  console.log('示例：');
  console.log('   node scripts/test-ocr.js examples/sample-schedule.png\n');
  process.exit(0);
}

const imagePath = args[0];
testOCR(imagePath);
