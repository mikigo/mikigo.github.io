import {defineConfig} from 'rspress/config';
import sitemap from "rspress-plugin-sitemap";
import path from "node:path";

export default defineConfig({
    globalStyles: path.join(__dirname, 'theme/var.css'),
    root: 'docs',
    base: '/',
    title: 'mikigo.site',
    description: 'mikigo.site',
    icon: '/favicon.ico',
    logo: '/logo.png',
    logoText: 'mikigo.site',
    themeConfig: {
        enableContentAnimation: true,
        enableAppearanceAnimation: true,
        enableScrollToTop: true,
        lastUpdated: true,

        footer: {
            message: `
        <a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024104386号</a>
         版权所有 © 2020-${new Date().getFullYear()} mikigo
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
            customMaps: {
                "/sample": {
                    loc: "/sample",
                    lastmod: "2025-08-27T07:44:43.422Z",
                    priority: "0.7",
                    changefreq: "always",
                },
            },
            defaultChangeFreq: "monthly",
            defaultPriority: "0.5",
        }),
    ],
});