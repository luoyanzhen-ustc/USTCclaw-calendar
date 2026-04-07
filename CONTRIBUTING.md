# 贡献指南

欢迎贡献代码！🎉

## 开发环境设置

### 1. Fork 仓库

在 GitHub 上点击 "Fork" 按钮。

### 2. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/USTCclaw-calendar.git
cd USTCclaw-calendar
```

### 3. 安装依赖

```bash
npm install
```

### 4. 创建分支

```bash
git checkout -b feature/your-feature-name
```

## 开发流程

### 1. 修改代码

在 `skill/` 目录下进行修改。

### 2. 测试

```bash
# 测试 OCR 识别
npm test

# 或者手动测试
node scripts/test-ocr.js examples/sample-schedule.png
```

### 3. 提交代码

```bash
git add .
git commit -m "feat: add your feature description"
```

**提交信息规范：**

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 重构
- `test:` 测试
- `chore:` 构建/工具

### 4. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

在 GitHub 上创建 PR，描述你的改动。

## 代码规范

### JavaScript 规范

- 使用 ES6+ 语法
- 使用 `async/await` 处理异步
- 添加适当的注释
- 保持函数简洁（< 50 行）

### 文件组织

```
skill/
├── scripts/          # 核心逻辑
│   ├── parse-image.js    # 图片识别
│   ├── intent.js         # 意图识别
│   ├── view.js           # 视图展示
│   └── notify.js         # 消息推送
├── templates/        # 模板文件
└── references/       # 参考文档
```

## 测试

### 单元测试

```bash
npm test
```

### 手动测试

1. 部署到本地 OpenClaw
2. 在聊天中测试功能
3. 记录测试结果

## 文档

### 更新文档

如果添加了新功能，请更新：

- `README.md` - 项目说明
- `docs/USAGE.md` - 使用手册
- `docs/CONFIG.md` - 配置说明

### 文档规范

- 使用清晰的标题
- 提供示例代码
- 添加截图/GIF（如需要）

## 报告 Bug

### Bug 报告模板

```markdown
**问题描述**
简要描述问题

**复现步骤**
1. ...
2. ...
3. ...

**预期行为**
应该发生什么

**实际行为**
实际发生了什么

**环境信息**
- OpenClaw 版本：
- 操作系统：
- 模型：

**截图**
如有，请添加截图
```

### 提交 Bug

在 GitHub Issues 中创建 Issue，选择 "Bug Report" 模板。

## 功能建议

### 功能建议模板

```markdown
**功能描述**
简要描述功能

**使用场景**
什么情况下会用到

**实现建议**
如何实现（可选）

**替代方案**
其他解决方案（可选）
```

### 提交建议

在 GitHub Issues 中创建 Issue，选择 "Feature Request" 模板。

## 代码审查

所有 PR 都需要经过代码审查：

1. 代码质量
2. 测试覆盖
3. 文档完整性
4. 性能影响

## 发布流程

### 版本号规范

遵循语义化版本（SemVer）：

- `MAJOR.MINOR.PATCH`
- `MAJOR`: 不兼容的改动
- `MINOR`: 向后兼容的功能
- `PATCH`: 向后兼容的修复

### 发布步骤

1. 更新 `package.json` 版本号
2. 更新 `CHANGELOG.md`
3. 创建 Git Tag
4. 发布到 GitHub
5. 发布到 clawhub（如适用）

## 联系方式

- GitHub Issues: https://github.com/luoyanzhen-ustc/USTCclaw-calendar/issues
- Email: (可选)

## 感谢贡献者

感谢所有为这个项目贡献代码的人！ 🌸

---

**Happy Coding!**
