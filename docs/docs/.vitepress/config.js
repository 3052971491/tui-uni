import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'Tui Uni',
  description: '一款高效的低代码引擎',
  lastUpdated: true,
  // cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
  ],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/images/icon.png',
    // 导航栏
    nav: nav(),

    // 侧边栏
    sidebar: {
      '/guide/': sidebarGuide(),
      '/developer/': sidebarDeveloper(),
    },

    // 链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/3052971491/hex-lowcode-engine-starter' }
    ],

    // 底部
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present JunJie Yuan'
    },

    // 搜索
    search: {
      provider: 'algolia',
      options: {
        appId: '8J64VVRP8K',
        apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
        indexName: 'vitepress'
      }
    },
  },
  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: 'https://www.zczchen.top/hex-lowcode-engine-starter/' },
  },
})

function nav() {
  return [
    { text: '首页', link: '/' },
    { text: '文档', link: '/guide/introduce', activeMatch: '/guide/' },
    {
      text: '组件',
      link: '/developer/components/basic/text',
      activeMatch: '/developer/'
    },
    {
      text: '更新日志',
      link: '/change-log/index',
      activeMatch: '/change-log/'
    },
    {
      text: '高频问题',
      link: '/problem/index',
      activeMatch: '/problem/'
    },
  ]
}

function sidebarGuide() {
  return [
    {
      text: '文档',
      collapsed: false,
      items: [
        { text: '介绍', link: '/guide/introduce' },
        { text: '技术实现', link: '/guide/realization' },
        { text: '安装', link: '/guide/install' },
      ]
    },
  ]
}

function sidebarDeveloper() {
  return [
    { 
      text: '基础控件', 
      collapsed: true,
      items: [
        { text: 'Text 文本', link: '/developer/components/basic/text' },
      ]
    },
    { 
      text: '表单控件', 
      collapsed: true,
      items: [
        { text: 'Input 单行文本', link: '/developer/components/form/input' },
      ]
    },
    { 
      text: '布局控件', 
      collapsed: true,
      items: [
      ]
    },
  ]
}
