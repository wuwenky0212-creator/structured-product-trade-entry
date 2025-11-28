const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DIST_PATH = path.join(__dirname, 'dist');

// 提供静态文件服务
app.use(express.static(DIST_PATH));

// 处理 Vue Router 的 history 模式
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

// 监听所有网络接口
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

