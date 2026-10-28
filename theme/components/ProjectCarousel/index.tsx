import { projects } from '../projects';
import './index.css';

export function ProjectCarousel() {
  return (
    <div className="project-carousel">
      <h2 className="project-carousel__title">我创建的开源项目</h2>
      <div className="project-carousel__wrapper">
        <div className="project-carousel__track">
          {projects.map((p, i) => (
            <a key={`a-${i}`} href={p.link} target={p.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="project-carousel__card">
              <span className="project-carousel__card-icon">{p.icon}</span>
              <span className="project-carousel__card-title">{p.title}</span>
              <span className="project-carousel__card-desc">{p.details}</span>
            </a>
          ))}
          {projects.map((p, i) => (
            <a key={`b-${i}`} href={p.link} target={p.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="project-carousel__card">
              <span className="project-carousel__card-icon">{p.icon}</span>
              <span className="project-carousel__card-title">{p.title}</span>
              <span className="project-carousel__card-desc">{p.details}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}