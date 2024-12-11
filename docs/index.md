<!-- 
<meta http-equiv="refresh" content="0; url=/md"> -->

# VitePress

由 Vite 和 Vue 驱动的静态站点生成器

将 Markdown 变成优雅的文档，只需几分钟

# VitePress 是什么？[](https://vitepress.dev/zh/guide/what-is-vitepress#what-is-vitepress)

VitePress 是一个[静态站点生成器](https://en.wikipedia.org/wiki/Static_site_generator) (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

只是想尝试一下？跳到[快速开始](https://vitepress.dev/zh/guide/getting-started)。

---

# VitePress-template

这是一个基于 [VitePress](https://vitepress.dev/) 的文档网站模板，包含以下功能和特点：

- 自定义 CSS 主题。
- 包含 GitHub Actions 工作流，自动化部署到 GitHub Pages。
- VitePress 路由由 `docs` 文件夹的文件结构自动生成。

## 快速开始

### 1. 安装依赖

首先安装项目依赖：

```bash
npm install
```

### 2. 启动开发服务器

运行以下命令启动本地开发服务器：

```bash
npm run docs:dev
```

开发服务器会默认运行在 `http://localhost:5173`，你可以在浏览器中访问。

------

## 使用说明

### 修改文档配置

1. 打开

   ```
   docs/.vitepress/config.mjs
   ```

    文件，根据你的项目需求，修改以下内容：

   - `title`：文档的标题。
   - `description`：文档的描述信息。
   - `themeConfig`：导航栏、侧边栏等配置。
   - ...

### 添加路由

VitePress 会根据 `docs` 文件夹的目录结构自动生成路由。例如：

- `docs/index.md` -> 路由 `/`
- `docs/guide/getting-started.md` -> 路由 `/guide/getting-started`

**注意**：需要手动在 `config.mjs` 的 `sidebar` 配置中添加相应的目录结构。

示例：

```javascript
sidebar: [
  {
    text: '指南',
    items: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '配置', link: '/guide/configuration' }
    ]
  }
]
```

------

## 部署

此模板已集成 GitHub Actions 工作流，支持自动化部署到 GitHub Pages。

### 步骤

1. 在你的 GitHub 仓库中启用 Pages 功能，选择GitHub Actions 部署。
2. 每次将代码推送到主分支后，GitHub Actions 会自动触发构建和部署流程。

------

## 文件结构

以下是项目的基本结构说明：

```
VitePress-template/
├── docs/                   # 文档内容
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.mjs      # 文档的配置文件
│   │   ├── theme/          # 自定义主题
│   ├── index.md            # 首页内容
│   ├──  ...         # 文档分类目录
├── package.json            # 项目依赖和脚本
├── README.md               # 项目说明文件
```

**修改主题**：可以通过修改 `docs/.vitepress/theme` 文件夹中的 CSS 文件来自定义样式。

------

## 技术支持

- VitePress 官方文档：<https://vitepress.dev/>
