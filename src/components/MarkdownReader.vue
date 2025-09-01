<template>
  <div class="markdown-reader">
    <!-- 主容器 -->
    <div class="main-container">
      <!-- 左侧边栏 - 文件目录 -->
      <div class="sidebar left" :class="{ collapsed: leftSidebarCollapsed }">
        <div class="sidebar-content">
          <ul class="file-tree">
            <li v-for="item in fileTree" :key="item.path">
              <a 
                v-if="item.type === 'folder'"
                @click="toggleFolder(item)"
                class="folder"
              >
                {{ item.expanded ? '📂' : '📁' }} {{ item.name }}
              </a>
                             <router-link
                 v-else
                 :to="{ path: `/guide/${getFileId(item.path)}` }"
                 :class="{ active: currentFile && currentFile.path === item.path }"
                 class="file"
               >
                📄 {{ item.name }}
              </router-link>
              <ul v-if="item.type === 'folder' && item.expanded" class="file-tree">
                <li v-for="child in item.children" :key="child.path">
                                   <router-link
                   :to="{ path: `/guide/${getFileId(child.path)}` }"
                   :class="{ active: currentFile && currentFile.path === child.path }"
                   class="file"
                 >
                    📄 {{ child.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <!-- 中间内容区域 -->
      <div class="content-area">
        <div class="content-body">
          <!-- 左侧切换按钮 -->
          <button 
            @click="toggleLeftSidebar" 
            class="toggle-button left-toggle"
            :class="{ 
              active: !leftSidebarCollapsed,
              'sidebar-collapsed': leftSidebarCollapsed 
            }"
          >
            📁 {{ leftSidebarCollapsed ? '显示' : '隐藏' }}目录
          </button>
          
          <!-- 右侧切换按钮 -->
          <button 
            @click="toggleRightSidebar" 
            class="toggle-button right-toggle"
            :class="{ 
              active: !rightSidebarCollapsed,
              'sidebar-collapsed': rightSidebarCollapsed 
            }"
          >
            📋 {{ rightSidebarCollapsed ? '显示' : '隐藏' }}大纲
          </button>
          
          <div v-if="currentFile" class="markdown-content" v-html="renderedContent"></div>
          <div v-else class="markdown-content">
            <h2>欢迎使用Markdown阅读器</h2>
            <p>请从左侧选择要阅读的文档。</p>
          </div>
        </div>

        <!-- 底部导航 -->
        <div v-if="currentFile" class="content-footer">
                     <router-link 
             v-if="prevFile" 
             :to="{ path: `/guide/${getFileId(prevFile.path)}` }" 
             class="nav-button prev"
           >
            ← 上一章: {{ prevFile.name }}
          </router-link>
          <span v-else class="nav-button prev" style="opacity: 0.5; cursor: not-allowed;">
            ← 上一章
          </span>
          
                     <router-link 
             v-if="nextFile" 
             :to="{ path: `/guide/${getFileId(nextFile.path)}` }" 
             class="nav-button next"
           >
            下一章: {{ nextFile.name }} →
          </router-link>
          <span v-else class="nav-button next" style="opacity: 0.5; cursor: not-allowed;">
            下一章 →
          </span>
        </div>
      </div>

      <!-- 右侧边栏 - 大纲 -->
      <div class="sidebar right" :class="{ collapsed: rightSidebarCollapsed }">
        <div class="sidebar-content">
          <ul v-if="outline.length > 0" class="outline">
            <li v-for="item in outline" :key="item.id">
              <a 
                @click="scrollToHeading(item.id)"
                :class="`h${item.level}`"
              >
                {{ item.text }}
              </a>
            </li>
          </ul>
          <div v-else style="color: #656d76; font-style: italic;">
            暂无大纲内容
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default {
  name: 'MarkdownReader',
  props: {
    defaultFile: {
      type: String,
      default: 'intro'
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    
    // 响应式数据
    const leftSidebarCollapsed = ref(false)
    const rightSidebarCollapsed = ref(false)
    const currentFile = ref(null)
    const fileTree = ref([])
    const outline = ref([])
    const renderedContent = ref('')

    // 配置marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (err) {}
        }
        return hljs.highlightAuto(code).value
      },
      breaks: true,
      gfm: true
    })

    // 计算属性
    const prevFile = computed(() => {
      if (!currentFile.value) return null
      const allFiles = getAllFiles(fileTree.value)
      const currentIndex = allFiles.findIndex(f => f.path === currentFile.value.path)
      return currentIndex > 0 ? allFiles[currentIndex - 1] : null
    })

    const nextFile = computed(() => {
      if (!currentFile.value) return null
      const allFiles = getAllFiles(fileTree.value)
      const currentIndex = allFiles.findIndex(f => f.path === currentFile.value.path)
      return currentIndex < allFiles.length - 1 ? allFiles[currentIndex + 1] : null
    })

    // 方法
    const toggleLeftSidebar = () => {
      leftSidebarCollapsed.value = !leftSidebarCollapsed.value
    }

    const toggleRightSidebar = () => {
      rightSidebarCollapsed.value = !rightSidebarCollapsed.value
    }

    const toggleFolder = (folder) => {
      folder.expanded = !folder.expanded
    }

    const getFileId = (path) => {
      // 从路径中提取文件名（不含扩展名）
      const filename = path.split('/').pop().replace('.md', '')
      return filename
    }

    const getFileById = (id) => {
      const allFiles = getAllFiles(fileTree.value)
      return allFiles.find(file => getFileId(file.path) === id)
    }

    const loadFile = async (file) => {
      try {
        // 根据环境调整文件路径
        let filePath = file.path
        const base = import.meta.env.BASE_URL || '/'
        
        // 在预览和生产环境中，确保路径正确
        if (import.meta.env.PROD) {
          // 如果是绝对路径，需要加上基础路径
          if (filePath.startsWith('/')) {
            filePath = base + filePath.substring(1)
          }
        }
        
        const response = await fetch(filePath)
        const content = await response.text()
        currentFile.value = file
        
        // 移除frontmatter部分（---包围的内容）
        let processedContent = content.replace(/^---[\s\S]*?---\s*/, '')
        
        // 处理图片路径，支持多种格式
        processedContent = processedContent.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          (match, alt, src) => {
            // 如果是相对路径，转换为绝对路径
            if (src.startsWith('./') || src.startsWith('../') || !src.startsWith('/')) {
              const imagePath = `/images/${src.replace(/^\.\//, '').replace(/^\.\.\//, '')}`
              // 在生产环境中，需要加上基础路径
              if (import.meta.env.PROD) {
                return `![${alt}](${base}${imagePath.substring(1)})`
              }
              return `![${alt}](${imagePath})`
            }
            // 如果是绝对路径，也需要处理基础路径
            if (src.startsWith('/images/') && import.meta.env.PROD) {
              return `![${alt}](${base}${src.substring(1)})`
            }
            return match
          }
        )
        
        // 处理文章中的链接，将/guide/开头的链接转换为路由链接
        processedContent = processedContent.replace(
          /\[([^\]]*)\]\(\/guide\/([^)]+)\)/g,
          (match, text, id) => {
            // 在预览和生产环境中，链接应该包含基础路径
            if (import.meta.env.PROD) {
              return `<a href="${base}guide/${id}" class="internal-link">${text}</a>`
            } else {
              return `<a href="/guide/${id}" class="internal-link">${text}</a>`
            }
          }
        )
        
        renderedContent.value = marked(processedContent)
        
        // 滚动到内容区顶部
        const contentArea = document.querySelector('.content-area')
        if (contentArea) {
          contentArea.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
        
        // 延迟生成大纲，确保DOM已渲染
        setTimeout(() => {
          generateOutline()
          // 为文章中的链接添加点击事件
          addLinkClickHandlers()
        }, 100)
      } catch (error) {
        console.error('读取文件失败:', error)
        alert('读取文件失败: ' + error.message)
      }
    }

    const generateOutline = () => {
      const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6')
      outline.value = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`
        heading.id = id
        return {
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1))
        }
      })
    }

    const scrollToHeading = (id) => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const addLinkClickHandlers = () => {
      const links = document.querySelectorAll('.markdown-content .internal-link')
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          const href = link.getAttribute('href')
          if (href && href.includes('/guide/')) {
            // 提取路径部分，去掉基础路径
            const base = import.meta.env.BASE_URL || '/'
            let path = href
            
            // 如果链接包含基础路径，需要去掉
            if (path.startsWith(base)) {
              path = path.substring(base.length - 1) // 保留开头的 /
            }
            
            // 确保路径以 / 开头
            if (!path.startsWith('/')) {
              path = '/' + path
            }
            
            router.push(path)
          }
        })
      })
    }

    const getAllFiles = (items) => {
      const files = []
      items.forEach(item => {
        if (item.type === 'folder' && item.children) {
          files.push(...getAllFiles(item.children))
        } else if (item.type === 'file') {
          files.push(item)
        }
      })
      return files
    }

    // 初始化文件树
    const initFileTree = () => {
      fileTree.value = [
        {
          name: '开篇词 (1讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '开篇词 | 参透了浏览器的工作原理, 你就能解决80%的前端难题',
              type: 'file',
              path: '/docs/guide/intro.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '宏观视角下的浏览器 (6讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '01 | Chrome架构: 仅仅打开了1个页面, 为什么有4个进程',
              type: 'file',
              path: '/docs/guide/01.md',
              lastModified: new Date()
            },
            {
              name: '02 | TCP协议: 如何保证页面文件能被完整送达浏览器?',
              type: 'file',
              path: '/docs/guide/02.md',
              lastModified: new Date()
            },
            {
              name: '03 | HTTP请求流程: 为什么很多站点第二次打开速度会很快?',
              type: 'file',
              path: '/docs/guide/03.md',
              lastModified: new Date()
            },
            {
              name: '04 | 导航流程: 从输入URL到页面展示, 这中间发生了什么?',
              type: 'file',
              path: '/docs/guide/04.md',
              lastModified: new Date()
            },
            {
              name: '05 | 渲染流程(上): HTML、CSS和JavaScript, 是如何变成页面的?',
              type: 'file',
              path: '/docs/guide/05.md',
              lastModified: new Date()
            },
            {
              name: '06 | 渲染流程(下): HTML、CSS和JavaScript, 是如何变成页面的?',
              type: 'file',
              path: '/docs/guide/06.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '浏览器中的JavaScript执行机制 (5讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '07 | 变量提升: JavaScript代码是按顺序执行的吗?',
              type: 'file',
              path: '/docs/guide/07.md',
              lastModified: new Date()
            },
            {
              name: '08 | 调用栈: 为什么JavaScript代码会出现栈溢出?',
              type: 'file',
              path: '/docs/guide/08.md',
              lastModified: new Date()
            },
            {
              name: '09 | 块级作用域: var缺陷以及为什么要引入let和const?',
              type: 'file',
              path: '/docs/guide/09.md',
              lastModified: new Date()
            },
            {
              name: '10 | 作用域链和闭包: 代码中出现相同的变量,JavaScript引擎是如何选择的?',
              type: 'file',
              path: '/docs/guide/10.md',
              lastModified: new Date()
            },
            {
              name: '11 | this: 从JavaScript执行上下文的视角讲清楚this',
              type: 'file',
              path: '/docs/guide/11.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: 'V8工作原理 (3讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '12 | 栈空间和堆空间：数据是如何存储的？',
              type: 'file',
              path: '/docs/guide/12.md',
              lastModified: new Date()
            },
            {
              name: '13 | 垃圾回收：垃圾数据是如何自动回收的？',
              type: 'file',
              path: '/docs/guide/13.md',
              lastModified: new Date()
            },
            {
              name: '14 | 编译器和解释器: V8是如何执行一段JavaScript代码的?',
              type: 'file',
              path: '/docs/guide/14.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '浏览器中的页面循环系统 (6讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '15 | 消息队列和事件循环：页面是怎么"活"起来的？',
              type: 'file',
              path: '/docs/guide/15.md',
              lastModified: new Date()
            },
            {
              name: '16 | WebAPI: setTimeout是如何实现的?',
              type: 'file',
              path: '/docs/guide/16.md',
              lastModified: new Date()
            },
            {
              name: '17 | WebAPI: XMLHttpRequest是怎么实现的?',
              type: 'file',
              path: '/docs/guide/17.md',
              lastModified: new Date()
            },
            {
              name: '18 | 宏任务和微任务：不是所有任务都是一个待遇',
              type: 'file',
              path: '/docs/guide/18.md',
              lastModified: new Date()
            },
            {
              name: '19 | Promise: 使用Promise, 告别回调函数',
              type: 'file',
              path: '/docs/guide/19.md',
              lastModified: new Date()
            },
            {
              name: '20 | async/await: 使用同步的方式去写异步代码',
              type: 'file',
              path: '/docs/guide/20.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '浏览器中的页面 (8讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '21 | Chrome开发者工具: 利用网络面板做性能分析',
              type: 'file',
              path: '/docs/guide/21.md',
              lastModified: new Date()
            },
            {
              name: '22 | DOM树: JavaScript是如何影响DOM树构建的?',
              type: 'file',
              path: '/docs/guide/22.md',
              lastModified: new Date()
            },
            {
              name: '23 | 渲染流水线: CSS如何影响首次加载时的白屏时间?',
              type: 'file',
              path: '/docs/guide/23.md',
              lastModified: new Date()
            },
            {
              name: '24 | 分层和合成机制: 为什么CSS动画比JavaScript高效?',
              type: 'file',
              path: '/docs/guide/24.md',
              lastModified: new Date()
            },
            {
              name: '25 | 页面性能：如何系统地优化页面？',
              type: 'file',
              path: '/docs/guide/25.md',
              lastModified: new Date()
            },
            {
              name: '26 | 虚拟DOM: 虚拟DOM和实际的DOM有何不同?',
              type: 'file',
              path: '/docs/guide/26.md',
              lastModified: new Date()
            },
            {
              name: '27 | 渐进式网页应用(PWA): 它究竟解决了Web应用的哪些问题?',
              type: 'file',
              path: '/docs/guide/27.md',
              lastModified: new Date()
            },
            {
              name: '28 | WebComponent: 像搭积木一样构建Web应用',
              type: 'file',
              path: '/docs/guide/28.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '浏览器中的网络 (3讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '29 | HTTP/1: HTTP性能优化',
              type: 'file',
              path: '/docs/guide/29.md',
              lastModified: new Date()
            },
            {
              name: '30 | HTTP/2: 如何提升网络速度？',
              type: 'file',
              path: '/docs/guide/30.md',
              lastModified: new Date()
            },
            {
              name: '31 | HTTP/3:甩掉TCP、TLS 的包袱，构建高效网络',
              type: 'file',
              path: '/docs/guide/31.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '浏览器安全 (5讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '32 | 同源策略: 为什么XMLHttpRequest不能跨域请求资源?',
              type: 'file',
              path: '/docs/guide/32.md',
              lastModified: new Date()
            },
            {
              name: '33 | 跨站脚本攻击(XSS): 为什么Cookie中有HttpOnly属性?',
              type: 'file',
              path: '/docs/guide/33.md',
              lastModified: new Date()
            },
            {
              name: '34 | CSRF攻击: 陌生链接不要随便点',
              type: 'file',
              path: '/docs/guide/34.md',
              lastModified: new Date()
            },
            {
              name: '35 | 安全沙箱：页面和系统之间的隔离墙',
              type: 'file',
              path: '/docs/guide/35.md',
              lastModified: new Date()
            },
            {
              name: '36 | HTTPS: 让数据传输更安全',
              type: 'file',
              path: '/docs/guide/36.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '结束语 (3讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '结束语 | 大道至简',
              type: 'file',
              path: '/docs/guide/end.md',
              lastModified: new Date()
            }
          ]
        },
        {
          name: '课外加餐 (6讲)',
          type: 'folder',
          expanded: true,
          children: [
            {
              name: '加餐一｜浏览上下文组：如何计算Chrome中渲染进程的个数？',
              type: 'file',
              path: '/docs/guide/extra-1.md',
              lastModified: new Date()
            },
            {
              name: '加餐二｜任务调度：有了setTimeOut，为什么还要使用rAF？',
              type: 'file',
              path: '/docs/guide/extra-2.md',
              lastModified: new Date()
            },
            {
              name: '加餐三｜加载阶段性能：使用Audits来优化Web性能',
              type: 'file',
              path: '/docs/guide/extra-3.md',
              lastModified: new Date()
            },
            {
              name: '加餐四｜页面性能工具：如何使用Performance？',
              type: 'file',
              path: '/docs/guide/extra-4.md',
              lastModified: new Date()
            },
            {
              name: '加餐五 | 性能分析工具：如何分析Performance中的Main指标？',
              type: 'file',
              path: '/docs/guide/extra-5.md',
              lastModified: new Date()
            },
            {
              name: '加餐六｜HTTPS：浏览器如何验证数字证书？',
              type: 'file',
              path: '/docs/guide/extra-6.md',
              lastModified: new Date()
            }
          ]
        }
      ]
    }

    // 监听路由变化
    watch(() => route.params.id, (newId) => {
      if (newId) {
        const file = getFileById(newId)
        if (file) {
          console.log('路由变化，加载文件:', file.name)
          loadFile(file)
        }
      }
    }, { immediate: false }) // 改为false，避免与直接访问处理冲突



    // 处理直接访问章节URL
    const handleDirectAccess = () => {
      // 检查当前URL是否直接访问章节
      const currentPath = window.location.pathname
      const base = import.meta.env.BASE_URL || '/'
      
      // 如果是直接访问章节URL（如 /guide/03）
      if (currentPath.includes('/guide/')) {
        // 从URL中提取章节ID
        const pathMatch = currentPath.match(/\/guide\/([^\/]+)/)
        if (pathMatch) {
          const chapterId = pathMatch[1]
          console.log('检测到直接访问章节:', chapterId)
          
          // 检查章节是否存在
          const file = getFileById(chapterId)
          if (file) {
            console.log('加载章节文件:', file.name)
            loadFile(file)
            return true
          } else {
            console.log('章节不存在:', chapterId)
          }
        }
      }
      return false
    }

    // 生命周期
    onMounted(() => {
      initFileTree()
      
      // 处理直接访问章节URL
      const handledDirectAccess = handleDirectAccess()
      
      // 如果直接访问处理成功，不需要其他处理
      if (handledDirectAccess) {
        console.log('直接访问处理成功，跳过其他逻辑')
        return
      }
      
      // 如果有路由参数，让路由监听器处理
      if (route.params.id) {
        console.log('有路由参数，让路由监听器处理:', route.params.id)
        const file = getFileById(route.params.id)
        if (file) {
          loadFile(file)
        }
        return
      }
      
      // 如果没有路由参数、也没有直接访问章节，加载默认文件
      const defaultFile = getFileById(props.defaultFile)
      if (defaultFile) {
        console.log('加载默认文件:', defaultFile.name)
        loadFile(defaultFile)
      }
    })

    return {
      leftSidebarCollapsed,
      rightSidebarCollapsed,
      currentFile,
      fileTree,
      outline,
      renderedContent,
      prevFile,
      nextFile,
      toggleLeftSidebar,
      toggleRightSidebar,
      toggleFolder,
      getFileId,
      scrollToHeading
    }
  }
}
</script>

<style>
/* 组件样式继承全局样式 */
</style>
