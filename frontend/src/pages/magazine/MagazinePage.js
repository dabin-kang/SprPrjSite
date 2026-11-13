import React, { useEffect, useRef, useState } from 'react';
import { magazineApi } from '../../api';
import './MagazinePage.css';

const PAGE_SIZE = 9;
const CATEGORIES = ['전체', '트렌드', '기술', '비즈니스', '디자인'];
const GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

function getErrorMessage(error, fallback) {
  if (typeof error === 'string') return error;
  return error?.response?.data?.message || error?.message || fallback;
}

function MagazinePage() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const detailRequestId = useRef(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    magazineApi.getMagazines(page, PAGE_SIZE, category)
      .then((response) => {
        const data = response?.data;
        if (!Array.isArray(data?.magazines) || !Number.isFinite(data?.total)) {
          throw new Error('매거진 응답 형식이 올바르지 않습니다.');
        }
        if (active) {
          setMagazines(data.magazines);
          setTotal(data.total);
        }
      })
      .catch((requestError) => {
        if (active) {
          setMagazines([]);
          setTotal(0);
          setError(getErrorMessage(requestError, '매거진을 불러오지 못했습니다.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, category, retryCount]);

  useEffect(() => {
    if (!selected) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        detailRequestId.current += 1;
        setSelected(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory === '전체' ? '' : nextCategory);
    setPage(1);
  };

  const openMagazine = async (magazine) => {
    const requestId = detailRequestId.current + 1;
    detailRequestId.current = requestId;
    setSelected(magazine);
    setDetailLoading(true);
    setDetailError('');

    try {
      const response = await magazineApi.getMagazine(magazine.magazineId);
      if (!response?.data?.magazineId) {
        throw new Error('매거진 상세 응답이 올바르지 않습니다.');
      }
      if (detailRequestId.current === requestId) setSelected(response.data);
    } catch (requestError) {
      if (detailRequestId.current === requestId) {
        setDetailError(getErrorMessage(requestError, '매거진 상세를 불러오지 못했습니다.'));
      }
    } finally {
      if (detailRequestId.current === requestId) setDetailLoading(false);
    }
  };

  const closeMagazine = () => {
    detailRequestId.current += 1;
    setSelected(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const selectedIndex = selected
    ? magazines.findIndex((magazine) => magazine.magazineId === selected.magazineId)
    : 0;
  const selectedGradient = GRADIENTS[Math.max(0, selectedIndex) % GRADIENTS.length];

  return (
    <div className="magazine-page">
      <header className="page-header">
        <div className="container">
          <h1>매거진</h1>
          <p>스프레브의 인사이트와 트렌드를 확인하세요</p>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="category-filter" aria-label="매거진 카테고리">
            {CATEGORIES.map((item) => {
              const active = (item === '전체' && !category) || category === item;
              return (
                <button
                  key={item}
                  type="button"
                  className={`cat-btn ${active ? 'active' : ''}`}
                  aria-pressed={active}
                  onClick={() => handleCategoryChange(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="spinner" role="status">매거진을 불러오는 중입니다.</div>
          ) : error ? (
            <div className="magazine-error" role="alert">
              <p>{error}</p>
              <button type="button" className="btn btn-secondary" onClick={() => setRetryCount((current) => current + 1)}>
                다시 시도
              </button>
            </div>
          ) : magazines.length === 0 ? (
            <p className="magazine-empty">등록된 매거진이 없습니다.</p>
          ) : (
            <>
              <div className="magazines-grid">
                {magazines.map((magazine, index) => (
                  <button
                    key={magazine.magazineId}
                    type="button"
                    className="mag-card card"
                    onClick={() => openMagazine(magazine)}
                  >
                    <div className="mag-thumbnail" style={{ background: GRADIENTS[index % GRADIENTS.length] }}>
                      {magazine.thumbnail && (
                        <img src={magazine.thumbnail} alt="" loading="lazy" />
                      )}
                      <span className="mag-category-badge">{magazine.category || '미분류'}</span>
                    </div>
                    <div className="card-body">
                      <h2 className="card-title">{magazine.title}</h2>
                      <div className="mag-meta">
                        <span>조회 {magazine.viewCount?.toLocaleString() || 0}</span>
                        <time dateTime={magazine.createdAt}>
                          {magazine.createdAt?.split('T')[0] || '날짜 미정'}
                        </time>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="magazine-pagination" aria-label="매거진 페이지">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    이전
                  </button>
                  <span>{page} / {totalPages}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    다음
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="magazine-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMagazine();
          }}
        >
          <article className="magazine-modal-content" role="dialog" aria-modal="true" aria-labelledby="magazine-title">
            <button type="button" className="magazine-modal-close" onClick={closeMagazine} aria-label="닫기">
              ×
            </button>
            <div className="magazine-modal-thumbnail" style={{ background: selectedGradient }}>
              {selected.thumbnail && <img src={selected.thumbnail} alt="" />}
              <span className="mag-category-badge">{selected.category || '미분류'}</span>
            </div>
            <div className="magazine-modal-body">
              <h2 id="magazine-title">{selected.title}</h2>
              <div className="mag-meta">
                <span>조회 {selected.viewCount?.toLocaleString() || 0}</span>
                <time dateTime={selected.createdAt}>
                  {selected.createdAt?.split('T')[0] || '날짜 미정'}
                </time>
              </div>
              {detailLoading && <p role="status">내용을 불러오는 중입니다.</p>}
              {detailError && <p className="magazine-error" role="alert">{detailError}</p>}
              <p className="modal-desc">{selected.content || '등록된 내용이 없습니다.'}</p>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export default MagazinePage;
