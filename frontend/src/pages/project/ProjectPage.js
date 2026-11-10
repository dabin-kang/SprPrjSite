
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './ProjectPage.css';

import { useSignedUrls } from '../../hooks/useSignedUrl.js';
import { projectApi } from '../../api';

import ChangwonBiennale from './data/ChangwonBiennale.js';
import BulmosanGoods from './data/BulmosanGoods.js';

// 기존 정적 프로젝트
const staticProjects = [
  {
    ...ChangwonBiennale,
    number: '01',
  },
  {
    ...BulmosanGoods,
    number: '02',
  },
  {
    id: 'lantern-project',
    number: '03',
    title: '인터넷 소원연등',
    description: '인터넷 소원연등 프로젝트',
    image: null,
    storage: {
      bucket: 'spr_sg',
      paths: [
        '56PPlbSdz0Xk59Mfsl_EVBYcBWxDHmjokGB7k676N07ISlHbCSgOnkth7u12Ww8yZWg2qwUteIxt3qDutv5s-RgGpCacRDPMzb2Ud3fWmYyPohpUJqHjxShq3ny3I4QDvm7kqRUThxtlbJq28zEA10GhNbq1vqtu_nFKSnrft8fUNdvJIOcMSq5ZjNuLCDVW.jpg',
      ],
    },
    link: '/lantern',
  },
];

function ProjectPage() {
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 공개 프로젝트 조회
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await projectApi.getProjects(1, 100);

        const rows = response?.data?.projects || [];

        const convertedProjects = rows.map((item) => ({
          id: String(item.projectId),
          slug: item.slug,
          number: String(item.projectNo || ''),
          title: item.title,
          description: item.description || '',
          image: null,
          storage: {
            bucket: 'spr_sg',
            paths: item.imageUrl ? [item.imageUrl] : [],
          },
        }));

        setDbProjects(convertedProjects);
      } catch (error) {
        console.error('프로젝트 목록 조회 실패:', error);
        setDbProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // 정적 프로젝트와 DB 프로젝트 결합
  const projects = [
    ...staticProjects.filter(
      (staticProject) =>
        !dbProjects.some(
          (dbProject) =>
            dbProject.slug === staticProject.id
        )
    ),
    ...dbProjects,
  ];

  // 이미지 경로 수집
  const storagePaths = projects.flatMap((project) =>
    project.storage?.paths || []
  );

  const signedUrls = useSignedUrls(storagePaths);

  // 이미지 경로와 실제 URL 연결
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

      {loading && (
        <p className="project-loading">
          프로젝트를 불러오는 중입니다.
        </p>
      )}

      <section className="projects-grid">
        {projects.map((project) => {
          const storagePath =
            project.storage?.paths?.[0];

          const imageSrc = storagePath
            ? signedUrlMap[storagePath]
            : project.image;

          return (
            <Link
              key={project.id}
              to={project.link || `/projects/${project.id}`}
              className="proj-card"
            >
              <div className="proj-thumbnail">

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={project.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="proj-thumbnail-loading">
                    <span>IMAGE LOADING...</span>
                  </div>
                )}

                <span className="proj-num">
                  {String(project.number).padStart(2, '0')}
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
          );
        })}
      </section>

    </main>
  );
}

export default ProjectPage;
