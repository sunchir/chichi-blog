module.exports = {
  title: '驰驰的blog',
  description: 'I am just a trespasser , only want to remain a trail of footprints for you',
  plugins: ['@vuepress/active-header-links','@vuepress/blog'],
  theme: 'reco',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  themeConfig: {
    author: 'CHI-CHI',
    nav: [
      { text: '生活之旅', link: '/tags/', icon: 'reco-category' },
      { text: '技术之途', link: '/techonology/', icon: 'reco-up' },
      { text: '其他分类', 
        items: [
          { text: '见闻感悟', link: '/categories/frontEnd',icon: 'reco-message' },
          { text: 'contact', link: '/categories/backEnd',icon: 'reco-wechat' }
        ]
      },
    ]
  }
}