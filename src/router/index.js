import { createRouter, createWebHistory } from 'vue-router'
import MarkdownReader from '../components/MarkdownReader.vue'

// 获取基础路径，如果是GitHub Pages部署，使用仓库名作为基础路径
const base = import.meta.env.BASE_URL || '/'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MarkdownReader,
    props: { defaultFile: 'intro' }
  },
  {
    path: '/guide/:id',
    name: 'Chapter',
    component: MarkdownReader,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router
