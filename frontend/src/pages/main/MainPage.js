import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  const features = [
    { icon: '🚀', title: '혁신적인 프로젝트', desc: '최신 기술 스택을 활용한 창의적인 솔루션을 제공합니다.' },
    { icon: '📰', title: '업계 인사이트', desc: '매거진을 통해 최신 트렌드와 깊은 인사이트를 공유합니다.' },
    { icon: '🎯', title: '맞춤형 이벤트', desc: '다양한 이벤트와 프로그램으로 고객과 소통합니다.' },
    { icon: '💬', title: '빠른 문의 대응', desc: '신속하고 정확한 답변으로 최상의 고객 경험을 제공합니다.' },
  ];

  const stats = [
    { number: '200+', label: '완료 프로젝트' },
    { number: '1,500+', label: '회원 수' },
    { number: '50+', label: '매거진 아티클' },
    { number: '98%', label: '고객 만족도' },
  ];

  return (
    <div className="main-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
          </div>
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">Creative Studio</span>
            <h1 className="hero-title">
              혁신적인 디지털<br />
              <span className="accent">경험</span>을 만들다
            </h1>
            <p className="hero-desc">
              스프레브은 창의적인 아이디어와 최신 기술로<br />
              당신의 비전을 현실로 만드는 파트너입니다.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary btn-lg">프로젝트 보기</Link>
              <Link to="/inquiry" className="btn btn-secondary btn-lg">문의하기</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card floating">
              <div className="hc-icon">💡</div>
              <div>
                <div className="hc-title">새로운 프로젝트</div>
                <div className="hc-sub">AI 기반 솔루션</div>
              </div>
            </div>
            <div className="hero-card floating-delay">
              <div className="hc-icon">📊</div>
              <div>
                <div className="hc-title">성장하는 커뮤니티</div>
                <div className="hc-sub">1,500+ 회원</div>
              </div>
            </div>
            <div className="hero-main-visual">
              <div className="visual-circle">
                <span>SPREVN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">우리가 제공하는 것</h2>
            <p className="section-subtitle">스프레브과 함께라면 무엇이든 가능합니다</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="card-body">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="card-title">{f.title}</h3>
                  <p className="card-text">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="section events-preview">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">최신 이벤트</h2>
              <p className="section-subtitle">놓치면 아쉬운 스프레브 이벤트</p>
            </div>
            <Link to="/events" className="btn btn-secondary">전체 보기 →</Link>
          </div>
          <div className="preview-cards">
            {[1, 2, 3].map((i) => (
              <div key={i} className="preview-card card">
                <div className="preview-img" style={{ background: `hsl(${i * 80}, 60%, 70%)` }}>
                  <span>EVENT {i}</span>
                </div>
                <div className="card-body">
                  <span className="badge badge-success">진행중</span>
                  <h3 className="card-title">스프레브 이벤트 {i}호</h3>
                  <p className="card-text">다양한 혜택과 함께하는 특별한 이벤트입니다.</p>
                  <Link to="/events" className="btn btn-sm btn-primary" style={{marginTop: '12px'}}>자세히 보기</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>지금 바로 시작하세요</h2>
            <p>스프레브과 함께 특별한 경험을 만들어보세요</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">무료 회원가입</Link>
              <Link to="/inquiry" className="btn btn-secondary btn-lg">상담 문의</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
