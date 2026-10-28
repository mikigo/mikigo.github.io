import React from 'react';
import ChinaMap from './ChinaMap';
import { visitedCities } from './visited-cities';

interface CustomHeroProps {
  name: string;
  text: string;
  tagline: string;
  blogCount: number;
  projectCount: number;
  tutorialCount: number;
  patentCount: number;
}

/** lixiaolai.com 风格双栏 Hero */
const CustomHero: React.FC<CustomHeroProps> = ({ name, text, tagline, blogCount, projectCount, tutorialCount, patentCount }) => {
  return (
    <div className="custom-hero">
      {/* 左侧：身份陈述 */}
      <div className="custom-hero__main">
        <h1 className="custom-hero__title">
          {name}
        </h1>
        <p className="custom-hero__en">Small steps daily, greatness through persistence.</p>
        <p className="custom-hero__sub">{text}</p>
        <p className="custom-hero__desc">{tagline}</p>

        <div className="custom-hero__meta">
          <div className="custom-hero__meta-line">
            <span className="custom-hero__meta-label">Role</span>
            <span className="custom-hero__meta-val">Automation Engineer · Developer · Open Source</span>
          </div>
          <div className="custom-hero__meta-line">
            <span className="custom-hero__meta-label">Since</span>
            <span className="custom-hero__meta-val">2020 <em style={{fontStyle:'normal',opacity:0.5,fontSize:'0.75rem'}}>(this site)</em></span>
          </div>
        </div>

        <div className="custom-hero__stats">
          <div className="custom-hero__stat">
            <span className="custom-hero__stat-num">{blogCount}</span>
            <span className="custom-hero__stat-label">博客随笔</span>
          </div>
          <div className="custom-hero__stat">
            <span className="custom-hero__stat-num">{projectCount}</span>
            <span className="custom-hero__stat-label">开源项目</span>
          </div>
          <div className="custom-hero__stat">
            <span className="custom-hero__stat-num">{tutorialCount}</span>
            <span className="custom-hero__stat-label">技术教程</span>
          </div>
          <div className="custom-hero__stat">
            <span className="custom-hero__stat-num">{patentCount}</span>
            <span className="custom-hero__stat-label">发明专利</span>
          </div>
        </div>

        <div className="custom-hero__links">
          <a href="/blog/" className="custom-hero__link">
            阅读博客 <span className="custom-hero__link-arrow">→</span>
          </a>
          <a href="/open_source_project/" className="custom-hero__link">
            开源项目 <span className="custom-hero__link-arrow">→</span>
          </a>
          <a href="https://github.com/mikigo" target="_blank" rel="noopener noreferrer" className="custom-hero__link">
            GitHub <span className="custom-hero__link-arrow">↗</span>
          </a>
        </div>
      </div>

      {/* 右侧：状态卡片 */}
      <aside className="custom-hero__card">
        {/* 地图区域 */}
        <div className="co-head">
          <ChinaMap cities={visitedCities} />
          <dl className="co-dl">
            <dt>BASE</dt>
            <dd>成都</dd>
          </dl>
        </div>

        {/* 分隔线 */}
        <div className="co-rule">
          <span>§</span>
        </div>

        {/* 动态信息 */}
        <div className="co-body">
          <div className="co-line">
            <span className="co-bullet">•</span>
            <span className="co-label">项目</span>
            <span className="co-value">
              <a href="/open_source_project/">开源项目</a>
              <em> · {projectCount} repos</em>
            </span>
          </div>
          <div className="co-line">
            <span className="co-bullet">•</span>
            <span className="co-label">文档</span>
            <span className="co-value">
              <a href="/tech_doc/">技术文档</a>
              <em> · 持续更新</em>
            </span>
          </div>
          <div className="co-line">
            <span className="co-bullet">•</span>
            <span className="co-label">博客</span>
            <span className="co-value">
              <a href="/blog/">阅读</a>
              <em> · 技术笔记</em>
            </span>
          </div>
        </div>

        {/* 页脚 */}
        <div className="co-foot">
          <span>Built with <em>Rspress</em> &amp; React</span>
          <span className="co-stamp">{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </aside>
    </div>
  );
};

export default CustomHero;