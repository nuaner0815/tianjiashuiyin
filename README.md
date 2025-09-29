# 📸 水印相机 - Watermark Camera

一个简洁优雅的在线水印相机应用，支持为照片添加时间、日期、地点等信息水印。

## ✨ 功能特性

- 🖼️ **图片上传** - 支持拖拽上传或点击选择图片
- 🕐 **时间水印** - 自动添加当前时间或自定义时间
- 📅 **日期显示** - 显示日期和星期信息
- 📍 **地点标记** - 自定义地点信息
- 🎨 **现代设计** - 简洁美观的用户界面
- 📱 **响应式布局** - 支持各种设备尺寸
- 🎯 **水印位置** - 支持四个角落位置选择
- 💾 **一键下载** - 处理完成后直接下载

## 🚀 在线体验

访问 [水印相机在线版](https://nuaner0815.github.io/tianjiashuiyin/) 立即体验！

## 📋 使用说明

### 1. 上传图片
- 点击上传区域选择图片文件
- 或直接拖拽图片到上传区域

### 2. 设置水印信息
- **时间**：默认为当前时间，可自定义修改
- **日期**：默认为当前日期，可自定义修改  
- **地点**：输入您想要显示的地点信息

### 3. 选择水印位置
- 右下角（默认）
- 右上角
- 左下角
- 左上角

### 4. 生成和下载
- 点击"添加水印"按钮生成带水印的图片
- 点击"下载图片"保存到本地

## 🛠️ 本地部署

### 方法一：Python 服务器
```bash
# 克隆项目
git clone https://github.com/nuaner0815/tianjiashuiyin.git
cd tianjiashuiyin

# 启动服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

### 方法二：Node.js 服务器
```bash
# 安装 http-server
npm install -g http-server

# 在项目目录下启动
http-server -p 8000

# 访问 http://localhost:8000
```

### 方法三：直接打开
直接用浏览器打开 `index.html` 文件即可使用。

## 🌐 在线部署

### GitHub Pages 部署
1. Fork 本项目到您的 GitHub 账户
2. 进入项目设置 (Settings)
3. 找到 Pages 选项
4. 选择 Source 为 "Deploy from a branch"
5. 选择 Branch 为 "main" 或 "master"
6. 点击 Save，等待部署完成

### Netlify 部署
1. 访问 [Netlify](https://netlify.com)
2. 连接您的 GitHub 账户
3. 选择本项目进行部署
4. 自动部署完成后获得访问链接

### Vercel 部署
1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 项目
3. 一键部署完成

## 📁 项目结构

```
tianjiashuiyin/
├── index.html          # 主页面
├── script.js           # 核心功能脚本
├── style.css           # 样式文件
├── README.md           # 项目说明
└── 部署说明.md         # 详细部署指南
```

## 🎨 水印样式

- **橙色竖线** - 现代设计元素
- **白色文字** - 清晰易读
- **图标标识** - 时钟、日历、地点图标
- **阴影效果** - 增强可读性
- **响应式字体** - 根据图片大小自适应

## 🔧 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和布局
- **JavaScript** - 核心功能
- **Canvas API** - 图片处理和水印绘制

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👨‍💻 作者

[@nuaner0815](https://github.com/nuaner0815)

---

⭐ 如果这个项目对您有帮助，请给个 Star 支持一下！