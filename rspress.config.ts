import {defineConfig} from 'rspress/config';
import sitemap from "rspress-plugin-sitemap";
import path from "node:path";
import mermaid from 'rspress-plugin-mermaid';
import live2d from 'rspress-plugin-live2d';
import fileTree from 'rspress-plugin-file-tree';
import readingTime from 'rspress-plugin-reading-time';

export default defineConfig({
    globalStyles: path.join(__dirname, 'theme/var.css'),
    root: 'docs',
    base: '/',
    title: 'mikigo.site',
    description: 'mikigo.site',
    icon: '/favicon.ico',
    logo: '/logo.png',
    logoText: 'mikigo.site',

    head: [
        ['script', { src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', defer: '' }],
    ],

    themeConfig: {
        enableContentAnimation: true,
        enableAppearanceAnimation: true,
        enableScrollToTop: true,
        lastUpdated: true,

        footer: {
            message: `
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024104386号</a>
         版权所有 © 2020-${new Date().getFullYear()} <a href="https://github.com/mikigo" target="_blank">mikigo</a>
          | <p> | 本站总访问量：<span id="busuanzi_site_pv" style={{ color: '#1cc088' }}>加载中...</span> 次</p>
      `,
        },
        hideNavbar: 'auto',

        outlineTitle: '本页目录',
        prevPageText: '上一页',
        nextPageText: '下一页',
        lastUpdatedText: '最近更新时间',
        searchPlaceholderText: '搜索文档',
        overview: {
            filterNameText: '快速查找',
            filterPlaceholderText: '输入关键词',
            filterNoResultText: '未查询到结果',
        },
        socialLinks: [
            {
                icon: 'github',
                mode: 'link',
                content: 'https://github.com/mikigo/',
            }
        ],
    },
    plugins: [
        sitemap({
            domain: "https://mikigo.site",
        }),
        mermaid(),
        fileTree(),
        readingTime({
            defaultLocale: 'zh-CN',
        }),
        live2d({
          models: [
            {
              path: 'https://model.oml2d.com/HK416-1-normal/model.json',
              position: [0, 60],
              scale: 0.08,
              stageStyle: {
                height: 450,
              },
            },
          ],
        }),
    ],
});