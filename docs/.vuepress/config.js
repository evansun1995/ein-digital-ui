module.exports = {
  title: 'Ein Digial UI',
  description: '一应科技数字化事业部PC端后台基础UI组件库，基于element-ui二次封装。',
  base: '/ein-digital-ui/',
  themeConfig: {
    nav: [
      {
        text: '生态',
        items: [{ text: '移动端(待整理)', link: 'https://github.com/evansun1995/ein-digital-ui' }]
      },
      { text: 'Github', link: 'https://github.com/evansun1995/ein-digital-ui' }
    ],
    sidebar: [
      {
        title: '开发指南',
        path: '/',
        collapsable: false,
        children: ['快速上手', 'filters', 'directives', 'methods']
      },
      {
        title: '组件',
        collapsable: false,
        children: ['Table', 'Dialog', 'Drawer', 'Tree', 'Scrollbar', 'ImageViewer', 'Loading']
      }
    ]
  },
  plugins: ['demo-container'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': '/docs/.vuepress/public/images'
      }
    }
  }
}
