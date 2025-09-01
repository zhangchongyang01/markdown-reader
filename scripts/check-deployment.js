const fs = require('fs');
const path = require('path');

console.log('🔍 检查部署配置...\n');

// 检查构建目录
const distPath = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist 目录不存在，请先运行 npm run build');
  process.exit(1);
}

console.log('✅ dist 目录存在');

// 检查必要文件
const requiredFiles = ['index.html', '404.html'];
for (const file of requiredFiles) {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} 存在`);
  } else {
    console.error(`❌ ${file} 不存在`);
  }
}

// 检查docs目录
const docsPath = path.join(distPath, 'docs');
if (fs.existsSync(docsPath)) {
  const guidePath = path.join(docsPath, 'guide');
  if (fs.existsSync(guidePath)) {
    const files = fs.readdirSync(guidePath);
    console.log(`✅ docs/guide 目录存在，包含 ${files.length} 个Markdown文件`);
  } else {
    console.error('❌ docs/guide 目录不存在');
  }
} else {
  console.error('❌ docs 目录不存在');
}

// 检查assets目录
const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  const assets = fs.readdirSync(assetsPath);
  console.log(`✅ assets 目录存在，包含 ${assets.length} 个文件`);
} else {
  console.error('❌ assets 目录不存在');
}

// 检查基础路径配置
const indexPath = path.join(distPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (indexContent.includes('/broswer-working-principle/')) {
  console.log('✅ 基础路径配置正确');
} else {
  console.error('❌ 基础路径配置错误');
}

console.log('\n📋 部署检查完成！');
console.log('\n🚀 部署步骤：');
console.log('1. 推送代码到 GitHub');
console.log('2. 在仓库设置中启用 GitHub Pages');
console.log('3. 选择 gh-pages 分支作为源');
console.log('4. 访问 https://[username].github.io/broswer-working-principle/');
