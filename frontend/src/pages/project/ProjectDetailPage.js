import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Link, useParams } from 'react-router-dom';

import './ProjectDetailPage.css';

import ChangwonBiennale from './data/ChangwonBiennale';
import BulmosanGoods from './data/BulmosanGoods.js';

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


  /*
   * ======================================================
   * 프로젝트 이미지
   * ======================================================
   */

  const imagePaths =
    project?.storage?.paths || [];


  const signedUrls = useSignedUrls(imagePaths);


  /*
   * Supabase에서 받아온 이미지 주소
   */
  const supabaseImages = signedUrls
    ?.map((item) => item?.signedUrl)
    .filter(Boolean) || [];


  /*
   * ======================================================
   * 불모산 굿즈 이미지 슬라이더
   * ======================================================
   */

  const isBulmosan =
    project?.id === 'bulmosan-goods';


  /*
   * 불모산 굿즈는 Supabase 이미지 여러 장
   *
   * 다른 프로젝트는 기존 image 사용
   */
  const images = isBulmosan
    ? supabaseImages
    : project?.image
      ? [project.image]
      : [];


  const [currentIndex, setCurrentIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);

  const dragCurrentX = useRef(0);


  /*
   * ======================================================
   * 이미지가 변경되었을 때
   * ======================================================
   */

  useEffect(() => {

    setCurrentIndex(0);

  }, [projectId]);


  /*
   * ======================================================
   * 자동 슬라이드
   * ======================================================
   *
   * 4초마다 다음 이미지
   *
   * 불모산 굿즈이고
   * 이미지가 2장 이상일 때만 작동
   */

  useEffect(() => {

    if (
      !isBulmosan ||
      images.length <= 1
    ) {
      return;
    }


    const timer = setInterval(() => {

      setCurrentIndex((prev) =>
        (prev + 1) % images.length
      );

    }, 4000);


    return () => {
      clearInterval(timer);
    };

  }, [
    isBulmosan,
    images.length,
  ]);


  /*
   * ======================================================
   * 이전 이미지
   * ======================================================
   */

  const goPrev = () => {

    if (images.length <= 1) return;

    setCurrentIndex((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );

  };


  /*
   * ======================================================
   * 다음 이미지
   * ======================================================
   */

  const goNext = () => {

    if (images.length <= 1) return;

    setCurrentIndex((prev) =>
      (prev + 1) % images.length
    );

  };


  /*
   * ======================================================
   * 드래그 시작
   * ======================================================
   */

  const handlePointerDown = (event) => {

    if (
      !isBulmosan ||
      images.length <= 1
    ) {
      return;
    }


    setIsDragging(true);

    dragStartX.current = event.clientX;

    dragCurrentX.current = event.clientX;

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );

  };


  /*
   * ======================================================
   * 드래그 중
   * ======================================================
   */

  const handlePointerMove = (event) => {

    if (!isDragging) return;

    dragCurrentX.current = event.clientX;

  };


  /*
   * ======================================================
   * 드래그 종료
   * ======================================================
   */

  const handlePointerUp = (event) => {

    if (!isDragging) return;

    const difference =
      dragStartX.current -
      dragCurrentX.current;


    const swipeThreshold = 50;


    if (difference > swipeThreshold) {

      goNext();

    } else if (
      difference < -swipeThreshold
    ) {

      goPrev();

    }


    setIsDragging(false);

    event.currentTarget.releasePointerCapture?.(
      event.pointerId
    );

  };


  /*
   * ======================================================
   * 드래그 취소
   * ======================================================
   */

  const handlePointerCancel = () => {

    setIsDragging(false);

  };


  /*
   * ======================================================
   * 존재하지 않는 프로젝트
   * ======================================================
   */

  if (!project) {

    return (

      <main className="project-detail-page">

        <h1>
          프로젝트를 찾을 수 없습니다.
        </h1>

        <Link to="/projects">
          프로젝트 목록으로 돌아가기
        </Link>

      </main>

    );

  }


  return (

    <main className="project-detail-page">


      {/* ==================================================
          HEADER
      ================================================== */}

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


      {/* ==================================================
          IMAGE
      ================================================== */}

      {isBulmosan ? (

        <section className="bulmosan-slider">


          {/* 이미지 영역 */}

          <div
            className={`bulmosan-slider-stage ${
              isDragging
                ? 'is-dragging'
                : ''
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >


            {images.length > 0 ? (

              <img
                src={images[currentIndex]}
                alt={`${project.title} ${currentIndex + 1}`}
                draggable="false"
              />

            ) : (

              <div className="project-detail-image-loading">

                이미지를 불러오는 중입니다.

              </div>

            )}


            {/* 이전 버튼 */}

            {images.length > 1 && (

              <button
                type="button"
                className="bulmosan-slider-button prev"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                aria-label="이전 이미지"
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </button>

            )}


            {/* 다음 버튼 */}

            {images.length > 1 && (

              <button
                type="button"
                className="bulmosan-slider-button next"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                aria-label="다음 이미지"
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </button>

            )}

          </div>


          {/* 이미지 번호 */}

          {images.length > 0 && (

            <div className="bulmosan-slider-counter">

              {String(currentIndex + 1).padStart(2, '0')}

              <span>/</span>

              {String(images.length).padStart(2, '0')}

            </div>

          )}


          {/* 인디케이터 */}

          {images.length > 1 && (

            <div className="bulmosan-slider-dots">

              {images.map((_, index) => (

                <button
                  key={index}
                  type="button"
                  className={
                    index === currentIndex
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`${index + 1}번 이미지`}
                />

              ))}

            </div>

          )}

        </section>

      ) : (

        <section className="project-detail-image">

          {images[0] ? (

            <img
              src={images[0]}
              alt={project.title}
            />

          ) : (

            <div className="project-detail-image-loading">

              이미지를 불러오는 중입니다.

            </div>

          )}

        </section>

      )}


      {/* ==================================================
          창원 비엔날레 지도 버튼
      ================================================== */}

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


      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="project-detail-content">

        <p>
          {project.content}
        </p>

      </section>


      <br />


      {/* ==================================================
          INTRO
      ================================================== */}

      <section className="project-detail-intro">

        <p>
          {project.intro}
        </p>

      </section>


      {/* ==================================================
          PROJECT SECTIONS
      ================================================== */}

      {project.sections?.map(
        (section, index) => (

          <section
            className="project-content-section"
            key={index}
          >

            <div className="project-content-text">

              <p className="section-number">
                0{index + 1}
              </p>

              <h2>
                {section.title}
              </h2>

              <p>
                {section.text}
              </p>

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

        )
      )}


      {/* ==================================================
          BACK
      ================================================== */}

      <section className="project-detail-navigation">

        <Link to="/projects">
          ← BACK TO PROJECTS
        </Link>

      </section>


    </main>

  );

}

export default ProjectDetailPage;