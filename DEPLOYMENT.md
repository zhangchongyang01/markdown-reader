# 部署说明

## GitHub Pages 部署

### 自动部署（推荐）

1. **启用 GitHub Actions**
   - 确保您的仓库中有 `.github/workflows/deploy.yml` 文件
   - 推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动构建并部署

2. **配置 GitHub Pages**
   - 进入仓库设置 (Settings)
   - 找到 "Pages" 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages" 分支
   - 保存设置

3. **访问地址**
   - 部署完成后，访问地址将是：`https://[username].github.io/markdown-reader/`

### 手动部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **创建 gh-pages 分支**
   ```bash
   git checkout -b gh-pages
   git add dist/
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **配置 GitHub Pages**
   - 同自动部署步骤 2

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:3000
```

## 配置说明

### 基础路径配置

项目已配置支持 GitHub Pages 的基础路径：

- **开发环境**: `/`
- **生产环境**: `/markdown-reader/`

### 路由配置

- 首页: `/`
- 章节页面: `/guide/[章节ID]`
- 例如: `/guide/01`, `/guide/02` 等

### 文件结构

```
markdown-reader/
├── src/
│   ├── components/
│   │   └── MarkdownReader.vue    # 主要组件
│   ├── router/
│   │   └── index.js              # 路由配置
│   ├── App.vue                   # 根组件
│   └── main.js                   # 入口文件
├── docs/                         # Markdown 文档
├── public/                       # 静态资源
├── vite.config.js                # Vite 配置
└── package.json
```

## 注意事项

1. **图片路径**: 确保图片文件放在 `public/images/` 目录下
   - 图片路径会自动处理基础路径
   - 开发环境: `/images/02/xxx.png`
   - 生产环境: `/markdown-reader/images/02/xxx.png`
2. **文档路径**: Markdown 文件放在 `public/docs/guide/` 目录下（重要！）
   - 只有 `public` 目录下的文件才会被复制到构建后的 `dist` 目录
   - 如果文档不在 `public` 目录下，构建后将无法访问
3. **内部链接**: 文章中的 `[上一篇文章](/guide/01)` 链接会自动处理
    - 开发环境: 链接为 `/guide/01`，点击后跳转到 `/guide/01`
    - 生产环境: 链接为 `/markdown-reader/guide/01`，点击后跳转到 `/guide/01`
    - 预览环境: 与生产环境一致
4. **直接访问**: 直接访问章节URL（如 `/guide/03`）也能正确显示内容
    - Vue应用会自动检测URL中的章节ID并加载对应内容
    - 支持开发、预览和生产环境
5. **基础路径**: 所有内部链接都会自动处理基础路径
6. **路由**: 支持直接访问章节 URL，如 `/guide/01`

## 故障排除

### 构建失败
- 检查 Node.js 版本 (推荐 16+)
- 确保所有依赖已安装
- 检查控制台错误信息

### 部署后页面空白
- 检查 GitHub Pages 设置
- 确认 gh-pages 分支存在
- 检查浏览器控制台错误

### 路由不工作
- 确认基础路径配置正确
- 检查 GitHub Pages 是否支持 SPA 路由
