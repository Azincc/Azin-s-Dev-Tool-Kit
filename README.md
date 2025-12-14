# Azin's Dev Toolkit

[![Build and Publish Docker Image](https://github.com/Azincc/Azin-s-Dev-Tool-Kit/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Azincc/Azin-s-Dev-Tool-Kit/actions/workflows/docker-publish.yml)

一个功能丰富的开发者工具集合，提供多种实用工具帮助开发者提高工作效率。

## 🔗 在线预览

访问 [tool.azin.cc](https://tool.azin.cc) 体验完整功能

## ✨ 功能特性

- **时间工具** - 时间转换、时区处理、Crontab 表达式等
- **文本工具** - 文本格式化、编码转换、正则测试等
- **JSON 工具** - JSON 格式化、验证、转换等
- **颜色工具** - 颜色选择器、格式转换、二维码生成等
- **安全工具** - 加密解密、哈希计算等
- **国际化支持** - 多语言界面
- **深色模式** - 支持明暗主题切换

## 🚀 本地运行

**前置要求:** Node.js

1. 安装依赖:

   ```bash
   npm install
   ```

2. 启动开发服务器:

   ```bash
   npm run dev
   ```

3. 构建生产版本:

   ```bash
   npm run build
   ```

## 🐳 Docker 部署

```bash
docker build -t azin-dev-toolkit .
docker run -p 9080:80 azin-dev-toolkit
```

## 🙏 致谢

本项目由以下工具和服务协助完成：

- Gemini 3 Pro
- Claude
- [CTO.NEW](https://cto.new)
- 感谢随时跑路公益站提供的公益服务
- Antigravity

## 📄 License

MIT
