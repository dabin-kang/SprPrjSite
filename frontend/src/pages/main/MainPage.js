import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import './MainPage.css';

import { useSignedUrls } from '../../hooks/useSignedUrl';

import ChangwonBiennale from '../project/data/ChangwonBiennale';
import BulmosanGoods from '../project/data/BulmosanGoods';


// ======================================================
// 프로젝트 데이터
// ======================================================

const projects = [
  ChangwonBiennale,
  BulmosanGoods,
];


// ======================================================
// MainPage
// ======================================================

function MainPage() {

  // ====================================================
  // 메인 슬라이드 이미지
  // Supabase Storage
  // 버킷: spr_sg
  // ====================================================

  const imagePaths = [
    
    
    'KakaoTalk_2026_bs.jpg',
    'spr_home/captured-image-1749302385996.jpg',
    '20260927_215436(0).jpg',
  ];

  const mainImages = useSignedUrls(imagePaths);


  // ====================================================
  // 슬라이드 상태
  // ====================================================

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);


  // ====================================================
  // 드래그 / 터치
  // ====================================================

  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);


  // ====================================================
  // 실제 사용할 수 있는 이미지
  // ====================================================

  const slides = mainImages.filter(
    (image) => image && image.signedUrl
  );


  // ====================================================
  // 다음 슬라이드
  // ====================================================

  const nextSlide = () => {

    if (slides.length === 0) {
      return;
    }

    setCurrentIndex((prev) => {

      if (prev >= slides.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  };


  // ====================================================
  // 이전 슬라이드
  // ====================================================

  const prevSlide = () => {

    if (slides.length === 0) {
      return;
    }

    setCurrentIndex((prev) => {

      if (prev <= 0) {
        return slides.length - 1;
      }

      return prev - 1;
    });
  };


  // ====================================================
  // 자동 슬라이드
  // 4초마다 다음 이미지
  // ====================================================

  useEffect(() => {

    if (
      slides.length <= 1 ||
      isPaused ||
      isDragging
    ) {
      return;
    }

    const timer = setInterval(() => {

      setCurrentIndex((prev) => {

        if (prev >= slides.length - 1) {
          return 0;
        }

        return prev + 1;
      });

    }, 4000);

    return () => {
      clearInterval(timer);
    };

  }, [slides.length, isPaused, isDragging]);


  // ====================================================
  // 이미지 개수가 변경되었을 때
  // 잘못된 index 방지
  // ====================================================

  useEffect(() => {

    if (slides.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }

  }, [slides.length, currentIndex]);


  // ====================================================
  // 마우스 드래그 시작
  // ====================================================

  const handleMouseDown = (e) => {

    if (slides.length <= 1) {
      return;
    }

    setIsDragging(true);

    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;

    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
    }
  };


  // ====================================================
  // 마우스 이동
  // ====================================================

  const handleMouseMove = (e) => {

    if (!isDragging) {
      return;
    }

    currentXRef.current = e.clientX;
  };


  // ====================================================
  // 마우스 드래그 종료
  // ====================================================

  const handleMouseUp = () => {

    if (!isDragging) {
      return;
    }

    const diff =
      currentXRef.current -
      startXRef.current;

    if (Math.abs(diff) > 50) {

      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);

    if (sliderRef.current) {
      sliderRef.current.classList.remove('dragging');
    }
  };


  // ====================================================
  // 마우스가 영역을 벗어났을 때
  // ====================================================

  const handleMouseLeave = () => {

    if (isDragging) {
      handleMouseUp();
    }
  };


  // ====================================================
  // 터치 시작
  // ====================================================

  const handleTouchStart = (e) => {

    if (slides.length <= 1) {
      return;
    }

    setIsDragging(true);

    startXRef.current =
      e.touches[0].clientX;

    currentXRef.current =
      e.touches[0].clientX;
  };


  // ====================================================
  // 터치 이동
  // ====================================================

  const handleTouchMove = (e) => {

    if (!isDragging) {
      return;
    }

    currentXRef.current =
      e.touches[0].clientX;
  };


  // ====================================================
  // 터치 종료
  // ====================================================

  const handleTouchEnd = () => {

    if (!isDragging) {
      return;
    }

    const diff =
      currentXRef.current -
      startXRef.current;

    if (Math.abs(diff) > 50) {

      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);
  };


  // ====================================================
  // 특정 슬라이드 선택
  // ====================================================

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };


  // ====================================================
  // 화면
  // ====================================================

  return (
    <div className="main-page">

      {/* ==================================================
          HERO SLIDER
      ================================================== */}

      <section
        className="hero-slider"
        ref={sliderRef}

        onMouseEnter={() => {
          setIsPaused(true);
        }}

        onMouseLeave={() => {
          setIsPaused(false);
          handleMouseLeave();
        }}

        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}

        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

        {slides.length > 0 ? (

          <div
            className="slider-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >

            {slides.map((image, index) => (

              <div
                className="slide"
                key={index}
              >

                <img
                  src={image.signedUrl}
                  alt={`말랑뮤즈 메인 이미지 ${index + 1}`}
                  draggable="false"
                />

                <div className="slide-overlay" />

                <div className="slide-content">

                  <span className="slide-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h1>
                    말랑뮤즈
                  </h1>

                  <p>
                    창의적인 아이디어와 지역의 이야기를
                    <br />
                    새로운 경험으로 만들어갑니다.
                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="slide-empty">
            <p>이미지를 불러오는 중입니다.</p>
          </div>

        )}


        {/* ==================================================
            이전 버튼
        ================================================== */}

        {slides.length > 1 && (

          <button
            type="button"
            className="slider-button slider-button-prev"

            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}

            aria-label="이전 이미지"
          >
            ‹
          </button>

        )}


        {/* ==================================================
            다음 버튼
        ================================================== */}

        {slides.length > 1 && (

          <button
            type="button"
            className="slider-button slider-button-next"

            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}

            aria-label="다음 이미지"
          >
            ›
          </button>

        )}


        {/* ==================================================
            슬라이드 하단 정보
        ================================================== */}

        {slides.length > 1 && (

          <div className="slider-bottom">

            <div className="slider-counter">

              <strong>
                {String(currentIndex + 1).padStart(2, '0')}
              </strong>

              <span>/</span>

              <span>
                {String(slides.length).padStart(2, '0')}
              </span>

            </div>


            <div className="slider-dots">

              {slides.map((_, index) => (

                <button
                  type="button"
                  key={index}

                  className={`slider-dot ${
                    index === currentIndex
                      ? 'active'
                      : ''
                  }`}

                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}

                  aria-label={`${index + 1}번 이미지`}
                />

              ))}

            </div>


            <div className="slider-hint">
              ← DRAG →
            </div>

          </div>

        )}

      </section>


      {/* ==================================================
          PROJECTS
      ================================================== */}

      <section className="section projects-section">

        <div className="container">

          <div className="section-header">

            <div>
              <p className="section-label">
                PROJECTS
              </p>

              <h2 className="section-title">
                말랑뮤즈의 프로젝트
              </h2>

              <p className="section-subtitle">
                지역의 이야기와 아이디어로
                새로운 경험들을 만들어갑니다.
              </p>
            </div>

          </div>


          <div className="preview-cards">

            {projects.map((project) => (

              <article
                key={project.id}
                className="preview-card card"
              >

                {/* 프로젝트 이미지 */}

                <div className="preview-img">

                  <img
                    src={project.image}
                    alt={project.title}
                  />

                </div>


                {/* 프로젝트 정보 */}

                <div className="card-body">

                  <span className="badge badge-success">
                    PROJECT {project.number}
                  </span>

                  <h3 className="card-title">
                    {project.title}
                  </h3>

                  <p className="card-text">
                    {project.description}
                  </p>

                  <Link
                    to={`/projects/${project.id}`}
                    className="btn btn-sm btn-primary project-detail-button"
                  >
                    자세히 보기
                  </Link>

                </div>

              </article>

            ))}

          </div>

        </div>

      </section>


      {/* ==================================================
          CTA
      ================================================== */}

      <section className="cta-section">

        <div className="container">

          <div className="cta-content">

            <h2>
              함께 만들어보세요
            </h2>

            <p>
              말랑뮤즈와 함께 특별한 경험을 만들어보세요
            </p>

            <div className="cta-buttons">

              <Link
                to="/signup"
                className="btn btn-primary btn-lg"
              >
                무료 회원가입
              </Link>

              <Link
                to="/inquiry"
                className="btn btn-secondary btn-lg"
              >
                상담 문의
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


export default MainPage;