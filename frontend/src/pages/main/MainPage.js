import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import { useSignedUrls } from '../../hooks/useSignedUrl';

function MainPage() {
  // ============================================
  // 메인 슬라이드 이미지
  // Supabase Storage spr_sg 버킷에
  // 아래 이름의 이미지가 있어야 합니다.
  //1920x1080이미지 크기가 적당함
  //메인배너용 이미지 16:9 비율 권장
  // ============================================
  const imagePaths = [
    'lunarRdv.png',
    '20240524_201604.jpg',
    'KakaoTalk_2026_bs.jpg',
    'spr_home/captured-image-1749302385996.jpg',
  ];

  const MainImages = useSignedUrls(imagePaths);

  // ============================================
  // 슬라이드 상태
  // ============================================
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 드래그 관련
  const [isDragging, setIsDragging] = useState(false);

  const sliderRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // ============================================
  // 실제 사용할 수 있는 이미지
  // ============================================
  const slides = MainImages.filter(
    (image) => image && image.signedUrl
  );

  // ============================================
  // 다음 슬라이드
  // ============================================
  const nextSlide = () => {
    if (slides.length === 0) return;

    setCurrentIndex((prev) => {
      if (prev >= slides.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  };

  // ============================================
  // 이전 슬라이드
  // ============================================
  const prevSlide = () => {
    if (slides.length === 0) return;

    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return slides.length - 1;
      }

      return prev - 1;
    });
  };

  // ============================================
  // 자동 슬라이드
  // 4초마다 다음 이미지
  // ============================================
  useEffect(() => {
    if (slides.length <= 1 || isPaused || isDragging) {
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

    return () => clearInterval(timer);
  }, [slides.length, isPaused, isDragging]);

  // ============================================
  // 이미지가 변경되었을 때
  // 존재하지 않는 index 방지
  // ============================================
  useEffect(() => {
    if (slides.length === 0) {
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // ============================================
  // 마우스 드래그 시작
  // ============================================
  const handleMouseDown = (e) => {
    if (slides.length <= 1) return;

    setIsDragging(true);

    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;

    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
    }
  };

  // ============================================
  // 마우스 이동
  // ============================================
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    currentXRef.current = e.clientX;
  };

  // ============================================
  // 마우스 드래그 종료
  // ============================================
  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = currentXRef.current - startXRef.current;

    // 50px 이상 움직였을 때 슬라이드 이동
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

  // ============================================
  // 마우스가 영역 밖으로 나갔을 때
  // ============================================
  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // ============================================
  // 터치 시작
  // ============================================
  const handleTouchStart = (e) => {
    if (slides.length <= 1) return;

    setIsDragging(true);

    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  // ============================================
  // 터치 이동
  // ============================================
  const handleTouchMove = (e) => {
    if (!isDragging) return;

    currentXRef.current = e.touches[0].clientX;
  };

  // ============================================
  // 터치 종료
  // ============================================
  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = currentXRef.current - startXRef.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsDragging(false);
  };

  // ============================================
  // 현재 슬라이드 직접 선택
  // ============================================
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // ============================================
  // 기존 페이지 데이터
  // ============================================
  const features = [
    {
      icon: '🚀',
      title: '혁신적인 프로젝트',
      desc: '최신 기술 스택을 활용한 창의적인 솔루션을 제공합니다.',
    },
    {
      icon: '📰',
      title: '업계 인사이트',
      desc: '매거진을 통해 최신 트렌드와 깊은 인사이트를 공유합니다.',
    },
    {
      icon: '🎯',
      title: '맞춤형 이벤트',
      desc: '다양한 이벤트와 프로그램으로 고객과 소통합니다.',
    },
    {
      icon: '💬',
      title: '빠른 문의 대응',
      desc: '신속하고 정확한 답변으로 최상의 고객 경험을 제공합니다.',
    },
  ];

  const stats = [
    { number: '200+', label: '완료 프로젝트' },
    { number: '1,500+', label: '회원 수' },
    { number: '50+', label: '매거진 아티클' },
    { number: '98%', label: '고객 만족도' },
  ];

  return (
    <div className="main-page">

      {/* ============================================
          FULL WIDTH IMAGE SLIDER
      ============================================ */}
      <section
        className="hero-slider"
        ref={sliderRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={(e) => {
          setIsPaused(false);
          handleMouseLeave(e);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

        {/* 이미지가 있을 경우 */}
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

                {/* 이미지 위 어두운 오버레이 */}
                <div className="slide-overlay"></div>

                {/* 이미지 위 텍스트 */}
                <div className="slide-content">
                  <span className="slide-number">
                    0{index + 1}
                  </span>

                  <h1>
                    말랑뮤즈
                  </h1>

                  <p>
                    창의적인 아이디어와 지역의 이야기를<br />
                    새로운 경험으로 만들어갑니다.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 이미지가 아직 없을 때
          <div className="slide-empty">
            <p>이미지를 불러오는 중입니다.</p>
          </div>
        )}

        {/* ============================================
            좌측 버튼
        ============================================ */}
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

        {/* ============================================
            우측 버튼
        ============================================ */}
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

        {/* ============================================
            하단 슬라이드 정보
        ============================================ */}
        {slides.length > 1 && (
          <div className="slider-bottom">

            {/* 현재 번호 */}
            <div className="slider-counter">
              <strong>
                {String(currentIndex + 1).padStart(2, '0')}
              </strong>
              <span>
                /
              </span>
              <span>
                {String(slides.length).padStart(2, '0')}
              </span>
            </div>

            {/* 점 */}
            <div className="slider-dots">
              {slides.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={`slider-dot ${
                    index === currentIndex ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  aria-label={`${index + 1}번 이미지`}
                />
              ))}
            </div>

            {/* 드래그 안내 */}
            <div className="slider-hint">
              ← DRAG →
            </div>

          </div>
        )}
      </section>


    
      


      {/* ============================================
          Features Section
      ============================================ */}
      <section className="section features-section">
        <div className="container">

          <div className="text-center">
            <h2 className="section-title">
              우리가 제공하는 것
            </h2>

            <p className="section-subtitle">
              창원조각비엔날레 조각지도
            </p>
          </div>

          <div className="features-grid">

            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card card"
              >
                <div className="card-body">

                  <div className="feature-icon">
                    {f.icon}
                  </div>

                  <h3 className="card-title">
                    {f.title}
                  </h3>

                  <p className="card-text">
                    {f.desc}
                  </p>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>


      {/* ============================================
          Projects Preview
      ============================================ */}
      <section className="section events-preview">

        <div className="container">

          <div className="section-header">

            <div>
              <h2 className="section-title">
                프로젝트
              </h2>

              <p className="section-subtitle">
                말랑뮤즈가 만들어가는 프로젝트
              </p>
            </div>

            <Link
              to="/projects"
              className="btn btn-secondary"
            >
              전체 보기 →
            </Link>

          </div>


          <div className="preview-cards">

            {[1, 2, 3].map((i) => (

              <div
                key={i}
                className="preview-card card"
              >

                <div
                  className="preview-img"
                  style={{
                    background: `hsl(${i * 80}, 60%, 70%)`,
                  }}
                >
                  <span>
                    PROJECT {i}
                  </span>
                </div>

                <div className="card-body">

                  <span className="badge badge-success">
                    진행중
                  </span>

                  <h3 className="card-title">
                    말랑뮤즈 프로젝트 {i}호
                  </h3>

                  <p className="card-text">
                    다양한 지역과 사람들의 이야기를
                    새로운 경험으로 만들어갑니다.
                  </p>

                  <Link
                    to="/projects"
                    className="btn btn-sm btn-primary"
                    style={{ marginTop: '12px' }}
                  >
                    자세히 보기
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ============================================
          CTA
      ============================================ */}
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