import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProjectDetailPage.css';
import ChangwonBiennaleMapPage from './ChangwonBiennaleMapPage.js';
import  ChangwonBiennale from'./data/ChangwonBiennale';
import   BulmosanGoods from'./data/BulmosanGoods.js';
import { useSignedUrls } from '../../hooks/useSignedUrl.js';


const projects = [
  ChangwonBiennale,
  BulmosanGoods,
];

function ProjectDetailPage() {

  const { projectId } = useParams();

  const project = projects.find(
    (item) => item.id === projectId
  );

//이미지 여러개 배열로 처리한다
  const imagePaths =
    project?.storage?.path || [];
   

  const signedUrls = useSignedUrls(imagePaths);

  const supabaseImageUrl =
    signedUrls?.[0]?.signedUrl || null;

  /*
   * 기존 프로젝트는 image를 사용하고,
   * 불모산 굿즈는 Supabase 이미지를 사용합니다.
   */
  const imageUrl =
    project?.image || supabaseImageUrl;


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
        {imageUrl ? (
    <img
      src={imageUrl}
      alt={project.title}
    />
    ) : (
    <div className="project-detail-image-loading">
      이미지를 불러오는 중입니다.
    </div>
    )}
      </section>

    
        {/* ======================================================
          창원 비엔날레 지도 버튼
          창원 비엔날레 프로젝트에서만 표시
      ====================================================== */}

      {project.id === 'changwon-biennale' && (

        <section className="project-map-link-section">

          <Link
            to="/projects/changwon-biennale/map"
            className="project-map-link"
          >
            <span>
              CHANGWON SCULPTURE BIENNALE
            </span>

            <strong>
              창원 조각 지도 보기 →
            </strong>
          </Link>

        </section>


      )}

        <section className="project-detail-content">
          <p>{project.content}</p>
       </section>
        <br/>
       


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