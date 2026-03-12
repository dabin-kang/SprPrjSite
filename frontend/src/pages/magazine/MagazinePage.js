import React, { useState, useEffect, useCallback } from 'react';
import { magazineApi } from '../../api';
import './MagazinePage.css';

const DUMMY_MAGAZINES = [
  { magazineId: 1, title: '2024 웹 트렌드: AI와 UX의 만남', category: '트렌드', thumbnail: null, viewCount: 1250, createdAt: '2024-03-01' },
  { magazineId: 2, title: 'React 18의 새로운 기능 총정리', category: '기술', thumbnail: null, viewCount: 890, createdAt: '2024-02-20' },
  { magazineId: 3, title: '스타트업을 위한 클라우드 전략', category: '비즈니스', thumbnail: null, viewCount: 645, createdAt: '2024-02-10' },
  { magazineId: 4, title: 'UI/UX 디자인 시스템 구축 가이드', category: '디자인', thumbnail: null, viewCount: 1100, createdAt: '2024-01-28' },
  { magazineId: 5, title: 'Spring Boot 3.0 마이그레이션 가이드', category: '기술', thumbnail: null, viewCount: 720, createdAt: '2024-01-15' },
  { magazineId: 6, title: '2024 마케팅 전략: 데이터 드리븐 접근법', category: '비즈니스', thumbnail: null, viewCount: 560, createdAt: '2024-01-05' },
];

const CATEGORIES = ['전체', '트렌드', '기술', '비즈니스', '디자인'];

const GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

function MagazinePage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const size = 9;

  const fetchMagazines = useCallback(async () => {
    setLoading(true);
    try {
      const res = await magazineApi.getMagazines(page, size, category);
      setMagazines(res.data?.magazines || DUMMY_MAGAZINES);
      setTotal(res.data?.total || DUMMY_MAGAZINES.length);
    } catch {
      setMagazines(DUMMY_MAGAZINES);
      setTotal(DUMMY_MAGAZINES.length);
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => { fetchMagazines(); }, [fetchMagazines]);

  const handleCategoryChange = (cat) => {
    setCategory(cat === '전체' ? '' : cat);
    setPage(1);
  };

  const totalPages = Math.ceil(total / size);

  return (
    <div className="magazine-page">
      <div className="page-header">
        <div className="container">
          <h1>매거진</h1>
          <p>스프레브의 인사이트와 트렌드를 확인하세요</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* 카테고리 필터 */}
          <div className="category-filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${(cat === '전체' && !category) || category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <div className="magazines-grid">
                {magazines.map((mag, idx) => (
                  <div key={mag.magazineId} className="mag-card card" onClick={() => setSelected(mag)}>
                    <div className="mag-thumbnail" style={{ background: GRADIENTS[idx % GRADIENTS.length] }}>
                      <span className="mag-category-badge">{mag.category}</span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{mag.title}</h3>
                      <div className="mag-meta">
                        <span>👁 {mag.viewCount?.toLocaleString() || 0}</span>
                        <span>{mag.createdAt?.split('T')[0] || mag.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth:'600px'}}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="modal-img" style={{ background: GRADIENTS[magazines.indexOf(selected) % GRADIENTS.length] }}>
              <span className="mag-category-badge">{selected.category}</span>
            </div>
            <div className="modal-body">
              <h2>{selected.title}</h2>
              <div className="mag-meta" style={{ marginBottom: '16px' }}>
                <span>👁 {selected.viewCount?.toLocaleString() || 0} 조회</span>
                <span>📅 {selected.createdAt?.split('T')[0] || selected.createdAt}</span>
              </div>
              <p className="modal-desc">
                {selected.content || '이 매거진의 전체 내용은 로그인 후 확인하실 수 있습니다. 스프레브 매거진에서는 최신 트렌드, 기술 인사이트, 비즈니스 전략 등 다양한 콘텐츠를 제공합니다.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MagazinePage;
