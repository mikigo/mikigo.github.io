import {defineConfig} from '@rspress/core';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import path from "node:path";

const siteUrl = 'https://mikigo.site';

export default defineConfig({
    lang: 'zh',
    globalStyles: path.join(__dirname, 'theme/var.css'),
    root: 'docs',
    base: '/',
    title: 'mikigo.site',
    description: 'mikigo.site',
    icon: '/favicon.ico',
    logo: '/logo.png',
    logoText: 'mikigo.site',
    // head: [
    //     ['script', { src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js', defer: '' }],
    // ],
    route: {
        cleanUrls: true,
        exclude: ['components/**'],
    },
    themeConfig: {
        enableContentAnimation: true,
        enableAppearanceAnimation: true,
        enableScrollToTop: true,
        lastUpdated: true,

        footer: {
            message: `
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024104386号</a>
         版权所有 © 2020-${new Date().getFullYear()} <a href="https://github.com/mikigo" target="_blank">mikigo</a>
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
        pluginSitemap({
            siteUrl,
        }),
    ],
});