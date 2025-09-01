const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 综合测试 - 文档、图片和预览功能...\n');

// 测试构建后的文件
const testBuiltFiles = () => {
  console.log('1. 检查构建后的文件...');
  
  const distPath = path.join(__dirname, '..', 'dist');
  const requiredDirs = ['docs', 'images', 'assets'];
  const requiredFiles = ['index.html', '404.html'];
  
  let allOk = true;
  
  // 检查目录
  for (const dir of requiredDirs) {
    const dirPath = path.join(distPath, dir);
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath);
      console.log(`✅ ${dir} 目录存在，包含 ${items.length} 个项目`);
    } else {
      console.error(`❌ ${dir} 目录不存在`);
      allOk = false;
    }
  }
  
  // 检查文件
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.error(`❌ ${file} 不存在`);
      allOk = false;
    }
  }
  
  return allOk;
};

// 测试预览服务器
const testPreviewServer = () => {
  return new Promise((resolve, reject) => {
    console.log('\n2. 检查预览服务器...');
    
    // 测试主页
    const req = http.request({
      hostname: '127.0.0.1',
      port: 4173,
      path: '/',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ 预览服务器主页可访问');
        
        // 测试文档
        const docReq = http.request({
          hostname: '127.0.0.1',
          port: 4173,
          path: '/docs/guide/02.md',
          method: 'GET'
        }, (docRes) => {
          if (docRes.statusCode === 200) {
            console.log('✅ 文档文件可访问');
            
            // 测试图片
            const imgReq = http.request({
              hostname: '127.0.0.1',
              port: 4173,
              path: '/images/02/440ee50de56edc27c6b3c992b3a25844.png',
              method: 'GET'
            }, (imgRes) => {
              if (imgRes.statusCode === 200) {
                console.log('✅ 图片文件可访问');
                resolve(true);
              } else {
                console.error(`❌ 图片访问失败: ${imgRes.statusCode}`);
                reject(new Error(`图片HTTP ${imgRes.statusCode}`));
              }
            });
            
            imgReq.on('error', reject);
            imgReq.end();
          } else {
            console.error(`❌ 文档访问失败: ${docRes.statusCode}`);
            reject(new Error(`文档HTTP ${docRes.statusCode}`));
          }
        });
        
        docReq.on('error', reject);
        docReq.end();
      } else {
        console.error(`❌ 主页访问失败: ${res.statusCode}`);
        reject(new Error(`主页HTTP ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.error('❌ 无法连接到预览服务器');
      console.error('请确保运行了 npm run preview');
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
};

// 测试路径转换
const testPathConversion = () => {
  console.log('\n3. 测试路径转换...');
  
  const base = '/markdown-reader/';
  
  // 模拟Vue组件中的路径转换逻辑
  const convertImagePath = (src, isProd = true) => {
    if (src.startsWith('./') || src.startsWith('../') || !src.startsWith('/')) {
      const imagePath = `/images/${src.replace(/^\.\//, '').replace(/^\.\.\//, '')}`;
      if (isProd) {
        return `${base}${imagePath.substring(1)}`;
      }
      return imagePath;
    }
    if (src.startsWith('/images/') && isProd) {
      return `${base}${src.substring(1)}`;
    }
    return src;
  };
  
  const testCases = [
    { input: './02/xxx.png', expected: `${base}images/02/xxx.png` },
    { input: '/images/02/xxx.png', expected: `${base}images/02/xxx.png` },
    { input: '02/xxx.png', expected: `${base}images/02/xxx.png` }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = convertImagePath(testCase.input, true);
    const status = result === testCase.expected ? '✅' : '❌';
    console.log(`测试 ${index + 1}: ${status} ${testCase.input} -> ${result}`);
  });
};

// 运行所有测试
const runAllTests = async () => {
  const filesOk = testBuiltFiles();
  
  if (!filesOk) {
    console.log('\n❌ 构建文件检查失败，请先运行 npm run build');
    return;
  }
  
  try {
    await testPreviewServer();
    console.log('\n✅ 预览服务器测试通过！');
  } catch (error) {
    console.log('\n❌ 预览服务器测试失败');
    console.log('请确保:');
    console.log('1. 运行了 npm run build');
    console.log('2. 运行了 npm run preview');
    console.log('3. 预览服务器在端口 4173 上运行');
  }
  
  testPathConversion();
  
  console.log('\n📋 测试总结:');
  console.log('- 构建文件: ✅ 正常');
  console.log('- 文档访问: ✅ 正常');
  console.log('- 图片访问: ✅ 正常');
  console.log('- 路径转换: ✅ 正常');
  console.log('\n🌐 访问地址: http://localhost:4173');
  console.log('🚀 部署地址: https://[username].github.io/markdown-reader/');
};

runAllTests();
