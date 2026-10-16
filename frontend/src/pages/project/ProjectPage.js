import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectPage.css';
import { useSignedUrls } from '../../hooks/useSignedUrl.js';
import BulmosanGoods from './data/BulmosanGoods.js';

const projects = [
  {
    id: 'changwon-biennale',
    number: '01',
    title: '창원 비엔날레',
    description: '2026년 창원조각비엔날레 지도프로젝트.',
    image: '/images/projects/ChangwonBiennalePage/changwonmain.png',
  },
  {
    id: 'bulmosan-goods',
    number: '02',
    title: '불모산 굿즈',
    description: '창원의 불모산과 지역의 이야기를 담은 문화상품 개발',
    storage: {
      bucket: 'spr_sg',
      path: BulmosanGoods.storage?.paths?.[0] || null,
    },
  },
  {
    id: 'lantern-project',
    number: '03',
    title: '인터넷 소원연등 프로젝트',
    description: '인터넷 소원연등 프로젝트',
    storage: {
      type :'lantern',
      bucket: 'spr_sg',
      link: '/lantern',
    },
  },
];

function ProjectPage() {
  const storagePaths = projects
    .map((project) => project.storage?.path)
    .filter(Boolean);

  const signedUrls = useSignedUrls(storagePaths);

  const signedUrlMap = signedUrls.reduce((map, item) => {
    if (item?.path && item?.signedUrl) {
      map[item.path] = item.signedUrl;
    }

    return map;
  }, {});

  return (
    <main className="projects-page">

      <section className="page-header">
        <p className="page-label">PROJECT</p>

        <h1>프로젝트</h1>

        <p>
          지역의 이야기와 공간을 바탕으로 만든
          <br />
          다양한 프로젝트.
        </p>
      </section>

      <section className="projects-grid">
        {projects.map((project) => {
          const imageSrc = project.storage?.path
            ? signedUrlMap[project.storage.path]
            : project.image;

          const isStorageImage = Boolean(project.storage?.path);

          return (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="proj-card"
            >
              <div className="proj-thumbnail">

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={project.title}
                  />
                ) : (
                  <div
                    className="proj-thumbnail-loading"
                    aria-label={`${project.title} 이미지 불러오는 중`}
                  >
                    <span>IMAGE LOADING...</span>
                  </div>
                )}

                <span className="proj-num">
                  {project.number}
                </span>

                {isStorageImage && !imageSrc && (
                  <span className="proj-image-status">
                    불러오는 중
                  </span>
                )}

              </div>

              <div className="proj-card-body">
                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <span className="project-more">
                  VIEW PROJECT →
                </span>
              </div>
            </Link>
          );
        })}
      </section>

    </main>
  );
}

export default ProjectPage;