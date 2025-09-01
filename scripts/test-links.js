const fs = require('fs');
const path = require('path');

console.log('🔍 测试链接处理逻辑...\n');

// 模拟Vue组件中的链接处理逻辑
const processInternalLinks = (content, isProd = true) => {
  const base = isProd ? '/broswer-working-principle/' : '/'
  
  return content.replace(
    /\[([^\]]*)\]\(\/guide\/([^)]+)\)/g,
    (match, text, id) => {
      if (isProd) {
        return `<a href="${base}guide/${id}" class="internal-link">${text}</a>`
      } else {
        return `<a href="/guide/${id}" class="internal-link">${text}</a>`
      }
    }
  )
}

// 模拟点击处理逻辑
const extractPathFromHref = (href, isProd = true) => {
  const base = isProd ? '/broswer-working-principle/' : '/'
  let path = href
  
  // 如果链接包含基础路径，需要去掉
  if (path.startsWith(base)) {
    path = path.substring(base.length - 1) // 保留开头的 /
  }
  
  // 确保路径以 / 开头
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  
  return path
}

// 测试用例
const testCases = [
  {
    name: '开发环境链接处理',
    isProd: false,
    input: '[上一篇文章](/guide/01)',
    expected: '<a href="/guide/01" class="internal-link">上一篇文章</a>'
  },
  {
    name: '生产环境链接处理',
    isProd: true,
    input: '[上一篇文章](/guide/01)',
    expected: '<a href="/broswer-working-principle/guide/01" class="internal-link">上一篇文章</a>'
  }
]

// 测试点击处理
const clickTestCases = [
  {
    name: '开发环境点击处理',
    isProd: false,
    href: '/guide/01',
    expected: '/guide/01'
  },
  {
    name: '生产环境点击处理',
    isProd: true,
    href: '/broswer-working-principle/guide/01',
    expected: '/guide/01'
  },
  {
    name: '生产环境点击处理（无基础路径）',
    isProd: true,
    href: '/guide/01',
    expected: '/guide/01'
  }
]

console.log('1. 测试链接生成...');
testCases.forEach((testCase, index) => {
  const result = processInternalLinks(testCase.input, testCase.isProd)
  const status = result === testCase.expected ? '✅' : '❌'
  console.log(`${index + 1}. ${testCase.name}: ${status}`)
  if (result !== testCase.expected) {
    console.log(`   期望: ${testCase.expected}`)
    console.log(`   实际: ${result}`)
  }
})

console.log('\n2. 测试点击处理...');
clickTestCases.forEach((testCase, index) => {
  const result = extractPathFromHref(testCase.href, testCase.isProd)
  const status = result === testCase.expected ? '✅' : '❌'
  console.log(`${index + 1}. ${testCase.name}: ${status}`)
  if (result !== testCase.expected) {
    console.log(`   期望: ${testCase.expected}`)
    console.log(`   实际: ${result}`)
  }
})

// 测试实际文档中的链接
console.log('\n3. 测试实际文档...');
const docsPath = path.join(__dirname, '..', 'dist', 'docs', 'guide', '03.md')
if (fs.existsSync(docsPath)) {
  const content = fs.readFileSync(docsPath, 'utf8')
  
  // 查找链接
  const linkMatches = content.match(/\[([^\]]*)\]\(\/guide\/([^)]+)\)/g)
  if (linkMatches) {
    console.log(`找到 ${linkMatches.length} 个内部链接:`)
    linkMatches.forEach((match, index) => {
      console.log(`  ${index + 1}. ${match}`)
      
      // 测试开发环境处理
      const devResult = processInternalLinks(match, false)
      console.log(`     开发环境: ${devResult}`)
      
      // 测试生产环境处理
      const prodResult = processInternalLinks(match, true)
      console.log(`     生产环境: ${prodResult}`)
    })
  }
}

console.log('\n📋 链接处理说明:');
console.log('- 开发环境: 链接为 /guide/01，点击后跳转到 /guide/01');
console.log('- 生产环境: 链接为 /broswer-working-principle/guide/01，点击后跳转到 /guide/01');
console.log('- 预览环境: 应该与生产环境一致');
