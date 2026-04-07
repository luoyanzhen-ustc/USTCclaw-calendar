# 安装指南

## 前置要求

- OpenClaw 已安装并运行（版本 2026.3.11+）
- 已连接 QQ 或 微信（可选，用于提醒推送）
- 模型支持图片识别（qwen-chat 或类似）

## 安装步骤

### 方式 1：手动安装（推荐）

1. **克隆仓库**

```bash
git clone https://github.com/luoyanzhen-ustc/USTCclaw-calendar.git
cd USTCclaw-calendar
```

2. **复制 Skill 到 OpenClaw**

```bash
cp -r skill ~/.openclaw/workspace/skills/calendar-assistant
```

3. **复制模板文件**

```bash
mkdir -p ~/.openclaw/workspace/calendar
cp skill/templates/events.json ~/.openclaw/workspace/calendar/
cp skill/templates/settings.json ~/.openclaw/workspace/calendar/
```

4. **重启 OpenClaw（如需要）**

```bash
openclaw gateway restart
```

### 方式 2：从 clawhub 安装（开发中）

```bash
openclaw skill install calendar-assistant
```

## 初始化

### 方式 1：上传课表图片

在聊天中直接上传你的**课表图片**，助手会自动识别并引导你完成初始化。

### 方式 2：手动初始化

在聊天中输入：
```
帮我初始化日历
```

助手会引导你：
1. 选择时区（默认 Asia/Shanghai）
2. 设置默认提醒时间
3. 选择推送渠道（QQ/微信/当前聊天）
4. 导入课表（图片或手动输入）

## 配置渠道

### QQ 推送

1. 确保已安装 QQBot 插件
2. 在设置中启用 QQ 推送
3. 绑定 QQ 群号或用户 ID

### 微信推送

1. 确保已安装 WeChat 插件
2. 在设置中启用微信推送
3. 绑定微信号

## 验证安装

在聊天中输入：
```
今天有什么课
```

如果助手回复今日日程，说明安装成功！

## 故障排除

### 问题：上传图片没有反应

**解决：**
- 检查模型是否支持图片识别（qwen-chat）
- 确保图片清晰，避免模糊
- 尝试重新上传

### 问题：提醒没有推送

**解决：**
- 检查渠道配置是否启用
- 确认 QQ/微信插件已安装
- 查看日志文件是否有错误

### 问题：课表识别不准确

**解决：**
- 确保图片清晰，光线充足
- 避免反光和遮挡
- 或者手动输入课表信息

## 下一步

安装完成后，查看 [使用手册](USAGE.md) 了解更多功能！
