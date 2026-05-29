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
    route: {
        cleanUrls: false,
        exclude: ['components/**'],
    },
    themeConfig: {
        enableContentAnimation: true,
        enableAppearanceAnimation: true,
        enableScrollToTop: true,
        lastUpdated: true,

        footer: {
            message: `
        <a style="text-decoration: underline" href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2024104386号</a>
         版权所有 © 2020-${new Date().getFullYear()} <a style="text-decoration: underline" href="https://github.com/mikigo" target="_blank">mikigo</a>
      `,
        },
        hideNavbar: 'auto',
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