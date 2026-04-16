# Elegant QR Code

一个优雅的二维码生成器，支持自定义样式、Logo 嵌入以及图像化二维码生成。基于 React + Vite + TypeScript + Tailwind CSS 构建。

## 功能特性

- 输入任意 URL 或文本生成二维码
- 多种预设风格一键套用
- 自定义颜色、点样式、边角样式等
- 支持上传 Logo 并嵌入二维码中心
- 支持源图像上传与裁剪，生成图像化二维码
- 一键导出 PNG / SVG

## 技术栈

- **React 19** + **TypeScript**
- **Vite 6** 构建工具
- **Tailwind CSS** 样式方案
- **qr-code-styling** / **qrcode-generator** 二维码核心库
- **file-saver** 文件导出

## 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm / yarn

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

浏览器访问 `http://localhost:5173` 即可。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/     # UI 组件（输入、预览、样式控制等）
├── hooks/          # 自定义 Hook（useQRCode 等）
├── lib/            # 核心逻辑（compose、imageQR、presets）
├── App.tsx         # 根组件
└── main.tsx        # 入口文件
```

## License

MIT
