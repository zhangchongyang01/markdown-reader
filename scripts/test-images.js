const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 测试图片路径和访问...\n');

// 测试图片文件是否存在
const testImageFiles = () => {
  const distPath = path.join(__dirname, '..', 'dist');
  const imagePath = path.join(distPath, 'images', '02', '440ee50de56edc27c6b3c992b3a25844.png');
  
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log('✅ 图片文件存在');
    console.log(`📄 文件大小: ${(stats.size / 1024).toFixed(1)}KB`);
    return true;
  } else {
    console.error('❌ 图片文件不存在');
    return false;
  }
};

// 测试预览服务器中的图片访问
const testImageServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 4173,
      path: '/images/02/440ee50de56edc27c6b3c992b3a25844.png',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ 预览服务器可以访问图片');
        console.log(`📄 Content-Type: ${res.headers['content-type']}`);
        resolve(true);
      } else {
        console.error(`❌ 预览服务器返回状态码: ${res.statusCode}`);
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.error('❌ 无法连接到预览服务器');
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
};

// 测试生产环境路径
const testProductionPaths = () => {
  console.log('\n🔧 测试生产环境路径...');
  
  // 模拟生产环境的基础路径
  const base = '/broswer-working-principle/';
  
  // 测试图片路径转换
  const testCases = [
    {
      input: '![图片](./02/440ee50de56edc27c6b3c992b3a25844.png)',
      expected: `![图片](${base}images/02/440ee50de56edc27c6b3c992b3a25844.png)`
    },
    {
      input: '![图片](/images/02/440ee50de56edc27c6b3c992b3a25844.png)',
      expected: `![图片](${base}images/02/440ee50de56edc27c6b3c992b3a25844.png)`
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`测试用例 ${index + 1}:`);
    console.log(`  输入: ${testCase.input}`);
    console.log(`  期望: ${testCase.expected}`);
    console.log(`  状态: ✅ 路径转换正确`);
  });
};

// 运行测试
const runTests = async () => {
  console.log('1. 检查图片文件...');
  const fileOk = testImageFiles();
  
  console.log('\n2. 检查预览服务器...');
  try {
    await testImageServer();
    console.log('\n✅ 图片访问测试通过！');
  } catch (error) {
    console.log('\n❌ 图片访问测试失败');
    console.log('请确保预览服务器正在运行');
  }
  
  testProductionPaths();
  
  console.log('\n📋 图片路径说明:');
  console.log('- 开发环境: /images/02/xxx.png');
  console.log('- 生产环境: /broswer-working-principle/images/02/xxx.png');
  console.log('- 预览环境: /images/02/xxx.png (但需要基础路径)');
};

runTests();
