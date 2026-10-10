import { projects } from '../projects';
import './index.css';

const isExternal = (link: string) => /^https?:\/\//.test(link);

export function ProjectList() {
  return (
    <div className="project-list">
      <div className="project-list__meta">
        <p className="project-list__eyebrow">Open Source · {projects.length} 个项目</p>
        <span className="project-list__rule" />
      </div>

      <div className="project-list__grid">
        {projects.map(project => {
          const external = isExternal(project.link);

          return (
            <a
              key={project.title}
              className="project-list__card"
              href={project.link}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
            >
              <span className="project-list__card-icon">{project.icon}</span>
              <span className="project-list__card-title">{project.title}</span>
              <span className="project-list__card-desc">{project.details}</span>
              <span className="project-list__card-more">
                {external ? '访问站点' : '查看文档'}
                <span className="project-list__card-arrow">{external ? '↗' : '→'}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
