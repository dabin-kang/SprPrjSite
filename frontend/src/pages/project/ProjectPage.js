import React from 'react';
import {Link} from "react-router-dom";
import './ProjectPage.css';


const projects = [
  {
    id:'changwon-biennale',
    number: '01',
    title: '창원 비엔날레',
    description: '2026년 창원조각비엔날레 지도프로젝트.',
    image: '/images/projects/ChangwonBiennalePage/changwonmain.png',
    path: '/projects/changwon-biennale',
  },
  {
    id: 'bulmosan-goods',
    number: '02',
    title: '불모산 굿즈',
    description: '창원의 불모산과 지역의 이야기를 담은 문화상품 개발',
    image: '/images/projects/bulmosan/main.jpg',
    path: '/projects/bulmosan-goods',
  },
];

function ProjectPage() {
  return (
    <main className="projects-page">
      <section className="page-header">
        <p className="page-label">PROJECT</p>
        <h1>프로젝트</h1>
        <p>
          지역의 이야기와 공간을 바탕으로 만든
          <br />
          다양한 프로젝트를 소개합니다.
        </p>
      </section>

      <section className="projects-grid">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={project.path}
            className="proj-card"
          >
            <div className="proj-thumbnail">
              <img
                src={project.image}
                alt={project.title}
              />

              <span className="proj-num">
                {project.number}
              </span>
            </div>

            <div className="proj-card-body">
              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <span className="project-more">
                VIEW PROJECT →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
export default ProjectPage;
