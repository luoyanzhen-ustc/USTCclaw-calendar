#!/bin/bash

# USTCclaw Calendar 快速部署脚本

set -e

echo "🌸 USTCclaw Calendar 快速部署"
echo "═══════════════════════════════════"

# 检查 OpenClaw 是否安装
if ! command -v openclaw &> /dev/null; then
    echo "❌ 错误：OpenClaw 未安装"
    echo "请先安装 OpenClaw: https://openclaw.ai"
    exit 1
fi

echo "✅ OpenClaw 已安装"

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCLAW_WORKSPACE="$HOME/.openclaw/workspace"

echo "📂 工作区：$OPENCLAW_WORKSPACE"

# 创建日历目录
echo ""
echo "📁 创建日历目录..."
mkdir -p "$OPENCLAW_WORKSPACE/calendar"

# 复制 Skill
echo "📦 复制 Skill..."
cp -r "$SCRIPT_DIR/skill" "$OPENCLAW_WORKSPACE/skills/calendar-assistant"

# 复制模板文件
echo "📋 复制模板文件..."
cp "$SCRIPT_DIR/skill/templates/events.json" "$OPENCLAW_WORKSPACE/calendar/"
cp "$SCRIPT_DIR/skill/templates/settings.json" "$OPENCLAW_WORKSPACE/calendar/"

# 复制示例文件
echo "📖 复制示例文件..."
cp -r "$SCRIPT_DIR/examples" "$OPENCLAW_WORKSPACE/calendar/examples"

# 初始化配置文件
echo "⚙️  初始化配置..."
cat > "$OPENCLAW_WORKSPACE/calendar/settings.json" << 'EOF'
{
  "timezone": "Asia/Shanghai",
  "defaultView": "day",
  "quietHours": ["23:00", "08:00"],
  "notify": {
    "channels": ["current"],
    "qq": {
      "enabled": false
    },
    "wechat": {
      "enabled": false
    }
  },
  "reminderDefaults": {
    "high": [1440, 60],
    "medium": [30],
    "low": [10]
  }
}
EOF

# 创建空事件文件
cat > "$OPENCLAW_WORKSPACE/calendar/events.json" << 'EOF'
{
  "version": 1,
  "events": [],
  "metadata": {
    "createdAt": "2026-04-07T00:00:00.000Z",
    "updatedAt": "2026-04-07T00:00:00.000Z",
    "courseCount": 0,
    "planCount": 0
  }
}
EOF

echo ""
echo "✅ 部署完成！"
echo ""
echo "═══════════════════════════════════"
echo "📖 下一步："
echo ""
echo "1. 重启 OpenClaw（如需要）："
echo "   openclaw gateway restart"
echo ""
echo "2. 在聊天中上传课表图片，开始使用！"
echo ""
echo "3. 或者输入："
echo "   帮我初始化日历"
echo ""
echo "═══════════════════════════════════"
echo ""
echo "📚 文档："
echo "   - 使用手册：$SCRIPT_DIR/docs/USAGE.md"
echo "   - 安装指南：$SCRIPT_DIR/docs/INSTALL.md"
echo "   - 配置说明：$SCRIPT_DIR/docs/CONFIG.md"
echo ""
