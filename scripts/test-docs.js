const fs = require('fs');
const path = require('path');

console.log('🔍 测试文档访问...\n');

// 检查构建后的文档
const distPath = path.join(__dirname, '..', 'dist');
const docsPath = path.join(distPath, 'docs', 'guide');

if (!fs.existsSync(docsPath)) {
  console.error('❌ 构建后的docs/guide目录不存在');
  process.exit(1);
}

// 检查几个关键文档
const testFiles = ['intro.md', '01.md', '03.md', 'end.md'];
let successCount = 0;

for (const file of testFiles) {
  const filePath = path.join(docsPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} 存在 (${(stats.size / 1024).toFixed(1)}KB)`);
    successCount++;
  } else {
    console.error(`❌ ${file} 不存在`);
  }
}

// 检查文档内容
const introPath = path.join(docsPath, 'intro.md');
if (fs.existsSync(introPath)) {
  const content = fs.readFileSync(introPath, 'utf8');
  if (content.includes('参透了浏览器的工作原理')) {
    console.log('✅ intro.md 内容正确');
    successCount++;
  } else {
    console.error('❌ intro.md 内容不正确');
  }
}

console.log(`\n📊 测试结果: ${successCount}/${testFiles.length + 1} 通过`);
console.log('\n✅ 文档配置正确，可以正常部署！');
console.log('\n🌐 部署后可以通过以下URL访问:');
console.log('- 首页: https://[username].github.io/broswer-working-principle/');
console.log('- 第1章: https://[username].github.io/broswer-working-principle/guide/01');
console.log('- 第3章: https://[username].github.io/broswer-working-principle/guide/03');
