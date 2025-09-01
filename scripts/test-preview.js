const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 测试预览模式下的文档访问...\n');

// 测试本地预览服务器
const testPreviewServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 4173,
      path: '/docs/guide/02.md',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ 预览服务器可以访问文档');
          console.log(`📄 文档大小: ${(data.length / 1024).toFixed(1)}KB`);
          if (data.includes('TCP协议')) {
            console.log('✅ 文档内容正确');
          } else {
            console.log('⚠️ 文档内容可能不正确');
          }
          resolve(true);
        } else {
          console.error(`❌ 预览服务器返回状态码: ${res.statusCode}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ 无法连接到预览服务器');
      console.error('请确保运行了 npm run preview');
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
};

// 测试构建后的文件
const testBuiltFiles = () => {
  const distPath = path.join(__dirname, '..', 'dist');
  const filePath = path.join(distPath, 'docs', 'guide', '02.md');
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log('✅ 构建后的文档文件存在');
    console.log(`📄 文件大小: ${(content.length / 1024).toFixed(1)}KB`);
    if (content.includes('TCP协议')) {
      console.log('✅ 构建后的文档内容正确');
      return true;
    } else {
      console.log('⚠️ 构建后的文档内容可能不正确');
      return false;
    }
  } else {
    console.error('❌ 构建后的文档文件不存在');
    return false;
  }
};

// 运行测试
const runTests = async () => {
  console.log('1. 检查构建后的文件...');
  const builtFileOk = testBuiltFiles();
  
  console.log('\n2. 检查预览服务器...');
  try {
    await testPreviewServer();
    console.log('\n✅ 所有测试通过！');
    console.log('\n🌐 现在可以访问: http://localhost:4173');
  } catch (error) {
    console.log('\n❌ 预览服务器测试失败');
    console.log('请确保:');
    console.log('1. 运行了 npm run build');
    console.log('2. 运行了 npm run preview');
    console.log('3. 预览服务器在端口 4173 上运行');
  }
};

runTests();
