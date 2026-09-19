import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProjectDetailPage.css';

const projects = [
  {
    id: 'changwon-biennale',
    number: '01',
    title: '창원 비엔날레',
    description: '2026년 창원조각비엔날레 지도프로젝트.',
    image: '/images/projects/ChangwonBiennalePage/changwonmain.png',

    content: `
      2026년 창원조각비엔날레와 함께 진행한
      지역 기반 지도 프로젝트입니다.

      창원의 공간과 작품을 연결하고,
      방문자가 직접 걸으며 작품을 발견할 수 있도록
      프로젝트를 구성했습니다.
    `,
  },

  {
    id: 'bulmosan-goods',
    number: '02',
    title: '불모산 굿즈',
    description: '창원의 불모산과 지역의 이야기를 담은 문화상품 개발',
    image: '/images/projects/bulmosan/main.jpg',

    content: `
      창원의 불모산과성주사를 소재로 한
      지역문화상품 개발 프로젝트입니다.

      산의 형태와 지역의 이야기를 바탕으로
      일상에서 사용할 수 있는 상품을 디자인합니다.
    `,

    intro:`
      불모산과 성주사의 이야기를 담은
      지역문화상품 개발 프로젝트.
    `,

    sections: [
        {
            title: '상품개발',
            text:
            `
            1. 불모산 석고 방향제
            2. 성주사 곰모형 종
            3. 돌탑 모형
            `,
        }
    ]

  },
];

function ProjectDetailPage() {

  const { projectId } = useParams();

  const project = projects.find(
    (item) => item.id === projectId
  );

  // 존재하지 않는 프로젝트
  if (!project) {
    return (
      <main className="project-detail-page">

        <h1>프로젝트를 찾을 수 없습니다.</h1>

        <Link to="/projects">
          프로젝트 목록으로 돌아가기
        </Link>

      </main>
    );
  }

  return (
    <main className="project-detail-page">

      <section className="project-detail-header">

        <p className="page-label">
          PROJECT {project.number}
        </p>

        <h1>
          {project.title}
        </h1>

        <p>
          {project.description}
        </p>

      </section>


      <section className="project-detail-image">

        <img
          src={project.image}
          alt={project.title}
        />
      </section>

          {/* INTRO */}
    <section className="project-detail-intro">

      <p>
        {project.intro}
      </p>

    </section>


       {/* CONTENT */}
    {project.sections?.map((section, index) => (

      <section
        className="project-content-section"
        key={index}
      >

        <div className="project-content-text">

          <p className="section-number">
            0{index + 1}
          </p>

          <h2>{section.title}</h2>

          <p>{section.text}</p>

        </div>


        {section.image && (
          <div className="project-content-image">
            <img
              src={section.image}
              alt={section.title}
            />
          </div>
        )}

      </section>
    ))}


      <section className="project-detail-navigation">

        <Link to="/projects">
          ← BACK TO PROJECTS
        </Link>

      </section>

    </main>
  );
}

export default ProjectDetailPage;