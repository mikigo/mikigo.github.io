import { useState } from 'react';
import { Link } from '@rspress/core/theme';
import { useBlogPages } from '../Blog';
import './index.css';

const TABS = [
  { key: 'recent', label: '最近文章' },
  { key: 'leaderboard', label: '排行榜' },
];

function formatDate(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function HomeTabs() {
  const [activeTab, setActiveTab] = useState('recent');
  const blogPages = useBlogPages();
  const recentPosts = blogPages.slice(0, 10);

  return (
    <div className="home-tabs">
      <div className="home-tabs__nav">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`home-tabs__btn ${activeTab === tab.key ? 'home-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="home-tabs__content">
        {activeTab === 'recent' && (
          <ul className="home-tabs__posts">
            {recentPosts.map(post => (
              <li key={post.id} className="home-tabs__post-item">
                <Link href={post.href} className="home-tabs__post-link">
                  <span className="home-tabs__post-title">{post.title}</span>
                  {post.date && (
                    <span className="home-tabs__post-date">{formatDate(post.date)}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {activeTab === 'leaderboard' && (
          <div data-pv-top="" style={{ maxWidth: '900px', margin: '0 auto' }}></div>
        )}
      </div>
    </div>
  );
}