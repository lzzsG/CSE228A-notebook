# Lzzs CSE228A Notebook

加州大学圣克鲁兹分校（UC Santa Cruz）开设的 CSE 228A 课程，名为“敏捷硬件设计”（Agile Hardware Design），旨在将软件工程中的敏捷方法应用于硬件设计，以提升设计效率和生产力。

**课程内容：**

该课程利用 Chisel 硬件设计语言，将函数式和面向对象编程的优势引入硬件设计。课程形式包括互动式讲座（结合编码演示和嘉宾演讲）以及循序渐进的设计作业，最终以一个小型项目作为总结。

**先修要求：**

学生需在以下三个领域中至少具备两个的同等经验：

- 逻辑设计（如 Verilog/VHDL，对应课程 CSE 100/L 或 CSE 125/L）
- 计算机体系结构（对应课程 CSE 120 或 CSE 220）
- 高级编程（如函数式、面向对象等）

课程主要面向研究生，优秀的本科生可在获得导师同意后选修。

**教学资源：**

课程的讲义以 Jupyter 笔记本的形式发布，学生可以直接在幻灯片中执行代码并查看结果。

**课程目标：**

通过本课程，学生将：

- 深入理解敏捷硬件设计方法及其在实际项目中的应用。
- 掌握 Chisel 硬件设计语言的使用，提升硬件设计的抽象和模块化能力。
- 通过实践项目，培养解决复杂硬件设计问题的能力。

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
