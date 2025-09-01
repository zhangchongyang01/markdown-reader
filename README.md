# Markdown Reader

一个基于Vue 3的三栏布局Markdown文档阅读器，支持语法高亮、大纲导航和响应式设计。

## 功能特性

- 📖 **三栏布局**: 文件树 + 内容区域 + 大纲导航
- 🎨 **语法高亮**: 支持多种编程语言的代码高亮
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔗 **路由导航**: 支持Vue Router的SPA路由
- 🖼️ **图片支持**: 自动处理图片路径
- 📋 **大纲生成**: 自动生成文章大纲
- ⚡ **快速加载**: 基于Vite的快速构建

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Vite** - 下一代前端构建工具
- **Marked** - Markdown解析器
- **Highlight.js** - 代码语法高亮

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

访问 `http://localhost:4173` 预览构建结果。

## 项目结构

```
markdown-reader/
├── src/
│   ├── components/
│   │   └── MarkdownReader.vue    # 主要组件
│   ├── router/
│   │   └── index.js              # 路由配置
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 入口文件
│   └── style.css                 # 全局样式
├── public/
│   ├── docs/                     # Markdown文档
│   ├── images/                   # 图片资源
│   └── 404.html                  # 404页面
├── scripts/                      # 测试和部署脚本
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions部署配置
├── .editorconfig                 # 编辑器配置
├── .gitattributes               # Git属性配置
├── .gitignore                   # Git忽略文件
├── CHANGELOG.md                 # 更新日志
├── CONTRIBUTING.md              # 贡献指南
├── DEPLOYMENT.md                # 部署说明
├── LICENSE                      # 开源许可证
├── SECURITY.md                  # 安全政策
├── deploy.sh                    # 部署脚本
├── index.html                   # HTML入口文件
├── vite.config.js               # Vite配置
└── package.json                 # 项目配置
```

## 部署到GitHub Pages

### 自动部署（推荐）

1. 确保仓库中有 `.github/workflows/deploy.yml` 文件
2. 推送代码到 `main` 或 `master` 分支
3. 在仓库设置中启用GitHub Pages，选择 `gh-pages` 分支
4. 访问 `https://[username].github.io/markdown-reader/`

### 手动部署

```bash
npm run build
git checkout -b gh-pages
git add dist/
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

## 配置说明

### 基础路径

项目已配置支持GitHub Pages的基础路径：

- **开发环境**: `/`
- **生产环境**: `/markdown-reader/`

### 文档结构

- Markdown文件放在 `public/docs/guide/` 目录下
- 图片文件放在 `public/images/` 目录下
- 支持相对路径和绝对路径的图片引用

### 路由配置

- 首页: `/`
- 章节页面: `/guide/[章节ID]`
- 例如: `/guide/01`, `/guide/02` 等

## 测试

```bash
# 测试所有功能
npm run test-all

# 测试文档访问
npm run test-docs

# 测试图片访问
npm run test-images

# 测试链接功能
npm run test-links
```

## 开发指南

### 添加新文档

1. 在 `public/docs/guide/` 目录下添加Markdown文件
2. 在 `MarkdownReader.vue` 的 `initFileTree` 函数中添加文件引用
3. 重新构建项目

### 自定义样式

修改 `src/style.css` 文件来自定义样式。

### 添加新功能

主要逻辑在 `src/components/MarkdownReader.vue` 中，可以根据需要扩展功能。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！